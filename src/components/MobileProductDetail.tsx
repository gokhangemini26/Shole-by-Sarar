"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { TYPE, PALETTES } from "@/lib/design";
import { getProduct, PRODUCTS } from "@/lib/products";
import { useLocale } from "@/lib/LocaleContext";
import { getLabels } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/client";
import { logProductView, logCartEvent } from "@/lib/supabase/tracking";
import { Menu, Sparkles, ShoppingBag, ShoppingCart, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function MobileProductDetail() {
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
  
  // Accordion states
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [deliveryOpen, setDeliveryOpen] = useState(false);

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

  // Guided Tour Scrolling Logic
  useEffect(() => {
    if (isTour && product) {
      const seq = async () => {
        // 1. Once resmi gostersin
        window.scrollTo({ top: 0, behavior: "smooth" });
        await new Promise((r) => setTimeout(r, 1500));
        
        // 2. Sayfanin altina insin
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
        
        // 3. 2 sn beklesin
        await new Promise((r) => setTimeout(r, 2000));
        
        // 4. Resme donsun
        window.scrollTo({ top: 0, behavior: "smooth" });
      };
      seq();
    }
  }, [isTour, product]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size first.");
      return;
    }
    if (user && product) {
      logCartEvent(user.id, product.slug, 'add');
      alert("Added to bag!");
    } else if (!user) {
      router.push('/login');
    }
  };

  if (!product) return null;

  const pName = locale === "tr" && product.name_tr ? product.name_tr : product.name;
  const pStory = locale === "tr" && product.story_tr ? product.story_tr : product.story;

  return (
    <div className="min-h-screen pb-24" style={{ background: palette.bg, color: palette.ink, fontFamily: TYPE.sans }}>
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-[#FAF7F0]/90 backdrop-blur-md flex items-center justify-between px-5 py-4">
        <button className="text-black p-1">
          <Menu size={24} strokeWidth={1.5} />
        </button>
        <div 
          onClick={() => router.push("/")}
          className="text-2xl font-bold cursor-pointer" 
          style={{ fontFamily: TYPE.display, letterSpacing: "-0.02em" }}
        >
          SHOLÉ
        </div>
        <button className="text-black p-1">
          <Sparkles size={24} strokeWidth={1.5} />
        </button>
      </header>

      {/* Main Image */}
      <div className="w-full aspect-[4/5] relative bg-[#E8DFCF]" id="product-image">
        <img 
          src={product.image} 
          alt={pName} 
          className="w-full h-full object-cover"
        />
      </div>

      <div className="px-5 py-6">
        {/* Category & Title */}
        <div className="flex justify-between items-baseline mb-2">
          <div className="text-[10px] uppercase tracking-widest text-gray-500 font-mono">
            OUTERWEAR / TAILORING
          </div>
        </div>
        <div className="flex justify-between items-end mb-6">
          <h1 className="text-4xl" style={{ fontFamily: TYPE.display }}>{pName}</h1>
          <div className="text-lg mb-1">{product.price}</div>
        </div>

        {/* Story / Description */}
        <div id="product-details" className="text-[15px] leading-relaxed text-gray-800 mb-8">
          {pStory.split("\n\n")[0]} {/* Show only first paragraph to match design */}
        </div>

        {/* Color */}
        <div className="mb-8">
          <div className="flex justify-between items-end mb-4">
            <div className="text-[10px] uppercase tracking-widest text-gray-500 font-mono">COLOR</div>
            <div className="text-sm font-medium">Terracotta</div>
          </div>
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full border border-gray-400 p-[2px]">
              <div className="w-full h-full rounded-full bg-[#A85B32]"></div>
            </div>
            <div className="w-8 h-8 rounded-full border border-transparent p-[2px]">
              <div className="w-full h-full rounded-full bg-[#1C1C1C]"></div>
            </div>
            <div className="w-8 h-8 rounded-full border border-transparent p-[2px]">
              <div className="w-full h-full rounded-full bg-[#EAE8E3]"></div>
            </div>
          </div>
        </div>

        {/* Size */}
        <div id="product-sizes" className="mb-8">
          <div className="flex justify-between items-end mb-4">
            <div className="text-[10px] uppercase tracking-widest text-gray-500 font-mono">SIZE</div>
            <div className="text-[10px] uppercase tracking-widest text-gray-500 font-mono underline decoration-gray-400 underline-offset-4 cursor-pointer">
              SIZE GUIDE
            </div>
          </div>
          <div className="grid grid-cols-5 gap-0 border border-gray-200">
            {['XS', 'S', 'M', 'L', 'XL'].map((size, idx) => {
              const isSelected = selectedSize === size || (!selectedSize && size === 'S'); // Default select S to match design
              const isOutOfStock = size === 'L'; // Match design (L has a line through it)
              
              return (
                <button 
                  key={size}
                  onClick={() => !isOutOfStock && setSelectedSize(size)}
                  className={`py-3 text-sm flex items-center justify-center relative
                    ${idx !== 4 ? 'border-r border-gray-200' : ''}
                    ${isSelected ? 'bg-black text-white' : 'bg-transparent text-black'}
                    ${isOutOfStock ? 'text-gray-300' : ''}
                  `}
                >
                  {size}
                  {isOutOfStock && (
                    <div className="absolute inset-0 w-full h-full border-t border-gray-200 transform rotate-[30deg] origin-center scale-150 opacity-50"></div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Add to Bag */}
        <button 
          onClick={handleAddToCart}
          className="w-full bg-[#1C1C1C] text-white py-4 text-sm tracking-wider font-medium mb-3 flex justify-center items-center gap-2"
        >
          ADD TO BAG <ShoppingBag size={14} />
        </button>
        <div className="text-center text-[10px] font-mono text-gray-400 tracking-wider mb-8 uppercase">
          Complimentary shipping & returns
        </div>

        <div className="border-t border-gray-200"></div>

        {/* Accordions */}
        <div 
          onClick={() => setDetailsOpen(!detailsOpen)}
          className="py-5 border-b border-gray-200 flex justify-between items-center cursor-pointer"
        >
          <span className="text-[15px]">Details & Care</span>
          <ChevronDown size={18} className={`transition-transform ${detailsOpen ? 'rotate-180' : ''}`} strokeWidth={1.5} />
        </div>
        <AnimatePresence>
          {detailsOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="py-4 text-sm text-gray-600 leading-relaxed">
                {product.details.map((d, i) => <div key={i} className="mb-2">✦ {d}</div>)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div 
          onClick={() => setDeliveryOpen(!deliveryOpen)}
          className="py-5 border-b border-gray-200 flex justify-between items-center cursor-pointer"
        >
          <span className="text-[15px]">Delivery & Returns</span>
          <ChevronDown size={18} className={`transition-transform ${deliveryOpen ? 'rotate-180' : ''}`} strokeWidth={1.5} />
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 w-full bg-[#FAF7F0] border-t border-gray-200 px-8 py-3 flex justify-between items-center z-40 pb-6">
        <button className="flex flex-col items-center gap-1 text-gray-500 hover:text-black transition-colors">
          <Sparkles size={20} strokeWidth={1.5} />
          <span className="text-[9px] uppercase tracking-widest font-mono font-bold">STYLIST</span>
        </button>
        <button onClick={() => router.push("/")} className="flex flex-col items-center gap-1 text-black">
          <ShoppingBag size={20} strokeWidth={1.5} />
          <span className="text-[9px] uppercase tracking-widest font-mono font-bold">SHOP</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-gray-500 hover:text-black transition-colors">
          <ShoppingCart size={20} strokeWidth={1.5} />
          <span className="text-[9px] uppercase tracking-widest font-mono font-bold">BAG</span>
        </button>
      </div>

    </div>
  );
}
