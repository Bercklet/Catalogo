/**
 * OG IMAGE DINÁMICO
 * ------------------
 * Ruta: src/app/api/og/route.tsx
 *
 * Instalación: npm install @vercel/og
 *
 * Genera imágenes 1200×630 para Open Graph en tiempo real.
 * Acceso: /api/og?title=Nombre+Producto&subtitle=Categoría
 *
 * Vercel cachea estas imágenes automáticamente en el Edge.
 */

import { ImageResponse } from "@vercel/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const title    = searchParams.get("title")    ?? "MAISON";
  const subtitle = searchParams.get("subtitle") ?? "Luxury Ready-to-Wear";

  return new ImageResponse(
    (
      <div
        style={{
          display:         "flex",
          flexDirection:   "column",
          alignItems:      "center",
          justifyContent:  "center",
          width:           "100%",
          height:          "100%",
          backgroundColor: "#0A0A0A",
          padding:         "60px",
          fontFamily:      "serif",
        }}
      >
        {/* Línea decorativa superior */}
        <div style={{
          display:         "flex",
          width:           "80px",
          height:          "1px",
          backgroundColor: "#C9A96E",
          marginBottom:    "32px",
        }} />

        {/* Logo */}
        <div style={{
          fontSize:      "18px",
          letterSpacing: "0.4em",
          color:         "#C9A96E",
          textTransform: "uppercase",
          marginBottom:  "20px",
          fontFamily:    "sans-serif",
          fontWeight:    300,
        }}>
          MAISON
        </div>

        {/* Título del producto */}
        <div style={{
          fontSize:    title.length > 30 ? "44px" : "56px",
          fontWeight:  300,
          color:       "#FFFFFF",
          textAlign:   "center",
          lineHeight:  1.2,
          maxWidth:    "900px",
          marginBottom: "16px",
        }}>
          {title}
        </div>

        {/* Subtítulo */}
        <div style={{
          fontSize:      "18px",
          color:         "#888888",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          fontFamily:    "sans-serif",
          fontWeight:    300,
        }}>
          {subtitle}
        </div>

        {/* Línea decorativa inferior */}
        <div style={{
          display:         "flex",
          width:           "80px",
          height:          "1px",
          backgroundColor: "#C9A96E",
          marginTop:       "32px",
        }} />
      </div>
    ),
    {
      width:  1200,
      height: 630,
    }
  );
}
