/**
 * MASTER BRAND CONFIGURATION — White-Label Catalog v2.0
 * --------------------------------------------------------
 * Este archivo es la única fuente de verdad para la identidad visual.
 * Modifica aquí y toda la aplicación se actualiza instantáneamente.
 *
 * Para activar una nueva marca:
 *   1. Duplica este archivo (ej. brand.maison.config.ts)
 *   2. Actualiza los valores
 *   3. Apunta el import en tailwind.config.ts
 */

export const brandConfig = {
  /** Identidad de marca */
  brand: {
    name: "MAISON",
    tagline: "Luxury Ready-to-Wear",
    locale: "es-CO",
    currency: "COP",
    currencySymbol: "$",
  },

  /** Paleta cromática */
  colors: {
    primary: "#0A0A0A",      // Negro absoluto — CTAs, headers
    secondary: "#F8F6F2",    // Crema cálida — fondo de página
    accent: "#C9A96E",       // Dorado — highlights, links activos
    surface: "#FFFFFF",      // Blanco puro — tarjetas, formularios
    border: "#E8E4DC",       // Hueso — separadores sutiles
    text: {
      primary: "#1A1A1A",
      secondary: "#888888",
      inverse: "#FFFFFF",
    },
    status: {
      success: "#3B6D11",
      warning: "#854F0B",
      error: "#A32D2D",
      info: "#185FA5",
    },
  },

  /** Sistema tipográfico */
  typography: {
    /** Fuente de display — headings, nombres de producto */
    fontDisplay: {
      family: "'Cormorant Garamond', serif",
      googleFont: "Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300",
      weights: [300, 400, 600],
    },
    /** Fuente de UI — body, botones, labels */
    fontUi: {
      family: "'DM Sans', sans-serif",
      googleFont: "DM+Sans:wght@300;400;500",
      weights: [300, 400, 500],
    },
    /** Escala modular (ratio 1.25 — Major Third) */
    scale: {
      xs: "0.75rem",    // 12px — labels, badges
      sm: "0.875rem",   // 14px — body small
      base: "1rem",     // 16px — body
      lg: "1.25rem",    // 20px — subheadings
      xl: "1.5rem",     // 24px — prices, destacados
      "2xl": "2rem",    // 32px — section titles
      "3xl": "2.5rem",  // 40px — product name en detalle
      "4xl": "3.5rem",  // 56px — hero
    },
  },

  /** UI Kit — tokens globales de componentes */
  ui: {
    borderRadius: {
      sm: "4px",
      md: "8px",
      lg: "16px",
      xl: "24px",
      full: "9999px",
    },
    shadows: {
      card: "0 2px 8px rgba(0,0,0,0.06)",
      hover: "0 12px 40px rgba(0,0,0,0.10)",
      focus: "0 0 0 3px rgba(201,169,110,0.25)",
    },
    /** Aspect ratios para imágenes de producto */
    productImageRatio: {
      card: "4 / 5",      // Grid de catálogo
      detail: "4 / 5",    // Vista de detalle
      thumbnail: "1 / 1", // Thumbnails de galería
    },
    transitions: {
      fast: "all 0.15s ease",
      base: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      slow: "all 0.5s ease",
    },
    button: {
      height: "44px",
      paddingX: "24px",
      fontWeight: "500",
      letterSpacing: "0.05em",
    },
  },

  /** Configuración del catálogo */
  catalog: {
    productsPerPage: 12,
    gridColumns: { mobile: 2, tablet: 3, desktop: 4 },
    sortOptions: [
      { label: "Más recientes", value: "date_desc" },
      { label: "Precio: menor a mayor", value: "price_asc" },
      { label: "Precio: mayor a menor", value: "price_desc" },
      { label: "Más populares", value: "popularity_desc" },
    ],
  },
} as const;

/** Tipo inferido para autocompletado en toda la app */
export type BrandConfig = typeof brandConfig;
