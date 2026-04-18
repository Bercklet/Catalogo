/**
 * MOCK DATA — Catálogo MAISON
 * ----------------------------
 * 12 productos de ejemplo que implementan estrictamente la interfaz Product.
 * Las imágenes provienen de Unsplash (gratuitas, no requieren API key).
 *
 * Para reemplazar por datos reales:
 *   1. Conecta Supabase/Neon
 *   2. Reemplaza este import en page.tsx por tu fetch a la DB
 *   3. Elimina este archivo
 */

import type { Product } from "@/types/product";

// ——— Categorías reutilizables ———
const CAT = {
  pret: { id: "cat-1", name: "Prêt-à-porter", slug: "pret-a-porter" },
  acc:  { id: "cat-2", name: "Accesorios",     slug: "accesorios" },
  calz: { id: "cat-3", name: "Calzado",        slug: "calzado" },
  joy:  { id: "cat-4", name: "Joyería",        slug: "joyeria" },
} as const;

// ——— Paleta de colores de la colección ———
const COLORS = {
  ivory:   { name: "Ivory",    hex: "#E8D5C4" },
  onix:    { name: "Ónix",     hex: "#2C2C2A" },
  lavanda: { name: "Lavanda",  hex: "#7F77DD" },
  salvia:  { name: "Salvia",   hex: "#5DCAA5" },
  tostado: { name: "Tostado",  hex: "#8B6F47" },
  plata:   { name: "Plata",    hex: "#B4B2A9" },
  dorado:  { name: "Dorado",   hex: "#C9A96E" },
  arena:   { name: "Arena",    hex: "#D3C9B5" },
  coral:   { name: "Coral",    hex: "#F0997B" },
  vino:    { name: "Vino",     hex: "#6B2737" },
} as const;

// ——— Helper para generar variantes color × talla ———
function makeVariants(
  colors: Array<{ name: string; hex: string }>,
  sizes: string[],
  baseStock = 10
) {
  return colors.flatMap((color, ci) =>
    sizes.map((size, si) => ({
      id:    `v-${ci}-${si}`,
      sku:   `SKU-${color.name.toUpperCase().slice(0, 3)}-${size}`,
      color,
      size,
      stock: si === 0 ? 0 : Math.floor(Math.random() * baseStock) + 1,
    }))
  );
}

export const mockProducts: Product[] = [
  // ——— 1. Vestido Seda Cruda ———
  {
    id: "prod-001",
    slug: "vestido-seda-cruda-ss25",
    name: "Vestido Seda Cruda",
    description:
      "Confeccionado en seda natural de grado A procedente de talleres artesanales en Lyon. Caída fluida que abraza la silueta con elegancia sobria. Cierre lateral invisible, corte al bies con entalle en cintura. Forro interior en seda lavable. Una pieza atemporal para ocasiones que exigen distinción.",
    shortDescription: "Seda natural de grado A. Corte al bies. Caída impecable.",
    material: "100% Seda natural (grado A). Forro: 100% Seda lavable.",
    careInstructions: [
      "Lavado en seco recomendado",
      "Planchar a temperatura baja con paño protector",
      "Guardar en funda de tela para evitar rozaduras",
    ],
    images: [
      { id: "img-001-1", url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=85", alt: "Vestido Seda Cruda — Vista frontal", position: 0, width: 800, height: 1000 },
      { id: "img-001-2", url: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=85", alt: "Vestido Seda Cruda — Vista posterior", position: 1, width: 800, height: 1000 },
      { id: "img-001-3", url: "https://images.unsplash.com/photo-1566206091558-7f218b696731?w=800&q=85", alt: "Vestido Seda Cruda — Detalle de tela", position: 2, width: 800, height: 1000 },
      { id: "img-001-4", url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=85", alt: "Vestido Seda Cruda — Detalle escote", position: 3, width: 800, height: 1000 },
    ],
    price: 890000,
    currency: "COP",
    variants: makeVariants([COLORS.ivory, COLORS.onix, COLORS.lavanda], ["XS","S","M","L","XL"]),
    availableColors: [COLORS.ivory, COLORS.onix, COLORS.lavanda],
    availableSizes: ["XS","S","M","L","XL"],
    category: CAT.pret,
    tags: ["seda", "vestido", "ocasión especial", "ss25"],
    badges: ["nuevo"],
    isActive: true,
    publishedAt: "2025-01-15T10:00:00Z",
    updatedAt:   "2025-03-01T08:30:00Z",
    seo: {
      title: "Vestido Seda Cruda SS25 — MAISON",
      description: "Vestido en seda natural de grado A. Corte al bies. Disponible en Ivory, Ónix y Lavanda.",
      keywords: ["vestido seda", "lujo colombiano", "moda bogotá"],
    },
  },

  // ——— 2. Blazer Lino Estructurado ———
  {
    id: "prod-002",
    slug: "blazer-lino-estructurado-ss25",
    name: "Blazer Lino Estructurado",
    description:
      "Tejido en lino belga de primera calidad, este blazer redefine la formalidad contemporánea. Construcción con entretela fusionada para mantener la silueta durante todo el día. Bolsillos de bichero con tapa. Botones forrados en el mismo tejido.",
    shortDescription: "Lino belga. Construcción entretela. Silueta estructurada.",
    material: "78% Lino, 22% Algodón. Forro: 100% Viscosa.",
    careInstructions: [
      "Lavado en seco",
      "No torcer ni retorcer",
      "Planchar en sentido del tejido",
    ],
    images: [
      { id: "img-002-1", url: "https://images.unsplash.com/photo-1594938298603-c8148c4b4086?w=800&q=85", alt: "Blazer Lino — Vista frontal", position: 0 },
      { id: "img-002-2", url: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=85", alt: "Blazer Lino — Vista lateral", position: 1 },
      { id: "img-002-3", url: "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=800&q=85", alt: "Blazer Lino — Detalle botones", position: 2 },
    ],
    price: 630000,
    compareAtPrice: 900000,
    currency: "COP",
    variants: makeVariants([COLORS.arena, COLORS.onix], ["XS","S","M","L","XL","XXL"]),
    availableColors: [COLORS.arena, COLORS.onix],
    availableSizes: ["XS","S","M","L","XL","XXL"],
    category: CAT.pret,
    tags: ["lino", "blazer", "formal", "descuento"],
    badges: ["oferta"],
    isActive: true,
    publishedAt: "2024-11-20T10:00:00Z",
    updatedAt:   "2025-02-14T09:00:00Z",
  },

  // ——— 3. Cartera Cuero Artesanal ———
  {
    id: "prod-003",
    slug: "cartera-cuero-artesanal",
    name: "Cartera Cuero Artesanal",
    description:
      "Elaborada a mano en cuero full-grain curtido al vegetal en talleres familiares de Medellín. Con el tiempo, desarrolla una pátina única que hace cada pieza irrepetible. Herrajes en latón envejecido. Capacidad para A4, laptop de 13\", y bolsillos organizadores.",
    shortDescription: "Cuero full-grain. Curtido al vegetal. Herrajes latón.",
    material: "Cuero full-grain curtido al vegetal. Sin cromo.",
    careInstructions: [
      "Limpiar con paño seco o ligeramente húmedo",
      "Nutrir con cera de abeja cada 3 meses",
      "Evitar exposición prolongada al sol",
    ],
    images: [
      { id: "img-003-1", url: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=85", alt: "Cartera Cuero — Vista frontal", position: 0 },
      { id: "img-003-2", url: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&q=85", alt: "Cartera Cuero — Interior", position: 1 },
      { id: "img-003-3", url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=85", alt: "Cartera Cuero — Detalle herraje", position: 2 },
    ],
    price: 1250000,
    currency: "COP",
    variants: [
      { id: "v-c1", sku: "SKU-CART-TOS", color: COLORS.tostado, size: "Única", stock: 6 },
      { id: "v-c2", sku: "SKU-CART-ONI", color: COLORS.onix,    size: "Única", stock: 4 },
    ],
    availableColors: [COLORS.tostado, COLORS.onix],
    availableSizes: ["Única"],
    category: CAT.acc,
    tags: ["cuero", "cartera", "artesanal", "colombiano"],
    badges: ["best-seller"],
    isActive: true,
    publishedAt: "2024-09-01T10:00:00Z",
    updatedAt:   "2025-03-15T11:00:00Z",
  },

  // ——— 4. Mule Satín Bajo ———
  {
    id: "prod-004",
    slug: "mule-satin-bajo",
    name: "Mule Satín Bajo",
    description:
      "Diseñado en colaboración con zapateros artesanales de Bucaramanga. Tejido de satén con acabado espejo sobre horma anatómica de última generación. Talonera acolchada en cuero suave. Suela de cuero con antideslizante discreto.",
    shortDescription: "Satén espejo. Horma anatómica. Artesanía Bucaramanga.",
    material: "Exterior: Satén de seda 100%. Interior y suela: Cuero natural.",
    careInstructions: [
      "Limpiar manchas con paño ligeramente húmedo",
      "Guardar en bolsa de tela individual",
      "Usar calzador para preservar la forma",
    ],
    images: [
      { id: "img-004-1", url: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=85", alt: "Mule Satín — Vista lateral", position: 0 },
      { id: "img-004-2", url: "https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=800&q=85", alt: "Mule Satín — Vista superior", position: 1 },
    ],
    price: 520000,
    currency: "COP",
    variants: makeVariants([COLORS.coral, COLORS.onix, COLORS.salvia], ["35","36","37","38","39","40"]),
    availableColors: [COLORS.coral, COLORS.onix, COLORS.salvia],
    availableSizes: ["35","36","37","38","39","40"],
    category: CAT.calz,
    tags: ["calzado", "satén", "mule", "primavera"],
    badges: ["nuevo"],
    isActive: true,
    publishedAt: "2025-02-01T10:00:00Z",
    updatedAt:   "2025-03-10T14:00:00Z",
  },

  // ——— 5. Collar Eslabón Fino ———
  {
    id: "prod-005",
    slug: "collar-eslabon-fino",
    name: "Collar Eslabón Fino",
    description:
      "Joyería de autor fabricada en plata de ley 925 con baño de oro de 18k. Eslabón oval tipo trace chain de 1.5mm de grosor. Cierre tipo mosquetón de precisión. Largo ajustable entre 40 y 45 cm mediante extensión incluida.",
    shortDescription: "Plata 925. Baño oro 18k. Largo ajustable 40–45 cm.",
    material: "Plata esterlina 925 con baño de oro 18 kilates.",
    careInstructions: [
      "Guardar en paño anti-oxidante",
      "Evitar contacto con perfumes y cloro",
      "Limpiar con paño de joyería suave",
    ],
    images: [
      { id: "img-005-1", url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=85", alt: "Collar Eslabón — Vista general", position: 0 },
      { id: "img-005-2", url: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=85", alt: "Collar Eslabón — Detalle cierre", position: 1 },
    ],
    price: 340000,
    currency: "COP",
    variants: [
      { id: "v-col-d", sku: "SKU-COL-DOI", color: COLORS.dorado, size: "40cm", stock: 12 },
      { id: "v-col-p", sku: "SKU-COL-PLA", color: COLORS.plata,  size: "40cm", stock: 8 },
    ],
    availableColors: [COLORS.dorado, COLORS.plata],
    availableSizes: ["40cm", "45cm"],
    category: CAT.joy,
    tags: ["joyería", "collar", "plata", "oro"],
    badges: ["nuevo"],
    isActive: true,
    publishedAt: "2025-01-28T10:00:00Z",
    updatedAt:   "2025-03-05T10:00:00Z",
  },

  // ——— 6. Pashmina Doble Faz ———
  {
    id: "prod-006",
    slug: "pashmina-doble-faz",
    name: "Pashmina Doble Faz",
    description:
      "Tejida a mano en los telares de Pasto por artesanas que preservan técnicas centenarias. Lana de cachemira procedente del Himalaya nepalés. Reversible: cada cara en un tono distinto de la misma familia cromática. Dimensiones: 200 × 70 cm.",
    shortDescription: "Cachemira Himalaya. Tejida a mano. Reversible. 200×70cm.",
    material: "100% Cachemira grado A (Mongolia/Nepal). 16 micras.",
    careInstructions: [
      "Lavado a mano en agua fría con detergente suave para lana",
      "No retorcer — escurrir enrollando en toalla",
      "Secar en horizontal sobre superficie plana",
    ],
    images: [
      { id: "img-006-1", url: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800&q=85", alt: "Pashmina — Vista completa", position: 0 },
      { id: "img-006-2", url: "https://images.unsplash.com/photo-1510553108780-c7f1f8e1dd56?w=800&q=85", alt: "Pashmina — Detalle tejido", position: 1 },
    ],
    price: 280000,
    currency: "COP",
    variants: [
      { id: "v-psh-1", sku: "SKU-PSH-LAV", color: COLORS.lavanda, size: "Única", stock: 7 },
      { id: "v-psh-2", sku: "SKU-PSH-SAL", color: COLORS.salvia,  size: "Única", stock: 5 },
      { id: "v-psh-3", sku: "SKU-PSH-IVO", color: COLORS.ivory,   size: "Única", stock: 9 },
    ],
    availableColors: [COLORS.lavanda, COLORS.salvia, COLORS.ivory],
    availableSizes: ["Única"],
    category: CAT.acc,
    tags: ["cachemira", "pashmina", "artesanal", "colombia"],
    badges: [],
    isActive: true,
    publishedAt: "2024-10-15T10:00:00Z",
    updatedAt:   "2025-02-20T10:00:00Z",
  },

  // ——— 7. Pantalón Palazzo Crepé ———
  {
    id: "prod-007",
    slug: "pantalon-palazzo-crepe",
    name: "Pantalón Palazzo Crepé",
    description:
      "Corte palazzo de pierna ultra ancha en crepé georgette de doble capa. Cintura elástica oculta bajo banda de tela para apariencia estructurada. Bolsillos laterales profundos. Una prenda que une comodidad y elegancia sin concesiones.",
    shortDescription: "Crepé georgette. Pierna ultra ancha. Cintura elástica oculta.",
    material: "100% Poliéster reciclado certificado GRS. Tejido: Crepé georgette.",
    careInstructions: [
      "Lavar a máquina en ciclo delicado 30°C",
      "No usar secadora",
      "Planchar a temperatura media-baja por el revés",
    ],
    images: [
      { id: "img-007-1", url: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=85", alt: "Pantalón Palazzo — Vista frontal", position: 0 },
      { id: "img-007-2", url: "https://images.unsplash.com/photo-1594938298603-c8148c4b4086?w=800&q=85", alt: "Pantalón Palazzo — Vista lateral", position: 1 },
    ],
    price: 420000,
    compareAtPrice: 560000,
    currency: "COP",
    variants: makeVariants([COLORS.onix, COLORS.vino, COLORS.arena], ["XS","S","M","L","XL"]),
    availableColors: [COLORS.onix, COLORS.vino, COLORS.arena],
    availableSizes: ["XS","S","M","L","XL"],
    category: CAT.pret,
    tags: ["palazzo", "pantalón", "descuento", "ss25"],
    badges: ["oferta", "best-seller"],
    isActive: true,
    publishedAt: "2025-01-05T10:00:00Z",
    updatedAt:   "2025-03-18T10:00:00Z",
  },

  // ——— 8. Cinturón Cuero Trenzado ———
  {
    id: "prod-008",
    slug: "cinturon-cuero-trenzado",
    name: "Cinturón Cuero Trenzado",
    description:
      "Elaborado a partir de tres tiras de cuero curtido al vegetal trenzadas a mano. Hebilla intercambiable en latón macizo pulido a mano. Disponible en tres anchos. Un accesorio que define el look con un gesto minimal.",
    shortDescription: "Cuero curtido vegetal. Trenzado a mano. Hebilla latón.",
    material: "Cuero curtido al vegetal (sin cromo). Hebilla: Latón macizo.",
    careInstructions: [
      "Nutrir con aceite de cuero cada 6 meses",
      "Guardar sin doblar cuando sea posible",
    ],
    images: [
      { id: "img-008-1", url: "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=800&q=85", alt: "Cinturón Trenzado — Vista completa", position: 0 },
      { id: "img-008-2", url: "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=800&q=85", alt: "Cinturón Trenzado — Detalle hebilla", position: 1 },
    ],
    price: 195000,
    currency: "COP",
    variants: [
      { id: "v-cin-1", sku: "SKU-CIN-TOS-S", color: COLORS.tostado, size: "S (70–80cm)", stock: 8 },
      { id: "v-cin-2", sku: "SKU-CIN-TOS-M", color: COLORS.tostado, size: "M (80–90cm)", stock: 10 },
      { id: "v-cin-3", sku: "SKU-CIN-TOS-L", color: COLORS.tostado, size: "L (90–100cm)", stock: 6 },
      { id: "v-cin-4", sku: "SKU-CIN-ONI-S", color: COLORS.onix,    size: "S (70–80cm)", stock: 5 },
      { id: "v-cin-5", sku: "SKU-CIN-ONI-M", color: COLORS.onix,    size: "M (80–90cm)", stock: 7 },
      { id: "v-cin-6", sku: "SKU-CIN-ONI-L", color: COLORS.onix,    size: "L (90–100cm)", stock: 3 },
    ],
    availableColors: [COLORS.tostado, COLORS.onix],
    availableSizes: ["S (70–80cm)", "M (80–90cm)", "L (90–100cm)"],
    category: CAT.acc,
    tags: ["cinturón", "cuero", "artesanal"],
    badges: [],
    isActive: true,
    publishedAt: "2024-12-01T10:00:00Z",
    updatedAt:   "2025-02-28T10:00:00Z",
  },

  // ——— 9. Cardigan Cachemira Fine-Gauge ———
  {
    id: "prod-009",
    slug: "cardigan-cachemira-fine-gauge",
    name: "Cardigan Cachemira Fine-Gauge",
    description:
      "Tejido en punto fino (fine-gauge) con hilo de cachemira de 2 cabos. Caída suave y fluida, no voluminosa. Botones de nácar natural. Un básico de lujo que eleva cualquier conjunto con su tacto incomparable.",
    shortDescription: "Cachemira 2 cabos. Punto fino. Botones nácar natural.",
    material: "100% Cachemira grado A. Botones: Nácar natural.",
    careInstructions: [
      "Lavado a mano en agua tibia (30°C)",
      "No colgar — secar en plano",
      "Guardar doblado con hoja de cedro anti-polilla",
    ],
    images: [
      { id: "img-009-1", url: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=85", alt: "Cardigan Cachemira — Vista frontal", position: 0 },
      { id: "img-009-2", url: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=85", alt: "Cardigan Cachemira — Detalle botones", position: 1 },
    ],
    price: 780000,
    currency: "COP",
    variants: makeVariants([COLORS.ivory, COLORS.salvia, COLORS.arena, COLORS.vino], ["XS","S","M","L","XL"]),
    availableColors: [COLORS.ivory, COLORS.salvia, COLORS.arena, COLORS.vino],
    availableSizes: ["XS","S","M","L","XL"],
    category: CAT.pret,
    tags: ["cachemira", "cardigan", "invierno", "básico"],
    badges: ["best-seller"],
    isActive: true,
    publishedAt: "2024-08-15T10:00:00Z",
    updatedAt:   "2025-03-20T10:00:00Z",
  },

  // ——— 10. Botas Chelsea Cuero Cepillado ———
  {
    id: "prod-010",
    slug: "botas-chelsea-cuero-cepillado",
    name: "Botas Chelsea Cuero Cepillado",
    description:
      "Reinterpretación contemporánea del clásico Chelsea boot. Fabricadas en cuero cepillado (brushed leather) que aporta carácter y profundidad al color. Elásticos laterales en grosgrain de seda. Suela de cuero con tacón de 3.5 cm.",
    shortDescription: "Cuero cepillado. Elásticos grosgrain seda. Tacón 3.5cm.",
    material: "Exterior: Cuero cepillado premium. Interior y plantilla: Cuero natural.",
    careInstructions: [
      "Limpiar con cepillo de cerda suave en dirección del cepillado",
      "Nutrir con crema específica para cuero cepillado",
      "Usar hormas de cedro cuando no estén en uso",
    ],
    images: [
      { id: "img-010-1", url: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800&q=85", alt: "Botas Chelsea — Vista lateral", position: 0 },
      { id: "img-010-2", url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=85", alt: "Botas Chelsea — Vista frontal", position: 1 },
    ],
    price: 950000,
    currency: "COP",
    variants: makeVariants([COLORS.tostado, COLORS.onix], ["35","36","37","38","39","40","41"]),
    availableColors: [COLORS.tostado, COLORS.onix],
    availableSizes: ["35","36","37","38","39","40","41"],
    category: CAT.calz,
    tags: ["botas", "chelsea", "cuero", "invierno"],
    badges: ["nuevo"],
    isActive: true,
    publishedAt: "2025-02-20T10:00:00Z",
    updatedAt:   "2025-03-22T10:00:00Z",
  },

  // ——— 11. Pulsera Oro Vermeil ———
  {
    id: "prod-011",
    slug: "pulsera-oro-vermeil",
    name: "Pulsera Oro Vermeil",
    description:
      "Pieza de joyería fina en plata de ley 925 con baño de oro 18k de 2.5 micras (vermeil). Diseño de cadena de papel (paperclip chain) de eslabones planos. Cierre tipo T-bar. Longitud: 16–19 cm ajustable.",
    shortDescription: "Plata 925. Baño oro 18k vermeil 2.5μm. Paperclip chain.",
    material: "Plata esterlina 925. Baño de oro 18 kilates, 2.5 micras (vermeil).",
    careInstructions: [
      "Evitar contacto con agua, sudor y productos de belleza",
      "Guardar en bolsita anti-oxidante",
      "Limpiar con paño de microfibra seco",
    ],
    images: [
      { id: "img-011-1", url: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&q=85", alt: "Pulsera Vermeil — Vista general", position: 0 },
      { id: "img-011-2", url: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=85", alt: "Pulsera Vermeil — Detalle eslabones", position: 1 },
    ],
    price: 265000,
    currency: "COP",
    variants: [
      { id: "v-pul-d",  sku: "SKU-PUL-DOI", color: COLORS.dorado, size: "Única", stock: 14 },
      { id: "v-pul-p",  sku: "SKU-PUL-PLA", color: COLORS.plata,  size: "Única", stock: 10 },
    ],
    availableColors: [COLORS.dorado, COLORS.plata],
    availableSizes: ["Única"],
    category: CAT.joy,
    tags: ["pulsera", "oro", "vermeil", "joyería fina"],
    badges: ["nuevo", "best-seller"],
    isActive: true,
    publishedAt: "2025-03-01T10:00:00Z",
    updatedAt:   "2025-03-25T10:00:00Z",
  },

  // ——— 12. Top Organza Bordada ———
  {
    id: "prod-012",
    slug: "top-organza-bordada",
    name: "Top Organza Bordada",
    description:
      "Cuerpo en organza de seda con bordados florales realizados a mano por artesanas de Mompox. Cada pieza es única: los motivos florales varían sutilmente entre unidades. Forro interior en seda para comodidad. Cierre lateral invisible.",
    shortDescription: "Organza seda. Bordado floral a mano. Pieza única Mompox.",
    material: "Organza: 100% Seda. Forro: 100% Seda. Bordados: Hilo de seda.",
    careInstructions: [
      "Lavado en seco exclusivamente",
      "Guardar extendido o con papel de seda",
      "No colgar para no deformar bordados",
    ],
    images: [
      { id: "img-012-1", url: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=800&q=85", alt: "Top Organza Bordada — Vista frontal", position: 0 },
      { id: "img-012-2", url: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=85", alt: "Top Organza Bordada — Detalle bordado", position: 1 },
    ],
    price: 560000,
    currency: "COP",
    variants: makeVariants([COLORS.ivory, COLORS.coral], ["XS","S","M","L"]),
    availableColors: [COLORS.ivory, COLORS.coral],
    availableSizes: ["XS","S","M","L"],
    category: CAT.pret,
    tags: ["organza", "bordado", "artesanal", "mompox", "exclusivo"],
    badges: ["exclusivo", "nuevo"],
    isActive: true,
    publishedAt: "2025-03-10T10:00:00Z",
    updatedAt:   "2025-03-28T10:00:00Z",
  },
];

/** Categorías únicas derivadas del mock data */
export const mockCategories = Array.from(
  new Map(mockProducts.map((p) => [p.category.id, p.category])).values()
);

/** Rango de precios del catálogo */
export const priceRange = {
  min: Math.min(...mockProducts.map((p) => p.price)),
  max: Math.max(...mockProducts.map((p) => p.price)),
};
