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
        ? "İzmir'de elde üretildi. İkonik Mule No. 4'ten sivri burun babetlere kadar."
        : "Cobblestone-tested and bench-made in Izmir. From our signature Mule No. 4 to the Pointed Flat."}
    />
  );
}
