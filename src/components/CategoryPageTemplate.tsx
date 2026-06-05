import React from "react";
import { useRouter } from "next/navigation";
import { TYPE, PALETTES } from "@/lib/design";
import { PRODUCTS, Product } from "@/lib/products";
import { Nav, Footer } from "@/components/SiteShell";
import { useLocale } from "@/lib/LocaleContext";
import { getLabels } from "@/lib/i18n";

export function CategoryPageTemplate({ category, title, description }: { category: Product["category"]; title: string; description: string; }) {
  const router = useRouter();
  const { locale } = useLocale();
  const labels = getLabels(locale);
  const palette = PALETTES.warmCream;
  const accent = palette.accent;
  
  const categoryProducts = PRODUCTS.filter(p => p.category === category);

  return (
    <div style={{ background: palette.bg, color: palette.ink, minHeight: "100vh" }}>
      <Nav palette={palette} onOpenAI={() => window.dispatchEvent(new CustomEvent("open-ai"))} />

      <main style={{ maxWidth: 1480, margin: "0 auto", padding: "80px 32px 120px" }}>
        <header style={{ marginBottom: 64, textAlign: "center", maxWidth: 600, margin: "0 auto 80px" }}>
          <h1 style={{ fontFamily: TYPE.display, fontSize: "clamp(48px, 6vw, 80px)", fontWeight: 400, margin: 0, letterSpacing: "-0.02em" }}>
            {title}
          </h1>
          <p style={{ fontFamily: TYPE.sans, fontSize: 16, color: palette.muted, marginTop: 16, lineHeight: 1.6 }}>
            {description}
          </p>
        </header>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "48px 32px" }}>
          {categoryProducts.map((product) => (
            <article
              key={product.slug}
              onClick={() => router.push(`/product/${product.slug}`)}
              style={{ cursor: "pointer" }}
              className="hover-card"
            >
              <div style={{
                borderRadius: 16, overflow: "hidden", background: "#E8DFCF",
                position: "relative",
              }}>
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{ width: "100%", aspectRatio: "3 / 4", objectFit: "cover", display: "block" }}
                  />
                ) : (
                  <div style={{ width: "100%", aspectRatio: "3 / 4", display: "grid", placeItems: "center", background: "#dcd1bc" }}>
                    <span style={{ fontFamily: TYPE.mono, fontSize: 12, color: palette.muted }}>{labels.imageComing}</span>
                  </div>
                )}
                {product.tag && (
                  <div style={{
                    position: "absolute", top: 16, left: 16,
                    background: product.tag.includes("✦") ? accent : palette.bg,
                    color: product.tag.includes("✦") ? "#1C1814" : palette.ink,
                    fontFamily: TYPE.mono, fontSize: 11, letterSpacing: "0.08em",
                    textTransform: "uppercase", padding: "6px 12px", borderRadius: 999,
                  }}>
                    {product.tag}
                  </div>
                )}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 16 }}>
                <div>
                  <div style={{ fontFamily: TYPE.sans, fontSize: 16, fontWeight: 500 }}>
                    {locale === "tr" && product.name_tr ? product.name_tr : product.name}
                  </div>
                  <div style={{ fontFamily: TYPE.mono, fontSize: 11, color: palette.muted, marginTop: 4, letterSpacing: "0.04em" }}>
                    {(locale === "tr" && product.subtitle_tr ? product.subtitle_tr : product.subtitle).split(" · ")[0]}
                  </div>
                </div>
                <div style={{ fontFamily: TYPE.display, fontSize: 18 }}>{product.price}</div>
              </div>
            </article>
          ))}
        </div>
      </main>

      <Footer palette={palette} accent={accent} />
    </div>
  );
}
