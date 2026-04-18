// @ts-nocheck
/**
 * CONFIRMACIÓN DE PEDIDO
 * -----------------------
 * Ruta: src/app/order/confirmation/page.tsx
 *
 * Wompi redirige aquí después del pago con ?ref=MAISON-2025-0001
 * Muestra el estado del pedido y los detalles de la compra.
 */

import Link from "next/link";
import type { Metadata } from "next";
import { brandConfig } from "@/brand.config";
import { formatPrice } from "@/lib/utils/format";

export const metadata: Metadata = {
  title:  `Confirmación de pedido — ${brandConfig.brand.name}`,
  robots: { index: false, follow: false },
};

interface PageProps {
  searchParams: { ref?: string; id?: string };
}

async function getOrder(ref: string) {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null;
    const { supabaseAdmin } = await import("@/lib/db/supabaseClient");
    const { data } = await supabaseAdmin
      .from("orders")
      .select("*, order_items(*)")
      .eq("order_number", ref)
      .single();
    return data;
  } catch {
    return null;
  }
}

export default async function OrderConfirmationPage({ searchParams }: PageProps) {
  const ref   = searchParams.ref;
  const order = ref ? await getOrder(ref) : null;

  const isApproved = order?.payment_status === "approved";
  const isPending  = order?.payment_status === "pending";

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">

        {/* ——— Ícono de estado ——— */}
        <div className="text-center mb-8">
          {isApproved ? (
            <>
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-100">
                <span className="text-2xl text-status-success">✓</span>
              </div>
              <h1 className="font-display text-3xl font-light text-brand-primary mb-2">
                ¡Pedido confirmado!
              </h1>
              <p className="text-sm text-brand-muted">
                Hemos recibido tu pago. Te enviaremos una confirmación a tu email.
              </p>
            </>
          ) : isPending ? (
            <>
              <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-100">
                <span className="text-2xl">⏳</span>
              </div>
              <h1 className="font-display text-3xl font-light text-brand-primary mb-2">
                Pago en proceso
              </h1>
              <p className="text-sm text-brand-muted">
                Tu transacción está siendo verificada. Te notificaremos por email.
              </p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100">
                <span className="text-2xl">✕</span>
              </div>
              <h1 className="font-display text-3xl font-light text-brand-primary mb-2">
                Pago no procesado
              </h1>
              <p className="text-sm text-brand-muted">
                No pudimos procesar tu pago. Puedes intentar de nuevo.
              </p>
            </>
          )}
        </div>

        {/* ——— Detalles del pedido ——— */}
        {order && (
          <div className="bg-white border border-brand-border rounded-xl p-5 mb-6 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-brand-muted">Número de pedido</span>
              <span className="font-medium text-brand-primary font-mono text-xs">{order.order_number}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-brand-muted">Cliente</span>
              <span className="text-brand-primary">{order.customer_name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-brand-muted">Email</span>
              <span className="text-brand-primary">{order.customer_email}</span>
            </div>
            <div className="flex justify-between text-sm border-t border-brand-border pt-3">
              <span className="text-brand-muted">Total pagado</span>
              <span className="font-medium text-brand-primary">
                {formatPrice(Number(order.total), order.currency)}
              </span>
            </div>
          </div>
        )}

        {/* ——— Acciones ——— */}
        <div className="flex flex-col gap-3">
          {!isApproved && (
            <Link
              href="/"
              className="w-full h-11 flex items-center justify-center bg-brand-primary text-brand-inverse text-sm font-medium tracking-widest uppercase rounded-md hover:bg-gray-800 transition-all duration-200"
            >
              Volver al catálogo
            </Link>
          )}
          {isApproved && (
            <Link
              href="/"
              className="w-full h-11 flex items-center justify-center border border-brand-border text-sm text-brand-primary rounded-md hover:border-brand-primary transition-all duration-200"
            >
              Seguir comprando
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
