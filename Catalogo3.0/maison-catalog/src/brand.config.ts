// src/brand.config.ts
export const brandConfig = {
  name: "Maison",
  fullName: "Maison Catálogo",
  description: "Catálogo de productos para la venta",
  primaryColor: "#000000",
  secondaryColor: "#ffffff",
  logo: "/logo.png", // cambia esto si tienes un logo
  currency: "COP",
  currencySymbol: "$",
  shippingThreshold: 500000, // envío gratis a partir de $500.000
  defaultShippingCost: 15000,
  contactEmail: "contacto@maison.com.co",
  contactPhone: "+57 300 123 4567",
  social: {
    instagram: "https://instagram.com/maison",
    facebook: "https://facebook.com/maison",
    whatsapp: "https://wa.me/573001234567",
  },
} as const;

export type BrandConfig = typeof brandConfig;
