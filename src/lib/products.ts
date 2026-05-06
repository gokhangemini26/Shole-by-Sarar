/* ═══════════════════════════════════════════════════════════════════════
   Product Data — SHOLÉ by SARAR · Chapter 01 · Spring/Summer 2026
   ═══════════════════════════════════════════════════════════════════════ */

export interface Product {
  slug: string;
  name: string;
  subtitle: string;
  price: string;
  tag?: string;
  image: string;
  detailImage: string;
  story: string;
  fabric: { name: string; percentage: number }[];
  details: string[];
  care: string[];
  sizes: string[];
  pairsWith: { slug: string; name: string }[];
}

export const PRODUCTS: Product[] = [
  {
    slug: "atelier-coat",
    name: "The Atelier Coat",
    subtitle: "terra dye wool · structured shoulder · cropped sleeve",
    price: "€ 890",
    tag: "new",
    image: "/images/products/atelier-coat.png",
    detailImage: "/images/products/atelier-coat-detail.png",
    story: `The coat that started it all. When SHOLÉ's design team sat down with the SARAR atelier master in Istanbul, the brief was simple: build a coat you'd wear to every dinner, every meeting, every airport. The result is the Atelier Coat — terra-dyed in a process that takes 72 hours and gives each piece its own unique warmth.

The structured shoulder nods to SARAR's tailoring heritage (they've been cutting coats since 1947), while the cropped sleeve is pure SHOLÉ — modern, a little unexpected, and surprisingly practical. It's the kind of piece that makes people ask where you got it.

Every coat is cut from a single bolt to match the grain. Twelve per drop, and when they're gone, they're gone.`,
    fabric: [
      { name: "Virgin Wool", percentage: 85 },
      { name: "Cashmere", percentage: 10 },
      { name: "Elastane", percentage: 5 },
    ],
    details: [
      "Structured shoulder with canvas interlining",
      "Cropped sleeve ending at the wrist",
      "Two-button front closure, horn buttons",
      "Fully lined in silk-blend lining",
      "Interior pocket with SHOLÉ monogram",
      "Terra dye — 72-hour natural pigment process",
    ],
    care: [
      "Dry clean only",
      "Store on a padded hanger",
      "Steam to refresh between wears",
      "Avoid prolonged direct sunlight",
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    pairsWith: [
      { slug: "wide-trouser", name: "Wide Atelier Trouser" },
      { slug: "mule-no4", name: "Mule No. 4" },
      { slug: "atelier-tote", name: "Atelier Tote" },
    ],
  },
  {
    slug: "soft-rules-shirt",
    name: "Soft Rules Shirt",
    subtitle: "cream silk · french seam · relaxed cut",
    price: "€ 340",
    image: "/images/products/soft-rules-shirt.png",
    detailImage: "/images/products/soft-rules-shirt-detail.png",
    story: `The Soft Rules Shirt breaks every office code worth breaking. Cut from cream silk that was sourced from a family mill in Bursa — one of the oldest silk-producing cities in the world — it falls differently from anything you've worn before.

The french seams are hand-finished, which means no raw edges touching your skin. It works tucked into the Wide Trouser for meetings, or loose over the Atelier Mini for Friday. The slight sheen catches light without screaming silk.

We called it "Soft Rules" because that's the dress code it belongs to. Somewhere between too formal and just right.`,
    fabric: [
      { name: "Mulberry Silk", percentage: 92 },
      { name: "Elastane", percentage: 8 },
    ],
    details: [
      "Relaxed cut with dropped shoulder",
      "French seam construction throughout",
      "Mother-of-pearl buttons, SHOLÉ engraved",
      "Curved hem — works tucked or untucked",
      "Single chest pocket with blind stitch",
      "Bursa silk — family mill, established 1890",
    ],
    care: [
      "Hand wash cold or dry clean",
      "Iron on low with pressing cloth",
      "Hang dry — never tumble",
      "Store folded in tissue",
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    pairsWith: [
      { slug: "atelier-mini", name: "Atelier Mini" },
      { slug: "mule-no4", name: "Mule No. 4" },
      { slug: "wide-trouser", name: "Wide Atelier Trouser" },
    ],
  },
  {
    slug: "wide-trouser",
    name: "Wide Atelier Trouser",
    subtitle: "sand linen · high waist · pleated",
    price: "€ 420",
    image: "/images/products/wide-trouser.png",
    detailImage: "/images/products/wide-trouser-detail.png",
    story: `There's a reason the Wide Atelier Trouser was the first piece the team prototyped. It had to move like you're walking through a bazaar, but look like you just left the gallery.

The linen is sourced from Normandy — heavyweight, slubbed, the kind that develops a beautiful patina after a few washes. The high waist and double-forward pleats give structure where it matters, and the wide leg falls in a way that makes everything below the waist look effortless.

This trouser was tested on Istanbul's cobblestones, on overnight flights, and at way too many lunches. It passed every time. Pair it with the Atelier Coat and the Mule, and you have the full atelier look — our favourite outfit this chapter.`,
    fabric: [
      { name: "French Linen", percentage: 88 },
      { name: "Cotton", percentage: 10 },
      { name: "Elastane", percentage: 2 },
    ],
    details: [
      "High waist with double-forward pleats",
      "Wide straight leg — 28cm hem opening",
      "Side pockets, one rear welt pocket",
      "Concealed hook-and-bar closure",
      "Heavyweight Normandy linen — 280gsm",
      "Pre-washed for softness and minimal shrinkage",
    ],
    care: [
      "Machine wash cold, gentle cycle",
      "Hang dry recommended",
      "Iron while slightly damp for best results",
      "Linen softens beautifully with each wash",
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    pairsWith: [
      { slug: "atelier-coat", name: "The Atelier Coat" },
      { slug: "sun-up-knit", name: "Sun-Up Knit" },
      { slug: "sun-up-scarf", name: "Sun-Up Scarf" },
    ],
  },
  {
    slug: "mule-no4",
    name: "Mule No. 4",
    subtitle: "espresso leather · squared toe · hand-stitched",
    price: "€ 380",
    tag: "late spring",
    image: "/images/products/mule-no4.png",
    detailImage: "/images/products/mule-no4-detail.png",
    story: `Mule No. 4 is the fourth iteration of our house mule — and the one we finally got right. The squared toe took seven prototypes. The heel height (35mm) was tested from Istanbul to Milan cobblestones. The leather sole is stitched, not glued.

The espresso leather comes from a tannery in Izmir that's been working hides for three generations. It's vegetable-tanned, which means it darkens and softens with wear — your pair will look different from everyone else's within a month.

We added a foam-cushioned insole because we believe a shoe can look sharp and feel comfortable. No compromise, that's rule number one at the atelier.`,
    fabric: [
      { name: "Vegetable-Tanned Leather", percentage: 100 },
    ],
    details: [
      "Squared toe — seven-prototype development",
      "35mm block heel — cobblestone-tested",
      "Blake-stitched leather sole",
      "Foam-cushioned leather insole",
      "Izmir tannery — vegetable-tanned, 3rd generation",
      "Darkens and softens with wear",
    ],
    care: [
      "Condition with leather balm monthly",
      "Store with shoe trees",
      "Avoid water — leather is uncoated",
      "Let rest 24h between wears",
    ],
    sizes: ["36", "37", "38", "39", "40", "41"],
    pairsWith: [
      { slug: "atelier-coat", name: "The Atelier Coat" },
      { slug: "soft-rules-shirt", name: "Soft Rules Shirt" },
      { slug: "atelier-mini", name: "Atelier Mini" },
    ],
  },
  {
    slug: "sun-up-knit",
    name: "Sun-Up Knit",
    subtitle: "saffron merino · ribbed · slight crop",
    price: "€ 290",
    tag: "✦ pick",
    image: "/images/products/sun-up-knit.png",
    detailImage: "/images/products/sun-up-knit-detail.png",
    story: `This is the colour piece. The Sun-Up Knit was born from a saffron spice market visit in Istanbul's Eminönü district. We kept coming back to that particular golden-yellow — warm without being loud, flattering on every skin tone.

The merino comes from a cooperative in New Zealand that guarantees mulesing-free wool. It's spun to a fine 18.5-micron gauge, which means it sits against your skin without itch. The rib structure gives it stretch and shape without losing the crop silhouette.

Wear it with the Wide Trouser and the Sun-Up Scarf for the full colour story, or layer it under the Atelier Coat when the weather turns.`,
    fabric: [
      { name: "Extra-Fine Merino Wool", percentage: 90 },
      { name: "Cashmere", percentage: 10 },
    ],
    details: [
      "Ribbed construction — 2x2 rib pattern",
      "Slight crop — hits at the natural waist",
      "18.5-micron merino, mulesing-free",
      "Saffron dye inspired by Eminönü spice market",
      "Rolled hem and cuffs — no raw edges",
      "Flat-locked seams for comfort",
    ],
    care: [
      "Hand wash cold with wool detergent",
      "Reshape and dry flat",
      "Never hang — knit will stretch",
      "Store folded with cedar block",
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    pairsWith: [
      { slug: "wide-trouser", name: "Wide Atelier Trouser" },
      { slug: "sun-up-scarf", name: "Sun-Up Scarf" },
      { slug: "atelier-tote", name: "Atelier Tote" },
    ],
  },
  {
    slug: "atelier-tote",
    name: "Atelier Tote",
    subtitle: "camel leather · unlined · everyday carry",
    price: "€ 540",
    image: "/images/products/atelier-tote.png",
    detailImage: "/images/products/atelier-tote-detail.png",
    story: `The Atelier Tote is an argument for simplicity. No hardware, no logos, no internal dividers. Just beautiful leather, cut and stitched by the same Izmir tannery that supplies our Mule No. 4.

It's unlined because we wanted you to feel the leather from the inside — and because it means the bag softens and moulds to your daily carry. After six months, your tote will have a slump and patina that's entirely yours.

Fits a 14" laptop, a water bottle, and the kind of life where you need everything in one bag. The shoulder drop is 24cm — long enough for a coat underneath.`,
    fabric: [
      { name: "Full-Grain Leather", percentage: 100 },
    ],
    details: [
      "Full-grain camel leather, vegetable-tanned",
      "Unlined — softens with daily use",
      "Fits 14\" laptop with room to spare",
      "24cm shoulder drop — coat-friendly",
      "Interior leather pocket with magnetic snap",
      "Reinforced base with protective feet",
    ],
    care: [
      "Condition with leather balm quarterly",
      "Stuff with tissue when storing",
      "Wipe spills immediately with dry cloth",
      "Leather patina develops naturally — embrace it",
    ],
    sizes: ["One Size"],
    pairsWith: [
      { slug: "atelier-coat", name: "The Atelier Coat" },
      { slug: "wide-trouser", name: "Wide Atelier Trouser" },
      { slug: "soft-bomber", name: "Soft Bomber" },
    ],
  },
  {
    slug: "sun-up-scarf",
    name: "Sun-Up Scarf",
    subtitle: "saffron silk · the bright accent",
    price: "€ 140",
    image: "/images/products/sun-up-scarf.png",
    detailImage: "/images/products/sun-up-scarf-detail.png",
    story: `The Sun-Up Scarf is the easiest way to buy into the saffron colour story. Same golden-yellow as the knit, but in Bursa silk — lighter, more luminous, and versatile enough to wear as a neck scarf, a hair tie, or a bag accessory.

The edges are hand-rolled, a technique that takes four times longer than machine-finishing but gives that beautiful soft curl that catches light. Each scarf is cut from a single silk panel to ensure pattern continuity.

At €140, it's our most accessible piece — and often the first SHOLÉ item people buy. We're fine with that. It's a gateway piece.`,
    fabric: [
      { name: "Mulberry Silk", percentage: 100 },
    ],
    details: [
      "70cm × 70cm — classic square format",
      "Hand-rolled edges — 4× longer finishing time",
      "Saffron dye matching Sun-Up Knit",
      "Bursa silk — single-panel cut",
      "Lightweight — 12 momme silk weight",
      "SHOLÉ monogram woven into corner",
    ],
    care: [
      "Hand wash cold with silk detergent",
      "Roll in towel to remove excess water",
      "Iron on low while slightly damp",
      "Store flat or rolled — never folded",
    ],
    sizes: ["One Size"],
    pairsWith: [
      { slug: "sun-up-knit", name: "Sun-Up Knit" },
      { slug: "wide-trouser", name: "Wide Atelier Trouser" },
      { slug: "soft-rules-shirt", name: "Soft Rules Shirt" },
    ],
  },
  {
    slug: "soft-bomber",
    name: "Soft Bomber",
    subtitle: "cream silk · lightweight · rolled cuff",
    price: "€ 540",
    tag: "evening",
    image: "/images/products/soft-bomber.png",
    detailImage: "/images/products/soft-bomber-detail.png",
    story: `The Soft Bomber is what happens when you take the most casual silhouette in menswear and rebuild it in silk for women. The cream colour reads neutral enough for day, but the silk catches light in a way that elevates it for evening.

The rolled cuff is hand-tacked — it won't unroll. The ribbed collar and hem use a silk-blend knit instead of the usual polyester. And the zip is a custom YKK in matte brass, because we spent too long looking at zippers for this project.

We think of it as the evening uniform piece. Layer it over the Soft Rules Shirt with the Wide Trouser and you're dressed for anything that isn't a wedding.`,
    fabric: [
      { name: "Mulberry Silk", percentage: 88 },
      { name: "Cotton", percentage: 10 },
      { name: "Elastane", percentage: 2 },
    ],
    details: [
      "Lightweight silk shell with subtle sheen",
      "Rolled cuff — hand-tacked, won't unroll",
      "Silk-blend ribbed collar and hem",
      "Custom YKK matte brass zip",
      "Two side pockets with invisible zip",
      "Interior SHOLÉ silk label, hand-stitched",
    ],
    care: [
      "Dry clean recommended",
      "Spot clean with damp cloth",
      "Hang on padded hanger",
      "Steam on low — avoid direct contact",
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    pairsWith: [
      { slug: "wide-trouser", name: "Wide Atelier Trouser" },
      { slug: "atelier-tote", name: "Atelier Tote" },
      { slug: "soft-rules-shirt", name: "Soft Rules Shirt" },
    ],
  },
  {
    slug: "atelier-mini",
    name: "Atelier Mini",
    subtitle: "espresso wool · above-knee · darted",
    price: "€ 410",
    image: "/images/products/atelier-mini.png",
    detailImage: "/images/products/atelier-mini-detail.png",
    story: `The Atelier Mini is the quiet favourite on the design team. The espresso wool matches the Mule No. 4 and creates a tonal leg line that makes everything above the waist pop.

The darts give it structure without being fussy — it sits flat at the hip and skims the thigh. The above-knee length was calibrated for movement: you can sit, stand, and walk without thinking about it. It works year-round because the wool weight (240gsm) is in that sweet spot between too warm and too light.

Pair it with the Soft Rules Shirt and the Mule for what we call "the effortless Friday." It's the outfit the whole team defaults to when they can't think of what to wear.`,
    fabric: [
      { name: "Merino Wool", percentage: 93 },
      { name: "Elastane", percentage: 7 },
    ],
    details: [
      "Above-knee length — movement-calibrated",
      "Four-dart front for a flat, structured fit",
      "Concealed back zip with hook-and-eye",
      "Fully lined in viscose for smooth drape",
      "240gsm wool — year-round weight",
      "Espresso dye matching Mule No. 4",
    ],
    care: [
      "Dry clean or hand wash cold",
      "Iron on medium with pressing cloth",
      "Hang or fold flat — no creasing",
      "Brush with garment brush between wears",
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    pairsWith: [
      { slug: "soft-rules-shirt", name: "Soft Rules Shirt" },
      { slug: "mule-no4", name: "Mule No. 4" },
      { slug: "sun-up-knit", name: "Sun-Up Knit" },
    ],
  },
];

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getAllSlugs(): string[] {
  return PRODUCTS.map((p) => p.slug);
}
