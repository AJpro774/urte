import type { Metadata } from "next";
import { JetBrains_Mono, Source_Serif_4, Space_Grotesk } from "next/font/google";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "URTE — Unified Research Technology Encyclopedia",
    template: "%s · URTE",
  },
  description:
    "Searchable encyclopedia of simulated scientific research studies with deterministic math, sources, and human review.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
};

const themeBootScript = `(function(){try{var t=localStorage.getItem('urte-theme')||'fox';var m=localStorage.getItem('urte-mode')||'system';var r=document.documentElement;r.setAttribute('data-theme',t);var dark=window.matchMedia('(prefers-color-scheme: dark)').matches;r.setAttribute('data-mode',m==='system'?(dark?'dark':'light'):m);}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="fox" data-mode="light" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body
        className={`${spaceGrotesk.variable} ${sourceSerif.variable} ${jetbrains.variable}`}
      >
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
