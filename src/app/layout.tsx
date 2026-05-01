import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SHOLÉ by SARAR — Modern Atelier",
  description:
    "A new chapter from the SARAR atelier. Tailoring that learns your shape, textures that get better with time, and an AI stylist that actually listens. Spring/Summer 2026.",
  keywords: [
    "SHOLÉ",
    "SARAR",
    "fashion",
    "luxury",
    "tailoring",
    "AI stylist",
    "Istanbul",
    "atelier",
  ],
  openGraph: {
    title: "SHOLÉ by SARAR — Modern Atelier",
    description:
      "Tailoring that learns your shape. An AI stylist that actually listens.",
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
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..700;1,9..144,300..700&family=Outfit:wght@300..700&family=Playfair+Display:ital,wght@0,400..700;1,400..700&family=DM+Serif+Display:ital@0;1&family=Inter:wght@300..700&family=JetBrains+Mono:wght@300..600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
