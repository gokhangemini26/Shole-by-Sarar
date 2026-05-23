"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PRODUCTS } from "@/lib/products";
import { useLocale } from "@/lib/LocaleContext";
import { getLabels } from "@/lib/i18n";
import { Sparkles, Menu, X, ShoppingBag } from "lucide-react";

export default function MobileHome() {
  const { locale } = useLocale();
  const labels = getLabels(locale);
  const openAI = () => window.dispatchEvent(new CustomEvent("open-ai"));
  const [menuOpen, setMenuOpen] = useState(false);
  const [vidIndex, setVidIndex] = useState(0);
  const videos = ["/videos/hero.mp4", "/videos/Kalem.mp4"];

  // Take the first 3 featured products from desktop for "Soft Arrivals"
  const featuredSlugs = ["atelier-coat", "soft-rules-shirt", "sun-up-knit"];
  const featuredProducts = featuredSlugs.map(s => PRODUCTS.find(p => p.slug === s)).filter(Boolean) as typeof PRODUCTS;

  const categories = [
    { label: locale === "tr" ? "Tüm Ürünler" : "All Collections", slug: "women" },
    { label: locale === "tr" ? "Terzilik" : "Tailoring", slug: "tailoring" },
    { label: locale === "tr" ? "Aksesuar" : "Accessories", slug: "accessories" },
    { label: locale === "tr" ? "Ayakkabı" : "Shoes", slug: "shoes" },
    { label: locale === "tr" ? "Dergi" : "Journal", slug: "journal" },
    { label: labels.account, slug: "login" }
  ];

  return (
    <div className="bg-[#FAF8F5] text-[#1C1814] font-body-main antialiased pb-24 min-h-screen relative overflow-x-hidden">
      
      {/* Drawer Menu Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-[110] bg-[#FAF8F5] flex flex-col px-6 py-6 transition-all duration-300">
          <div className="flex justify-between items-center mb-12">
            <span className="font-display-xl text-2xl uppercase tracking-tighter">SHOLÉ</span>
            <button onClick={() => setMenuOpen(false)} className="p-2 -mr-2 text-[#1C1814] hover:opacity-70">
              <X size={24} />
            </button>
          </div>
          <nav className="flex flex-col gap-6">
            {categories.map(cat => (
              <Link 
                key={cat.slug} 
                href={`/${cat.slug}`} 
                className="font-headline-lg-mobile text-4xl text-[#1C1814] border-b border-[#1C1814]/10 pb-4"
                onClick={() => setMenuOpen(false)}
              >
                {cat.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto flex justify-between items-end pb-8">
            <div className="flex flex-col gap-2 font-utility-mono text-xs uppercase tracking-widest text-[#1C1814]/50">
              <span>TR / EN</span>
              <span>İstanbul, TR</span>
            </div>
          </div>
        </div>
      )}

      {/* Minimal Top Nav */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-4 py-4 mix-blend-difference text-white">
        <button onClick={() => setMenuOpen(true)} className="hover:opacity-70 transition-opacity p-2 -ml-2">
          <Menu size={20} />
        </button>
        <div className="font-display-xl text-2xl uppercase tracking-tighter absolute left-1/2 -translate-x-1/2 pointer-events-none">
          SHOLÉ
        </div>
        <button className="hover:opacity-70 transition-opacity p-2 -mr-2">
          <ShoppingBag size={20} />
        </button>
      </header>

      <main>
        {/* Full Bleed Hero Section */}
        <section className="relative w-full h-[90vh] flex flex-col justify-end">
          <div className="absolute inset-0 z-0 bg-[#E8DFCF]">
            <video
              key={videos[vidIndex]}
              autoPlay
              muted
              playsInline
              onEnded={() => setVidIndex(v => (v + 1) % videos.length)}
              className="w-full h-full object-cover"
            >
              <source src={videos[vidIndex]} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          </div>
          <div className="relative z-10 p-6 flex flex-col gap-8 pb-12">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[#D48C51] text-sm"><Sparkles size={14}/></span>
                <span className="font-utility-mono text-[10px] uppercase tracking-widest text-white/80">Atelier Intelligence</span>
              </div>
              <h1 className="font-headline-lg-mobile text-4xl text-white leading-[1.1] max-w-[90%]">
                {locale === "tr" ? "Kendin gibi taşı — 1944'ten beri." : "Wear it like it's yours — since 1944."}
              </h1>
            </div>
            
            {/* Integrated AI Prompt */}
            <div 
              onClick={openAI}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex items-center gap-3 border border-white/20 mt-4 cursor-pointer hover:bg-white/20 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-[#D48C51] flex items-center justify-center flex-shrink-0">
                <Sparkles size={16} className="text-black" />
              </div>
              <div className="flex flex-col">
                <span className="font-utility-mono text-[10px] uppercase tracking-widest text-white/70">Ask Sholé</span>
                <span className="font-body-main text-white text-sm">&quot;{locale === "tr" ? "Galeri açılışı için bir kıyafet lazım..." : "I need an outfit for a gallery opening..."}&quot;</span>
              </div>
            </div>
          </div>
        </section>

        {/* Pictorial Product Showcase */}
        <section className="py-12 flex flex-col gap-2">
          <div className="px-6 mb-4 flex justify-between items-end">
            <h2 className="font-headline-lg-mobile text-2xl text-[#1C1814]">{locale === "tr" ? "Yumuşak Dokunuş" : "The soft arrivals"}</h2>
          </div>
          <div className="w-full flex flex-col gap-1">
            {featuredProducts.map((p) => (
              <Link key={p.slug} href={`/product/${p.slug}`} className="relative w-full aspect-[4/5] bg-[#E8DFCF] group cursor-pointer block">
                <img 
                  alt={p.name} 
                  className="w-full h-full object-cover object-center" 
                  src={`/images/products/${p.slug}.png`} 
                />
                <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/60 to-transparent flex justify-between items-end">
                  <div className="flex flex-col">
                    <h3 className="font-body-large text-white text-xl">{locale === "tr" && p.name_tr ? p.name_tr : p.name}</h3>
                    <span className="font-utility-mono text-[10px] text-white/70 uppercase tracking-widest mt-1">{locale === "tr" && p.subtitle_tr ? p.subtitle_tr : p.subtitle}</span>
                  </div>
                  <span className="font-utility-mono text-sm text-white">{p.price}</span>
                </div>
              </Link>
            ))}
          </div>
          <div className="px-6 mt-8">
            <Link href="/women" className="w-full border-b border-[#1C1814] text-[#1C1814] py-4 font-utility-mono text-xs uppercase tracking-widest flex items-center justify-between block">
              <span>{locale === "tr" ? "Tüm Koleksiyonu Gör" : "View Complete Collection"}</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
        </section>

        {/* AI Conversational Feed Integration */}
        <section className="py-16 px-6 bg-[#E8DFCF]/30 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-[#1C1814] flex items-center justify-center mb-6">
             <Sparkles size={24} className="text-[#D48C51]" />
          </div>
          <h2 className="font-headline-lg-mobile text-3xl text-[#1C1814] leading-tight mb-4">
            {locale === "tr" ? "Merhaba, ben SHOLÉ. Kişisel stilistiniz." : "Hi, I'm SHOLÉ. Your personal stylist."}
          </h2>
          <p className="font-body-main text-[#1C1814]/70 mb-10 max-w-sm">
            {locale === "tr" ? "Henüz ne olduğunu bilmediğinizde bile tam ihtiyacınız olanı bulmanıza yardım ederim." : "I help you find exactly what you need, even when you don't know what it is yet."}
          </p>
          <div className="w-full bg-white rounded-2xl p-6 shadow-sm border border-[#1C1814]/10 flex flex-col gap-6 text-left relative overflow-hidden">
             {/* Small accent detail */}
             <div className="absolute top-0 right-0 w-20 h-20 bg-[#D48C51]/10 rounded-bl-full -mr-4 -mt-4"></div>

            <div className="flex gap-4 items-start relative z-10">
              <div className="w-10 h-10 rounded-full bg-[#E8DFCF] flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[#1C1814]/50">person</span>
              </div>
              <div className="bg-[#FAF8F5] p-4 rounded-2xl rounded-tl-none text-body-main text-[#1C1814]">
                {locale === "tr" ? "Cuma akşamı bir akşam yemeği. Çok abartılı değil. Bir elbiseye ihtiyacım var." : "A dinner Friday. Not too dressed up. Need a dress."}
              </div>
            </div>
            <div className="flex gap-4 items-start flex-row-reverse relative z-10">
              <div className="w-10 h-10 rounded-full bg-[#1C1814] flex items-center justify-center flex-shrink-0">
                <Sparkles size={14} className="text-[#D48C51]" />
              </div>
              <div className="bg-[#1C1814] p-4 rounded-2xl rounded-tr-none text-body-main text-white">
                {locale === "tr" ? "Anlaşıldı. Hava 17°C — triko ağırlıklı gideceğim. Üç seçim, zahmetsiz ve şık. Birini denemek ister misin?" : "I have just the thing. Let's look at the bias cut silk slip, layered under the structured oversized blazer. Comfortable but very sharp."}
              </div>
            </div>
            <button 
              onClick={openAI}
              className="w-full bg-[#1C1814] text-white py-4 mt-4 font-utility-mono text-xs uppercase tracking-widest rounded-full hover:bg-black transition-colors relative z-10"
            >
              {locale === "tr" ? "Sohbete Devam Et" : "Continue Chat"}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
