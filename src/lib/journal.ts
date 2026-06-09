export interface Article {
  slug: string;
  title: string;
  title_tr?: string;
  title_de?: string;
  title_it?: string;
  date: string;
  category: string;
  category_tr?: string;
  category_de?: string;
  category_it?: string;
  image: string;
  excerpt: string;
  excerpt_tr?: string;
  excerpt_de?: string;
  excerpt_it?: string;
  content: string[];
  content_tr?: string[];
  content_de?: string[];
  content_it?: string[];
  suggestedProducts?: string[];
}

export const ARTICLES: Article[] = [
  {
    slug: "the-art-of-soft-tailoring",
    title: "The Art of Soft Tailoring",
    title_tr: "Yumuşak Terzilik Sanatı",
    title_de: "Die Kunst der weichen Schneiderkunst",
    title_it: "L'arte della sartoria morbida",
    date: "May 10, 2026",
    category: "Style",
    category_tr: "Stil",
    category_de: "Stil",
    category_it: "Stile",
    image: "/images/products/atelier-coat.png",
    excerpt: "How comfort and elegance blend in modern tailoring. Exploring structural draping and fluid shapes.",
    excerpt_tr: "Konfor ve zarafetin modern terzilikte buluşması. Yapılandırılmış dökümler ve akıcı formları keşfediyoruz.",
    excerpt_de: "Wie sich Komfort und Eleganz in moderner Schneiderkunst verbinden. Strukturierte Drapierungen und fließende Formen entdecken.",
    excerpt_it: "Come il comfort e l'eleganza si fondono nella sartoria moderna. Esplorando drappeggi strutturati e forme fluide.",
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
    content_de: [
      "Weiche Schneiderkunst stellt eine Abkehr von starren Silhouetten hin zu Fließfähigkeit und Komfort dar. Wir bei SHOLÉ glauben, dass Kleidung sich mit Ihnen bewegen sollte, anstatt Sie einzuschränken.",
      "Die Kombination aus strukturierten Schultern und entspannten Schnitten schafft eine zeitgemäße Garderobe, die in jeder Umgebung funktioniert. Es geht darum, Schlüsselstücke so zu stylen, dass es mühelos und dennoch elegant wirkt.",
      "Um diese Philosophie perfekt zu demonstrieren, kombinieren Sie den strukturierten Atelier-Mantel mit einer locker geschnittenen Hose oder flachen Schuhen. So entsteht das perfekte Gleichgewicht zwischen Form und Funktion."
    ],
    content_it: [
      "La sartoria morbida rappresenta un allontanamento dalle siluette rigide verso la fluidità e il comfort. Presso SHOLÉ, crediamo che gli abiti debbano muoversi con te, non limitarti.",
      "La combinazione di spalle strutturate e tagli rilassati crea un guardaroba contemporaneo adatto a ogni situazione. Si tratta di abbinare capi chiave in modo naturale ma elegante.",
      "Per una perfetta dimostrazione di questa filosofia, abbina il Cappotto Atelier strutturato con un paio di pantaloni morbidi o una scarpa piatta elegante. Trova il perfetto equilibrio tra forma e funzione."
    ],
    suggestedProducts: ["atelier-coat", "double-breasted-blazer", "pointed-flat"]
  },
  {
    slug: "behind-the-virtual-try-on",
    title: "Behind the Virtual Try-On",
    title_tr: "Sanal Denemenin Arkası",
    title_de: "Hinter den Kulissen der virtuellen Anprobe",
    title_it: "Dietro la prova virtuale",
    date: "May 20, 2026",
    category: "Technology",
    category_tr: "Teknoloji",
    category_de: "Technologie",
    category_it: "Tecnologia",
    image: "/images/products/sun-up-knit.png",
    excerpt: "How neural networks and spatial computing are changing how we interact with fabric and fit.",
    excerpt_tr: "Yapay sinir ağları ve mekansal bilişimin kumaş dokusu ve kalıpla olan etkileşimimizi nasıl değiştirdiğini inceliyoruz.",
    excerpt_de: "Wie neurale Netze und räumliches Computing unsere Interaktion mit Stoffen und Passformen verändern.",
    excerpt_it: "Come le reti neurali e il computing spaziale stanno cambiando il nostro modo di interagire con i tessuti e la vestibilità.",
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
    content_de: [
      "Die Technologie der virtuellen Anprobe ist mehr als nur eine digitale Überlagerung. Es ist eine komplexe Simulation, wie Stoffe fallen, sich dehnen und Licht basierend auf einzigartigen physikalischen Parametern reflektieren.",
      "Durch die Integration neuronaler Netze mit hochauflösender Modellierung ermöglicht SHOLÉ Ihnen, Kleidungsstücke mit unglaublicher Genauigkeit an Ihrem Körper zu visualisieren und Unsicherheiten bei der Passform zu beseitigen.",
      "Egal, ob Sie unser Sun-Up-Strickoberteil oder das fließende Seiden-Slipkleid anprobieren, die Simulation berücksichtigt Webart, Gewicht und Zusammensetzung, um eine lebensechte Darstellung der Passform zu liefern."
    ],
    content_it: [
      "La tecnologia di prova virtuale è molto più di una semplice sovrapposizione digitale. Si tratta di una simulazione complessa di come il tessuto cade, si tende e riflette la luce in base a parametri fisici unici.",
      "Integrando le reti neurali con una modellazione ad alta fedeltà, SHOLÉ ti permette di visualizzare i capi sul tuo corpo con un'accuratezza incredibile, eliminando l'incertezza sulla taglia.",
      "Che si tratti di provare la nostra maglia Sun-Up o il fluido abito slip in seta, la simulazione rispetta il peso della trama e la composizione per offrire una rappresentazione realistica della vestibilità."
    ],
    suggestedProducts: ["sun-up-knit", "silk-slip-dress"]
  },
  {
    slug: "executive-minimalism",
    title: "Executive Minimalism",
    title_tr: "Yönetici Minimalizmi",
    title_de: "Executive Minimalismus",
    title_it: "Minimalismo Executive",
    date: "June 02, 2026",
    category: "Lifestyle",
    category_tr: "Yaşam",
    category_de: "Lifestyle",
    category_it: "Stile di vita",
    image: "/images/products/navy-blazer.png",
    excerpt: "Streamlining your choices in life and wardrobe. Finding clarity through high-quality essentials.",
    excerpt_tr: "Yaşamda ve gardırobunuzda seçimlerinizi sadeleştirmek. Yüksek kaliteli temel parçalarla zihin netliğine ulaşmak.",
    excerpt_de: "Auswahl im Leben und in der Garderobe vereinfachen. Klarheit durch hochwertige Basics finden.",
    excerpt_it: "Semplificare le scelte di vita e di guardaroba. Trovare chiarezza attraverso elementi essenziali di alta qualità.",
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
    content_de: [
      "Bei Executive Minimalismus geht es darum, sich auf das zu konzentrieren, was wirklich wichtig ist. In einer Welt ständiger Ablenkungen bietet die Vereinfachung Ihrer täglichen Garderobenentscheidungen ein einzigartiges Gefühl von Klarheit und Fokus.",
      "Eine Kapselgarderobe aus hochwertigen Basics – wie unserem Navy-Blazer und der maßgeschneiderten Hose – nimmt Ihnen die Entscheidungsfindung ab und lässt Sie Ihre Energie auf Arbeit und Leben konzentrieren.",
      "Kombinieren Sie diese strukturierten Teile mit unseren flachen Derby-Schuhen für eine elegante, moderne Uniform, die mühelos von Vorstandsbesprechungen zu entspannten Abenden übergeht."
    ],
    content_it: [
      "Il minimalismo executive consiste nel concentrarsi su ciò che conta davvero. In un mondo di continue distrazioni, semplificare le decisioni quotidiane sul guardaroba offre un senso unico di chiarezza e concentrazione.",
      "Un guardaroba capsula di capi essenziali di qualità — come il nostro Blazer Navy e i Pantaloni Sartoriali — elimina la stanchezza decisionale, consentendoti di concentrare le tue energie sul lavoro e sulla vita.",
      "Abbina questi articoli strutturati con le nostre scarpe Derby dal profilo sottile per una divisa elegante e moderna che passa senza sforzo dalle riunioni di lavoro alle serate sociali libere."
    ],
    suggestedProducts: ["navy-blazer", "navy-trousers", "chunky-derby"]
  }
];

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}
