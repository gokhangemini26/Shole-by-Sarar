"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { createClient } from "./supabase/client";
import { logCartEvent, logPurchase } from "./supabase/tracking";
import { PRODUCTS, getProduct } from "./products";

export interface CartItem {
  product_id: string;
  size: string;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  addToCart: (productId: string, size: string) => Promise<void>;
  removeFromCart: (productId: string, size: string) => Promise<void>;
  updateQuantity: (productId: string, size: string, quantity: number) => Promise<void>;
  checkout: () => Promise<boolean>;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  const supabase = createClient();

  // Listen to Auth state changes
  useEffect(() => {
    async function initUser() {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);
      if (currentUser) {
        await loadCartFromSupabase(currentUser.id);
      } else {
        setCartItems([]);
        setLoading(false);
      }
    }

    initUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user || null;
        setUser(currentUser);
        if (currentUser) {
          await loadCartFromSupabase(currentUser.id);
        } else {
          setCartItems([]);
          setLoading(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Reconstruct cart from Supabase events
  const loadCartFromSupabase = async (userId: string) => {
    setLoading(true);
    try {
      let latestPurchaseTime = new Date(0).toISOString();

      // Get latest purchase timestamp
      try {
        const { data: latestPurchase, error: pError } = await supabase
          .from("purchases")
          .select("purchased_at")
          .eq("user_id", userId)
          .order("purchased_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (!pError && latestPurchase) {
          latestPurchaseTime = latestPurchase.purchased_at;
        }
      } catch (e) {
        console.warn("[CartContext] purchases table not created yet or query failed:", e);
      }

      // Get all cart events after the latest purchase
      const { data: events, error: eError } = await supabase
        .from("cart_events")
        .select("product_id, action, size, created_at")
        .eq("user_id", userId)
        .gt("created_at", latestPurchaseTime)
        .order("created_at", { ascending: true });

      if (eError) throw eError;

      const itemsMap: Record<string, CartItem> = {};
      if (events) {
        for (const event of events) {
          const size = event.size || "S";
          const key = `${event.product_id}-${size}`;

          if (event.action === "add") {
            if (itemsMap[key]) {
              itemsMap[key].quantity += 1;
            } else {
              itemsMap[key] = { product_id: event.product_id, size, quantity: 1 };
            }
          } else if (event.action === "remove") {
            if (itemsMap[key]) {
              itemsMap[key].quantity -= 1;
              if (itemsMap[key].quantity <= 0) {
                delete itemsMap[key];
              }
            }
          }
        }
      }

      setCartItems(Object.values(itemsMap));
    } catch (error) {
      console.error("[CartContext] Error loading cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId: string, size: string) => {
    const defaultSize = size || "S";
    // Update local state first for instant response
    setCartItems(prev => {
      const key = `${productId}-${defaultSize}`;
      const existing = prev.find(item => item.product_id === productId && item.size === defaultSize);
      if (existing) {
        return prev.map(item =>
          item.product_id === productId && item.size === defaultSize
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product_id: productId, size: defaultSize, quantity: 1 }];
    });

    // Sync to Supabase
    if (user) {
      await logCartEvent(user.id, productId, "add", defaultSize);
    }
  };

  const removeFromCart = async (productId: string, size: string) => {
    const defaultSize = size || "S";
    setCartItems(prev => {
      return prev.filter(item => !(item.product_id === productId && item.size === defaultSize));
    });

    if (user) {
      // Log removes to clear from net count
      // To fully remove the item, we must log a 'remove' event for each unit
      const item = cartItems.find(i => i.product_id === productId && i.size === defaultSize);
      if (item) {
        for (let i = 0; i < item.quantity; i++) {
          await logCartEvent(user.id, productId, "remove", defaultSize);
        }
      }
    }
  };

  const updateQuantity = async (productId: string, size: string, quantity: number) => {
    const defaultSize = size || "S";
    const item = cartItems.find(i => i.product_id === productId && i.size === defaultSize);
    if (!item) return;

    const diff = quantity - item.quantity;
    if (diff === 0) return;

    setCartItems(prev =>
      prev.map(i =>
        i.product_id === productId && i.size === defaultSize
          ? { ...i, quantity }
          : i
      ).filter(i => i.quantity > 0)
    );

    if (user) {
      if (diff > 0) {
        for (let i = 0; i < diff; i++) {
          await logCartEvent(user.id, productId, "add", defaultSize);
        }
      } else {
        for (let i = 0; i < Math.abs(diff); i++) {
          await logCartEvent(user.id, productId, "remove", defaultSize);
        }
      }
    }
  };

  const checkout = async (): Promise<boolean> => {
    if (cartItems.length === 0) return false;

    if (!user) {
      return false;
    }

    try {
      // Log all purchases to database
      for (const item of cartItems) {
        const product = getProduct(item.product_id);
        const price = product ? product.price : "€0";
        await logPurchase(user.id, item.product_id, item.size, price, item.quantity);
      }

      // Clear local cart
      setCartItems([]);
      return true;
    } catch (err) {
      console.error("[CartContext] Checkout error:", err);
      return false;
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartOpen,
        setCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        checkout,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
