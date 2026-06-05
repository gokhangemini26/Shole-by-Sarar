export interface Article {
  slug: string;
  title: string;
  title_tr?: string;
  date: string;
  category: string;
  category_tr?: string;
  image: string;
  excerpt: string;
  excerpt_tr?: string;
  content: string[];
  content_tr?: string[];
  suggestedProducts?: string[];
}

export const ARTICLES: Article[] = [
  {
    slug: "the-art-of-soft-tailoring",
    title: "The Art of Soft Tailoring",
    title_tr: "Yumuşak Terzilik Sanatı",
    date: "May 10, 2026",
    category: "Style",
    category_tr: "Stil",
    image: "/images/products/atelier-coat.png",
    excerpt: "How comfort and elegance blend in modern tailoring. Exploring structural draping and fluid shapes.",
    excerpt_tr: "Konfor ve zarafetin modern terzilikte buluşması. Yapılandırılmış dökümler ve akıcı formları keşfediyoruz.",
    content: [
      "Soft tailoring represents a departure from rigid silhouettes towards fluidity and comfort. At SHOLÉ, we believe clothes should move with you, not restrict you.",
      "The combination of structured shoulders and relaxed cuts creates a contemporary wardrobe that works in any setting. It's about styling key pieces in a way that feels effortless yet polished.",
      "For a perfect demonstration of this philosophy, pair the structured Atelier Coat with a relaxed pair of trousers or a sleek flat. It strikes the perfect balance between form and function."
    ],
    content_tr: [
      "Yumuşak terzilik, sert silüetlerden uzaklaşıp akıcılık ve konfora yönelimi temsil eder. SHOLÉ olarak biz, kıyafetlerin sizi sınırlamak yerine sizinle birlikte hareket etmesi gerektiğine inanıyoruz.",
      "Yapılandırılmış omuzlar ile rahat kesimlerin birleşimi, her ortama uyum sağlayan çağdaş bir gardırop yaratır. Temel parçaları zahmetsiz ama şık bir şekilde bir araya getirmek anahtardır.",
      "Bu felsefenin mükemmel bir örneği için, yapılandırılmış Atelier Palto'yu rahat kesimli bir pantolon veya zarif bir babetle birleştirin. Form ve işlev arasındaki mükemmel dengeyi yakalayacaksınız."
    ],
    suggestedProducts: ["atelier-coat", "double-breasted-blazer", "pointed-flat"]
  },
  {
    slug: "behind-the-virtual-try-on",
    title: "Behind the Virtual Try-On",
    title_tr: "Sanal Denemenin Arkası",
    date: "May 20, 2026",
    category: "Technology",
    category_tr: "Teknoloji",
    image: "/images/products/sun-up-knit.png",
    excerpt: "How neural networks and spatial computing are changing how we interact with fabric and fit.",
    excerpt_tr: "Yapay sinir ağları ve mekansal bilişimin kumaş dokusu ve kalıpla olan etkileşimimizi nasıl değiştirdiğini inceliyoruz.",
    content: [
      "Virtual try-on technology is more than just a digital overlay. It's a complex simulation of how fabric drapes, stretches, and reflects light based on unique physical parameters.",
      "By integrating neural networks with high-fidelity modeling, SHOLÉ allows you to visualize garments on your body with incredible accuracy, eliminating fitting uncertainty.",
      "Whether trying on our Sun-Up Knit or the fluid Silk Slip Dress, the simulation respects the weave weight and composition to present a true-to-life representation of fit."
    ],
    content_tr: [
      "Sanal deneme teknolojisi, dijital bir görsel giydirmeden çok daha fazlasıdır. Kumaşın fiziksel parametrelere göre nasıl döküldüğünü, esnediğini ve ışığı nasıl yansıttığını gösteren karmaşık bir simülasyondur.",
      "SHOLÉ, yapay sinir ağlarını yüksek kaliteli modellemeyle entegre ederek, kıyafetlerin vücudunuzda nasıl duracağını yüksek doğrulukla görmenizi sağlar ve beden tereddütlerini ortadan kaldırır.",
      "Sun-Up Triko'muzu veya dökümlü İpek Slip Elbise'yi denerken, simülasyon kumaşın örgü ağırlığına ve bileşimine sadık kalarak kalıbın gerçekçi bir sunumunu yapar."
    ],
    suggestedProducts: ["sun-up-knit", "silk-slip-dress"]
  },
  {
    slug: "executive-minimalism",
    title: "Executive Minimalism",
    title_tr: "Yönetici Minimalizmi",
    date: "June 02, 2026",
    category: "Lifestyle",
    category_tr: "Yaşam",
    image: "/images/products/navy-blazer.png",
    excerpt: "Streamlining your choices in life and wardrobe. Finding clarity through high-quality essentials.",
    excerpt_tr: "Yaşamda ve gardırobunuzda seçimlerinizi sadeleştirmek. Yüksek kaliteli temel parçalarla zihin netliğine ulaşmak.",
    content: [
      "Executive minimalism is about focusing on what truly matters. In a world of constant distractions, simplifying your daily wardrobe decisions offers a unique sense of clarity and focus.",
      "A capsule wardrobe of premium essentials — like our Navy Blazer and Tailored Trousers — removes decision fatigue, allowing you to focus your energy on your work and life.",
      "Pair these structured items with our Slim Profile Derby for a polished, modern uniform that transitions effortlessly from executive meetings to off-duty social evenings."
    ],
    content_tr: [
      "Yönetici minimalizmi, gerçekten önemli olana odaklanmakla ilgilidir. Sürekli dikkat dağıtıcı unsurlarla dolu bir dünyada, günlük gardırop kararlarınızı basitleştirmek benzersiz bir netlik ve odaklanma sunar.",
      "Lacivert Blazer ve Tailored Pantolon gibi birinci sınıf temel parçalardan oluşan kapsül bir gardırop, karar yorgunluğunu ortadan kaldırır ve enerjinizi işinize ve yaşamınıza odaklamanıza olanak tanır.",
      "Bu yapılandırılmış parçaları Zarif Klasik Derby ile tamamlayarak, yönetim kurulu toplantılarından akşam sosyal etkinliklerine zahmetsizce geçiş yapan, modern bir üniforma yaratın."
    ],
    suggestedProducts: ["navy-blazer", "navy-trousers", "chunky-derby"]
  }
];

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}
