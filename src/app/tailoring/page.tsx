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
        ? "Yeniden yorumlanan SARAR mirası. Yapılı omuzlar, keskin yakalar ve özel kanvas iç astarlar."
        : "The SARAR heritage reimagined. Structured shoulders, sharp lapels, and custom canvas interlinings."}
    />
  );
}
