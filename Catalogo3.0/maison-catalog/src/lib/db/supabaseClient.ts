/**
 * SUPABASE CLIENT — Singleton Pattern para Next.js
 * --------------------------------------------------
 * Ruta: src/lib/db/supabaseClient.ts
 *
 * Exporta DOS clientes con responsabilidades distintas:
 *
 * 1. `supabase`      → cliente público (anon key)
 *    - Usado en Server Components y Client Components
 *    - Respeta Row Level Security (RLS)
 *    - Solo lectura del catálogo público
 *
 * 2. `supabaseAdmin` → cliente privilegiado (service_role)
 *    - SOLO usar en Server Actions y API Routes
 *    - Bypasea RLS — puede escribir cualquier tabla
 *    - NUNCA exponer al cliente (no usar en "use client")
 *
 * Variables de entorno requeridas:
 *   NEXT_PUBLIC_SUPABASE_URL      → Dashboard → Settings → API → URL
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY → Dashboard → Settings → API → anon key
 *   SUPABASE_SERVICE_ROLE_KEY     → Dashboard → Settings → API → service_role key
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

// ——— Validación de variables de entorno ———
const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl)  throw new Error("Falta NEXT_PUBLIC_SUPABASE_URL en .env.local");
if (!supabaseAnon) throw new Error("Falta NEXT_PUBLIC_SUPABASE_ANON_KEY en .env.local");

// ——— Singleton: evita múltiples instancias en desarrollo (hot reload) ———
declare global {
  // eslint-disable-next-line no-var
  var _supabasePublic: SupabaseClient<Database> | undefined;
  // eslint-disable-next-line no-var
  var _supabaseAdmin:  SupabaseClient<Database> | undefined;
}

// Cliente público — respeta RLS
export const supabase: SupabaseClient<Database> =
  globalThis._supabasePublic ??
  (globalThis._supabasePublic = createClient<Database>(supabaseUrl, supabaseAnon, {
    auth: {
      persistSession: false, // En Server Components no hay sesión
      autoRefreshToken: false,
    },
  }));

// Cliente admin — bypasea RLS (¡solo en servidor!)
export const supabaseAdmin: SupabaseClient<Database> =
  globalThis._supabaseAdmin ??
  (globalThis._supabaseAdmin = createClient<Database>(
    supabaseUrl,
    supabaseServiceRole ?? supabaseAnon, // Fallback a anon si no está configurado
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  ));

// En producción, no acumular en globalThis
if (process.env.NODE_ENV === "production") {
  globalThis._supabasePublic = undefined;
  globalThis._supabaseAdmin  = undefined;
}
