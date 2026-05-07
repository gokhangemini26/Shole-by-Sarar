export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  stock: number;
  image: string;
  matchingItems: string[]; // IDs of products that go well with this
}

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "p_linen_shirt_01",
    name: "Classic Linen Shirt",
    category: "shirts",
    price: 120,
    description: "A breathable, lightweight linen shirt perfect for summer evenings. Tailored fit.",
    stock: 45,
    image: "https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?w=500&q=80",
    matchingItems: ["p_linen_trouser_01", "p_leather_belt_01"],
  },
  {
    id: "p_linen_trouser_01",
    name: "Tailored Linen Trousers",
    category: "trousers",
    price: 150,
    description: "Relaxed yet sharp linen trousers with a subtle pleat.",
    stock: 20,
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500&q=80",
    matchingItems: ["p_linen_shirt_01", "p_suede_loafer_01"],
  },
  {
    id: "p_silk_dress_01",
    name: "Midnight Silk Slip Dress",
    category: "dresses",
    price: 280,
    description: "An elegant, bias-cut silk slip dress in deep midnight blue.",
    stock: 12,
    image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=500&q=80",
    matchingItems: ["p_pearl_necklace_01", "p_stiletto_heel_01"],
  },
  {
    id: "p_leather_belt_01",
    name: "Woven Leather Belt",
    category: "accessories",
    price: 85,
    description: "Hand-woven full-grain leather belt with a brass buckle.",
    stock: 100,
    image: "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=500&q=80",
    matchingItems: ["p_linen_trouser_01"],
  },
  {
    id: "p_suede_loafer_01",
    name: "Espresso Suede Loafers",
    category: "shoes",
    price: 210,
    description: "Unlined suede loafers for supreme comfort and effortless style.",
    stock: 30,
    image: "https://images.unsplash.com/photo-1614252339460-e171b30eb602?w=500&q=80",
    matchingItems: ["p_linen_trouser_01"],
  }
];

// Helper functions to simulate DB queries
export const db = {
  searchProducts: (query?: string, category?: string, maxPrice?: number) => {
    return MOCK_PRODUCTS.filter(p => {
      let match = true;
      if (query && !p.name.toLowerCase().includes(query.toLowerCase()) && !p.description.toLowerCase().includes(query.toLowerCase())) match = false;
      if (category && p.category.toLowerCase() !== category.toLowerCase()) match = false;
      if (maxPrice && p.price > maxPrice) match = false;
      return match;
    });
  },
  getProductDetails: (id: string) => {
    return MOCK_PRODUCTS.find(p => p.id === id) || null;
  },
  getStyleCombos: (id: string) => {
    const product = MOCK_PRODUCTS.find(p => p.id === id);
    if (!product) return [];
    return MOCK_PRODUCTS.filter(p => product.matchingItems.includes(p.id));
  }
};
