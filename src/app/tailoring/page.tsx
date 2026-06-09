"use client";
import { CategoryPageTemplate } from "@/components/CategoryPageTemplate";
import { useLocale } from "@/lib/LocaleContext";

export default function TailoringPage() {
  const { locale } = useLocale();

  const title = locale === "tr" ? "Terzilik"
              : locale === "de" ? "Schneiderei"
              : locale === "it" ? "Sartoria"
              : "Tailoring";

  const description = locale === "tr" ? "Yapay zeka çağında yeniden tasarlanan yüksek terzilik. Algoritmik hassasiyetle yapılandırılmış omuzlar, keskin yakalar ve özel kanvas iç astarlar."
                    : locale === "de" ? "Hohe Schneiderkunst neu gedacht für das KI-Zeitalter. Strukturierte Schultern, scharfe Revers und maßgeschneiderte Canvas-Einlagen, konstruiert mit algorithmischer Präzision."
                    : locale === "it" ? "L'alta sartoria ripensata per l'era dell'IA. Spalle strutturate, revers affilati e interni in tela personalizzati progettati con precisione algoritmica."
                    : "High tailoring reimagined for the AI age. Structured shoulders, sharp lapels, and custom canvas interlinings engineered with algorithmic precision.";

  return (
    <CategoryPageTemplate
      category="tailoring"
      title={title}
      description={description}
    />
  );
}
