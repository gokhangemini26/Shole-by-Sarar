"use client";

import React, { useState } from "react";
import { useCart } from "@/lib/CartContext";
import { PRODUCTS, getProduct } from "@/lib/products";
import { useLocale } from "@/lib/LocaleContext";
import { X, Plus, Minus, Trash2, ShoppingBag, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { TYPE } from "@/lib/design";

export function CartDrawer() {
  const { cartItems, cartOpen, setCartOpen, updateQuantity, removeFromCart, checkout } = useCart();
  const { locale } = useLocale();
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);

  if (!cartOpen) return null;

  const parsePrice = (priceStr: string): number => {
    return parseInt(priceStr.replace(/[^0-9]/g, "")) || 0;
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => {
      const product = getProduct(item.product_id);
      if (!product) return sum;
      return sum + parsePrice(product.price) * item.quantity;
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const isFreeShipping = subtotal >= 200;
  const shippingThresholdLeft = 200 - subtotal;

  const handleCheckout = async () => {
    setCheckingOut(true);
    const success = await checkout();
    setCheckingOut(false);
    if (success) {
      setPurchaseSuccess(true);
      setTimeout(() => {
        setPurchaseSuccess(false);
        setCartOpen(false);
      }, 3000);
    } else {
      alert(locale === "tr" ? "Lütfen satın alma yapabilmek için giriş yapın." : "Please login to complete purchase.");
      setCartOpen(false);
      window.location.href = "/login";
    }
  };

  return (
    <div className="fixed inset-0 z-[120] overflow-hidden">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => !purchaseSuccess && setCartOpen(false)}
        className="absolute inset-0 bg-black/45 backdrop-blur-xs transition-opacity"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "tween", duration: 0.35, ease: "easeInOut" }}
          className="w-screen max-w-md bg-[#FAF8F5] text-[#1C1814] flex flex-col shadow-2xl"
          style={{ fontFamily: TYPE.sans }}
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-[#1C1814]/10 flex items-center justify-between">
            <h2 className="text-xl font-medium tracking-wide flex items-center gap-2" style={{ fontFamily: TYPE.display }}>
              <ShoppingBag size={20} className="stroke-[1.5]" />
              {locale === "tr" ? "Sepetim" : "Your Bag"}
            </h2>
            <button
              onClick={() => setCartOpen(false)}
              className="p-1.5 rounded-full hover:bg-black/5 transition-colors"
            >
              <X size={20} className="stroke-[1.5]" />
            </button>
          </div>

          {/* Success Overlay */}
          <AnimatePresence>
            {purchaseSuccess && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-[#FAF8F5]/95 z-50 flex flex-col items-center justify-center p-6 text-center"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1, type: "spring" }}
                  className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20"
                >
                  <Check size={32} className="stroke-[2.5]" />
                </motion.div>
                <h3 className="text-2xl font-semibold mb-2" style={{ fontFamily: TYPE.display }}>
                  {locale === "tr" ? "Satın Alma Başarılı!" : "Purchase Completed!"}
                </h3>
                <p className="text-sm text-gray-500 max-w-xs">
                  {locale === "tr"
                    ? "Siparişiniz atölyemizde hazırlanmaya başlandı. Harika bir stil tercihi yaptınız."
                    : "Your order is now being tailored at our atelier. Exceptional style choice."}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto py-6 px-6 space-y-6">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center pb-12">
                <div className="w-16 h-16 rounded-full border border-dashed border-gray-300 flex items-center justify-center mb-4 text-gray-400">
                  <ShoppingBag size={24} className="stroke-[1.2]" />
                </div>
                <h3 className="text-lg font-medium mb-1" style={{ fontFamily: TYPE.display }}>
                  {locale === "tr" ? "Sepetiniz Boş" : "Your bag is empty"}
                </h3>
                <p className="text-xs text-gray-400 max-w-[240px] mb-6">
                  {locale === "tr"
                    ? "Henüz sepetinize bir ürün eklemediniz. Koleksiyonu keşfedin."
                    : "You haven't added any pieces to your bag yet."}
                </p>
                <button
                  onClick={() => setCartOpen(false)}
                  className="px-6 py-2.5 bg-[#1C1814] text-white text-xs uppercase tracking-widest rounded-full hover:bg-black transition-colors"
                >
                  {locale === "tr" ? "Alışverişe Başla" : "Start Shopping"}
                </button>
              </div>
            ) : (
              cartItems.map((item) => {
                const product = getProduct(item.product_id);
                if (!product) return null;
                const pName = locale === "tr" && product.name_tr ? product.name_tr : product.name;
                const pSubtitle = locale === "tr" && product.subtitle_tr ? product.subtitle_tr : product.subtitle;
                return (
                  <div key={`${item.product_id}-${item.size}`} className="flex gap-4 border-b border-[#1C1814]/5 pb-6 last:border-0 last:pb-0">
                    <div className="w-20 aspect-[3/4] bg-[#E8DFCF] rounded-lg overflow-hidden flex-shrink-0">
                      <img src={product.image} alt={pName} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-0.5">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="text-sm font-medium leading-snug">{pName}</h4>
                          <span className="text-sm font-medium shrink-0">{product.price}</span>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-mono">
                          {locale === "tr" ? `Beden: ${item.size}` : `Size: ${item.size}`}
                        </p>
                      </div>

                      <div className="flex justify-between items-center mt-3">
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-[#1C1814]/10 rounded-full bg-white px-2 py-1">
                          <button
                            onClick={() => updateQuantity(item.product_id, item.size, item.quantity - 1)}
                            className="p-1 hover:text-black transition-colors text-gray-400"
                          >
                            <Minus size={12} className="stroke-[2.5]" />
                          </button>
                          <span className="px-3 text-xs font-medium font-mono min-w-[20px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product_id, item.size, item.quantity + 1)}
                            className="p-1 hover:text-black transition-colors text-gray-400"
                          >
                            <Plus size={12} className="stroke-[2.5]" />
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeFromCart(item.product_id, item.size)}
                          className="text-[#1C1814]/40 hover:text-red-600 transition-colors p-1"
                        >
                          <Trash2 size={16} className="stroke-[1.5]" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cartItems.length > 0 && (
            <div className="border-t border-[#1C1814]/10 bg-white/60 backdrop-blur-md px-6 py-6 space-y-4 shrink-0">
              {/* Shipping Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-gray-500">
                    {isFreeShipping
                      ? (locale === "tr" ? "✦ Ücretsiz kargo kazandınız!" : "✦ Qualified for free shipping!")
                      : (locale === "tr" ? "Kargo Ücretsiz Barajı" : "Free Shipping Goal")}
                  </span>
                  <span className="font-medium">
                    {isFreeShipping ? "€0" : `€${shippingThresholdLeft}`}
                  </span>
                </div>
                <div className="h-1 bg-[#1C1814]/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#D48C51] transition-all duration-500"
                    style={{ width: `${Math.min((subtotal / 200) * 100, 100)}%` }}
                  />
                </div>
                {!isFreeShipping && (
                  <p className="text-[10px] text-gray-400">
                    {locale === "tr"
                      ? `Ücretsiz kargo için sepetinize €${shippingThresholdLeft} daha ürün ekleyin.`
                      : `Add €${shippingThresholdLeft} more to qualify for free shipping.`}
                  </p>
                )}
              </div>

              {/* Subtotal */}
              <div className="flex justify-between items-baseline pt-2">
                <span className="text-sm font-medium">{locale === "tr" ? "Ara Toplam" : "Subtotal"}</span>
                <span className="text-2xl font-medium font-serif">€{subtotal}</span>
              </div>

              {/* Checkout Button */}
              <button
                disabled={checkingOut}
                onClick={handleCheckout}
                className="w-full bg-[#1C1814] text-white py-4 rounded-full text-xs uppercase tracking-widest font-semibold hover:bg-black transition-colors flex justify-center items-center gap-2 shadow-lg shadow-black/5 disabled:opacity-55"
              >
                {checkingOut ? (
                  <span>{locale === "tr" ? "İŞLENİYOR..." : "PROCESSING..."}</span>
                ) : (
                  <span>{locale === "tr" ? "ALIŞVERİŞİ TAMAMLA" : "COMPLETE PURCHASE"}</span>
                )}
              </button>

              <p className="text-[10px] text-center text-gray-400 tracking-wider uppercase">
                {locale === "tr"
                  ? "Güvenli Ödeme · Kolay İade ve Değişim"
                  : "Secure Checkout · Complimentary Returns"}
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
