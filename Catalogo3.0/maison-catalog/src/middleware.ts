/**
 * MIDDLEWARE — Protección de rutas administrativas
 * --------------------------------------------------
 * Ruta: src/middleware.ts  (en la raíz de /src, NO en /app)
 *
 * Flujo:
 * 1. Toda petición a /admin/* pasa por aquí primero
 * 2. Verifica la cookie de sesión de Supabase
 * 3. Si no hay sesión válida → redirect a /admin/login
 * 4. Si hay sesión → deja pasar la petición
 *
 * La ruta /admin/login está excluida para evitar bucle infinito.
 */

import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse }           from "next/server";
import type { NextRequest }       from "next/server";
import type { Database }          from "@/types/database";

export async function middleware(req: NextRequest) {
  const res  = NextResponse.next();
  const path = req.nextUrl.pathname;

  // Excluir login y assets estáticos
  if (
    path === "/admin/login" ||
    path.startsWith("/_next") ||
    path.startsWith("/api/webhook") // Wompi webhook no requiere auth
  ) {
    return res;
  }

  // Crear cliente Supabase ligado a las cookies de la petición
  const supabase = createMiddlewareClient<Database>({ req, res });

  // Refrescar sesión (renueva el token si está por expirar)
  const { data: { session } } = await supabase.auth.getSession();

  // Sin sesión → redirigir al login
  if (!session) {
    const loginUrl = new URL("/admin/login", req.url);
    loginUrl.searchParams.set("redirect", path); // Para volver después del login
    return NextResponse.redirect(loginUrl);
  }

  // Verificar que el usuario tiene rol de admin
  // (Puedes agregar lógica de roles aquí si tienes múltiples tipos de usuario)
  const isAdmin = session.user.email === process.env.ADMIN_EMAIL ||
                  session.user.app_metadata?.role === "admin";

  if (!isAdmin) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return res;
}

// Configurar qué rutas activan el middleware
export const config = {
  matcher: ["/admin/:path*"],
};
