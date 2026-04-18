/**
 * API ROUTE — Checkout con Wompi
 * --------------------------------
 * Ruta: src/app/api/checkout/route.ts
 *
 * Variables requeridas en .env.local:
 *   WOMPI_PUBLIC_KEY=pub_test_XXXXXXXX        ← Dashboard Wompi → Llaves API
 *   WOMPI_PRIVATE_KEY=prv_test_XXXXXXXX       ← Dashboard Wompi → Llaves API
 *   WOMPI_INTEGRITY_SECRET=test_integrity_XXX ← Dashboard Wompi → Eventos
 *   NEXT_PUBLIC_SITE_URL=https://tu-dominio.com
 *
 * Flujo completo:
 * 1. Frontend POST /api/checkout con los ítems del carrito
 * 2. Esta ruta crea el pedido en Supabase (status: pending)
 * 3. Calcula el checksum de integridad (SHA256)
 * 4. Devuelve los datos para inicializar el widget de Wompi
 * 5. El usuario paga en el widget embebido
 * 6. Wompi llama al webhook POST /api/checkout/webhook
 * 7. El webhook actualiza el estado del pedido en Supabase
 */

import { NextRequest, NextResponse }  from "next/server";
import { createHash }                  from "crypto";
import { supabaseAdmin }               from "@/lib/db/supabaseClient";

interface CheckoutItem {
  productId:   string;
  variantId?:  string;
  productName: string;
  productSlug: string;
  imageUrl:    string;
  colorName:   string;
  colorHex:    string;
  size:        string;
  sku:         string;
  unitPrice:   number;
  quantity:    number;
}

interface CheckoutBody {
  items:           CheckoutItem[];
  customerName:    string;
  customerEmail:   string;
  customerPhone?:  string;
  shippingAddress: {
    street:      string;
    city:        string;
    department:  string;
    postalCode?: string;
    country:     string;
  };
}

/** Genera el checksum SHA256 requerido por Wompi para verificar integridad */
function generateWompiChecksum(
  reference:       string,
  amountInCents:   number,
  currency:        string,
  expirationTime:  string,
  integritySecret: string
): string {
  const raw = `\( {reference} \){amountInCents}\( {currency} \){expirationTime}${integritySecret}`;
  return createHash("sha256").update(raw).digest("hex");
}

// ——— POST /api/checkout — Crear pedido e inicializar pago ———
export async function POST(req: NextRequest) {
  try {
    const body: CheckoutBody = await req.json();

    // Validación básica
    if (!body.items?.length)        return NextResponse.json({ error: "Sin productos" }, { status: 400 });
    if (!body.customerEmail)        return NextResponse.json({ error: "Email requerido" }, { status: 400 });
    if (!body.customerName)         return NextResponse.json({ error: "Nombre requerido" }, { status: 400 });

    const WOMPI_PUBLIC_KEY       = process.env.WOMPI_PUBLIC_KEY;
    const WOMPI_INTEGRITY_SECRET = process.env.WOMPI_INTEGRITY_SECRET;
    const SITE_URL               = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

    if (!WOMPI_PUBLIC_KEY || !WOMPI_INTEGRITY_SECRET) {
      return NextResponse.json({ error: "Wompi no configurado" }, { status: 503 });
    }

    // ——— Calcular totales ———
    const subtotal      = body.items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
    const shippingCost  = subtotal >= 500000 ? 0 : 15000; // Envío gratis > $500k COP
    const total         = subtotal + shippingCost;
    const amountInCents = Math.round(total * 100); // Wompi usa centavos

    // ——— Generar número de pedido único ———
    const { data: orderNumData } = await supabaseAdmin
      .rpc("generate_order_number" as never);

    const orderNumber = (orderNumData as unknown as string) ?? `MAISON-${Date.now()}`;

    // ——— Crear pedido en Supabase (status: pending) ———
    const { data: order, error: orderErr } = await supabaseAdmin
      .from("orders")
      .insert({
        order_number:     orderNumber,
        customer_email:   body.customerEmail,
        customer_name:    body.customerName,
        customer_phone:   body.customerPhone ?? null,
        shipping_address: body.shippingAddress,
        subtotal,
        shipping_cost:    shippingCost,
        discount_amount:  0,
        total,
        currency:         "COP",
        payment_status:   "pending",
        status:           "pending",
        wompi_reference:  orderNumber,
      })
      .select("id")
      .single();

    if (orderErr) throw new Error(`Error creando pedido: ${orderErr.message}`);

    // ——— Insertar ítems del pedido ———
    const { error: itemsErr } = await supabaseAdmin
      .from("order_items")
      .insert(
        body.items.map((item) => ({
          order_id:     order.id,
          product_id:   item.productId,
          variant_id:   item.variantId ?? null,
          product_name: item.productName,
          product_slug: item.productSlug,
          image_url:    item.imageUrl,
          color_name:   item.colorName,
          color_hex:    item.colorHex,
          size:         item.size,
          sku:          item.sku,
          unit_price:   item.unitPrice,
          quantity:     item.quantity,
        }))
      );

    if (itemsErr) throw new Error(`Error insertando ítems: ${itemsErr.message}`);

    // ——— Calcular checksum de integridad Wompi ———
    const expiresAt  = new Date(Date.now() + 30 * 60 * 1000).toISOString(); // 30 minutos
    const checksum   = generateWompiChecksum(
      orderNumber,
      amountInCents,
      "COP",
      expiresAt,
      WOMPI_INTEGRITY_SECRET
    );

    // ——— Responder con datos para el widget de Wompi ———
    return NextResponse.json({
      orderId:      order.id,
      orderNumber,
      // Datos para inicializar window.WidgetCheckout de Wompi
      wompi: {
        publicKey:      WOMPI_PUBLIC_KEY,
        currency:       "COP",
        amountInCents,
        reference:      orderNumber,
        signature:      { integrity: checksum },
        expirationTime: expiresAt,
        customerData: {
          email:        body.customerEmail,
          fullName:     body.customerName,
          phoneNumber:  body.customerPhone ?? "",
          phoneNumberPrefix: "+57",
        },
        redirectUrl: `\( {SITE_URL}/order/confirmation?ref= \){orderNumber}`,
      },
    });

  } catch (err) {
    console.error("[checkout POST]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error interno" },
      { status: 500 }
    );
  }
}