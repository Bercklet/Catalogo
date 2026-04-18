"use client";

/**
 * CHECKOUT MODAL — Integración completa con Wompi
 * -------------------------------------------------
 * Ruta: src/components/CheckoutModal.tsx
 *
 * Flujo:
 * 1. Usuario hace clic en "Proceder al pago" en CartDrawer
 * 2. Se abre este modal con formulario de datos de envío
 * 3. Al confirmar, llama a POST /api/checkout
 * 4. La API crea el pedido en Supabase y devuelve los datos de Wompi
 * 5. Se inicializa el widget de Wompi con esos datos
 * 6. El usuario completa el pago en el widget embebido
 * 7. Wompi redirige a /order/confirmation
 */

import { useState } from "react";
import { useCartStore } from "@/store/cart.store";
import { formatPrice }  from "@/lib/utils/format";
import { brandConfig }  from "@/brand.config";

interface ShippingForm {
  name:       string;
  email:      string;
  phone:      string;
  street:     string;
  city:       string;
  department: string;
}

const DEPARTMENTS = [
  "Bogotá D.C.", "Antioquia", "Valle del Cauca", "Atlántico",
  "Cundinamarca", "Santander", "Bolívar", "Nariño", "Tolima",
  "Huila", "Córdoba", "Cauca", "Norte de Santander", "Risaralda",
  "Quindío", "Caldas", "Meta", "Boyacá", "Cesar", "Magdalena",
];

interface Props {
  isOpen:   boolean;
  onClose:  () => void;
}

export function CheckoutModal({ isOpen, onClose }: Props) {
  const { items, totalPrice, clearCart } = useCartStore();
  const total    = totalPrice();
  const currency = items[0]?.currency ?? "COP";

  const [step,    setStep]    = useState<"form" | "processing" | "payment">("form");
  const [error,   setError]   = useState<string | null>(null);
  const [form,    setForm]    = useState<ShippingForm>({
    name: "", email: "", phone: "", street: "", city: "", department: "Bogotá D.C.",
  });

  const shippingCost = total >= 500000 ? 0 : 15000;
  const grandTotal   = total + shippingCost;

  const updateField = (field: keyof ShippingForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const isFormValid = () =>
    form.name && form.email && form.phone && form.street && form.city && form.department;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) return;

    setStep("processing");
    setError(null);

    try {
      const response = await fetch("/api/checkout", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId:   item.productId,
            variantId:   undefined,
            productName: item.name,
            productSlug: item.slug,
            imageUrl:    item.image,
            colorName:   item.color.name,
            colorHex:    item.color.hex,
            size:        item.size,
            sku:         `${item.productId}-${item.color.hex}-${item.size}`,
            unitPrice:   item.price,
            quantity:    item.quantity,
          })),
          customerName:  form.name,
          customerEmail: form.email,
          customerPhone: form.phone,
          shippingAddress: {
            street:     form.street,
            city:       form.city,
            department: form.department,
            country:    "Colombia",
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Error al crear el pedido");
      }

      // Inicializar widget de Wompi
      initWompiWidget(data.wompi);
      clearCart();
      setStep("payment");

    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
      setStep("form");
    }
  };

  /** Carga e inicializa el widget embebido de Wompi */
  const initWompiWidget = (wompiData: {
    publicKey:       string;
    currency:        string;
    amountInCents:   number;
    reference:       string;
    signature:       { integrity: string };
    expirationTime:  string;
    customerData:    Record<string, string>;
    redirectUrl:     string;
  }) => {
    // Cargar el script de Wompi si no está cargado
    if (!document.getElementById("wompi-script")) {
      const script    = document.createElement("script");
      script.id       = "wompi-script";
      script.src      = "https://checkout.wompi.co/widget.js";
      script.setAttribute("data-render", "button");
      script.setAttribute("data-public-key",      wompiData.publicKey);
      script.setAttribute("data-currency",        wompiData.currency);
      script.setAttribute("data-amount-in-cents", String(wompiData.amountInCents));
      script.setAttribute("data-reference",       wompiData.reference);
      script.setAttribute("data-signature:integrity", wompiData.signature.integrity);
      script.setAttribute("data-expiration-time", wompiData.expirationTime);
      script.setAttribute("data-customer-data:email",         wompiData.customerData.email);
      script.setAttribute("data-customer-data:full-name",     wompiData.customerData.fullName);
      script.setAttribute("data-customer-data:phone-number",  wompiData.customerData.phoneNumber);
      script.setAttribute("data-customer-data:phone-number-prefix", "+57");
      script.setAttribute("data-redirect-url", wompiData.redirectUrl);
      document.getElementById("wompi-container")?.appendChild(script);
    }
  };

  if (!isOpen) return null;

  return (
    // Overlay
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-xl max-h-[95vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-brand-border sticky top-0 bg-white z-10">
          <h2 className="font-display text-xl font-light text-brand-primary">
            {step === "payment" ? "Completar pago" : "Datos de envío"}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-md text-brand-muted hover:text-brand-primary hover:bg-brand-secondary transition-colors"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-5">

          {/* ——— STEP: Formulario ——— */}
          {step === "form" && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {error && (
                <div className="px-4 py-3 bg-red-50 border border-red-100 rounded-md">
                  <p className="text-sm text-status-error">{error}</p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Nombre completo" required>
                  <input type="text"    value={form.name}  onChange={updateField("name")}  placeholder="Ana García"   required className={inputCls} />
                </Field>
                <Field label="Email" required>
                  <input type="email"   value={form.email} onChange={updateField("email")} placeholder="ana@email.com" required className={inputCls} />
                </Field>
                <Field label="Teléfono" required>
                  <input type="tel"     value={form.phone} onChange={updateField("phone")} placeholder="300 000 0000"  required className={inputCls} />
                </Field>
                <Field label="Departamento" required>
                  <select value={form.department} onChange={updateField("department")} required className={inputCls}>
                    {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
                  </select>
                </Field>
                <Field label="Ciudad" required>
                  <input type="text" value={form.city}   onChange={updateField("city")}   placeholder="Bogotá" required className={inputCls} />
                </Field>
                <Field label="Dirección" required>
                  <input type="text" value={form.street} onChange={updateField("street")} placeholder="Cra 7 # 32-16" required className={inputCls} />
                </Field>
              </div>

              {/* Resumen de costos */}
              <div className="border-t border-brand-border pt-4 space-y-2">
                <div className="flex justify-between text-sm text-brand-muted">
                  <span>Subtotal ({items.length} {items.length === 1 ? "producto" : "productos"})</span>
                  <span>{formatPrice(total, currency)}</span>
                </div>
                <div className="flex justify-between text-sm text-brand-muted">
                  <span>Envío</span>
                  <span className={shippingCost === 0 ? "text-status-success font-medium" : ""}>
                    {shippingCost === 0 ? "Gratis" : formatPrice(shippingCost, currency)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-medium text-brand-primary pt-1 border-t border-brand-border">
                  <span>Total</span>
                  <span>{formatPrice(grandTotal, currency)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={!isFormValid()}
                className="w-full h-12 bg-brand-primary text-brand-inverse text-sm font-medium tracking-widest uppercase rounded-md hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
              >
                Continuar al pago
              </button>

              <p className="text-xs text-brand-muted text-center">
                Pago seguro procesado por{" "}
                <span className="font-medium text-brand-primary">Wompi</span>
                {" "}— Bancolombia
              </p>
            </form>
          )}

          {/* ——— STEP: Procesando ——— */}
          {step === "processing" && (
            <div className="py-12 flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-2 border-brand-border border-t-brand-primary rounded-full animate-spin" />
              <p className="text-sm text-brand-muted">Preparando tu pedido...</p>
            </div>
          )}

          {/* ——— STEP: Widget de Wompi ——— */}
          {step === "payment" && (
            <div className="py-4">
              <p className="text-sm text-brand-muted text-center mb-6">
                Completa el pago de forma segura con Wompi
              </p>
              {/* El script de Wompi inyecta el botón aquí */}
              <div id="wompi-container" className="flex justify-center" />
              <p className="text-xs text-brand-muted text-center mt-4">
                Tu pedido ha sido registrado. Recibirás una confirmación por email.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ——— Helpers ———
const inputCls = "w-full h-10 px-3 border border-brand-border rounded-md text-sm bg-white text-brand-primary outline-none focus:border-brand-primary transition-colors";

function Field({ label, children, required }: {
  label:    string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs text-brand-muted uppercase tracking-wider">
        {label}{required && <span className="text-status-error ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}
