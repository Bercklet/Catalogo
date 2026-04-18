# MAISON — Catálogo Premium White-Label v2.0

> Stack: Next.js 14 · TypeScript · Tailwind CSS · App Router

---

## Inicio rápido (localhost en 3 minutos)

```bash
# 1. Instalar dependencias
npm install

# 2. Levantar servidor de desarrollo
npm run dev

# 3. Abrir en el navegador
# http://localhost:3000          → Catálogo
# http://localhost:3000/admin    → Panel de administración
```

---

## Estructura de archivos

```
maison-catalog/
├── brand.config.ts                  ← FUENTE DE VERDAD de marca
├── tailwind.config.ts               ← Tokens de diseño
├── next.config.js                   ← Configuración Next.js
├── .env.example                     ← Variables de entorno (plantilla)
│
└── src/
    ├── app/
    │   ├── layout.tsx               ← Root layout (fuentes, metadata)
    │   ├── page.tsx                 ← Catálogo principal ✅
    │   ├── not-found.tsx            ← Página 404
    │   ├── globals.css              ← Estilos base
    │   ├── products/
    │   │   └── [slug]/
    │   │       └── page.tsx         ← Detalle de producto ✅
    │   └── admin/
    │       ├── page.tsx             ← Dashboard inventario ✅
    │       └── products/
    │           ├── new/page.tsx     ← Crear producto ✅
    │           └── [id]/page.tsx    ← Editar producto ✅
    │
    ├── components/
    │   ├── Navbar.tsx
    │   ├── FilterBar.tsx            ← Filtros + búsqueda + orden
    │   ├── CatalogClient.tsx        ← Wrapper cliente (estado)
    │   ├── ProductCard.tsx          ← Tarjeta del grid
    │   ├── ProductDetailView.tsx    ← Ficha completa + galería
    │   ├── InventoryForm.tsx        ← Formulario admin
    │   └── SkeletonCard.tsx         ← Skeleton de carga
    │
    ├── constants/
    │   └── mockData.ts              ← 12 productos de ejemplo
    │
    ├── hooks/
    │   └── useCatalog.ts            ← Filtrado + búsqueda + orden
    │
    ├── lib/
    │   └── utils/
    │       └── format.ts            ← formatPrice, slugify
    │
    └── types/
        └── product.ts               ← Interfaces TypeScript
```

---

## Despliegue gratuito en Vercel

### Paso 1 — Crear repositorio en GitHub

```bash
# Opción A: usando GitHub CLI (recomendado)
gh auth login
gh repo create maison-catalog --public --push --source=.

# Opción B: manual
git init
git add .
git commit -m "feat: MAISON catalog v1.0 — plug and play"
# Luego en github.com: New repository → maison-catalog
# Seguir instrucciones para "push an existing repository"
git remote add origin https://github.com/TU_USUARIO/maison-catalog.git
git branch -M main
git push -u origin main
```

### Paso 2 — Conectar a Vercel

1. Ve a **[vercel.com](https://vercel.com)** → "Sign Up" con tu cuenta de GitHub (gratis)
2. Click en **"Add New Project"**
3. Selecciona el repositorio `maison-catalog`
4. Vercel detecta Next.js automáticamente — **no cambies nada**
5. Click en **"Deploy"**
6. En ~90 segundos tendrás: `https://maison-catalog-xxxx.vercel.app`

### Paso 3 — Dominio personalizado (opcional, gratuito)

En Vercel → Project Settings → Domains → agrega tu dominio.

---

## Estrategia Zero Cost para escalar

| Capa | Servicio | Plan gratis | Cuándo migrar |
|---|---|---|---|
| **Base de datos** | [Supabase](https://supabase.com) | 500MB · 50k filas | Desde el día 1 |
| **BD alternativa** | [Neon](https://neon.tech) | 512MB · branching | Proyectos grandes |
| **Imágenes** | [Cloudinary](https://cloudinary.com) | 25GB · WebP auto | Desde el día 1 |
| **Hosting** | [Vercel](https://vercel.com) | 100GB bandwidth | Hobby → Pro a los $20/mes |
| **Búsqueda** | [Algolia](https://algolia.com) | 10k búsquedas/mes | +500 productos |
| **Auth (admin)** | Supabase Auth | 50k MAU | Desde el día 1 |
| **Email** | [Resend](https://resend.com) | 3k emails/mes | Para confirmaciones |

### Conectar Supabase (cuando estés listo)

```bash
npm install @supabase/supabase-js
```

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

```ts
// src/lib/db/products.ts
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function getProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("published_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}
```

```ts
// src/app/page.tsx — reemplaza mockProducts por:
import { getProducts } from "@/lib/db/products";
export const revalidate = 60; // ISR: refresca cada 60 segundos

export default async function CatalogPage() {
  const products = await getProducts(); // ← datos reales
  // ...
}
```

### Conectar Cloudinary para imágenes

```bash
npm install next-cloudinary
```

```ts
// En InventoryForm, reemplaza el upload local por:
import { CldUploadWidget } from "next-cloudinary";

<CldUploadWidget
  uploadPreset="maison_catalog"
  onUpload={(result) => setImages([...images, result.info])}
>
  {({ open }) => <button onClick={() => open()}>Subir imagen</button>}
</CldUploadWidget>
```

---

## Cambiar la marca (White-Label)

Para adaptar el catálogo a otra marca, edita **solo** `brand.config.ts`:

```ts
export const brandConfig = {
  brand: {
    name: "NUEVA MARCA",
    tagline: "Tu tagline aquí",
    currency: "USD",
    // ...
  },
  colors: {
    primary: "#1B4332",   // Verde oscuro
    accent:  "#40916C",   // Verde medio
    // ...
  },
  typography: {
    fontDisplay: {
      family: "'Playfair Display', serif",
      googleFont: "Playfair+Display:wght@400;700",
    },
    // ...
  },
};
```

Guarda → la identidad visual completa se actualiza instantáneamente.

---

## Scripts disponibles

```bash
npm run dev      # Servidor de desarrollo (localhost:3000)
npm run build    # Build de producción (detecta errores de tipos)
npm run start    # Servidor de producción local
npm run lint     # ESLint
```

---

*Generado con Claude · Arquitectura SOLID · Next.js 14 App Router*
