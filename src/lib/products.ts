/* ═══════════════════════════════════════════════════════════════════════
   Product Data — SHOLÉ by SARAR · Chapter 01 · Spring/Summer 2026
   ═══════════════════════════════════════════════════════════════════════ */

export interface Product {
  slug: string;
  name: string;
  subtitle: string;
  price: string;
  tag?: string;
  category: "women" | "accessories" | "shoes" | "tailoring";
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
    category: "tailoring",
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
    category: "women",
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
    category: "tailoring",
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
    category: "shoes",
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
    category: "women",
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
    category: "accessories",
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
    category: "accessories",
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
    category: "tailoring",
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
    category: "tailoring",
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
  // --- WOMEN ---
  {
    slug: "silk-slip-dress",
    name: "Silk Slip Dress",
    subtitle: "black silk · bias cut · midi length",
    price: "€ 480",
    category: "women",
    image: "", detailImage: "",
    story: "A masterclass in bias cutting. The Silk Slip Dress molds to the body without clinging, offering a fluid silhouette that works for both evening events and layered daytime looks.",
    fabric: [{ name: "Silk", percentage: 100 }],
    details: ["Bias cut", "V-neckline", "Adjustable straps", "Midi length"],
    care: ["Dry clean only", "Do not hang by straps long term"],
    sizes: ["XS", "S", "M", "L", "XL"],
    pairsWith: [{ slug: "atelier-coat", name: "The Atelier Coat" }, { slug: "mule-no4", name: "Mule No. 4" }]
  },
  {
    slug: "draped-silk-blouse",
    name: "Draped Silk Blouse",
    subtitle: "ivory silk · high neck · gathered sleeve",
    price: "€ 360",
    category: "women",
    tag: "new",
    image: "", detailImage: "",
    story: "The Draped Silk Blouse reimagines the classic button-down with a sculptural high neck and softly gathered sleeves. Cut from fluid ivory silk.",
    fabric: [{ name: "Silk", percentage: 100 }],
    details: ["High draped neck", "Gathered cuffs", "Concealed back zip"],
    care: ["Dry clean only"],
    sizes: ["XS", "S", "M", "L"],
    pairsWith: [{ slug: "wide-trouser", name: "Wide Atelier Trouser" }]
  },
  {
    slug: "pleated-midi-skirt",
    name: "Pleated Midi Skirt",
    subtitle: "olive wool-blend · sunray pleats",
    price: "€ 450",
    category: "women",
    image: "", detailImage: "",
    story: "Permanent sunray pleats give this skirt extraordinary movement. The olive wool-blend provides enough weight to hold the shape beautifully.",
    fabric: [{ name: "Wool", percentage: 60 }, { name: "Polyester", percentage: 40 }],
    details: ["Sunray pleats", "Concealed side zip", "Midi length"],
    care: ["Dry clean only", "Store hanging"],
    sizes: ["XS", "S", "M", "L"],
    pairsWith: [{ slug: "sun-up-knit", name: "Sun-Up Knit" }]
  },
  {
    slug: "cashmere-wrap-sweater",
    name: "Cashmere Wrap Sweater",
    subtitle: "charcoal cashmere · ballet wrap",
    price: "€ 520",
    category: "women",
    image: "", detailImage: "",
    story: "Inspired by ballet warm-up gear but executed in pure cashmere. The wrap silhouette allows for adjustable fit and styling.",
    fabric: [{ name: "Cashmere", percentage: 100 }],
    details: ["Wrap front", "Side tie closure", "Ribbed cuffs"],
    care: ["Hand wash cold", "Dry flat"],
    sizes: ["XS", "S", "M", "L", "XL"],
    pairsWith: [{ slug: "wide-trouser", name: "Wide Atelier Trouser" }]
  },
  {
    slug: "tailored-vest",
    name: "Tailored Vest",
    subtitle: "sand linen · tailored fit",
    price: "€ 280",
    category: "women",
    image: "", detailImage: "",
    story: "The Tailored Vest can be worn as a top or layered over a shirt. Cut from the same Normandy linen as our Wide Trouser.",
    fabric: [{ name: "Linen", percentage: 100 }],
    details: ["Five-button front", "Welt pockets", "Adjustable back tab"],
    care: ["Dry clean or hand wash"],
    sizes: ["XS", "S", "M", "L"],
    pairsWith: [{ slug: "wide-trouser", name: "Wide Atelier Trouser" }]
  },

  // --- ACCESSORIES ---
  {
    slug: "leather-belt-no1",
    name: "Leather Belt No. 1",
    subtitle: "espresso leather · brass buckle",
    price: "€ 160",
    category: "accessories",
    image: "", detailImage: "",
    story: "A simple, perfectly proportioned belt. The brass buckle is cast specifically for SHOLÉ and will develop a unique patina over time.",
    fabric: [{ name: "Leather", percentage: 100 }],
    details: ["25mm width", "Solid brass buckle", "Hand-burnished edges"],
    care: ["Condition leather occasionally"],
    sizes: ["S", "M", "L"],
    pairsWith: [{ slug: "wide-trouser", name: "Wide Atelier Trouser" }]
  },
  {
    slug: "oversized-sunglasses",
    name: "Oversized Acetate Sunglasses",
    subtitle: "tortoiseshell · polarized",
    price: "€ 280",
    category: "accessories",
    image: "", detailImage: "",
    story: "Handmade in Italy from premium acetate. The oversized square frame offers a cinematic, glamorous silhouette while providing full UV protection.",
    fabric: [{ name: "Acetate", percentage: 100 }],
    details: ["Polarized lenses", "Five-barrel hinges", "100% UVA/UVB protection"],
    care: ["Clean with microfiber cloth"],
    sizes: ["One Size"],
    pairsWith: [{ slug: "atelier-coat", name: "The Atelier Coat" }]
  },
  {
    slug: "silk-hair-tie",
    name: "Silk Hair Tie Set",
    subtitle: "saffron & black · pure silk",
    price: "€ 65",
    category: "accessories",
    tag: "gift",
    image: "", detailImage: "",
    story: "Crafted from offcuts of our Bursa silk to minimize waste. Gentle on hair to prevent breakage.",
    fabric: [{ name: "Silk", percentage: 100 }],
    details: ["Set of two", "Internal elastic", "Zero-waste design"],
    care: ["Hand wash cold"],
    sizes: ["One Size"],
    pairsWith: [{ slug: "soft-rules-shirt", name: "Soft Rules Shirt" }]
  },
  {
    slug: "sculptural-cuff",
    name: "Sculptural Brass Cuff",
    subtitle: "solid brass · hand-cast",
    price: "€ 320",
    category: "accessories",
    image: "", detailImage: "",
    story: "A bold, undulating cuff bracelet cast in solid brass. Designed to be the only piece of jewelry you need to wear.",
    fabric: [{ name: "Brass", percentage: 100 }],
    details: ["Hand-cast in Istanbul", "Polished finish", "Adjustable fit"],
    care: ["Polish with brass cleaner when needed"],
    sizes: ["One Size"],
    pairsWith: [{ slug: "soft-bomber", name: "Soft Bomber" }]
  },
  {
    slug: "mini-crossbody-bag",
    name: "Mini Crossbody Bag",
    subtitle: "camel leather · structured",
    price: "€ 420",
    category: "accessories",
    image: "", detailImage: "",
    story: "A miniature companion to the Atelier Tote. Fits just the essentials: phone, cardholder, and keys.",
    fabric: [{ name: "Leather", percentage: 100 }],
    details: ["Magnetic closure", "Adjustable strap", "Suede lining"],
    care: ["Condition leather occasionally"],
    sizes: ["One Size"],
    pairsWith: [{ slug: "atelier-tote", name: "Atelier Tote" }]
  },

  // --- SHOES ---
  {
    slug: "pointed-flat",
    name: "Pointed Leather Flat",
    subtitle: "black leather · slight heel",
    price: "€ 340",
    category: "shoes",
    image: "", detailImage: "",
    story: "The elegant alternative to the Mule. The pointed toe elongates the leg line, while the slight 15mm heel provides all-day support.",
    fabric: [{ name: "Leather", percentage: 100 }],
    details: ["Pointed toe", "15mm stacked heel", "Cushioned insole"],
    care: ["Use leather conditioner"],
    sizes: ["36", "37", "38", "39", "40"],
    pairsWith: [{ slug: "wide-trouser", name: "Wide Atelier Trouser" }]
  },
  {
    slug: "strappy-sandal",
    name: "Minimalist Strappy Sandal",
    subtitle: "espresso leather · 50mm heel",
    price: "€ 390",
    category: "shoes",
    tag: "evening",
    image: "", detailImage: "",
    story: "Barely-there straps hold the foot securely atop a comfortable 50mm heel. The perfect evening shoe.",
    fabric: [{ name: "Leather", percentage: 100 }],
    details: ["Ankle strap", "50mm heel", "Leather sole"],
    care: ["Wipe clean"],
    sizes: ["36", "37", "38", "39", "40", "41"],
    pairsWith: [{ slug: "atelier-mini", name: "Atelier Mini" }]
  },
  {
    slug: "tall-leather-boot",
    name: "Tall Leather Boot",
    subtitle: "black leather · riding boot style",
    price: "€ 680",
    category: "shoes",
    image: "", detailImage: "",
    story: "A classic riding boot silhouette updated with a modern square toe. Hits just below the knee.",
    fabric: [{ name: "Leather", percentage: 100 }],
    details: ["Below-knee height", "Inside zip", "Block heel"],
    care: ["Store with boot trees"],
    sizes: ["37", "38", "39", "40", "41"],
    pairsWith: [{ slug: "atelier-mini", name: "Atelier Mini" }]
  },
  {
    slug: "woven-loafer",
    name: "Woven Loafer",
    subtitle: "camel leather · hand-woven",
    price: "€ 460",
    category: "shoes",
    image: "", detailImage: "",
    story: "Intricately hand-woven leather gives this loafer a rich texture and exceptional breathability for warmer months.",
    fabric: [{ name: "Leather", percentage: 100 }],
    details: ["Hand-woven upper", "Leather sole", "Slip-on"],
    care: ["Condition gently"],
    sizes: ["36", "37", "38", "39", "40"],
    pairsWith: [{ slug: "wide-trouser", name: "Wide Atelier Trouser" }]
  },
  {
    slug: "chunky-derby",
    name: "Chunky Sole Derby",
    subtitle: "black leather · platform",
    price: "€ 420",
    category: "shoes",
    tag: "new",
    image: "", detailImage: "",
    story: "A robust take on the classic derby. The lightweight platform sole adds height and edge to tailored looks.",
    fabric: [{ name: "Leather", percentage: 100 }],
    details: ["Lace-up", "Lightweight rubber lug sole", "Leather lining"],
    care: ["Polish regularly"],
    sizes: ["36", "37", "38", "39", "40", "41"],
    pairsWith: [{ slug: "wide-trouser", name: "Wide Atelier Trouser" }]
  },

  // --- TAILORING ---
  {
    slug: "double-breasted-blazer",
    name: "Double-Breasted Blazer",
    subtitle: "navy wool · sharp shoulder",
    price: "€ 720",
    category: "tailoring",
    image: "", detailImage: "",
    story: "The cornerstone of any tailored wardrobe. Strong shoulders, a nipped waist, and six horn buttons define this classic blazer.",
    fabric: [{ name: "Wool", percentage: 100 }],
    details: ["Double-breasted", "Peak lapel", "Fully lined"],
    care: ["Dry clean only"],
    sizes: ["XS", "S", "M", "L"],
    pairsWith: [{ slug: "wide-trouser", name: "Wide Atelier Trouser" }]
  },
  {
    slug: "pleated-trousers-navy",
    name: "Pleated Trousers",
    subtitle: "navy wool · matching blazer",
    price: "€ 440",
    category: "tailoring",
    image: "", detailImage: "",
    story: "Designed to pair perfectly with the Double-Breasted Blazer for a complete suit, or worn separately for an elevated everyday look.",
    fabric: [{ name: "Wool", percentage: 100 }],
    details: ["Single pleat", "Straight leg", "Belt loops"],
    care: ["Dry clean only"],
    sizes: ["XS", "S", "M", "L", "XL"],
    pairsWith: [{ slug: "double-breasted-blazer", name: "Double-Breasted Blazer" }]
  },
  {
    slug: "silk-tuxedo-jacket",
    name: "Silk Tuxedo Jacket",
    subtitle: "black silk · satin lapel",
    price: "€ 850",
    category: "tailoring",
    tag: "evening",
    image: "", detailImage: "",
    story: "Evening tailoring at its finest. The contrast between the matte silk body and the glossy satin lapel creates a striking visual.",
    fabric: [{ name: "Silk", percentage: 100 }],
    details: ["Satin shawl lapel", "Single button closure", "Jet pockets"],
    care: ["Dry clean only"],
    sizes: ["XS", "S", "M", "L"],
    pairsWith: [{ slug: "silk-slip-dress", name: "Silk Slip Dress" }]
  },
  {
    slug: "wool-pencil-skirt",
    name: "Tailored Pencil Skirt",
    subtitle: "charcoal wool · back slit",
    price: "€ 360",
    category: "tailoring",
    image: "", detailImage: "",
    story: "A masterclass in fit. This pencil skirt is engineered to contour the body while allowing comfortable movement via a deep back slit.",
    fabric: [{ name: "Wool", percentage: 95 }, { name: "Elastane", percentage: 5 }],
    details: ["Knee length", "Back walking slit", "Concealed zip"],
    care: ["Dry clean only"],
    sizes: ["XS", "S", "M", "L"],
    pairsWith: [{ slug: "soft-rules-shirt", name: "Soft Rules Shirt" }]
  },
  {
    slug: "trench-coat-reimagined",
    name: "The Reimagined Trench",
    subtitle: "sand cotton-gabardine · oversized",
    price: "€ 940",
    category: "tailoring",
    tag: "bestseller",
    image: "", detailImage: "",
    story: "We took the traditional trench and exaggerated the proportions. The dramatic sweep of the coat provides both shelter and style.",
    fabric: [{ name: "Cotton", percentage: 100 }],
    details: ["Oversized fit", "Storm flap", "Belted waist"],
    care: ["Dry clean only"],
    sizes: ["S", "M", "L"],
    pairsWith: [{ slug: "wide-trouser", name: "Wide Atelier Trouser" }]
  }

];

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getAllSlugs(): string[] {
  return PRODUCTS.map((p) => p.slug);
}

