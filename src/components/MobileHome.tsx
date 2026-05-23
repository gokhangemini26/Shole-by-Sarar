"use client";

import React from "react";
import Image from "next/image";

export default function MobileHome() {
  const openAI = () => window.dispatchEvent(new CustomEvent("open-ai"));

  return (
    <div className="bg-background text-on-background font-body-main antialiased selection:bg-clay-accent selection:text-white pb-24 min-h-screen">
      {/* Minimal Top Nav */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-4 py-4 bg-transparent mix-blend-difference text-white">
        <button className="hover:opacity-70 transition-opacity flex items-center justify-center">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>menu</span>
        </button>
        <div className="font-display-xl text-2xl uppercase tracking-tighter absolute left-1/2 -translate-x-1/2 pointer-events-none">
          SHOLÉ
        </div>
        <button className="hover:opacity-70 transition-opacity flex items-center justify-center">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>shopping_bag</span>
        </button>
      </header>

      <main>
        {/* Full Bleed Hero Section */}
        <section className="relative w-full h-[90vh] flex flex-col justify-end">
          <div className="absolute inset-0 z-0">
            <img 
              alt="Hero background" 
              className="w-full h-full object-cover object-center" 
              src="https://lh3.googleusercontent.com/aida/ADBb0uia5gxOqWC09w_qNv9JbW6is4pY8r9JiKWWd-cYfPSwCtziraBCyfkw-rvgt8jk7PP2O1ZS9E-TjYfHGC20sp1ayiF49YXE6L39o-u3KRk6tAcIxkcBbNENGyVXXpa_EJ0blT0_rpmg6xXuZY-VhBJzRfH25dTOd1NH-xYzqYcSCfpIS-WtR-tT2Ss677vdpxRxek-YFhyGo9JwWQVN2PwPky_pXXOlYTgw7AoJ_2KlntY_1LESBAgIvi4" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          </div>
          <div className="relative z-10 p-6 flex flex-col gap-8 pb-12">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-clay-accent text-sm">✦</span>
                <span className="font-utility-mono text-[10px] uppercase tracking-widest text-white/80">Atelier Intelligence</span>
              </div>
              <h1 className="font-headline-lg-mobile text-4xl text-white leading-[1.1] max-w-[90%]">
                Wear it like it's yours — since 1944.
              </h1>
            </div>
            
            {/* Integrated AI Prompt */}
            <div 
              onClick={openAI}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex items-center gap-3 border border-white/20 mt-4 cursor-pointer hover:bg-white/20 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-clay-accent flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-white text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              </div>
              <div className="flex flex-col">
                <span className="font-utility-mono text-[10px] uppercase tracking-widest text-white/70">Ask Sholé</span>
                <span className="font-body-main text-white">"I need an outfit for a gallery opening..."</span>
              </div>
            </div>
          </div>
        </section>

        {/* Pictorial Product Showcase */}
        <section className="py-12 flex flex-col gap-2">
          <div className="px-6 mb-4 flex justify-between items-end">
            <h2 className="font-headline-lg-mobile text-2xl text-primary">The soft arrivals</h2>
          </div>
          <div className="w-full flex flex-col gap-1">
            {/* Full width product 1 */}
            <div className="relative w-full aspect-[4/5] bg-surface-container group cursor-pointer">
              <img 
                alt="Soft Rules Shirt" 
                className="w-full h-full object-cover object-center" 
                src="https://lh3.googleusercontent.com/aida/ADBb0ujcKNmLsqpROcd3pVdgRh20XEa0eJS6rfv4Q2md27y2WsMHhnbdzrO0WL-4Lp2zPRog-ixM2U4PqNkCpPaaCiDJ5RCEaI4hVHrEnpV04VYX-xZlxdnOkWjp8rWLCvvSmRxclCLRiATQ9_wv0jImugG5H_hO2MTVlTzx2ZZt1of1ikHj8VDaBf4bVTBumze_u8tr5czbKD-TZli6_xcDryoXktaswNTs6UtCG3WXtHL-zHS_V-khNafPXA" 
              />
              <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/60 to-transparent flex justify-between items-end">
                <div className="flex flex-col">
                  <h3 className="font-body-large text-white text-xl">Soft Rules Shirt</h3>
                  <span className="font-utility-mono text-[10px] text-white/70 uppercase tracking-widest mt-1">3 Colors</span>
                </div>
                <span className="font-utility-mono text-sm text-white">€ 340</span>
              </div>
            </div>
            
            {/* Full width product 2 */}
            <div className="relative w-full aspect-[4/5] bg-surface-container group cursor-pointer">
              <img 
                alt="Sun-Up Knit" 
                className="w-full h-full object-cover object-center" 
                src="https://lh3.googleusercontent.com/aida/ADBb0ui_-xJ7kTf4FGGJgaCe-wMl_2Uvkz3rZLNkD5nzpo9tgH-TZTG7yIMJY5Z-D3PQ7Azb-06gYWBLn-NNeAgzMk0UDZ9rw2yNYYy3-vYH7g8SdUyqIGrGsPL7Fvs3tOruBnz-MmqEX5kcqRaCh80mbYRDB2cg0KU1nxcRKy-2qepaCKLoKqFliXdcYbf1sX2SwrkS_kkzf7KoHs1GvJtxslaBe7kFvGM_Ar6FEY-uGosEP6N1bsw352i9e_s" 
              />
              <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/60 to-transparent flex justify-between items-end">
                <div className="flex flex-col">
                  <h3 className="font-body-large text-white text-xl">Sun-Up Knit</h3>
                  <span className="font-utility-mono text-[10px] text-white/70 uppercase tracking-widest mt-1">1 Color</span>
                </div>
                <span className="font-utility-mono text-sm text-white">€ 290</span>
              </div>
            </div>
          </div>
          <div className="px-6 mt-8">
            <button className="w-full border-b border-primary text-primary py-4 font-utility-mono text-xs uppercase tracking-widest flex items-center justify-between">
              <span>View Complete Collection</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </section>

        {/* AI Conversational Feed Integration */}
        <section className="py-16 px-6 bg-surface-container-low flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-charcoal flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-clay-accent text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
          </div>
          <h2 className="font-headline-lg-mobile text-3xl text-primary leading-tight mb-4">
            Hi, I'm SHOLÉ.<br/>Your personal stylist.
          </h2>
          <p className="font-body-main text-warm-grey mb-10 max-w-sm">
            I help you find exactly what you need, even when you don't know what it is yet.
          </p>
          <div className="w-full bg-white rounded-2xl p-6 shadow-sm border border-outline-variant/20 flex flex-col gap-6 text-left">
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-warm-grey">person</span>
              </div>
              <div className="bg-surface p-4 rounded-2xl rounded-tl-none text-body-main text-primary">
                A dinner Friday. Not too dressed up. Need a dress.
              </div>
            </div>
            <div className="flex gap-4 items-start flex-row-reverse">
              <div className="w-10 h-10 rounded-full bg-charcoal flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-clay-accent text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              </div>
              <div className="bg-charcoal p-4 rounded-2xl rounded-tr-none text-body-main text-white">
                I have just the thing. Let's look at the bias cut silk slip, layered under the structured oversized blazer. Comfortable but very sharp.
              </div>
            </div>
            <button 
              onClick={openAI}
              className="w-full bg-primary text-white py-4 mt-4 font-label-caps text-xs uppercase tracking-widest rounded-full"
            >
              Continue Chat
            </button>
          </div>
        </section>

        {/* Pictorial Heritage */}
        <section className="py-12">
          <div className="relative w-full aspect-square">
            <img 
              alt="Heritage" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida/ADBb0ujrBal57_DK_WQkuwvXXMz7gyOW9Ry0PJE7qvc2WddChG5m-6qDjekDbTbSSUFGN-7O18PaDGrUQMPSziNiuLJskiLM2NVFnFHNify8wHGiwqOXfvTe-iT4m947RwyXJSub9ztWYNJLpG7tgLPT11ssBVMmslX5uRc5pQV4MaBsNV0IW_Nm984HglawGHhVyiONBkHUX5m1RoxV1CF4fSd67AOYBITvhBqV1vXovXMH_wPviQj2mL4U7Kk" 
            />
            <div className="absolute inset-0 bg-black/30"></div>
            <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
              <div className="flex items-center gap-2 mb-4">
                <span className="font-utility-mono text-[10px] uppercase tracking-widest opacity-80">Since 1944</span>
              </div>
              <h2 className="font-headline-lg-mobile text-3xl leading-tight max-w-[80%]">
                Eighty years of tailoring, digitized.
              </h2>
            </div>
          </div>
        </section>
      </main>

      {/* Persistent Floating AI Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button 
          onClick={openAI}
          className="w-14 h-14 bg-charcoal rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
        >
          <span className="material-symbols-outlined text-clay-accent text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
        </button>
      </div>
    </div>
  );
}
