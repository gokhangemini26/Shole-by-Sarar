"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { TYPE, PALETTES } from "@/lib/design";
import { getProduct, PRODUCTS } from "@/lib/products";
import { Nav, Footer } from "@/components/SiteShell";
import { useLocale } from "@/lib/LocaleContext";
import { getLabels } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/client";
import { logProductView } from "@/lib/supabase/tracking";
import { useCart } from "@/lib/CartContext";

/* ═══════════════════════════════════════════════════════════════════════
   Product Detail Page (Desktop) — SHOLÉ
   ═══════════════════════════════════════════════════════════════════════ */

export default function DesktopProductDetail() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isTour = searchParams?.get("tour") === "true";
  const { locale } = useLocale();
  const labels = getLabels(locale);
  const palette = PALETTES.warmCream;
  const accent = palette.accent;
  const slug = params?.slug as string;
  const product = getProduct(slug);
  const [user, setUser] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const { addToCart, setCartOpen } = useCart();

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[2] || product.sizes[0] || "S");
    }
  }, [product]);

  useEffect(() => {
    async function initTracking() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user && product) {
        setUser(user);
        logProductView(user.id, product.slug);
      }
    }
    initTracking();
  }, [product?.slug]);

  // Guided Tour logic
  useEffect(() => {
    if (isTour && product) {
      const seq = async () => {
        // 1. Önce resmi göstersin
        window.scrollTo({ top: 0, behavior: "smooth" });
        await new Promise((r) => setTimeout(r, 1500));
        
        // 2. Yavaşça ürün bilgilerinin okunması için detay alanına kaydırsın
        const detailsEl = document.getElementById("product-details");
        if (detailsEl) {
          detailsEl.scrollIntoView({ behavior: "smooth", block: "center" });
        } else {
          window.scrollTo({ top: 500, behavior: "smooth" });
        }
        
        // 3. 2 sn orada beklesin
        await new Promise((r) => setTimeout(r, 2000));
        
        // 4. Resmi tam göstermek için yavaşça başa dönsün
        window.scrollTo({ top: 0, behavior: "smooth" });
      };
      seq();
    }
  }, [isTour, product]);

  const handleAddToCart = async () => {
    const sizeToUse = selectedSize || (product ? product.sizes[2] || "S" : "S");
    if (user && product) {
      await addToCart(product.slug, sizeToUse);
      setCartOpen(true);
    } else if (!user) {
      router.push('/login');
    }
  };

  if (!product) {
    return (
      <div style={{ background: palette.bg, color: palette.ink, minHeight: "100vh", display: "grid", placeItems: "center" }}>
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontFamily: TYPE.display, fontSize: 48 }}>404</h1>
          <p style={{ fontFamily: TYPE.sans, color: palette.muted }}>{labels.productNotFound}</p>
          <button onClick={() => router.push("/")} style={{ marginTop: 24, background: palette.ink, color: palette.bg, border: 0, padding: "12px 24px", borderRadius: 999, cursor: "pointer", fontFamily: TYPE.sans, fontSize: 13, fontWeight: 500 }}>
            {labels.backToShole}
          </button>
        </div>
      </div>
    );
  }

  const pName = locale === "tr" && product.name_tr ? product.name_tr : product.name;
  const pSubtitle = locale === "tr" && product.subtitle_tr ? product.subtitle_tr : product.subtitle;
  const pStory = locale === "tr" && product.story_tr ? product.story_tr : product.story;
  const pDetails = locale === "tr" && product.details_tr ? product.details_tr : product.details;
  const pCare = locale === "tr" && product.care_tr ? product.care_tr : product.care;

  return (
    <div style={{ background: palette.bg, color: palette.ink, minHeight: "100vh" }}>
      <Nav palette={palette} onOpenAI={() => {}} />

      {/* ── Breadcrumb ── */}
      <div style={{ maxWidth: 1480, margin: "0 auto", padding: "20px 32px 0" }}>
        <div style={{ fontFamily: TYPE.mono, fontSize: 11, letterSpacing: "0.06em", color: palette.muted, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ cursor: "pointer" }} onClick={() => router.push("/")}>SHOLÉ</span>
          <span>→</span>
          <span style={{ cursor: "pointer" }} onClick={() => { router.push("/"); setTimeout(() => document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" }), 300); }}>{labels.chapter01}</span>
          <span>→</span>
          <span style={{ color: palette.ink }}>{pName}</span>
        </div>
      </div>

      {/* ── Hero — Product + Info ── */}
      <section style={{
        maxWidth: 1480, margin: "0 auto", padding: "40px 32px 80px",
        display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 64, alignItems: "start",
      }}>
        {/* Images */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, position: "sticky", top: 100 }}>
          <div style={{ position: "relative", borderRadius: 16, overflow: "hidden", background: "#E8DFCF" }}>
            <img
              src={product.image}
              alt={`SHOLÉ — ${pName}`}
              style={{ width: "100%", aspectRatio: "3 / 4", objectFit: "cover", display: "block" }}
            />
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
          <div style={{ borderRadius: 16, overflow: "hidden", background: "#E8DFCF" }}>
            <img
              src={product.detailImage}
              alt={`${pName} — fabric detail`}
              style={{ width: "100%", aspectRatio: "16 / 9", objectFit: "cover", display: "block" }}
            />
          </div>
        </div>

        {/* Info */}
        <div style={{ paddingTop: 20 }}>
          <div style={{
            fontFamily: TYPE.mono, fontSize: 11, letterSpacing: "0.14em",
            textTransform: "uppercase", color: accent, marginBottom: 16,
            display: "inline-flex", alignItems: "center", gap: 8,
          }}>
            <span style={{ width: 20, height: 1, background: accent }} />
            {labels.chapter01} · {locale === "tr" ? "İlkbahar/Yaz 2026" : "Spring/Summer 2026"}
          </div>

          <h1 style={{
            fontFamily: TYPE.display, fontWeight: 400,
            fontSize: "clamp(36px, 4.5vw, 64px)", lineHeight: 1,
            letterSpacing: "-0.02em", margin: 0, color: palette.ink,
          }}>
            {pName}
          </h1>

          <p style={{
            fontFamily: TYPE.sans, fontSize: 16, color: palette.muted,
            marginTop: 12, letterSpacing: "0.02em",
          }}>
            {pSubtitle}
          </p>

          <div style={{
            fontFamily: TYPE.display, fontSize: 32, color: palette.ink,
            marginTop: 28,
          }}>
            {product.price}
          </div>

          {/* Sizes */}
          <div id="product-sizes" style={{ marginTop: 32 }}>
            <div style={{ fontFamily: TYPE.mono, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: palette.muted, marginBottom: 12 }}>
              {product.sizes.length > 1 ? labels.selectSize : labels.sizeLabel}
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  style={{
                    background: selectedSize === s ? palette.ink : "transparent",
                    color: selectedSize === s ? palette.bg : palette.ink,
                    border: `1px solid ${selectedSize === s ? palette.ink : palette.line}`,
                    padding: product.sizes.length <= 2 ? "10px 20px" : "10px 16px",
                    borderRadius: 999, cursor: "pointer",
                    fontFamily: TYPE.sans, fontSize: 13, fontWeight: 500,
                    minWidth: 44, textAlign: "center",
                    transition: "all 0.2s ease"
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Add to bag */}
          <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
            <button 
              onClick={handleAddToCart}
              style={{
              flex: 1, background: palette.ink, color: palette.bg, border: 0,
              padding: "16px 28px", borderRadius: 999, cursor: "pointer",
              fontFamily: TYPE.sans, fontSize: 15, fontWeight: 600,
              letterSpacing: "0.02em",
            }}>
              {labels.addToBag} — {product.price}
            </button>
            <button style={{
              width: 52, height: 52, borderRadius: "50%", border: `1px solid ${palette.line}`,
              background: "transparent", cursor: "pointer", fontSize: 20,
              display: "grid", placeItems: "center", flexShrink: 0,
            }}>
              ♡
            </button>
          </div>

          <div style={{ fontFamily: TYPE.mono, fontSize: 10, letterSpacing: "0.06em", color: palette.muted, marginTop: 12, textAlign: "center" }}>
            {labels.freeShippingDetail}
          </div>

          {/* ── Story ── */}
          <div id="product-details" style={{ marginTop: 56, paddingTop: 40, borderTop: `1px solid ${palette.line}` }}>
            <div style={{ fontFamily: TYPE.mono, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: palette.muted, marginBottom: 20 }}>
              {labels.theStory}
            </div>
            {pStory.split("\n\n").map((para, i) => (
              <p key={i} style={{
                fontFamily: TYPE.sans, fontSize: 15.5, lineHeight: 1.7,
                color: palette.ink, opacity: 0.85, marginTop: i === 0 ? 0 : 20,
                maxWidth: 580,
              }}>
                {para}
              </p>
            ))}
          </div>

          {/* ── Fabric Composition ── */}
          <div style={{ marginTop: 48, paddingTop: 40, borderTop: `1px solid ${palette.line}` }}>
            <div style={{ fontFamily: TYPE.mono, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: palette.muted, marginBottom: 24 }}>
              {labels.fabricComposition}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {product.fabric.map((f) => (
                <div key={f.name}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                    <span style={{ fontFamily: TYPE.sans, fontSize: 14, fontWeight: 500, color: palette.ink }}>{f.name}</span>
                    <span style={{ fontFamily: TYPE.mono, fontSize: 12, color: palette.muted }}>{f.percentage}%</span>
                  </div>
                  <div style={{ height: 4, borderRadius: 2, background: palette.line, overflow: "hidden" }}>
                    <div style={{
                      height: "100%", borderRadius: 2,
                      background: `linear-gradient(90deg, ${accent}, #C77A2D)`,
                      width: `${f.percentage}%`,
                      transition: "width 1.2s cubic-bezier(0.2, 0.7, 0.3, 1)",
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Details ── */}
          <div style={{ marginTop: 48, paddingTop: 40, borderTop: `1px solid ${palette.line}` }}>
            <div style={{ fontFamily: TYPE.mono, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: palette.muted, marginBottom: 20 }}>
              {labels.detailsLabel}
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
              {pDetails.map((d) => (
                <li key={d} style={{ fontFamily: TYPE.sans, fontSize: 14, color: palette.ink, opacity: 0.8, display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <span style={{ color: accent, fontSize: 10, marginTop: 4, flexShrink: 0 }}>✦</span>
                  {d}
                </li>
              ))}
            </ul>
          </div>

          {/* ── Care ── */}
          <div style={{ marginTop: 48, paddingTop: 40, borderTop: `1px solid ${palette.line}` }}>
            <div style={{ fontFamily: TYPE.mono, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: palette.muted, marginBottom: 20 }}>
              {labels.careInstructions}
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {pCare.map((c) => (
                <li key={c} style={{ fontFamily: TYPE.sans, fontSize: 13.5, color: palette.muted, display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 10 }}>◇</span>
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Pairs With ── */}
      <section style={{
        maxWidth: 1480, margin: "0 auto", padding: "0 32px 80px",
      }}>
        <div style={{
          borderTop: `1px solid ${palette.line}`, paddingTop: 56,
        }}>
          <div style={{ fontFamily: TYPE.mono, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: palette.muted, marginBottom: 12 }}>
            {labels.completeTheLook}
          </div>
          <h2 style={{
            fontFamily: TYPE.display, fontWeight: 400,
            fontSize: "clamp(28px, 3.5vw, 48px)", lineHeight: 1.1,
            letterSpacing: "-0.02em", margin: 0, color: palette.ink,
            marginBottom: 36,
          }}>
            {labels.pairsBeautifully.split(" beautifully ")[0]} <em style={{ color: accent }}>{locale === "tr" ? "mükemmel" : "beautifully"}</em> {labels.pairsBeautifully.split(" beautifully ")[1]}
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28 }}>
            {product.pairsWith.map((pair) => {
              const pairProduct = PRODUCTS.find(p => p.slug === pair.slug);
              if (!pairProduct) return null;
              return (
                <PairCard
                  key={pair.slug}
                  slug={pair.slug}
                  name={locale === "tr" && pairProduct.name_tr ? pairProduct.name_tr : pairProduct.name}
                  subtitle={locale === "tr" && pairProduct.subtitle_tr ? pairProduct.subtitle_tr : pairProduct.subtitle}
                  price={pairProduct.price}
                  image={pairProduct.image}
                  palette={palette}
                  accent={accent}
                />
              );
            })}
          </div>
        </div>
      </section>

      <Footer palette={palette} accent={accent} />
    </div>
  );
}

/* ── Pair Card ── */
function PairCard({ slug, name, subtitle, price, image, palette, accent }: {
  slug: string; name: string; subtitle: string; price: string; image: string;
  palette: typeof PALETTES.warmCream; accent: string;
}) {
  const router = useRouter();
  const [hover, setHover] = React.useState(false);
  return (
    <article
      onClick={() => router.push(`/product/${slug}`)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ cursor: "pointer" }}
    >
      <div style={{
        borderRadius: 16, overflow: "hidden", background: "#E8DFCF",
        transform: hover ? "translateY(-4px)" : "none",
        transition: "transform 0.4s cubic-bezier(0.2, 0.7, 0.3, 1)",
      }}>
        <img
          src={image}
          alt={`SHOLÉ — ${name}`}
          style={{ width: "100%", aspectRatio: "3 / 4", objectFit: "cover", display: "block" }}
          loading="lazy"
        />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 14 }}>
        <div>
          <div style={{ fontFamily: TYPE.sans, fontSize: 15, fontWeight: 500, color: palette.ink }}>{name}</div>
          <div style={{ fontFamily: TYPE.mono, fontSize: 11, color: palette.muted, marginTop: 2, letterSpacing: "0.04em" }}>{subtitle.split(" · ")[0]}</div>
        </div>
        <div style={{ fontFamily: TYPE.display, fontSize: 18, color: palette.ink }}>{price}</div>
      </div>
      <div style={{
        fontFamily: TYPE.mono, fontSize: 10, color: accent,
        letterSpacing: "0.06em", marginTop: 8,
        opacity: hover ? 1 : 0, transition: "opacity 0.3s ease",
      }}>
        {getLabels(useLocale().locale).viewProduct}
      </div>
    </article>
  );
}
