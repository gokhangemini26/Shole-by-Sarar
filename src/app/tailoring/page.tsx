"use client";
import { CategoryPageTemplate } from "@/components/CategoryPageTemplate";
import { useLocale } from "@/lib/LocaleContext";

export default function TailoringPage() {
  const { locale } = useLocale();
  return (
    <CategoryPageTemplate
      category="tailoring"
      title={locale === "tr" ? "Terzilik" : "Tailoring"}
      description={locale === "tr"
        ? "Yapay zeka çağında yeniden tasarlanan yüksek terzilik. Algoritmik hassasiyetle yapılandırılmış omuzlar, keskin yakalar ve özel kanvas iç astarlar."
        : "High tailoring reimagined for the AI age. Structured shoulders, sharp lapels, and custom canvas interlinings engineered with algorithmic precision."}
    />
  );
}
