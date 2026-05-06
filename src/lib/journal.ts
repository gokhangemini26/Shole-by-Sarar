export interface Article {
  slug: string;
  title: string;
  date: string;
  category: string;
  image: string;
  excerpt: string;
  content: string[];
}

export const ARTICLES: Article[] = [
  {
    slug: "the-bursa-silk-route",
    title: "The Bursa Silk Route: A Family Tradition",
    date: "March 15, 2026",
    category: "Heritage",
    image: "", // Placeholder
    excerpt: "For three generations, our silk has come from a single family mill in Bursa. We travelled there to document the weaving process.",
    content: [
      "Bursa has been the center of the silk trade since the days of the Silk Road. The city's caravanserais still buzz with the energy of commerce, but true craftsmanship lies in the quiet, dusty mills on the outskirts.",
      "We partner with a family mill established in 1890. They don't have a website. They communicate primarily via fax and landline. But their 12 momme mulberry silk is unmatched in its drape and luminosity.",
      "It takes three days to weave enough fabric for a single Soft Rules Shirt. The looms are semi-automated, requiring constant human oversight to ensure the tension remains perfect. This slow process is exactly why our silk doesn't cling to the body—it falls."
    ]
  },
  {
    slug: "anatomy-of-the-atelier-coat",
    title: "Anatomy of a Classic: The Atelier Coat",
    date: "March 22, 2026",
    category: "Design",
    image: "", // Placeholder
    excerpt: "What makes a coat last a lifetime? A look inside the structure, canvas, and natural dye process of our signature piece.",
    content: [
      "A coat is architectural. If the foundation is flawed, the structure eventually collapses. When designing The Atelier Coat, we spent three months solely on the shoulder construction.",
      "Instead of modern fusible interfacing, we use a traditional horsehair canvas. It's stitched entirely by hand. As you wear the coat, the heat from your body actually softens the canvas, causing it to mold permanently to your unique shoulder slope.",
      "The terra dye is another story entirely. It's a 72-hour natural pigment process. The wool is submerged in cold vats, left to rest, and then slowly heated. This ensures the color penetrates to the core of the fiber, preventing fading even after decades of wear."
    ]
  },
  {
    slug: "the-vegetable-tanning-process",
    title: "Time and Tannins: How Our Leather Ages",
    date: "April 05, 2026",
    category: "Craft",
    image: "", // Placeholder
    excerpt: "Why we insist on vegetable-tanned leather for all SHOLÉ footwear and accessories, despite the longer production time.",
    content: [
      "Most commercial leather is chrome-tanned. It's fast—taking about a day—but it uses harsh chemicals and results in a static material that degrades over time.",
      "We use vegetable tanning. It takes up to 40 days. Bark extracts, leaves, and time are the only active ingredients. The result is a 'living' leather.",
      "When you buy the Mule No. 4 or the Atelier Tote, it arrives matte and somewhat stiff. Within a month, the natural oils from your skin and exposure to the sun will darken the leather, softening it and bringing out a rich, glossy patina. Your bag becomes a map of where you've been."
    ]
  },
  {
    slug: "spring-summer-2026-inspiration",
    title: "Chapter 01: The Eminönü Palette",
    date: "April 18, 2026",
    category: "Collection",
    image: "", // Placeholder
    excerpt: "How the spice markets of Istanbul informed the saffron, terra, and espresso tones of our inaugural collection.",
    content: [
      "Inspiration doesn't usually strike like lightning; it builds slowly. For Chapter 01, we kept finding ourselves drawn back to Eminönü, specifically the spice bazaar.",
      "We brought swatches of wool and silk to the market, comparing them against mounds of fresh saffron, dried chilies, and roasted espresso beans. We wanted colors that felt warm but grounded—colors that look as good in the grey light of London as they do in the golden hour of Istanbul.",
      "The 'Sun-Up' saffron became our accent color, representing the energy of the city at dawn, while the 'Terra' and 'Espresso' tones anchor the collection in the earth."
    ]
  },
  {
    slug: "the-modern-uniform",
    title: "Building the Effortless Uniform",
    date: "May 02, 2026",
    category: "Style",
    image: "", // Placeholder
    excerpt: "Decision fatigue is real. Here is how to build a capsule wardrobe that transitions seamlessly from the gallery to dinner.",
    content: [
      "The concept of the 'uniform' often implies rigidity, but we view it as liberation. If your wardrobe consists of harmonious, impeccably tailored pieces, getting dressed becomes an afterthought rather than a chore.",
      "Start with proportion: The Wide Atelier Trouser anchors the lower half. Then, balance the volume. A slim top like the Sun-Up Knit or the tucked Soft Rules Shirt creates a sharp silhouette.",
      "Finally, the third piece. The Atelier Coat or the Soft Bomber completes the look, providing structure and signaling that the outfit is intentional. Add the Mule No. 4, and you are ready for literally any scenario that doesn't involve a gym."
    ]
  }
];

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}
