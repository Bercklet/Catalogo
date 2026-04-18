"use client";

/**
 * PÁGINA DE LOGIN — Panel de administración
 * ------------------------------------------
 * Ruta: src/app/admin/login/page.tsx
 *
 * Flujo de autenticación:
 * 1. Admin ingresa email + contraseña
 * 2. Supabase verifica credenciales
 * 3. Si correcto → cookie de sesión → redirect a /admin
 * 4. Si incorrecto → mensaje de error
 *
 * Para crear el admin en Supabase:
 *   Dashboard → Authentication → Users → Add user
 *   Email: tu@email.com | Password: contraseña-segura
 */

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { brandConfig } from "@/brand.config";
import type { Database } from "@/types/database";

export default function AdminLoginPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const redirectTo   = searchParams.get("redirect") ?? "/admin";

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);

  const supabase = createClientComponentClient<Database>();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email:    email.trim().toLowerCase(),
      password,
    });

    if (authError) {
      setError(
        authError.message === "Invalid login credentials"
          ? "Email o contraseña incorrectos."
          : authError.message
      );
      setLoading(false);
      return;
    }

    // Login exitoso → ir al panel
    router.push(redirectTo);
    router.refresh(); // Forzar revalidación del middleware
  };

  return (
    <div className="min-h-screen bg-brand-secondary flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="font-display text-3xl font-light tracking-[0.2em] text-brand-primary mb-1">
            {brandConfig.brand.name}
          </h1>
          <p className="text-xs text-brand-muted tracking-widest uppercase">
            Panel de administración
          </p>
        </div>

        {/* Formulario */}
        <div className="bg-white border border-brand-border rounded-xl p-8">
          <form onSubmit={handleLogin} className="flex flex-col gap-4">

            {/* Error */}
            {error && (
              <div className="px-4 py-3 bg-red-50 border border-red-100 rounded-md">
                <p className="text-sm text-status-error">{error}</p>
              </div>
            )}

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-brand-muted uppercase tracking-wider" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="admin@maison.co"
                className="h-11 px-3 border border-brand-border rounded-md text-sm bg-white text-brand-primary outline-none focus:border-brand-primary transition-colors"
              />
            </div>

            {/* Contraseña */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-brand-muted uppercase tracking-wider" htmlFor="password">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="h-11 px-3 border border-brand-border rounded-md text-sm bg-white text-brand-primary outline-none focus:border-brand-primary transition-colors"
              />
            </div>

            {/* Botón */}
            <button
              type="submit"
              disabled={loading || !email || !password}
              className="mt-2 h-11 bg-brand-primary text-brand-inverse text-sm font-medium tracking-widest uppercase rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? "Verificando..." : "Ingresar"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-brand-muted mt-6">
          Solo personal autorizado de {brandConfig.brand.name}
        </p>
      </div>
    </div>
  );
}
