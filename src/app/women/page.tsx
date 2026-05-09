"use client";
import { CategoryPageTemplate } from "@/components/CategoryPageTemplate";
import { useLocale } from "@/lib/LocaleContext";

export default function WomenPage() {
  const { locale } = useLocale();
  return (
    <CategoryPageTemplate
      category="women"
      title={locale === "tr" ? "Kadın Koleksiyonu" : "Women's Collection"}
      description={locale === "tr" 
        ? "Akışkan silüetler, verev kesim ipekler ve zahmetsiz trikolar. Hareket ve uzun ömür için tasarlandı." 
        : "Fluid silhouettes, bias-cut silks, and effortless knitwear. Designed for movement and longevity."}
    />
  );
}
