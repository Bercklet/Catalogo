/**
 * API ROUTE — Checkout con Wompi (Versión estable)
 */

import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { supabaseAdmin } from "@/lib/db/supabaseClient";

interface CheckoutBody {
  items: any[];
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: any;
}

function generateWompiChecksum(
  reference: string,
  amountInCents: number,
  currency: string,
  expirationTime: string,
  integritySecret: string
): string {
  const raw = `${reference}${amountInCents}${currency}${expirationTime}${integritySecret}`;
  return createHash("sha256").update(raw).digest("hex");
}

export async function POST(req: NextRequest) {
  try {
    const body: CheckoutBody = await req.json();

    if (!body.items?.length) return NextResponse.json({ error: "Sin productos" }, { status: 400 });
    if (!body.customerEmail) return NextResponse.json({ error: "Email requerido" }, { status: 400 });
    if (!body.customerName) return NextResponse.json({ error: "Nombre requerido" }, { status: 400 });

    const WOMPI_PUBLIC_KEY = process.env.WOMPI_PUBLIC_KEY;
    const WOMPI_INTEGRITY_SECRET = process.env.WOMPI_INTEGRITY_SECRET;
    const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

    if (!WOMPI_PUBLIC_KEY || !WOMPI_INTEGRITY_SECRET) {
      return NextResponse.json({ error: "Wompi no configurado" }, { status: 503 });
    }

    // Calcular totales
    const subtotal = body.items.reduce((s, i) => s + (i.unitPrice || 0) * (i.quantity || 1), 0);
    const shippingCost = subtotal >= 500000 ? 0 : 15000;
    const total = subtotal + shippingCost;
    const amountInCents = Math.round(total * 100);

    // Generar número de pedido
    const { data: orderNumData } = await supabaseAdmin.rpc("generate_order_number" as never);
    const orderNumber = (orderNumData as unknown as string) ?? `MAISON-${Date.now()}`;

    // Crear pedido
    const { data: order, error: orderErr } = await supabaseAdmin
      .from("orders")
      .insert({
        order_number: orderNumber,
        customer_email: body.customerEmail,
        customer_name: body.customerName,
        customer_phone: body.customerPhone ?? null,
        shipping_address: body.shippingAddress,
        subtotal,
        shipping_cost: shippingCost,
        discount_amount: 0,
        total,
        currency: "COP",
        payment_status: "pending",
        status: "pending",
        wompi_reference: orderNumber,
      } as any)
      .select("id")
      .single();

    if (orderErr) throw new Error(`Error creando pedido: ${orderErr.message}`);

    // Calcular checksum para Wompi
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();
    const checksum = generateWompiChecksum(orderNumber, amountInCents, "COP", expiresAt, WOMPI_INTEGRITY_SECRET);

    // Respuesta para el frontend
    return NextResponse.json({
      orderId: order.id,
      orderNumber,
      wompi: {
        publicKey: WOMPI_PUBLIC_KEY,
        currency: "COP",
        amountInCents,
        reference: orderNumber,
        signature: { integrity: checksum },
        expirationTime: expiresAt,
        customerData: {
          email: body.customerEmail,
          fullName: body.customerName,
          phoneNumber: body.customerPhone ?? "",
          phoneNumberPrefix: "+57",
        },
        redirectUrl: `${SITE_URL}/order/confirmation?ref=${orderNumber}`,
      },
    });

  } catch (err: any) {
    console.error("[checkout POST]", err);
    return NextResponse.json(
      { error: err.message || "Error interno" },
      { status: 500 }
    );
  }
}
