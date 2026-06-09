"use client";
import { CategoryPageTemplate } from "@/components/CategoryPageTemplate";
import { useLocale } from "@/lib/LocaleContext";

export default function WomenPage() {
  const { locale } = useLocale();

  const title = locale === "tr" ? "Kadın Koleksiyonu"
              : locale === "de" ? "Damenkollektion"
              : locale === "it" ? "Collezione Donna"
              : "Women's Collection";

  const description = locale === "tr" ? "Akışkan silüetler, verev kesim ipekler ve zahmetsiz trikolar. Hareket ve uzun ömür için tasarlandı."
                    : locale === "de" ? "Fließende Silhouetten, schräg geschnittene Seide und mühelose Strickwaren. Entworfen für Bewegung und Langlebigkeit."
                    : locale === "it" ? "Silhouette fluide, sete tagliate in sbieco e maglieria senza sforzo. Progettato per il movimento e la longevità."
                    : "Fluid silhouettes, bias-cut silks, and effortless knitwear. Designed for movement and longevity.";

  return (
    <CategoryPageTemplate
      category="women"
      title={title}
      description={description}
    />
  );
}
