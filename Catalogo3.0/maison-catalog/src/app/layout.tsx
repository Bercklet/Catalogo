import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { CartDrawer } from "@/components/CartDrawer";
import { brandConfig } from "@/brand.config";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-ui",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${brandConfig.brand.name} — ${brandConfig.brand.tagline}`,
    template: `%s — ${brandConfig.brand.name}`,
  },
  description: `Catálogo oficial de ${brandConfig.brand.name}. ${brandConfig.brand.tagline}.`,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body className="min-h-screen bg-brand-secondary font-ui antialiased">
        <Navbar />
        <CartDrawer />
        {children}
        <footer className="mt-24 border-t border-brand-border py-10">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="font-display text-base font-light tracking-widest text-brand-primary">
              {brandConfig.brand.name}
            </span>
            <p className="text-xs text-brand-muted">
              © {new Date().getFullYear()} {brandConfig.brand.name}. Todos los derechos reservados.
            </p>
            <p className="text-xs text-brand-muted">{brandConfig.brand.tagline}</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
