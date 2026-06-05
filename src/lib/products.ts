/* ═══════════════════════════════════════════════════════════════════════
   Product Data — SHOLÉ · Chapter 01 · Spring/Summer 2026
   ═══════════════════════════════════════════════════════════════════════ */

export interface Product {
  slug: string;
  name: string;
  name_tr?: string;
  subtitle: string;
  subtitle_tr?: string;
  price: string;
  tag?: string;
  category: "women" | "accessories" | "shoes" | "tailoring";
  image: string;
  detailImage: string;
  story: string;
  story_tr?: string;
  fabric: { name: string; percentage: number }[];
  details: string[];
  details_tr?: string[];
  care: string[];
  care_tr?: string[];
  sizes: string[];
  pairsWith: { slug: string; name: string }[];
}

export const PRODUCTS: Product[] = [
  {
    slug: "atelier-coat",
    name: "The Atelier Coat",
    name_tr: "Atelier Palto",
    subtitle: "terra dye wool · structured shoulder · cropped sleeve",
    subtitle_tr: "terra boyalı yün · yapılı omuz · kısa kol",
    price: "€ 890",
    category: "tailoring",
    tag: "new",
    image: "/images/products/atelier-coat.png",
    detailImage: "/images/products/atelier-coat-detail.png",
    story: `The coat that started it all. When SHOLÉ's design team trained our custom tailoring algorithms on classical outerwear silhouettes, the goal was simple: engineer an autonomous design you'd wear to every dinner, every meeting, every airport. The result is the Atelier Coat — computed to perfectly drape and terra-dyed in a process that takes 72 hours and gives each piece its own unique warmth.

The structured shoulder is a high-modernist statement achieved through precise mathematical draping, while the cropped sleeve is pure SHOLÉ — modern, a little unexpected, and surprisingly practical. It's the kind of piece that makes people ask where you got it.

Every coat is cut from a single bolt to match the grain. Twelve per drop, and when they're gone, they're gone.`,
    story_tr: `Her şeyin başladığı palto. SHOLÉ tasarım ekibi klasik dış giyim silüetlerini özel terzilik algoritmalarımızla eğittiğinde hedef basitti: her akşam yemeğine, her toplantıya, her havalimanına giyebileceğiniz otonom bir tasarım mühendisliği yapmak. Sonuç; dökümü mükemmel şekilde hesaplanan ve 72 saat süren bir işlemle terra boyanan, her parçaya kendine özgü sıcaklığını veren Atelier Palto oldu.

Yapılı omuzlar, hassas matematiksel drapajla elde edilen yüksek modernist bir duruş sergilerken, kısa kollar saf SHOLÉ — modern, biraz beklenmedik ve şaşırtıcı derecede pratik. İnsanların nereden aldığınızı sormasına neden olacak türden bir parça.

Her palto, kumaşın dokusuna uyması için tek bir toptan kesilir. Her seride on iki adet üretilir ve bittiklerinde bir daha gelmezler.`,
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
    details_tr: [
      "Kanvas iç astarlı yapılı omuzlar",
      "Bilekte biten kısa kollar",
      "İki düğmeli ön kapama, kemik düğmeler",
      "İpek karışımlı tam astar",
      "SHOLÉ monogramlı iç cep",
      "Terra boya — 72 saatlik doğal pigment işlemi",
    ],
    care: [
      "Dry clean only",
      "Store on a padded hanger",
      "Steam to refresh between wears",
      "Avoid prolonged direct sunlight",
    ],
    care_tr: [
      "Sadece kuru temizleme",
      "Dolgulu askıda saklayın",
      "Kullanımlar arasında buharla tazeleyin",
      "Uzun süre doğrudan güneş ışığından kaçının",
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
    name_tr: "Soft Rules İpek Gömlek",
    subtitle: "cream silk · french seam · relaxed cut",
    subtitle_tr: "krem ipek · fransız dikişi · rahat kesim",
    price: "€ 340",
    category: "women",
    image: "/images/products/soft-rules-shirt.png",
    detailImage: "/images/products/soft-rules-shirt-detail.png",
    story: `The Soft Rules Shirt breaks every office code worth breaking. Cut from cream silk that was sourced from a family mill in Bursa — one of the oldest silk-producing cities in the world — it falls differently from anything you've worn before.

The french seams are hand-finished, which means no raw edges touching your skin. It works tucked into the Wide Trouser for meetings, or loose over the Atelier Mini for Friday. The slight sheen catches light without screaming silk.

We called it "Soft Rules" because that's the dress code it belongs to. Somewhere between too formal and just right.`,
    story_tr: `Soft Rules İpek Gömlek, yıkılmaya değer tüm ofis kurallarını yıkıyor. Dünyanın en eski ipek üretim merkezlerinden biri olan Bursa'daki bir aile değirmeninden temin edilen krem ipekten kesilen bu gömlek, daha önce giydiğiniz hiçbir şeye benzemeyen bir döküme sahip.

Fransız dikişleri el işçiliğiyle tamamlanmıştır, bu da cildinize dokunan hiçbir pürüzlü kenar olmadığı anlamına gelir. Toplantılar için Wide Atelier Pantolon'un içine sokulmuş olarak veya Cuma akşamı Atelier Mini Etek üzerine dökümlü olarak kullanılabilir. Hafif parlaklığı, bağırmadan ışığı yakalar.

Ona "Soft Rules" dedik çünkü ait olduğu giyim tarzı bu. Çok resmi ile tam yerinde arasında bir yerde.`,
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
    details_tr: [
      "Düşük omuzlu rahat kesim",
      "Tamamında Fransız dikiş yapısı",
      "SHOLÉ logolu sedef düğmeler",
      "Kavisli etek ucu — içeride veya dışarıda kullanılabilir",
      "Gizli dikişli tek göğüs cebi",
      "Bursa ipeği — aile işletmesi, kuruluş 1890",
    ],
    care: [
      "Hand wash cold or dry clean",
      "Iron on low with pressing cloth",
      "Hang dry — never tumble",
      "Store folded in tissue",
    ],
    care_tr: [
      "Soğuk elde yıkama veya kuru temizleme",
      "Ütü bezini kullanarak düşük ısıda ütüleyin",
      "Asarak kurutun — asla tamburlu kurutma yapmayın",
      "Kağıt ambalaj içinde katlı saklayın",
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
    name_tr: "Wide Atelier Pantolon",
    subtitle: "sand linen · high waist · pleated",
    subtitle_tr: "kum beji keten · yüksek bel · pileli",
    price: "€ 420",
    category: "tailoring",
    image: "/images/products/wide-trouser.png",
    detailImage: "/images/products/wide-trouser-detail.png",
    story: `There's a reason the Wide Atelier Trouser was the first piece the team prototyped. It had to move like you're walking through a bazaar, but look like you just left the gallery.

The linen is sourced from Normandy — heavyweight, slubbed, the kind that develops a beautiful patina after a few washes. The high waist and double-forward pleats give structure where it matters, and the wide leg falls in a way that makes everything below the waist look effortless.

This trouser was tested on Istanbul's cobblestones, on overnight flights, and at way too many lunches. It passed every time. Pair it with the Atelier Coat and the Mule, and you have the full atelier look — our favourite outfit this chapter.`,
    story_tr: `Wide Atelier Pantolon'un ekibin prototipini yaptığı ilk parça olmasının bir nedeni var. Bir çarşıda yürüyormuşsunuz gibi hareket etmeli, ama bir galeriden yeni çıkmışsınız gibi görünmeliydi.

Keten, Normandiya'dan temin edilmiştir — ağır gramajlı, dokulu ve birkaç yıkamadan sonra güzel bir patina kazanan türden. Yüksek bel ve çift pile yapısı gereken yerde yapı kazandırırken, geniş paça belden aşağısının zahmetsiz görünmesini sağlar.

Bu pantolon İstanbul'un arnavut kaldırımlarında, gece uçuşlarında ve çok fazla öğle yemeğinde test edildi. Her seferinde geçer not aldı. Atelier Palto ve Mule ile eşleştirin; bu bölümün favori kombini olan tam atelier görünümüne sahip olun.`,
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
    details_tr: [
      "Çift pileli yüksek bel",
      "Geniş düz paça — 28cm paça genişliği",
      "Yan cepler, bir adet arka fileto cep",
      "Gizli kanca ve fermuar kapama",
      "Ağır gramajlı Normandiya keteni — 280gsm",
      "Yumuşaklık ve minimum çekme için önceden yıkanmıştır",
    ],
    care: [
      "Machine wash cold, gentle cycle",
      "Hang dry recommended",
      "Iron while slightly damp for best results",
      "Linen softens beautifully with each wash",
    ],
    care_tr: [
      "Soğuk makinede yıkama, hassas program",
      "Asarak kurutma önerilir",
      "En iyi sonuç için hafif nemliyken ütüleyin",
      "Keten her yıkamada güzelce yumuşar",
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
    name: "Atelier Suede Mule",
    name_tr: "Atölye Süet Terlik",
    subtitle: "espresso suede · seamless · elegant profile",
    subtitle_tr: "espresso süet · dikişsiz · yalın siluet",
    price: "€ 380",
    category: "shoes",
    tag: "late spring",
    image: "/images/products/mule-no4.png",
    detailImage: "/images/products/mule-no4-detail.png",
    story: `A study in sculptural simplicity. The Atelier Suede Mule is defined by its seamless construction, completely free of hardware or visible stitching on the upper. Cut from premium espresso suede, it features a refined pointed profile that naturally elongates the leg line while maintaining an understated, quiet luxury aesthetic.

Every pair is handcrafted in our workshop using vegetable-tanned lining and a blake-stitched leather sole. A slight stacked heel and cushioned insole ensure elegance without compromising daily comfort.`,
    story_tr: `Heykelsi sadeliğin bir ifadesi. Atölye Süet Terlik, dikişsiz tasarımı ve üzerinde hiçbir metal aksesuar ya da dikiş barındırmayan yalın yapısıyla öne çıkar. Birinci sınıf espresso rengi süet deriden kesilen bu model, bacak boyunu zarifçe uzatan sivri burun profiliyle sessiz lüks estetiğini en saf haliyle sunar.

Her bir çift, bitkisel tabaklanmış astar ve blake dikişli deri taban kullanılarak atölyemizde el işçiliğiyle üretilmiştir. Hafif katmanlı topuğu ve destekli iç tabanı, günlük konfordan ödün vermeden asil bir duruş sağlar.`,
    fabric: [
      { name: "Premium Suede Leather", percentage: 100 },
    ],
    details: [
      "Seamless upper in rich espresso suede",
      "Pointed-toe elegant silhouette",
      "Blake-stitched genuine leather sole",
      "Soft cushioned leather insole",
      "Vegetable-tanned leather lining",
      "Slight stacked heel",
    ],
    details_tr: [
      "Zengin espresso rengi süet dikişsiz saya",
      "Sivri burunlu zarif siluet",
      "Blake dikişli hakiki deri taban",
      "Yumuşak dolgulu deri iç taban",
      "Bitkisel tabaklanmış deri iç astar",
      "Hafif katmanlı topuk yapısı",
    ],
    care: [
      "Protect with a quality suede waterproofing spray",
      "Clean gently with a specialized suede brush",
      "Store in the provided dust bag with shoe trees",
      "Avoid direct exposure to heavy rain and water",
    ],
    care_tr: [
      "Kaliteli bir süet koruyucu sprey ile koruyun",
      "Özel süet fırçası yardımıyla nazikçe temizleyin",
      "Size sunulan toz torbasında ve ayakkabı kalıbıyla saklayın",
      "Yoğun yağmur ve suyla doğrudan temastan kaçının",
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
    name_tr: "Sun-Up Triko",
    subtitle: "saffron merino · ribbed · slight crop",
    subtitle_tr: "safran merinos · fitilli · hafif kısa kesim",
    price: "€ 290",
    category: "women",
    tag: "✦ pick",
    image: "/images/products/sun-up-knit.png",
    detailImage: "/images/products/sun-up-knit-detail.png",
    story: `This is the colour piece. The Sun-Up Knit was born from a saffron spice market visit in Istanbul's Eminönü district. We kept coming back to that particular golden-yellow — warm without being loud, flattering on every skin tone.

The merino comes from a cooperative in New Zealand that guarantees mulesing-free wool. It's spun to a fine 18.5-micron gauge, which means it sits against your skin without itch. The rib structure gives it stretch and shape without losing the crop silhouette.

Wear it with the Wide Trouser and the Sun-Up Scarf for the full colour story, or layer it under the Atelier Coat when the weather turns.`,
    story_tr: `Bu, koleksiyonun renkli parçası. Sun-Up Triko, İstanbul Eminönü'ndeki Mısır Çarşısı'na yapılan bir safran ziyareti sırasında doğdu. O özel altın sarısına sürekli geri döndük — gürültülü olmadan sıcak, her cilt tonuna yakışan bir renk.

Merinos yünü, Yeni Zelanda'daki mulesing (zararlı bir uygulama) içermeyen bir kooperatiften geliyor. 18.5 mikronluk ince bir yapıda eğrilmiştir, bu da cildinizde kaşıntı yapmadan durduğu anlamına gelir. Fitilli yapısı, kısa silüetini kaybetmeden ona esneklik ve form verir.

Tam bir renk hikayesi için Wide Atelier Pantolon ve Sun-Up Atkı ile giyin veya hava değiştiğinde Atelier Palto'nun altına katman olarak ekleyin.`,
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
    details_tr: [
      "Fitilli yapı — 2x2 örgü deseni",
      "Hafif kısa kesim — tam bel hizasında biter",
      "18.5 mikron merinos, mulesing içermez",
      "Eminönü baharat çarşısından ilham alan safran boya",
      "Kıvrık etek ve manşetler — pürüzsüz kenarlar",
      "Konfor için düz dikişler",
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
    name_tr: "Atelier Tote Çanta",
    subtitle: "camel leather · unlined · everyday carry",
    subtitle_tr: "deve tüyü rengi deri · astarsız · günlük kullanım",
    price: "€ 540",
    category: "accessories",
    image: "/images/products/atelier-tote.png",
    detailImage: "/images/products/atelier-tote-detail.png",
    story: `The Atelier Tote is an argument for simplicity. No hardware, no logos, no internal dividers. Just beautiful leather, cut and stitched by the same Izmir tannery that supplies our Mule No. 4.

It's unlined because we wanted you to feel the leather from the inside — and because it means the bag softens and moulds to your daily carry. After six months, your tote will have a slump and patina that's entirely yours.

Fits a 14" laptop, a water bottle, and the kind of life where you need everything in one bag. The shoulder drop is 24cm — long enough for a coat underneath.`,
    story_tr: `Atelier Tote, sadeliğin bir savunmasıdır. Metal aksesuar yok, logo yok, iç bölme yok. Sadece Mule No. 4'ümüzü de tedarik eden aynı İzmir tabakhanesi tarafından kesilen ve dikilen güzel bir deri.

Astarsızdır çünkü deriyi içeriden de hissetmenizi istedik — ve bu sayede çantanın yumuşayıp günlük eşyalarınıza göre şekil almasını sağladık. Altı ay sonra, çantanız tamamen size ait bir forma ve patinaya sahip olacak.

14 inçlik bir dizüstü bilgisayara, bir su şişesine ve her şeye tek bir çantada ihtiyaç duyduğunuz bir hayata uygundur. Askı boyu 24 cm'dir — altına palto giymek için yeterince uzundur.`,
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
    details_tr: [
      "Tam kalite deve tüyü rengi deri, bitkisel tabaklanmış",
      "Astarsız — günlük kullanımla yumuşar",
      "14 inç dizüstü bilgisayar sığar",
      "24 cm askı payı — paltoyla kullanıma uygun",
      "Mıknatıslı iç deri cep",
      "Koruyucu ayaklı takviyeli taban",
    ],
    care: [
      "Condition with leather balm quarterly",
      "Stuff with tissue when storing",
      "Wipe spills immediately with dry cloth",
      "Leather patina develops naturally — embrace it",
    ],
    care_tr: [
      "Üç ayda bir deri bakım kremi uygulayın",
      "Saklarken içine kağıt doldurun",
      "Dökülmeleri hemen kuru bir bezle silin",
      "Deri patinası doğal olarak gelişir — tadını çıkarın",
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
    name_tr: "Sun-Up İpek Eşarp",
    subtitle: "saffron silk · the bright accent",
    subtitle_tr: "safran ipek · parlak dokunuş",
    price: "€ 140",
    category: "accessories",
    image: "/images/products/sun-up-scarf.png",
    detailImage: "/images/products/sun-up-scarf-detail.png",
    story: `The Sun-Up Scarf is the easiest way to buy into the saffron colour story. Same golden-yellow as the knit, but in Bursa silk — lighter, more luminous, and versatile enough to wear as a neck scarf, a hair tie, or a bag accessory.

The edges are hand-rolled, a technique that takes four times longer than machine-finishing but gives that beautiful soft curl that catches light. Each scarf is cut from a single silk panel to ensure pattern continuity.

At €140, it's our most accessible piece — and often the first SHOLÉ item people buy. We're fine with that. It's a gateway piece.`,
    story_tr: `Sun-Up Eşarp, safran renk hikayesine dahil olmanın en kolay yoludur. Triko ile aynı altın sarısı, ancak Bursa ipeği ile — daha hafif, daha parlak ve boyun eşarbı, saç bandı veya çanta aksesuarı olarak kullanılabilecek kadar çok yönlü.

Kenarlar el işçiliğiyle rulo yapılmıştır; bu teknik makine dikişinden dört kat daha uzun sürer ancak ışığı yakalayan o güzel yumuşak kıvrımı verir. Desen sürekliliğini sağlamak için her eşarp tek bir ipek panelden kesilir.

140 € fiyatıyla en erişilebilir parçamızdır ve genellikle insanların satın aldığı ilk SHOLÉ ürünüdür. Bununla gurur duyuyoruz. Bu bir tanışma parçasıdır.`,
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
    details_tr: [
      "70cm × 70cm — klasik kare format",
      "El rulosu kenarlar — 4 kat daha uzun işleme süresi",
      "Sun-Up Triko ile uyumlu safran boya",
      "Bursa ipeği — tek panel kesim",
      "Hafif — 12 momme ipek ağırlığı",
      "Köşeye dokunmuş SHOLÉ monogramı",
    ],
    care: [
      "Hand wash cold with silk detergent",
      "Roll in towel to remove excess water",
      "Iron on low while slightly damp",
      "Store flat or rolled — never folded",
    ],
    care_tr: [
      "İpek deterjanıyla soğuk elde yıkayın",
      "Fazla suyu almak için havluya sarın",
      "Hafif nemliyken düşük ısıda ütüleyin",
      "Düz veya rulo yaparak saklayın — asla katlamayın",
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
    name_tr: "Soft Bomber Ceket",
    subtitle: "cream silk · lightweight · rolled cuff",
    subtitle_tr: "krem ipek · hafif · kıvrık manşet",
    price: "€ 540",
    category: "tailoring",
    tag: "evening",
    image: "/images/products/soft-bomber.png",
    detailImage: "/images/products/soft-bomber-detail.png",
    story: `The Soft Bomber is what happens when you take the most casual silhouette in menswear and rebuild it in silk for women. The cream colour reads neutral enough for day, but the silk catches light in a way that elevates it for evening.

The rolled cuff is hand-tacked — it won't unroll. The ribbed collar and hem use a silk-blend knit instead of the usual polyester. And the zip is a custom YKK in matte brass, because we spent too long looking at zippers for this project.

We think of it as the evening uniform piece. Layer it over the Soft Rules Shirt with the Wide Trouser and you're dressed for anything that isn't a wedding.`,
    story_tr: `Soft Bomber, erkek giyimindeki en rahat silüeti alıp kadınlar için ipekten yeniden yorumladığımızda ortaya çıkan parçadır. Krem rengi gündüz için yeterince nötrdür, ancak ipek ışığı yakalayarak onu akşam saatleri için yükseltir.

Kıvrık manşet el işçiliğiyle sabitlenmiştir — açılmaz. Fitilli yaka ve etek ucu, alışılmış polyester yerine ipek karışımlı bir örgü kullanır. Fermuar ise mat pirinçten özel bir YKK fermuardır, çünkü bu proje için fermuarlara çok uzun süre baktık.

Bunu akşam üniforması parçası olarak görüyoruz. Wide Atelier Pantolon ve Soft Rules Gömlek üzerine giydiğinizde, düğün dışında her şeye hazır bir şıklıkta olursunuz.`,
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
    details_tr: [
      "Hafif parlaklığa sahip ipek dış yüzey",
      "Kıvrık manşet — el dikişiyle sabitlenmiş, açılmaz",
      "İpek karışımlı fitilli yaka ve etek ucu",
      "Özel YKK mat pirinç fermuar",
      "Görünmez fermuarlı iki yan cep",
      "İç kısımda el dikişi SHOLÉ ipek etiketi",
    ],
    care: [
      "Dry clean recommended",
      "Spot clean with damp cloth",
      "Hang on padded hanger",
      "Steam on low — avoid direct contact",
    ],
    care_tr: [
      "Kuru temizleme önerilir",
      "Nemli bezle bölgesel temizlik yapın",
      "Dolgulu askıda asarak saklayın",
      "Düşük ısıda buhar verin — doğrudan temastan kaçının",
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
    name_tr: "Atelier Mini Etek",
    subtitle: "espresso wool · above-knee · darted",
    subtitle_tr: "espresso yün · diz üstü · pensli",
    price: "€ 410",
    category: "tailoring",
    image: "/images/products/atelier-mini.png",
    detailImage: "/images/products/atelier-mini-detail.png",
    story: `The Atelier Mini is the quiet favourite on the design team. The espresso wool matches the Mule No. 4 and creates a tonal leg line that makes everything above the waist pop.

The darts give it structure without being fussy — it sits flat at the hip and skims the thigh. The above-knee length was calibrated for movement: you can sit, stand, and walk without thinking about it. It works year-round because the wool weight (240gsm) is in that sweet spot between too warm and too light.

Pair it with the Soft Rules Shirt and the Mule for what we call "the effortless Friday." It's the outfit the whole team defaults to when they can't think of what to wear.`,
    story_tr: `Atelier Mini, tasarım ekibinin sessiz favorisidir. Espresso rengi yün, Mule No. 4 ile uyum sağlar ve belden yukarısının öne çıkmasını sağlayan tonlu bir bacak hattı oluşturur.

Pensler, abartılı olmadan yapı kazandırır — kalçaya düz bir şekilde oturur ve uyluğu hafifçe sarar. Diz üstü boyu hareket için ayarlanmıştır: düşünmenize gerek kalmadan oturabilir, ayakta durabilir ve yürüyebilirsiniz. Yün ağırlığı (240gsm) çok sıcak ile çok hafif arasındaki o mükemmel noktada olduğu için yıl boyunca kullanılabilir.

"Zahmetsiz Cuma" dediğimiz görünüm için Soft Rules Gömlek ve Mule ile eşleştirin. Bu, ne giyeceğini bilemediğinde tüm ekibin varsayılan olarak seçtiği kombindir.`,
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
    details_tr: [
      "Diz üstü boy — hareket için ayarlanmış",
      "Düz ve yapılı bir uyum için dört ön pens",
      "Kanca ve gözlü gizli arka fermuar",
      "Pürüzsüz döküm için tamamen viskon astarlı",
      "240gsm yün — yıl boyu kullanılabilir ağırlık",
      "Mule No. 4 ile uyumlu espresso boya",
    ],
    care: [
      "Dry clean or hand wash cold",
      "Iron on medium with pressing cloth",
      "Hang or fold flat — no creasing",
      "Brush with garment brush between wears",
    ],
    care_tr: [
      "Kuru temizleme veya soğuk elde yıkama",
      "Ütü bezi ile orta ısıda ütüleyin",
      "Asarak veya katlayarak saklayın — kırıştırmayın",
      "Kullanımlar arasında giysi fırçasıyla fırçalayın",
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
    name_tr: "İpek Slip Elbise",
    subtitle: "black silk · bias cut · midi length",
    subtitle_tr: "siyah ipek · verev kesim · midi boy",
    price: "€ 480",
    category: "women",
    image: "/images/products/silk-slip-dress.png",
    detailImage: "/images/products/silk-slip-dress-detail.png",
    story: `A masterclass in bias cutting. The Silk Slip Dress moulds to the body without clinging, offering a fluid silhouette that works for both evening events and layered daytime looks. The bias cut was perfected over five prototypes — each one adjusted millimetre by millimetre until the drape fell exactly right.

The black silk comes from the same Bursa mill that supplies our Soft Rules Shirt, but in a heavier 19-momme weight that gives it body without sacrificing movement. Wear it alone with the Mule No. 4 for evening, or layer the Atelier Coat over it for something more architectural.

The adjustable straps mean it works across shoulder widths, and the V-neckline sits low enough to be interesting but high enough to be effortless.`,
    story_tr: `Verev kesimde bir ustalık sınıfı. İpek Slip Elbise, vücuda yapışmadan kıvrımları sarar; hem akşam davetleri hem de katmanlı gündüz görünümleri için akıcı bir siluet sunar. Verev kesim, beş prototip boyunca mükemmelleştirildi — her biri, döküm tam olarak doğru düşene kadar milimetre milimetre ayarlandı.

Siyah ipek, Soft Rules Gömlek'imizi de besleyen aynı Bursa değirmeninden geliyor; ancak hareket kabiliyetinden ödün vermeden ona hacim kazandıran daha ağır bir 19-momme ağırlığında. Akşam için tek başına Mule No. 4 ile giyin veya daha mimari bir görünüm için üzerine Atelier Palto'yu katmanlayın.

Ayarlanabilir askıları, farklı omuz genişliklerine uyum sağladığı anlamına gelir ve V yaka dekoltesi ilgi çekici olacak kadar düşük, ancak zahmetsiz hissettirecek kadar yüksek tasarlanmıştır.`,
    fabric: [{ name: "Mulberry Silk", percentage: 100 }],
    details: [
      "Bias cut — five-prototype development",
      "V-neckline with clean finish",
      "Adjustable silk-covered straps",
      "Midi length — hits mid-calf",
      "French seam construction throughout",
      "19-momme Bursa silk — heavier drape"
    ],
    details_tr: [
      "Verev kesim — beş prototipli geliştirme süreci",
      "Temiz bitişli V yaka hattı",
      "Ayarlanabilir ipek kaplı askılar",
      "Midi boy — baldır hizasında biter",
      "Tamamında Fransız dikiş yapısı",
      "19-momme Bursa ipeği — daha ağır döküm"
    ],
    care: ["Dry clean only", "Do not hang by straps long-term", "Store flat or on padded hanger", "Steam on low to refresh"],
    care_tr: [
      "Sadece kuru temizleme",
      "Uzun süre askılarından asarak saklamayın",
      "Düz bir şekilde veya dolgulu askıda saklayın",
      "Tazelemek için düşük ısıda buhar uygulayın"
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    pairsWith: [{ slug: "atelier-coat", name: "The Atelier Coat" }, { slug: "mule-no4", name: "Mule No. 4" }, { slug: "sculptural-cuff", name: "Sculptural Brass Cuff" }]
  },
  {
    slug: "draped-silk-blouse",
    name: "Draped Silk Blouse",
    subtitle: "ivory silk · high neck · gathered sleeve",
    price: "€ 360",
    category: "women",
    tag: "new",
    image: "/images/products/draped-silk-blouse.png",
    detailImage: "/images/products/draped-silk-blouse-detail.png",
    story: `The Draped Silk Blouse reimagines the classic button-down with a sculptural high neck and softly gathered sleeves. Cut from fluid ivory silk sourced from our Bursa mill, it moves between boardroom and bistro without a wardrobe change.

The high neck drapes rather than constricts — it sits softly against the collarbone and creates a frame for the face that photographs beautifully. The gathered sleeves add volume without bulk, and the concealed back zip means the front is completely uninterrupted.

We think of it as the piece that replaces four blouses in your wardrobe. It works with the Wide Trouser for day, the Atelier Mini for evening, and the Pleated Midi Skirt for everything in between.`,
    fabric: [{ name: "Mulberry Silk", percentage: 95 }, { name: "Elastane", percentage: 5 }],
    details: [
      "Sculptural high draped neck",
      "Softly gathered cuffs with blind-stitch finish",
      "Concealed back zip — uninterrupted front",
      "Bursa silk — family mill, established 1890",
      "French seam construction throughout",
      "Relaxed fit through the body"
    ],
    care: ["Dry clean recommended", "Hand wash cold with silk detergent", "Iron on low with pressing cloth", "Store on padded hanger"],
    care_tr: [
      "Kuru temizleme önerilir",
      "İpek deterjanı ile soğuk elde yıkayın",
      "Ütü bezini kullanarak düşük ısıda ütüleyin",
      "Dolgulu askıda saklayın"
    ],
    sizes: ["XS", "S", "M", "L"],
    pairsWith: [{ slug: "wide-trouser", name: "Wide Atelier Trouser" }, { slug: "atelier-mini", name: "Atelier Mini" }, { slug: "pleated-midi-skirt", name: "Pleated Midi Skirt" }]
  },
  {
    slug: "pleated-midi-skirt",
    name: "Pleated Midi Skirt",
    name_tr: "Pileli Midi Etek",
    subtitle: "olive wool-blend · sunray pleats",
    subtitle_tr: "zeytin yeşili yün karışımı · güneş ışını pileler",
    price: "€ 450",
    category: "women",
    image: "/images/products/pleated-midi-skirt.png",
    detailImage: "/images/products/pleated-midi-skirt-detail.png",
    story: `Permanent sunray pleats give this skirt extraordinary movement — the kind that catches light as you walk and makes every entrance feel a little cinematic. The olive wool-blend provides enough weight to hold the shape beautifully without feeling heavy.

The pleats are heat-set in a process that takes 48 hours per batch. They won't fall out in the rain, on a plane, or after a full day of sitting. The olive colour was chosen to complement the saffron of the Sun-Up Knit — together they create a colour pairing that feels both modern and timeless.

The concealed side zip sits flush against the body, and the elasticated waistband at the back means it fits comfortably across sizes. We tested it through a full Istanbul fashion week — it didn't wrinkle once.`,
    story_tr: `Kalıcı güneş ışını pileler bu eteğe olağanüstü bir hareket kazandırıyor — yürürken ışığı yakalayan ve her girişi biraz sinematik hissettiren cinsten. Zeytin yeşili yün karışımı, ağır hissettirmeden formu güzelce korumak için yeterli ağırlığı sağlar.

Pileler, parti başına 48 saat süren bir işlemle ısıyla sabitlenir. Yağmurda, uçakta veya tam gün oturduktan sonra bile formunu kaybetmez. Zeytin yeşili rengi, Sun-Up Triko'nun safran tonunu tamamlamak üzere seçilmiştir — birlikte hem modern hem de zamansız hissettiren bir renk eşleşmesi oluştururlar.

Gizli yan fermuar vücuda tam oturur ve arkadaki elastik bel bandı, farklı bedenlere rahatça uyum sağlamasını sağlar. İstanbul moda haftası boyunca test ettik — bir kez bile kırışmadı.`,
    fabric: [{ name: "Merino Wool", percentage: 60 }, { name: "Polyester", percentage: 40 }],
    details: [
      "Permanent sunray pleats — 48-hour heat-set",
      "Concealed side zip with hook closure",
      "Midi length — hits below the knee",
      "Elasticated back waistband for comfort",
      "Fully lined in silk-blend lining",
      "Wrinkle-resistant construction"
    ],
    details_tr: [
      "Kalıcı güneş ışını pileler — 48 saatlik ısı sabitleme",
      "Kancalı gizli yan fermuar",
      "Midi boy — diz altında biter",
      "Konfor için elastik arka bel bandı",
      "İpek karışımlı tam astar",
      "Kırışmaya dayanıklı yapı"
    ],
    care: ["Dry clean only", "Store hanging — never fold", "Steam on low to refresh pleats", "Avoid ironing directly on pleats"],
    care_tr: [
      "Sadece kuru temizleme",
      "Asarak saklayın — asla katlamayın",
      "Pileleri tazelemek için düşük ısıda buhar uygulayın",
      "Doğrudan pilelerin üzerine ütü yapmaktan kaçının"
    ],
    sizes: ["XS", "S", "M", "L"],
    pairsWith: [{ slug: "sun-up-knit", name: "Sun-Up Knit" }, { slug: "draped-silk-blouse", name: "Draped Silk Blouse" }, { slug: "mule-no4", name: "Mule No. 4" }]
  },
  {
    slug: "cashmere-wrap-sweater",
    name: "Cashmere Wrap Sweater",
    name_tr: "Kaşmir Kruvaze Kazak",
    subtitle: "charcoal cashmere · ballet wrap",
    subtitle_tr: "kömür grisi kaşmir · bale kruvaze",
    price: "€ 520",
    category: "women",
    image: "/images/products/cashmere-wrap-sweater.png",
    detailImage: "/images/products/cashmere-wrap-sweater-detail.png",
    story: `Inspired by ballet warm-up gear but executed in pure Mongolian cashmere. The wrap silhouette allows for adjustable fit — cinch it tight for structure or leave it loose for that just-left-rehearsal energy.

The charcoal shade was chosen because it's the colour that works hardest in any wardrobe. It pairs with everything from the saffron Sun-Up pieces to the navy tailoring. The 12-gauge knit is dense enough to hold its shape but soft enough to feel like a second skin.

The side tie closure means no buttons, no zips — just a simple wrap that lets you adjust the neckline from crew to deep V depending on your mood. We added ribbed cuffs that stay put without elastic.`,
    story_tr: `Bale ısınma giysilerinden ilham alan, ancak saf Moğol kaşmiri ile üretilen bir tasarım. Kruvaze siluet, ayarlanabilir bir uyum sağlar — yapı kazandırmak için sıkıca bağlayın ya da provadan yeni çıkmış gibi rahat ve gevşek bırakın.

Kömür grisi tonu, her gardıropta en çok çalışan renk olduğu için seçildi. Safran rengi Sun-Up parçalarından lacivert terzilik ürünlerine kadar her şeyle eşleşir. 12-gauge örgü, formunu koruyacak kadar yoğun ancak ikinci bir ten hissi verecek kadar yumuşaktır.

Yan bağlama detayı düğme veya fermuar gerektirmez — modunuza göre yaka dekoltesini bisiklet yakadan derin V yakaya kadar ayarlamanızı sağlayan basit bir kruvaze yapı sunar. Lastik kullanmadan yerinde duran fitilli manşetler ekledik.`,
    fabric: [{ name: "Mongolian Cashmere", percentage: 100 }],
    details: [
      "Wrap front with side tie closure",
      "12-gauge knit — shape-holding density",
      "Ribbed cuffs and hem — no elastic",
      "Adjustable neckline depth",
      "Flat-locked seams for comfort",
      "Mongolian cashmere — Grade A fibres"
    ],
    details_tr: [
      "Yan bağlamalı kruvaze ön kapama",
      "12-gauge örgü — formunu koruyan yoğunluk",
      "Fitilli manşetler ve etek ucu — lastiksiz tasarım",
      "Ayarlanabilir yaka derinliği",
      "Konfor için düz dikişler",
      "Moğol kaşmiri — Sınıf A lifler"
    ],
    care: ["Hand wash cold with cashmere shampoo", "Reshape and dry flat", "Never hang — knit will stretch", "Store folded with cedar block"],
    care_tr: [
      "Kaşmir şampuanı ile soğuk elde yıkayın",
      "Yeniden şekillendirip düz sererek kurutun",
      "Asla asmayın — örgü esneyecektir",
      "Sedir ağacı bloku ile katlanmış olarak saklayın"
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    pairsWith: [{ slug: "wide-trouser", name: "Wide Atelier Trouser" }, { slug: "atelier-mini", name: "Atelier Mini" }, { slug: "silk-slip-dress", name: "Silk Slip Dress" }]
  },
  {
    slug: "tailored-vest",
    name: "Tailored Vest",
    name_tr: "Tailored Yelek",
    subtitle: "sand linen · tailored fit",
    subtitle_tr: "kum beji keten · tailored kesim",
    price: "€ 280",
    category: "women",
    image: "/images/products/tailored-vest.png",
    detailImage: "/images/products/tailored-vest-detail.png",
    story: `The Tailored Vest can be worn as a top on warm days or layered over the Soft Rules Shirt when the temperature drops. Cut from the same Normandy linen as our Wide Trouser — so the fabric will age in sync if you buy them together.

The five-button front uses the same horn buttons as the Atelier Coat — a small detail that ties the collection together. The welt pockets are hand-finished and sit at exactly the right height for your hands. The adjustable back tab lets you cinch the waist for a more fitted silhouette.

We designed it to be the piece you throw on when a jacket feels like too much. It adds structure without weight, and it photographs beautifully — which, honestly, matters.`,
    story_tr: `Tailored Yelek, sıcak günlerde tek başına bir üst olarak giyilebilir veya sıcaklık düştüğünde Soft Rules Gömlek'in üzerine katmanlanabilir. Wide Atelier Pantolon'umuzla aynı Normandiya keteninden kesilmiştir — böylece birlikte satın alırsanız kumaşlar zamanla aynı tonda yaşlanır.

Beş düğmeli ön kısım, Atelier Palto ile aynı kemik düğmeleri kullanır — koleksiyonu birbirine bağlayan küçük bir detay. Fileto cepler el işçiliğiyle tamamlanmıştır ve elleriniz için tam olarak doğru yükseklikte konumlandırılmıştır. Ayarlanabilir arka kemer kısmı, daha oturan bir siluet için beli büzmenize olanak tanır.

Ceketin fazla hissettirdiği anlar için gardırobun vazgeçilmezi olarak tasarladık. Ağırlık yapmadan yapı kazandırır ve fotoğraflarda son derece şık durur — ki dürüst olmak gerekirse, bu önemlidir.`,
    fabric: [{ name: "French Linen", percentage: 100 }],
    details: [
      "Five-button front with horn buttons",
      "Hand-finished welt pockets",
      "Adjustable back tab for fit",
      "Normandy linen — matching Wide Trouser",
      "Fully lined in cotton voile",
      "Pre-washed for softness"
    ],
    details_tr: [
      "Kemik düğmeli beş düğmeli ön kapama",
      "El işçiliğiyle tamamlanmış fileto cepler",
      "Uyum için ayarlanabilir arka kemer detayı",
      "Normandiya keteni — Wide Atelier Pantolon ile takım",
      "Tamamen pamuk vual astarlı",
      "Yumuşaklık için önceden yıkanmış kumaş"
    ],
    care: ["Dry clean or hand wash cold", "Hang dry — iron while slightly damp", "Linen softens beautifully with each wash", "Store on hanger"],
    care_tr: [
      "Kuru temizleme veya soğuk elde yıkama",
      "Asarak kurutun — hafif nemliyken ütüleyin",
      "Keten her yıkamada güzelce yumuşar",
      "Askıda saklayın"
    ],
    sizes: ["XS", "S", "M", "L"],
    pairsWith: [{ slug: "wide-trouser", name: "Wide Atelier Trouser" }, { slug: "soft-rules-shirt", name: "Soft Rules Shirt" }, { slug: "mule-no4", name: "Mule No. 4" }]
  },

  // --- ACCESSORIES ---
  {
    slug: "leather-belt-no1",
    name: "Leather Belt No. 1",
    name_tr: "Deri Kemer No. 1",
    subtitle: "espresso leather · brass buckle",
    subtitle_tr: "espresso deri · pirinç toka",
    price: "€ 160",
    category: "accessories",
    image: "/images/products/leather-belt-no1.png",
    detailImage: "/images/products/leather-belt-no1-detail.png",
    story: `A simple, perfectly proportioned belt. The brass buckle is cast specifically for SHOLÉ in an Istanbul foundry and will develop a unique patina over time — no two buckles age alike.

The espresso leather matches the Mule No. 4 exactly. It's cut from the same Izmir tannery hide, vegetable-tanned and hand-burnished at the edges. The 25mm width was chosen because it threads through every trouser loop in the collection without looking too thin or too heavy.

This is the kind of belt you buy once and wear for twenty years. The leather darkens, the brass mellows, and somehow it just gets better.`,
    story_tr: `Sade ve mükemmel oranlara sahip bir kemer. Pirinç toka, İstanbul'daki bir dökümhanede SHOLÉ için özel olarak dökülmüştür ve zamanla benzersiz bir patina geliştirecektir — hiçbir iki toka aynı şekilde yaşlanmaz.

Espresso derisi, Mule No. 4 ile tam olarak eşleşir. Aynı İzmir tabakhanesinden elde edilen deriden kesilmiş, bitkisel tabaklanmış ve kenarları el işçiliğiyle parlatılmıştır. 25 mm genişlik, çok ince veya çok ağır görünmeden koleksiyondaki her pantolon köprüsünden geçecek şekilde seçilmiştir.

Bu, bir kez satın alıp yirmi yıl boyunca takacağınız türden bir kemerdir. Deri koyulaşır, pirinç olgunlaşır ve bir şekilde zaman geçtikçe daha da güzelleşir.`,
    fabric: [{ name: "Vegetable-Tanned Leather", percentage: 100 }],
    details: [
      "25mm width — universal trouser fit",
      "Solid brass buckle — SHOLÉ cast",
      "Hand-burnished edges",
      "Izmir tannery leather — matching Mule No. 4",
      "Five adjustment holes",
      "Vegetable-tanned — ages beautifully"
    ],
    details_tr: [
      "25mm genişlik — evrensel pantolon köprüsü uyumu",
      "Masif pirinç toka — SHOLÉ özel döküm",
      "El işçiliğiyle parlatılmış kenarlar",
      "İzmir tabakhanesi derisi — Mule No. 4 ile uyumlu",
      "Beş adet ayar deliği",
      "Bitkisel tabaklanmış deri — zamanla güzelleşir"
    ],
    care: ["Condition with leather balm bi-annually", "Hang or roll — never fold sharply", "Brass will patina naturally", "Wipe with dry cloth"],
    care_tr: [
      "Yılda iki kez deri bakım kremi uygulayın",
      "Asarak veya rulo yaparak saklayın — asla sertçe katlamayın",
      "Pirinç toka zamanla doğal olarak patina kazanacaktır",
      "Kuru bir bezle silin"
    ],
    sizes: ["S", "M", "L"],
    pairsWith: [{ slug: "wide-trouser", name: "Wide Atelier Trouser" }, { slug: "tailored-vest", name: "Tailored Vest" }, { slug: "mule-no4", name: "Mule No. 4" }]
  },
  {
    slug: "oversized-sunglasses",
    name: "Oversized Acetate Sunglasses",
    name_tr: "Oversized Asetat Güneş Gözlüğü",
    subtitle: "tortoiseshell · polarized",
    subtitle_tr: "kaplumbağa kabuğu desenli · polarize",
    price: "€ 280",
    category: "accessories",
    image: "/images/products/oversized-sunglasses.png",
    detailImage: "/images/products/oversized-sunglasses-detail.png",
    story: `Handmade in Italy from premium Mazzucchelli acetate. The oversized square frame offers a cinematic, glamorous silhouette while providing full UV protection through Carl Zeiss polarized lenses.

The tortoiseshell pattern is hand-layered — each pair has a slightly different marbling, which means yours will be one of a kind. The five-barrel hinges are the same mechanism used by heritage Italian eyewear houses, and they're built to withstand years of daily use.

We think of sunglasses as the punctuation mark of an outfit. These are the full stop — bold, definitive, and impossible to ignore.`,
    story_tr: `İtalya'da birinci sınıf Mazzucchelli asetattan el yapımı olarak üretilmiştir. Büyük boy kare çerçeve, Carl Zeiss polarize camlar aracılığıyla tam UV koruması sağlarken sinematik ve büyüleyici bir siluet sunar.

Kaplumbağa kabuğu deseni elle tabakalandırılmıştır — her bir çiftin deseni hafifçe farklıdır, bu da sizinkinin eşsiz olacağı anlamına gelir. Beş milli menteşeler, köklü İtalyan gözlük markalarının kullandığı mekanizmanın aynısıdır ve yıllarca günlük kullanıma dayanacak şekilde üretilmiştir.

Gözlükleri bir kıyafetin noktalama işareti olarak görüyoruz. Bunlar tam nokta — cesur, belirgin ve göz ardı edilmesi imkansız.`,
    fabric: [{ name: "Italian Acetate", percentage: 100 }],
    details: [
      "Carl Zeiss polarized lenses",
      "Five-barrel spring hinges",
      "100% UVA/UVB protection",
      "Mazzucchelli acetate — hand-layered",
      "Includes SHOLÉ leather case",
      "Handmade in Italy"
    ],
    details_tr: [
      "Carl Zeiss polarize camlar",
      "Beş milli yaylı menteşeler",
      "100% UVA/UVB koruması",
      "Mazzucchelli asetat — elle tabakalanmış",
      "SHOLÉ deri kılıf dahildir",
      "İtalya'da el yapımı"
    ],
    care: ["Clean with included microfiber cloth", "Store in leather case when not worn", "Avoid leaving in direct heat", "Rinse with water before wiping"],
    care_tr: [
      "Birlikte verilen mikrofiber bezle temizleyin",
      "Kullanmadığınız zamanlarda deri kılıfında saklayın",
      "Doğrudan ısıda bırakmaktan kaçının",
      "Silmeden önce tozunu almak için suyla durulayın"
    ],
    sizes: ["One Size"],
    pairsWith: [{ slug: "atelier-coat", name: "The Atelier Coat" }, { slug: "sun-up-scarf", name: "Sun-Up Scarf" }, { slug: "atelier-tote", name: "Atelier Tote" }]
  },
  {
    slug: "silk-hair-tie",
    name: "Silk Hair Tie Set",
    name_tr: "İpek Saç Tokası Seti",
    subtitle: "saffron & black · pure silk",
    subtitle_tr: "safran ve siyah · saf ipek",
    price: "€ 65",
    category: "accessories",
    tag: "gift",
    image: "/images/products/silk-hair-tie.png",
    detailImage: "/images/products/silk-hair-tie-detail.png",
    story: `Crafted from offcuts of our Bursa silk to minimise waste — every centimetre of silk that enters the atelier gets used. The saffron matches the Sun-Up Knit and Scarf; the black matches everything else.

Unlike synthetic hair ties, silk doesn't create friction. That means no creasing, no pulling, and no breakage. The internal elastic is gentle enough to hold without squeezing, and the silk covering means it doubles as a wrist accessory.

At €65, it's our most giftable piece — and often someone's first SHOLÉ purchase. We package them in a recycled cotton pouch with a handwritten card from the atelier.`,
    story_tr: `Atıkları en aza indirmek için Bursa ipeklerimizin kumaş artıkları kullanılarak üretilmiştir — atölyeye giren her bir santimetre ipek mutlaka değerlendirilir. Safran tonu Sun-Up Triko ve Eşarp ile; siyah ise koleksiyondaki diğer her şeyle uyum sağlar.

Sentetik saç tokalarının aksine, ipek sürtünme yaratmaz. Bu da saçta iz bırakmama, çekmeme ve kırılma yapmama anlamına gelir. İç lastiği sıkmadan kavrayacak kadar naziktir ve ipek kaplaması sayesinde bilek aksesuarı olarak da kullanılabilir.

65 € fiyatıyla en çok hediye edilen parçamızdır ve genellikle birinin ilk SHOLÉ alışverişidir. Bunları, atölyeden el yazısıyla yazılmış bir kartla birlikte geri dönüştürülmüş pamuklu bir poşette paketliyoruz.`,
    fabric: [{ name: "Mulberry Silk", percentage: 100 }],
    details: [
      "Set of two — saffron and black",
      "Internal gentle elastic",
      "Zero-waste design from silk offcuts",
      "Bursa silk — matching Sun-Up collection",
      "Doubles as wrist accessory",
      "Packaged in recycled cotton pouch"
    ],
    details_tr: [
      "İkili set — safran ve siyah",
      "İç kısımda saç dostu nazik lastik",
      "İpek artıklarından sıfır atık tasarımı",
      "Bursa ipeği — Sun-Up koleksiyonu ile uyumlu",
      "Bilek aksesuarı olarak da kullanılabilir",
      "Geri dönüştürülmüş pamuklu kesede paketlenmiştir"
    ],
    care: ["Hand wash cold with silk detergent", "Air dry flat", "Do not tumble dry", "Store in included pouch"],
    care_tr: [
      "İpek deterjanı ile soğuk elde yıkayın",
      "Düz sererek kurutun",
      "Tamburlu kurutma yapmayın",
      "Birlikte verilen kesesinde saklayın"
    ],
    sizes: ["One Size"],
    pairsWith: [{ slug: "soft-rules-shirt", name: "Soft Rules Shirt" }, { slug: "sun-up-scarf", name: "Sun-Up Scarf" }, { slug: "sun-up-knit", name: "Sun-Up Knit" }]
  },
  {
    slug: "sculptural-cuff",
    name: "Sculptural Brass Cuff",
    name_tr: "Heykelsi Pirinç Kelepçe Bilezik",
    subtitle: "solid brass · hand-cast",
    subtitle_tr: "masif pirinç · el dökümü",
    price: "€ 320",
    category: "accessories",
    image: "/images/products/sculptural-cuff.png",
    detailImage: "/images/products/sculptural-cuff-detail.png",
    story: `A bold, undulating cuff bracelet cast in solid brass by a third-generation jeweller in Istanbul's Grand Bazaar. Each piece is hand-cast using the lost-wax method — a process that takes three days per cuff and produces organic variations that make every piece unique.

Designed to be the only piece of jewellery you need to wear. The sculptural form was inspired by the undulating walls of the atelier's courtyard in Istanbul. It catches light from every angle and looks equally striking on bare skin or over a shirt cuff.

The adjustable fit means it works on any wrist size. Simply squeeze gently to tighten or open. The polished finish will develop a warm patina over time — we encourage it.`,
    story_tr: `İstanbul Kapalıçarşı'da üçüncü kuşak bir kuyumcu ustası tarafından masif pirinçten dökülmüş cesur, dalgalı bir kelepçe bilezik. Her bir parça, kayıp mum yöntemi kullanılarak elde dökülür — bu işlem kelepçe başına üç gün sürer ve her parçayı benzersiz kılan organik varyasyonlar üretir.

Takmanız gereken tek mücevher parçası olacak şekilde tasarlandı. Heykelsi form, atölyenin İstanbul'daki avlusunun dalgalı duvarlarından ilham almıştır. Her açıdan ışığı yakalar ve çıplak ten üzerinde veya gömlek manşetinin üstünde eşit derecede çarpıcı görünür.

Ayarlanabilir yapısı, her bilek ölçüsüne uyum sağladığı anlamına gelir. Sadece hafifçe sıkarak daraltın veya açın. Cilalı yüzey zamanla sıcak bir patina geliştirecektir — bunu özellikle tavsiye ediyoruz.`,
    fabric: [{ name: "Solid Brass", percentage: 100 }],
    details: [
      "Hand-cast in Istanbul — lost-wax method",
      "Polished finish — develops patina",
      "Adjustable fit — squeeze to size",
      "Three-day casting process per piece",
      "Organic variations in each cuff",
      "Weight: 85g — substantial presence"
    ],
    details_tr: [
      "İstanbul'da el dökümü — kayıp mum yöntemi",
      "Cilalı yüzey — zamanla patina kazanır",
      "Ayarlanabilir form — bileğe göre sıkıştırılır",
      "Parça başına üç günlük döküm süreci",
      "Her kelepçede kendine özgü organik varyasyonlar",
      "Ağırlık: 85g — belirgin ve tok duruş"
    ],
    care: ["Polish with brass cleaner when desired", "Patina can be preserved or removed", "Store in included cotton pouch", "Remove before swimming"],
    sizes: ["One Size"],
    pairsWith: [{ slug: "soft-bomber", name: "Soft Bomber" }, { slug: "silk-slip-dress", name: "Silk Slip Dress" }, { slug: "soft-rules-shirt", name: "Soft Rules Shirt" }]
  },
  {
    slug: "mini-crossbody-bag",
    name: "Mini Crossbody Bag",
    name_tr: "Mini Çapraz Çanta",
    subtitle: "camel leather · structured",
    subtitle_tr: "deve tüyü rengi deri · yapılandırılmış form",
    price: "€ 420",
    category: "accessories",
    image: "/images/products/mini-crossbody-bag.png",
    detailImage: "/images/products/mini-crossbody-bag-detail.png",
    story: `A miniature companion to the Atelier Tote. Cut from the same camel leather and made at the same Izmir tannery, it fits just the essentials: phone, cardholder, and keys. Nothing more, nothing less.

The structured shape means it holds its form even when empty — no sad, deflated bag at the end of the night. The magnetic closure opens with one hand, and the suede lining protects your phone screen from scratches.

The adjustable strap lets you wear it as a crossbody or shorten it for a shoulder carry. We designed it for the moments when the Atelier Tote is too much — dinners, galleries, weekends.`,
    story_tr: `Atelier Tote'un minyatür bir eşlikçisi. Aynı deve tüyü rengi deriden kesilmiş ve aynı İzmir tabakhanesinde üretilmiştir; sadece en gerekli eşyalara yer ayırır: telefon, kartlık ve anahtarlar. Ne daha fazla, ne daha az.

Yapılandırılmış formu, çanta boşken bile şeklini korumasını sağlar — gecenin sonunda sönmüş, formu bozulmuş bir çanta görüntüsüne son. Mıknatıslı kapağı tek elle kolayca açılır ve süet astarı telefon ekranınızı çizilmelere karşı korur.

Ayarlanabilir askısı, çapraz çanta olarak takmanıza veya kısaltarak omuzda taşımanıza olanak tanır. Atelier Tote'un fazla gelebileceği anlar için tasarladık — akşam yemekleri, galeriler ve hafta sonları için.`,
    fabric: [{ name: "Full-Grain Leather", percentage: 100 }],
    details: [
      "Magnetic closure — one-hand opening",
      "Adjustable leather strap — crossbody or shoulder",
      "Suede lining — screen-safe",
      "Structured shape — holds form empty",
      "Interior card slot",
      "Izmir tannery — matching Atelier Tote"
    ],
    details_tr: [
      "Mıknatıslı kapama — tek elle açılma kolaylığı",
      "Ayarlanabilir deri askı — çapraz veya omuzda kullanım",
      "Süet astar — ekran korumalı iç yüzey",
      "Yapılandırılmış form — boşken bile şeklini korur",
      "İç kart bölmesi",
      "İzmir tabakhanesi — Atelier Tote ile uyumlu"
    ],
    care: ["Condition with leather balm quarterly", "Stuff with tissue when storing", "Wipe spills immediately", "Leather patina develops naturally"],
    care_tr: [
      "Üç ayda bir deri bakım kremi uygulayın",
      "Saklarken içine kağıt doldurun",
      "Dökülmeleri hemen silin",
      "Deri patinası doğal olarak gelişir"
    ],
    sizes: ["One Size"],
    pairsWith: [{ slug: "atelier-tote", name: "Atelier Tote" }, { slug: "silk-slip-dress", name: "Silk Slip Dress" }, { slug: "soft-bomber", name: "Soft Bomber" }]
  },

  // --- SHOES ---
    {
    slug: "pointed-flat",
    name: "Sleek Slingback Flat",
    name_tr: "Zarif Slingback Babet",
    subtitle: "black calfskin · delicate ankle strap · pointed toe",
    subtitle_tr: "siyah dana derisi · ince bilek bandı · sivri burun",
    price: "€ 340",
    category: "shoes",
    image: "/images/products/pointed-flat.png",
    detailImage: "/images/products/pointed-flat-detail.png",
    story: `The Sleek Slingback Flat is our minimal take on the classic flat. Cut from ultra-soft black calfskin, it features a sharp pointed toe and a delicate ankle strap that secures the foot with sculptural grace. It's the ultimate everyday companion, designed to walk you from morning gallery meetings to evening dinners with absolute ease.

The low-profile stacked heel is designed for continuous wear, and the leather-lined memory foam insole provides unexpected support. A timeless flat that feels completely contemporary.`,
    story_tr: `Zarif Slingback Babet, klasik babet tasarımına minimalist yorumumuzdur. Ultra yumuşak siyah dana derisinden kesilen bu model, keskin sivri burnu ve ayağı heykelsi bir zarafetle saran incecik bilek bandıyla öne çıkar. Sabah galeri toplantılarından akşam yemeklerine kadar size mutlak bir konforla eşlik edecek mükemmel bir günlük tamamlayıcıdır.

Düşük profilli katmanlı topuk, uzun süreli kullanım için tasarlanmıştır ve deri kaplı hafızalı köpük iç taban benzersiz bir destek sunar. Tamamen çağdaş hissettiren, zamansız bir babet.`,
    fabric: [{ name: "Calfskin Leather", percentage: 100 }],
    details: [
      "Ultra-soft black calfskin leather",
      "Delicate ankle strap with micro buckle",
      "Pointed-toe silhouette",
      "15mm stacked leather heel",
      "Memory foam cushioned insole",
      "Blake-stitched leather sole"
    ],
    details_tr: [
      "Ultra yumuşak siyah dana derisi",
      "Mikro tokalı ince bilek bandı",
      "Sivri burunlu siluet",
      "15mm katmanlı deri topuk",
      "Hafızalı köpük destekli iç taban",
      "Blake dikişli deri taban"
    ],
    care: [
      "Apply leather conditioner monthly",
      "Store with shoe trees to maintain shape",
      "Wipe clean with a soft, damp cloth",
      "Allow to rest 24 hours between wears"
    ],
    care_tr: [
      "Ayda bir deri bakım kremi uygulayın",
      "Formunu koruması için ayakkabı kalıbıyla saklayın",
      "Yumuşak, nemli bir bezle silerek temizleyin",
      "Kullanımlar arasında 24 saat dinlendirin"
    ],
    sizes: ["36", "37", "38", "39", "40"],
    pairsWith: [{ slug: "wide-trouser", name: "Wide Atelier Trouser" }, { slug: "pleated-midi-skirt", name: "Pleated Midi Skirt" }, { slug: "silk-slip-dress", name: "Silk Slip Dress" }]
  },
    {
    slug: "strappy-sandal",
    name: "Kitten-Heel Strappy Sandal",
    name_tr: "Zarif İnce Bantlı Sandalet",
    subtitle: "black leather · 35mm kitten heel · delicate straps",
    subtitle_tr: "siyah deri · 35mm ince topuk · zarif bantlar",
    price: "€ 390",
    category: "shoes",
    image: "/images/products/strappy-sandal.png",
    detailImage: "/images/products/strappy-sandal-detail.png",
    story: `A study in delicate proportions. The Kitten-Heel Strappy Sandal features minimal, clean lines that frame the foot with striking simplicity. The low 35mm kitten heel is optimized for elegant movement on any surface, from cobblestones to dance floors.

Crafted from premium black calfskin with a cushioned leather sole, it delivers refined elevation without sacrificing stability. The straps are lined with soft suede to prevent slipping and ensure comfort through long summer nights.`,
    story_tr: `Zarif oranların bir çalışması. İnce Bantlı Sandalet, ayağı çarpıcı bir sadelikle çerçeveleyen minimalist ve temiz çizgilere sahiptir. Düşük 35 mm ince topuk, arnavut kaldırımlardan dans pistlerine kadar her yüzeyde zarif adımlar atmanız için optimize edilmiştir.

Destekli deri tabanlı birinci sınıf siyah dana derisinden üretilen bu model, dengeden ödün vermeden rafine bir yükseklik sunar. Bantların içi, kaymayı önlemek ve uzun yaz geceleri boyunca konfor sağlamak için yumuşak süetle astarlanmıştır.`,
    fabric: [{ name: "Calfskin Leather", percentage: 100 }],
    details: [
      "Premium black calfskin",
      "35mm kitten heel for effortless height",
      "Delicate straps lined with soft suede",
      "Minimalist ankle closure",
      "Foam-cushioned leather insole",
      "Blake-stitched leather sole"
    ],
    details_tr: [
      "Birinci sınıf siyah dana derisi",
      "Zahmetsiz yükseklik sunan 35mm ince topuk",
      "Yumuşak süet astarlı zarif bantlar",
      "Minimalist bilek kapama",
      "Köpük destekli deri iç taban",
      "Blake dikişli deri taban"
    ],
    care: [
      "Wipe clean with a dry cloth",
      "Condition straps gently with leather balm",
      "Store in a dust bag in a cool, dry place",
      "Avoid exposure to water"
    ],
    care_tr: [
      "Kuru bir bezle silerek temizleyin",
      "Bantları deri kremiyle nazikçe nemlendirin",
      "Serin ve kuru bir yerde toz torbasında saklayın",
      "Su ile temastan kaçının"
    ],
    sizes: ["36", "37", "38", "39", "40", "41"],
    pairsWith: [{ slug: "atelier-mini", name: "Atelier Mini" }, { slug: "silk-slip-dress", name: "Silk Slip Dress" }, { slug: "silk-tuxedo-jacket", name: "Silk Tuxedo Jacket" }]
  },
    {
    slug: "tall-leather-boot",
    name: "Seamless Riding Boot",
    name_tr: "Dikişsiz Klasik Deri Çizme",
    subtitle: "black calfskin · zipperless · flat sole",
    subtitle_tr: "siyah dana derisi · fermuarsız · düz taban",
    price: "€ 680",
    category: "shoes",
    image: "/images/products/tall-leather-boot.png",
    detailImage: "/images/products/tall-leather-boot-detail.png",
    story: `The Seamless Riding Boot is built to create a clean, uninterrupted line from hem to floor. By removing all visible zippers and external hardware, we let the premium black calfskin take center stage. The boot's structured shaft holds its shape naturally while remaining soft enough to move with you.

Handcrafted with a durable flat leather sole and a cushioned footbed, it is designed to endure years of wear, developing a beautiful individual character over time.`,
    story_tr: `Dikişsiz Klasik Deri Çizme, etek ucundan yere kadar kesintisiz ve temiz bir hat oluşturmak için tasarlanmıştır. Görünür fermuarları ve dış aksesuarları ortadan kaldırarak, birinci sınıf siyah dana derisinin kalitesini ön plana çıkardık. Çizmenin yapılı gövdesi formunu doğal bir şekilde korurken, adımlarınızla birlikte esneyecek kadar yumuşaktır.

Dayanıklı düz deri taban ve destekli iç tabanla el işçiliğiyle üretilen bu model, yıllarca kullanılmak üzere tasarlanmıştır ve zamanla kendine has güzel bir karakter kazanır.`,
    fabric: [{ name: "Premium Calfskin Leather", percentage: 100 }],
    details: [
      "Seamless upper in soft black calfskin",
      "Zipperless pull-on design",
      "Flat leather sole with protective rubber grip",
      "Cushioned leather insole",
      "Below-knee classic height",
      "Handcrafted in our workshop"
    ],
    details_tr: [
      "Yumuşak siyah dana derisinden dikişsiz saya",
      "Fermuarsız, kolay giyilebilir tasarım",
      "Koruyucu kauçuk eklemeli düz deri taban",
      "Yumuşak dolgulu deri iç taban",
      "Diz altı klasik boy",
      "Atölyemizde el işçiliğiyle üretilmiştir"
    ],
    care: [
      "Use boot trees to maintain shaft shape",
      "Condition the leather seasonally",
      "Wipe clean with a damp cloth after wear",
      "Protect with a waterproofing spray"
    ],
    care_tr: [
      "Gövde formunu korumak için çizme kalıbı kullanın",
      "Mevsimsel olarak deri bakımı uygulayın",
      "Giyim sonrası nemli bir bezle silin",
      "Su geçirmez koruyucu sprey kullanın"
    ],
    sizes: ["37", "38", "39", "40", "41"],
    pairsWith: [{ slug: "atelier-mini", name: "Atelier Mini" }, { slug: "pleated-midi-skirt", name: "Pleated Midi Skirt" }, { slug: "double-breasted-blazer", name: "Double-Breasted Blazer" }]
  },
    {
    slug: "woven-loafer",
    name: "Atelier Smooth Loafer",
    name_tr: "Sade Deri Makosen",
    subtitle: "camel calfskin · clean vamp · stitched leather sole",
    subtitle_tr: "deve tüyü dana derisi · dikişsiz saya · kösele taban",
    price: "€ 460",
    category: "shoes",
    image: "/images/products/woven-loafer.png",
    detailImage: "/images/products/woven-loafer-detail.png",
    story: `The Atelier Smooth Loafer strip downs the traditional loafer to its absolute essence. Completely free of metal hardware, tassels, or heavy stitching, it offers a clean and modern silhouette. Cut from rich camel calfskin, it matches our leather accessories to create a unified aesthetic.

Handcrafted with a hand-stitched welt and a soft leather sole, it molds to your foot with wear, offering the comfort of a slipper with the structure of a dress shoe.`,
    story_tr: `Sade Deri Makosen, geleneksel loafer tasarımını en yalın haline indirger. Metal aksesuarlar, püsküller veya kaba dikişlerden tamamen arındırılmış, temiz ve modern bir siluet sunar. Zengin deve tüyü rengi dana derisinden kesilen bu model, deri aksesuarlarımızla mükemmel bir estetik uyum yakalar.

Elde dikilmiş taban çerçevesi ve yumuşak deri tabanıyla el işçiliğiyle üretilen bu makosen, giyildikçe ayağınızın şeklini alır ve klasik bir ayakkabının şıklığını ev terliği konforuyla birleştirir.`,
    fabric: [{ name: "Calfskin Leather", percentage: 100 }],
    details: [
      "Rich camel calfskin upper",
      "Clean, hardware-free design",
      "Hand-stitched leather sole",
      "Cushioned leather footbed",
      "Soft leather lining",
      "Slip-on construction"
    ],
    details_tr: [
      "Zengin deve tüyü rengi dana derisi",
      "Aksesuarsız, yalın tasarım",
      "Elde dikilmiş deri taban",
      "Yumuşak dolgulu deri iç taban",
      "Yumuşak deri iç astar",
      "Kolay giyilebilir slip-on yapı"
    ],
    care: [
      "Condition gently with leather cream",
      "Store with shoe trees to preserve form",
      "Avoid direct contact with water",
      "Clean with a soft horsehair brush"
    ],
    care_tr: [
      "Deri bakım kremiyle nazikçe nemlendirin",
      "Formunu koruması için ayakkabı kalıbıyla saklayın",
      "Suyla doğrudan temastan kaçının",
      "Yumuşak at kılı fırçayla temizleyin"
    ],
    sizes: ["36", "37", "38", "39", "40"],
    pairsWith: [{ slug: "wide-trouser", name: "Wide Atelier Trouser" }, { slug: "tailored-vest", name: "Tailored Vest" }, { slug: "atelier-tote", name: "Atelier Tote" }]
  },
    {
    slug: "chunky-derby",
    name: "Slim Profile Derby",
    name_tr: "Zarif Klasik Derby",
    subtitle: "black boxcalf · thin leather sole · waxed laces",
    subtitle_tr: "siyah dana derisi · ince kösele taban · vakslı bağcıklar",
    price: "€ 420",
    category: "shoes",
    image: "/images/products/chunky-derby.png",
    detailImage: "/images/products/chunky-derby-detail.png",
    story: `A refined reimagining of the classic derby shoe. Replacing heavy platform soles with a slim, flexible leather sole, the Slim Profile Derby offers an elegant and lightweight silhouette. Cut from premium black boxcalf leather, it features a subtle natural sheen that complements tailored trousers and casual denim alike.

Waxed cotton laces and meticulous stitching define its clean aesthetic, while the cushioned arch support provides comfortable all-day wear.`,
    story_tr: `Klasik derby ayakkabının rafine bir şekilde yeniden yorumlanması. Kaba platform tabanlar yerine ince ve esnek bir deri taban kullanan Zarif Klasik Derby, zarif ve hafif bir siluet sunar. Birinci sınıf siyah dana derisinden kesilen bu model, hem kumaş pantolonları hem de günlük denimleri tamamlayan hafif ve doğal bir cilaya sahiptir.

Vakslı pamuklu bağcıklar ve titiz dikişler bu temiz estetiği tanımlarken, ortopedik kavis destekli iç tabanı gün boyu rahat bir kullanım sağlar.`,
    fabric: [{ name: "Premium Boxcalf Leather", percentage: 100 }],
    details: [
      "Polished black boxcalf leather upper",
      "Slim profile leather sole",
      "Waxed organic cotton laces",
      "Cushioned insole with arch support",
      "Full leather lining",
      "Goodyear welted construction"
    ],
    details_tr: [
      "Cilalı siyah dana derisi üst yüzey",
      "İnce profilli deri taban",
      "Vakslı organik pamuk bağcıklar",
      "Ortopedik destekli yumuşak iç taban",
      "Tamamen deri iç astar",
      "Goodyear welt (çift dikişli) taban yapısı"
    ],
    care: [
      "Polish regularly with black shoe cream",
      "Store with shoe trees when not wearing",
      "Wipe clean with a soft dry cloth",
      "Re-wax laces as needed"
    ],
    care_tr: [
      "Siyah ayakkabı boyası ile düzenli cilalayın",
      "Kullanmadığınızda ayakkabı kalıbıyla saklayın",
      "Yumuşak kuru bezle silerek temizleyin",
      "Gerektiğinde bağcıkları yeniden vakslayın"
    ],
    sizes: ["36", "37", "38", "39", "40", "41"],
    pairsWith: [{ slug: "wide-trouser", name: "Wide Atelier Trouser" }, { slug: "atelier-mini", name: "Atelier Mini" }, { slug: "double-breasted-blazer", name: "Double-Breasted Blazer" }]
  },

  // --- TAILORING ---
  {
    slug: "double-breasted-blazer",
    name: "Double-Breasted Blazer",
    name_tr: "Kruvaze Yün Blazer Ceket",
    subtitle: "navy wool · sharp shoulder",
    subtitle_tr: "lacivert yün · keskin omuz kesimi",
    price: "€ 720",
    category: "tailoring",
    image: "/images/products/double-breasted-blazer.png",
    detailImage: "/images/products/double-breasted-blazer-detail.png",
    story: `The cornerstone of any tailored wardrobe, and the piece that connects SHOLÉ most directly to our vision of computational tailoring. Strong shoulders, a nipped waist, and six horn buttons define this classic blazer, engineered for maximum posture confidence.

The navy wool is from the same Italian mill that supplies some of the world's oldest tailoring houses. The canvas interlining is hand-padded — a technique that takes three times longer than machine fusing but produces a lapel that rolls naturally and improves with wear.

Pair it with the matching Pleated Trousers for a complete suit, or throw it over the Silk Slip Dress for something less expected. Either way, the shoulders will make you stand straighter.`,
    story_tr: `Her terzilik gardırobunun temel taşı ve SHOLÉ'yi hesaplamalı terzilik vizyonumuza en doğrudan bağlayan en özel parça. Maksimum duruş özgüveni için tasarlanan güçlü omuzlar, belirgin bir bel kesimi ve altı adet gerçek boynuz düğme bu klasik blazerı tanımlar.

Lacivert yün kumaş, dünyanın en eski terzilik evlerine de tedarik sağlayan köklü bir İtalyan dokuma atölyesinden temin edilmiştir. İç kısmındaki kıl tela konstrüksiyonu tamamen elde işlenmiştir; bu teknik, makine preslemesine kıyasla üç kat daha fazla zaman alsa da, yakanın doğal bir şekilde dökümlü durmasını sağlar ve giyildikçe vücudun şeklini alarak kusursuzlaşır.

Tam bir takım görünümü için aynı kumaştan üretilen Pileli Yün Pantolon ile eşleştirin veya daha beklenmedik ve modern bir siluet için İpek Kombinezon Elbise'nin üzerine zahmetsizce omuzlarınıza atın. Her iki şekilde de, keskin omuz yapısı duruşunuza asil bir zarafet katacaktır.`,
    fabric: [{ name: "Super 130s Wool", percentage: 100 }],
    details: [
      "Double-breasted with six horn buttons",
      "Peak lapel — hand-padded canvas",
      "Fully lined in Bemberg cupro",
      "Nipped waist with structured shoulder",
      "Interior SHOLÉ label, hand-stitched",
      "Super 130s Italian wool — 280gsm"
    ],
    details_tr: [
      "Altı adet boynuz düğmeli kruvaze tasarım",
      "Kırlangıç yaka — elde işlenmiş geleneksel kıl tela konstrüksiyonu",
      "Tamamen Bemberg kupro astar",
      "Vücuda oturan bel hattı ve yapılandırılmış omuz formu",
      "El dikişiyle tutturulmuş iç SHOLÉ etiketi",
      "Super 130s İtalyan yünü — 280 gsm"
    ],
    care: ["Dry clean only", "Store on padded hanger — never fold", "Steam to refresh between wears", "Brush with garment brush"],
    care_tr: [
      "Yalnızca kuru temizleme yapılması önerilir",
      "Destekli askıda muhafaza edin — asla katlamayın",
      "Giyilme aralarında buhar ile tazeleyin",
      "Narin giysi fırçasıyla düzenli olarak tarayın"
    ],
    sizes: ["XS", "S", "M", "L"],
    pairsWith: [{ slug: "pleated-trousers-navy", name: "Pleated Trousers" }, { slug: "wide-trouser", name: "Wide Atelier Trouser" }, { slug: "silk-slip-dress", name: "Silk Slip Dress" }]
  },
  {
    slug: "pleated-trousers-navy",
    name: "Pleated Trousers",
    name_tr: "Pileli Yün Pantolon",
    subtitle: "navy wool · matching blazer",
    subtitle_tr: "lacivert yün · takım pantolonu",
    price: "€ 440",
    category: "tailoring",
    image: "/images/products/pleated-trousers-navy.png",
    detailImage: "/images/products/pleated-trousers-navy-detail.png",
    story: `Designed to pair perfectly with the Double-Breasted Blazer for a complete suit, or worn separately for an elevated everyday look. The navy wool matches the blazer exactly — sourced from the same Italian mill, dyed in the same batch.

The single pleat gives structure at the waist while allowing the straight leg to fall cleanly. The belt loops are wide enough for a statement belt but proportioned enough to look clean without one.

We think of tailored trousers as the most underrated piece in any wardrobe. They do more work than anything else you own and rarely get the credit.`,
    story_tr: `Kusursuz bir takım silueti için Kruvaze Yün Blazer ile tam uyum sağlamak üzere tasarlanmış ya da günlük şıklığı bir üst seviyeye taşımak için tek başına giyilebilecek özel bir tasarım. Lacivert yün kumaş, blazer ile birebir aynı İtalyan atölyesinden alınmış ve aynı parti boyamayla üretilmiştir; bu sayede renk tonu kusursuzca eşleşir.

Öndeki tek pile, bel hattına yapısal bir duruş kazandırırken düz kesim paçanın aşağıya doğru temiz ve akıcı bir şekilde dökülmesini sağlar. Kemer köprüleri, dikkat çekici genişlikte bir kemeri taşıyacak kadar geniş, ancak kemersiz kullanıldığında da minimalist ve temiz görünecek şekilde oranlanmıştır.

Özel dikim kumaş pantolonları, bir gardırobun hak ettiği değeri en az gören ama en çok emek veren kahramanları olarak görüyoruz. Sahip olduğunuz diğer her şeyden daha fazla işlev görürler ve nadiren övgü alırlar.`,
    fabric: [{ name: "Super 130s Wool", percentage: 100 }],
    details: [
      "Single forward pleat",
      "Straight leg — 26cm hem opening",
      "Wide belt loops",
      "Concealed hook-and-bar closure",
      "Matching Double-Breasted Blazer fabric",
      "Half-lined to the knee"
    ],
    details_tr: [
      "Ön kısımda tek pile detayı",
      "Düz paça kesimi — 26 cm paça genişliği",
      "Geniş kemer köprüleri",
      "Gizli kancalı ve fermuarlı pat kapama",
      "Kruvaze Yün Blazer ile birebir aynı takım kumaşı",
      "Dize kadar yarım astar yapısı"
    ],
    care: ["Dry clean only", "Hang on trouser hanger with clips", "Steam to remove creases", "Avoid over-washing"],
    care_tr: [
      "Yalnızca kuru temizleme yapılması önerilir",
      "Klipsli pantolon askısında muhafaza edin",
      "Kırışıklıkları gidermek için buhar uygulayın",
      "Aşırı yıkamadan kaçının"
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    pairsWith: [{ slug: "double-breasted-blazer", name: "Double-Breasted Blazer" }, { slug: "soft-rules-shirt", name: "Soft Rules Shirt" }, { slug: "pointed-flat", name: "Square-Toe Leather Flat" }]
  },
  {
    slug: "silk-tuxedo-jacket",
    name: "Silk Tuxedo Jacket",
    name_tr: "İpek Smokin Ceketi",
    subtitle: "black silk · satin lapel",
    subtitle_tr: "siyah ipek · saten şal yaka",
    price: "€ 850",
    category: "tailoring",
    tag: "evening",
    image: "/images/products/silk-tuxedo-jacket.png",
    detailImage: "/images/products/silk-tuxedo-jacket-detail.png",
    story: `Evening tailoring at its finest. The contrast between the matte silk body and the glossy satin shawl lapel creates a striking visual that works under candlelight, gallery spots, and camera flashes.

The single button closure keeps the silhouette clean and decisive. The jet pockets sit flat against the body — no flaps, no bulk. The silk is from the same Bursa mill as the Soft Bomber, but in a denser weave that holds the structured shoulder.

We designed it as the piece that replaces the “I have nothing to wear” panic at 7pm. Throw it over the Silk Slip Dress and you're dressed for anything from a private view to a New Year's party.`,
    story_tr: `Akşam şıklığının en asil ve rafine yorumu. Mat ipek gövde ile parlak saten şal yaka arasındaki kontrast, mum ışığında, galeri spotlarında ve flaşlar altında göz alıcı bir görsel zenginlik yaratır.

Tek düğmeli kapama, silueti temiz ve net tutar. Fileto cepler, vücuda tamamen düz oturarak hiçbir potluk yaratmaz. Kullanılan ipek, Soft Bomber ceketimizle aynı Bursa atölyesinden temin edilmiş olup, omuz yapısını ve formunu korumak adına daha yoğun bir dokumayla işlenmiştir.

Bu ceketi, akşam saat yedide yaşanan "ne giyeceğim" paniğine kesin bir çözüm olarak tasarladık. İpek Kombinezon Elbise'nin üzerine giyerek özel bir sergiden yılbaşı davetine kadar her ortama zahmetsizce ve kusursuzca hazır olabilirsiniz.`,
    fabric: [{ name: "Mulberry Silk", percentage: 100 }],
    details: [
      "Satin shawl lapel — high-gloss contrast",
      "Single button closure — matte brass",
      "Jet pockets — flat, no flaps",
      "Fully lined in silk-blend",
      "Structured shoulder with light padding",
      "Bursa silk — dense evening weave"
    ],
    details_tr: [
      "Saten şal yaka — yüksek parlaklıkta kontrast detay",
      "Tek düğmeli kapama — mat pirinç düğme",
      "Fileto cepler — pürüzsüz ve düz form",
      "Tamamen ipek karışımlı astar",
      "Hafif vatkalı, yapılandırılmış omuz formu",
      "Bursa ipeği — yoğun akşam dokuması"
    ],
    care: ["Dry clean only", "Store on padded hanger in garment bag", "Steam on low — avoid direct contact", "Handle satin lapel with care"],
    care_tr: [
      "Yalnızca kuru temizleme yapılması önerilir",
      "Destekli askıda, koruyucu giysi kılıfında saklayın",
      "Düşük ısıda buhar uygulayın — doğrudan temastan kaçının",
      "Saten şal yakaya hassas davranın"
    ],
    sizes: ["XS", "S", "M", "L"],
    pairsWith: [{ slug: "silk-slip-dress", name: "Silk Slip Dress" }, { slug: "strappy-sandal", name: "Minimalist Strappy Sandal" }, { slug: "sculptural-cuff", name: "Sculptural Brass Cuff" }]
  },
  {
    slug: "wool-pencil-skirt",
    name: "Tailored Pencil Skirt",
    name_tr: "Terzilik İşi Yün Kalem Etek",
    subtitle: "charcoal wool · back slit",
    subtitle_tr: "antrasit yün · arka yırtmaç",
    price: "€ 360",
    category: "tailoring",
    image: "/images/products/wool-pencil-skirt.png",
    detailImage: "/images/products/wool-pencil-skirt-detail.png",
    story: `A masterclass in fit. This pencil skirt is engineered to contour the body while allowing comfortable movement via a deep back walking slit. The charcoal wool provides year-round weight — warm enough for autumn, light enough for spring.

The concealed zip sits at the back, keeping the front silhouette completely clean. The elastane blend means it moves with you through a full day of sitting, standing, and walking without losing shape.

Pair it with the Soft Rules Shirt tucked in and the Mule No. 4 for what we call “the meeting outfit” — polished enough to command the room but comfortable enough to forget you're wearing it.`,
    story_tr: `Kalıp ve uyumun başyapıtı. Bu kalem etek, vücut hatlarını mükemmel şekilde saracak şekilde tasarlanmış olup, arkadaki derin yürüme yırtmacıyla rahat hareket imkanı sunar. Antrasit yün kumaş, dört mevsim giyilebilecek ideal bir ağırlığa sahiptir — sonbahar için sıcak tutacak kadar tok, ilkbahar için ise nefes alacak kadar hafiftir.

Arkadaki gizli fermuar, ön silueti tamamen pürüzsüz ve temiz tutar. Elastan karışımı, gün boyu otururken, ayakta dururken ve yürürken formunu kaybetmeden sizinle birlikte esner.

Zahmetsizce asil bir "toplantı stili" için içine yerleştirilmiş Soft Rules Gömlek ve Mule No. 4 ile tamamlayın — odayı yönetebilecek kadar otoriter ve üzerinizde olduğunu unutturacak kadar konforlu.`,
    fabric: [{ name: "Merino Wool", percentage: 95 }, { name: "Elastane", percentage: 5 }],
    details: [
      "Knee length — sits at the natural knee",
      "Deep back walking slit for movement",
      "Concealed back zip with hook-and-eye",
      "Fully lined in viscose for smooth drape",
      "Elastane blend for stretch recovery",
      "Charcoal dye — year-round weight"
    ],
    details_tr: [
      "Diz boyu — doğal diz hizasında oturur",
      "Rahat hareket için derin arka yırtmaç detayı",
      "Gizli arka fermuar ve kopçalı kapama",
      "Kusursuz döküm için tamamen viskon iç astar",
      "Esneklik ve form koruması için elastan karışımı",
      "Antrasit tonu — dört mevsim giyilebilecek dokuma ağırlığı"
    ],
    care: ["Dry clean only", "Iron on medium with pressing cloth", "Hang or fold flat", "Brush with garment brush between wears"],
    care_tr: [
      "Yalnızca kuru temizleme yapılması önerilir",
      "Orta derecede ütü bezli ütüleme yapın",
      "Askıda veya düz sererek muhafaza edin",
      "Giyim aralarında narin giysi fırçasıyla temizleyin"
    ],
    sizes: ["XS", "S", "M", "L"],
    pairsWith: [{ slug: "soft-rules-shirt", name: "Soft Rules Shirt" }, { slug: "draped-silk-blouse", name: "Draped Silk Blouse" }, { slug: "mule-no4", name: "Mule No. 4" }]
  },
  {
    slug: "trench-coat-reimagined",
    name: "The Reimagined Trench",
    name_tr: "Yeniden Yorumlanan Trençkot",
    subtitle: "sand cotton-gabardine · oversized",
    subtitle_tr: "kum rengi pamuk gabardin · oversized kesim",
    price: "€ 940",
    category: "tailoring",
    tag: "bestseller",
    image: "/images/products/trench-coat-reimagined.png",
    detailImage: "/images/products/trench-coat-reimagined-detail.png",
    story: `We took the traditional trench and exaggerated the proportions — wider shoulders, longer hem, deeper pockets. The result is a coat that provides both shelter and style, the kind of piece that makes even a grocery run feel cinematic.

The sand cotton-gabardine is weatherproof without being stiff. It softens with wear and develops the kind of lived-in character that no new coat can replicate. The belted waist allows you to cinch for structure or leave open for drama.

The storm flap isn't just decorative — it actually works. We tested it in Istanbul's November rains. Not a drop got through. It's the coat that started as outerwear and became a wardrobe essential.`,
    story_tr: `Geleneksel trençkot tasarımını ele alıp oranları abarttık — daha geniş omuzlar, daha uzun bir etek ucu ve daha derin cepler. Sonuç; hem rüzgardan koruyan hem de stil sunan, en basit market alışverişini bile sinematik bir ana dönüştüren eşsiz bir dış giyim parçası.

Kum rengi pamuklu gabardin kumaş, sert ve kaba durmadan hava koşullarına dayanıklılık sağlar. Giyildikçe yumuşar ve hiçbir yeni ceketin taklit edemeyeceği, yaşanmışlık kokan asil bir karakter kazanır. Kemerli bel kısmı, yapısal bir duruş için sıkılabilir ya da dökümlü bir drama hissi için açık bırakılabilir.

Rüzgar kanadı sadece dekoratif değildir — gerçekten çalışır. İstanbul'un Kasım yağmurlarında test ettik; tek bir damla bile sızmadı. Dış giyim olarak başlayıp gardırobun vazgeçilmez temel parçasına dönüşen bir ikon.`,
    fabric: [{ name: "Cotton Gabardine", percentage: 100 }],
    details: [
      "Oversized fit — exaggerated proportions",
      "Functional storm flap — rain-tested",
      "Belted waist with horn buckle",
      "Deep patch pockets",
      "Back vent for movement",
      "Cotton gabardine — weatherproof finish"
    ],
    details_tr: [
      "Oversized kalıp — hacimli ve abartılı oranlar",
      "Fonksiyonel rüzgar kanadı — yağmur testi onaylı",
      "Boynuz tokalı kemerli bel hattı",
      "Derin yama cepler",
      "Rahat hareket için arka yırtmaç yapısı",
      "Hava şartlarına dayanıklı apreli pamuk gabardin"
    ],
    care: ["Dry clean only", "Store on padded hanger", "Re-proof with waterproofing spray seasonally", "Steam to refresh between wears"],
    care_tr: [
      "Yalnızca kuru temizleme yapılması önerilir",
      "Destekli askıda muhafaza edin",
      "Mevsimsel olarak su geçirmezlik spreyi ile koruma sağlayın",
      "Giyilme aralarında buhar ile tazeleyin"
    ],
    sizes: ["S", "M", "L"],
    pairsWith: [{ slug: "wide-trouser", name: "Wide Atelier Trouser" }, { slug: "silk-slip-dress", name: "Silk Slip Dress" }, { slug: "pointed-flat", name: "Square-Toe Leather Flat" }]
  },
  {
    slug: "executive-navy-blazer",
    name: "The Executive Blazer",
    name_tr: "Executive Navy Ceket",
    subtitle: "navy wool · tailored fit",
    subtitle_tr: "gece mavisi yün · tailored kesim",
    price: "€ 750",
    category: "tailoring",
    tag: "business",
    image: "/images/products/navy-blazer.png",
    detailImage: "/images/products/navy-blazer-detail.png",
    story: `A blazer that commands the room without shouting. The Executive Blazer was built for the days when you need absolute confidence. Cut from a premium navy wool blend, it offers a slight stretch for comfort through long meetings while maintaining a razor-sharp silhouette.\n\nThe single horn button and structural shoulder are nods to classic tailoring, updated with a modern, slightly elongated profile. Wear it over the Soft Rules Shirt for a boardroom-ready look, or draped over the Silk Slip Dress for evening transitions.`,
    story_tr: `Bağırmadan odaya hakim olan bir ceket. Executive Navy Ceket, mutlak özgüvene ihtiyaç duyduğunuz günler için tasarlandı. Birinci sınıf gece mavisi yün karışımından kesilen kumaşı, keskin siluetini korurken uzun toplantılar boyunca rahatlık için hafif bir esneklik sunar.\n\nTek kemik düğme ve yapılı omuz, klasik terziliğe gönderme yaparken, modern ve biraz uzatılmış profili ile güncellendi. Toplantı salonuna hazır bir görünüm için Soft Rules Gömlek üzerine giyin veya akşam geçişleri için İpek Slip Elbise üzerine atın.`,
    fabric: [
      { name: "Merino Wool", percentage: 95 },
      { name: "Elastane", percentage: 5 },
    ],
    details: [
      "Tailored fit with structured shoulders",
      "Single horn button closure",
      "Flap pockets, hand-finished",
      "Fully lined in breathable cupro",
      "Single back vent for movement",
      "Premium navy wool — 260gsm"
    ],
    details_tr: [
      "Yapılı omuzlarla tailored (özel dikim) kesim",
      "Tek kemik düğmeli ön kapama",
      "El işçiliğiyle tamamlanmış kapaklı cepler",
      "Nefes alabilen kupro tam astar",
      "Hareket için tek arka yırtmaç",
      "Birinci sınıf gece mavisi yün — 260gsm"
    ],
    care: ["Dry clean only", "Store on padded hanger", "Steam to refresh", "Avoid direct heat"],
    care_tr: [
      "Sadece kuru temizleme",
      "Dolgulu askıda saklayın",
      "Tazelemek için buhar uygulayın",
      "Doğrudan ısıdan kaçının"
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    pairsWith: [
      { slug: "navy-tailored-trouser", name: "Navy Tailored Trouser" },
      { slug: "soft-rules-shirt", name: "Soft Rules Shirt" },
      { slug: "mule-no4", name: "Mule No. 4" },
    ],
  },
  {
    slug: "navy-tailored-trouser",
    name: "Navy Tailored Trouser",
    name_tr: "Gece Mavisi Tailored Pantolon",
    subtitle: "navy wool · high waist · straight leg",
    subtitle_tr: "gece mavisi yün · yüksek bel · düz paça",
    price: "€ 420",
    category: "tailoring",
    tag: "business",
    image: "/images/products/navy-trousers.png",
    detailImage: "/images/products/navy-trousers-detail.png",
    story: `The definitive business trouser. We took the high waist of our beloved Wide Trouser and gave it a sharper, straighter leg for the office. The deep navy wool matches the Executive Blazer perfectly, creating a suiting option that feels both authoritative and modern.\n\nThe sharp center crease is permanent, engineered to stay crisp even after international flights. The fabric offers just enough give to be comfortable sitting at a desk all day, while the clean drape visually elongates the leg.`,
    story_tr: `Nihai iş pantolonu. Sevdiğimiz Wide Trouser'ın yüksek belini alıp, ofis için daha keskin, daha düz bir paça ile yeniden yorumladık. Derin gece mavisi yünü, Executive Ceket ile mükemmel uyum sağlayarak hem otoriter hem de modern hissettiren bir takım elbise seçeneği oluşturur.\n\nKeskin ön ütü çizgisi kalıcıdır, uluslararası uçuşlardan sonra bile net kalması için tasarlanmıştır. Kumaş, tüm gün masada otururken rahat olmanız için tam kıvamında bir esneklik sunarken, temiz dökümü bacak boyunu görsel olarak uzatır.`,
    fabric: [
      { name: "Merino Wool", percentage: 95 },
      { name: "Elastane", percentage: 5 },
    ],
    details: [
      "High waist with clean waistband",
      "Straight leg with permanent center crease",
      "Concealed side zip closure",
      "Matching fabric to Executive Blazer",
      "Two back welt pockets",
      "Wrinkle-resistant wool blend"
    ],
    details_tr: [
      "Temiz bel kemerli yüksek bel",
      "Kalıcı ütü çizgili düz paça",
      "Gizli yan fermuar kapama",
      "Executive Ceket ile takım kumaş",
      "İki arka fileto cep",
      "Kırışmaya dayanıklı yün karışımı"
    ],
    care: ["Dry clean recommended", "Hang on trouser hanger", "Press with pressing cloth"],
    care_tr: [
      "Kuru temizleme önerilir",
      "Pantolon askısında asın",
      "Ütü bezi kullanarak ütüleyin"
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    pairsWith: [
      { slug: "executive-navy-blazer", name: "The Executive Blazer" },
      { slug: "soft-rules-shirt", name: "Soft Rules Shirt" },
      { slug: "mule-no4", name: "Mule No. 4" },
    ],
  },
  {
    slug: "briefcase-tote",
    name: "The Briefcase Tote",
    name_tr: "Yapılı Ofis Çantası",
    subtitle: "espresso leather · structured · fits 15\" laptop",
    subtitle_tr: "espresso deri · formunu koruyan · 15\" laptop sığar",
    price: "€ 580",
    category: "accessories",
    tag: "business",
    image: "/images/products/briefcase-tote.png",
    detailImage: "/images/products/briefcase-tote-detail.png",
    story: `When a standard tote is too relaxed, and a traditional briefcase is too stiff, there is the Briefcase Tote. Cut from the same espresso vegetable-tanned leather as our Mule No. 4, it's designed to bring structure and professionalism to your daily carry.\n\nThe minimalist exterior features zero visible hardware, letting the quality of the Izmir-sourced leather speak for itself. It stands on its own thanks to a reinforced base, and the interior is perfectly proportioned to hold a 15" laptop, a notebook, and your essentials without bulging.`,
    story_tr: `Standart bir bez çanta çok rahat, geleneksel bir evrak çantası ise çok sert olduğunda, devreye Briefcase Tote girer. Mule No. 4'ümüzle aynı espresso bitkisel tabaklanmış deriden kesilen bu çanta, günlük taşımalarınıza yapı ve profesyonellik kazandırmak için tasarlandı.\n\nMinimalist dış yüzeyinde hiçbir görünür metal aksesuar yoktur, bu da İzmir kaynaklı derinin kalitesinin kendi adına konuşmasına izin verir. Güçlendirilmiş tabanı sayesinde kendi başına dik durabilir; iç hacmi ise 15 inçlik bir dizüstü bilgisayarı, bir defteri ve temel eşyalarınızı şişkinlik yapmadan alacak şekilde mükemmel orantılanmıştır.`,
    fabric: [
      { name: "Full-Grain Leather", percentage: 100 },
    ],
    details: [
      "Structured silhouette — stands on its own",
      "Fits up to 15\" laptop securely",
      "Vegetable-tanned espresso leather",
      "No visible hardware for minimalist look",
      "Sturdy top handles",
      "Izmir tannery — 3rd generation"
    ],
    details_tr: [
      "Yapılı siluet — kendi başına dik durur",
      "15 inç'e kadar laptop sığar",
      "Bitkisel tabaklanmış espresso deri",
      "Minimalist görünüm için gizli donanım",
      "Dayanıklı üst taşıma sapları",
      "İzmir tabakhanesi — 3. kuşak"
    ],
    care: ["Condition with leather balm quarterly", "Stuff with tissue when not in use", "Keep away from prolonged direct sunlight"],
    care_tr: [
      "Üç ayda bir deri kremi ile besleyin",
      "Kullanılmadığında kağıt ile doldurun",
      "Uzun süre doğrudan güneş ışığından koruyun"
    ],
    sizes: ["One Size"],
    pairsWith: [
      { slug: "executive-navy-blazer", name: "The Executive Blazer" },
      { slug: "navy-tailored-trouser", name: "Navy Tailored Trouser" },
      { slug: "mule-no4", name: "Mule No. 4" },
    ],
  }
];

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getAllSlugs(): string[] {
  return PRODUCTS.map((p) => p.slug);
}

