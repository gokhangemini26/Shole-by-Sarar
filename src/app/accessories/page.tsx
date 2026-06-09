"use client";
import { CategoryPageTemplate } from "@/components/CategoryPageTemplate";
import { useLocale } from "@/lib/LocaleContext";

export default function AccessoriesPage() {
  const { locale } = useLocale();

  const title = locale === "tr" ? "Aksesuar"
              : locale === "de" ? "Accessoires"
              : locale === "it" ? "Accessori"
              : "Accessories";

  const description = locale === "tr" ? "Mükemmel bitiş dokunuşları. Bitkisel tabaklanmış deriler, el yapımı asetat ve masif pirinç."
                    : locale === "de" ? "Die ultimativen letzten Schliffe. Pflanzlich gegerbtes Leder, handgemachtes Acetat und massives Messing."
                    : locale === "it" ? "I tocchi finali definitivi. Pelli conciate al vegetale, acetato fatto a mano e ottone massiccio."
                    : "The definitive finishing touches. Vegetable-tanned leathers, handmade acetate, and solid brass.";

  return (
    <CategoryPageTemplate
      category="accessories"
      title={title}
      description={description}
    />
  );
}
