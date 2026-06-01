import type { Metadata } from "next";
import "./globals.css";
import { GlobalAssistant } from "@/components/GlobalAssistant";
import { LocaleProvider } from "@/lib/LocaleContext";

export const metadata: Metadata = {
  title: "SHOLÉ — Digital-First Luxury Atelier",
  description:
    "The future of tailoring. A digital-first atelier where neural networks meet master craftsmanship, fabric learns your movements, and your AI stylist is always by your side. Spring/Summer 2026.",
  keywords: [
    "SHOLÉ",
    "AI stylist",
    "digital tailoring",
    "computational fashion",
    "luxury",
    "modern atelier",
    "Istanbul",
  ],
  openGraph: {
    title: "SHOLÉ — Digital-First Luxury Atelier",
    description:
      "The future of tailoring. Neural networks meet master craftsmanship.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..700;1,9..144,300..700&family=Outfit:wght@300..700&family=Playfair+Display:ital,wght@0,400..700;1,400..700&family=DM+Serif+Display:ital@0;1&family=Inter:wght@300..700&family=JetBrains+Mono:wght@300..600&family=Hanken+Grotesk:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <LocaleProvider>
          {children}
          <GlobalAssistant />
        </LocaleProvider>
      </body>
    </html>
  );
}

