"use client";
import { CategoryPageTemplate } from "@/components/CategoryPageTemplate";
import { useLocale } from "@/lib/LocaleContext";

export default function AccessoriesPage() {
  const { locale } = useLocale();
  return (
    <CategoryPageTemplate
      category="accessories"
      title={locale === "tr" ? "Aksesuar" : "Accessories"}
      description={locale === "tr"
        ? "Mükemmel bitiş dokunuşları. Bitkisel tabaklanmış deriler, el yapımı asetat ve masif pirinç."
        : "The definitive finishing touches. Vegetable-tanned leathers, handmade acetate, and solid brass."}
    />
  );
}
