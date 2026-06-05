"use client";
import { CategoryPageTemplate } from "@/components/CategoryPageTemplate";
import { useLocale } from "@/lib/LocaleContext";

export default function ShoesPage() {
  const { locale } = useLocale();
  return (
    <CategoryPageTemplate
      category="shoes"
      title={locale === "tr" ? "Ayakkabı" : "Footwear"}
      description={locale === "tr"
        ? "İzmir'de elde üretildi. Atölye Süet Terlik'ten zarif slingback babetlere kadar."
        : "Cobblestone-tested and bench-made in Izmir. From our Atelier Suede Mule to the Sleek Slingback Flat."}
    />
  );
}
