"use client";
import { CategoryPageTemplate } from "@/components/CategoryPageTemplate";
import { useLocale } from "@/lib/LocaleContext";

export default function ShoesPage() {
  const { locale } = useLocale();

  const title = locale === "tr" ? "Ayakkabı"
              : locale === "de" ? "Schuhe"
              : locale === "it" ? "Scarpe"
              : "Footwear";

  const description = locale === "tr" ? "İzmir'de elde üretildi. Atölye Süet Terlik'ten zarif slingback babetlere kadar."
                    : locale === "de" ? "Auf Kopfsteinpflaster getestet und handgefertigt in Izmir. Von unserer Atelier Wildleder-Mule bis zum eleganten Slingback-Schuh."
                    : locale === "it" ? "Testate sul pavé e realizzate a mano a Smirne. Dalle nostre sabot in camoscio Atelier alle eleganti ballerine slingback."
                    : "Cobblestone-tested and bench-made in Izmir. From our Atelier Suede Mule to the Sleek Slingback Flat.";

  return (
    <CategoryPageTemplate
      category="shoes"
      title={title}
      description={description}
    />
  );
}
