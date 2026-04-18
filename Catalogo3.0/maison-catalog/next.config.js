/** @type {import('next').NextConfig} */
const nextConfig = {

  // ——— Optimización de imágenes ———
  images: {
    remotePatterns: [
      // Cloudinary — storage de producción
      { protocol: "https", hostname: "res.cloudinary.com" },
      // Supabase Storage — si subes imágenes ahí también
      { protocol: "https", hostname: "*.supabase.co" },
      // Unsplash — solo para mock data en desarrollo
      ...(process.env.NODE_ENV === "development"
        ? [{ protocol: "https", hostname: "images.unsplash.com" }]
        : []),
    ],
    // Formatos modernos automáticos
    formats: ["image/avif", "image/webp"],
    // Tamaños del grid de catálogo
    deviceSizes:    [640, 750, 828, 1080, 1200, 1920],
    imageSizes:     [64, 128, 256, 384, 512],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 días
  },

  // ——— Headers de seguridad ———
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Previene que el navegador "adivine" el tipo de contenido
          { key: "X-Content-Type-Options",    value: "nosniff" },
          // Protección contra clickjacking
          { key: "X-Frame-Options",           value: "DENY" },
          // Fuerza HTTPS
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          // Política de referrer
          { key: "Referrer-Policy",           value: "strict-origin-when-cross-origin" },
          // Permisos del navegador
          { key: "Permissions-Policy",        value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      // Cache agresivo para assets estáticos de Next.js
      {
        source: "/_next/static/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      // Cache de imágenes optimizadas
      {
        source: "/_next/image(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" },
        ],
      },
      // OG Images cacheadas en el edge
      {
        source: "/api/og(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" },
        ],
      },
    ];
  },

  // ——— Webpack: ignorar warnings de Supabase en el edge ———
  webpack(config) {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },

  // ——— Logging en producción ———
  logging: {
    fetches: { fullUrl: process.env.NODE_ENV === "development" },
  },
};

module.exports = nextConfig;
