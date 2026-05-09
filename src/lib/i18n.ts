/* ═══════════════════════════════════════════════════════════════════════
   Basic i18n labels for SHOLÉ — client-side, no framework needed
   ═══════════════════════════════════════════════════════════════════════ */

export type Locale = "en" | "tr" | "de" | "it" | "zh";

export interface Labels {
  announce: string;
  navWomen: string;
  navAccessories: string;
  navShoes: string;
  navTailoring: string;
  navJournal: string;
  askShole: string;
  search: string;
  account: string;
  bag: string;
  heroSubtitle: string;
  heroTagline: string;
  shopChapter: string;
  tryStylist: string;
  collectionTitle: string;
  storyTitle: string;
  aiInviteTitle: string;
  aiInviteDesc: string;
  startConversation: string;
  styleQuiz: string;
  footerNewsletter: string;
  subscribe: string;
  greeting: string;
  voiceGreeting: string;
  welcome: string;
  welcomeDesc: string;
  startVoice: string;
  maybeLater: string;
  connecting: string;
  micPlaceholder: string;
  textPlaceholder: string;
  poweredBy: string;
  uploadPhoto: string;
  tryOnTitle: string;
  selectSize: string;
  sizeLabel: string;
  addToBag: string;
  freeShippingDetail: string;
  theStory: string;
  fabricComposition: string;
  detailsLabel: string;
  careInstructions: string;
  completeTheLook: string;
  pairsBeautifully: string;
  viewProduct: string;
  backToShole: string;
  productNotFound: string;
  imageComing: string;
  shopCol: string;
  stylistCol: string;
  serviceCol: string;
  sararCol: string;
  footerShopItems: string[];
  footerStylistItems: string[];
  footerServiceItems: string[];
  footerSararItems: string[];
  footerEst: string;
  editorial: string;
  theJournal: string;
  chapter01: string;
  newLooksCount: string;
  lookSholeSays: string;
  tryOnWithShole: string;
  sizeRange: string;
  theHouse: string;
  statAtelier: string;
  statTailoring: string;
  statPieces: string;
  meetYourStylist: string;
  chatPreviewUser: string;
  chatPreviewShole: string;
  herosince: string;
  onlineAiStylist: string;
  chatPreviewBubble1: string;
  chatPreviewBubble2: string;
  chatPreviewBubble3: string;
  pressQuote1: string;
  pressQuote2: string;
  pressQuote3: string;
}




const labels: Record<Locale, Labels> = {
  en: {
    announce: "✦ Free shipping over €200 · Meet SHOLÉ — your AI stylist · New drop: late spring 26",
    navWomen: "Women",
    navAccessories: "Accessories",
    navShoes: "Shoes",
    navTailoring: "Tailoring",
    navJournal: "Journal",
    askShole: "Ask SHOLÉ",
    search: "Search",
    account: "Account",
    bag: "Bag",
    heroSubtitle: "Spring / Summer 2026 — Chapter 01",
    heroTagline: "A new chapter from the SARAR atelier. Tailoring that learns your shape, textures that get better with time, and a stylist that actually listens.",
    shopChapter: "Shop the chapter →",
    tryStylist: "Try the stylist",
    collectionTitle: "The soft arrivals.",
    storyTitle: "Three generations of tailors, one very curious AI.",
    aiInviteTitle: "Hi, I'm SHOLÉ. I help you not panic at 8pm.",
    aiInviteDesc: "Tell me what you're going to. Show me the dress you almost bought. Send me a photo — I'll show you how the coat actually fits.",
    startConversation: "Start the conversation →",
    styleQuiz: "Take the style quiz",
    footerNewsletter: "Letters from SHOLÉ — drops, dispatches, and the occasional outfit emergency.",
    subscribe: "Subscribe →",
    greeting: "hi! it's sholé ✦ what are you styling today?",
    voiceGreeting: "Start talking to SHOLÉ",
    welcome: "Meet SHOLÉ",
    welcomeDesc: "Your AI fashion stylist. I can help you find the perfect outfit, suggest combinations, and even show you how things look — just ask!",
    startVoice: "Start Voice Chat",
    maybeLater: "Maybe later",
    connecting: "Connecting...",
    micPlaceholder: "listening...",
    textPlaceholder: "tell sholé what you're styling...",
    poweredBy: "◇ sholé · powered by gemini",
    uploadPhoto: "Send a photo for try-on",
    tryOnTitle: "Virtual Try-On",
    selectSize: "Select size",
    sizeLabel: "Size",
    addToBag: "Add to bag",
    freeShippingDetail: "✦ Free shipping over €200 · Free returns within 14 days",
    theStory: "◇ The story",
    fabricComposition: "◇ Fabric composition",
    detailsLabel: "◇ Details",
    careInstructions: "◇ Care instructions",
    completeTheLook: "◇ Complete the look",
    pairsBeautifully: "Pairs beautifully with",
    viewProduct: "View product →",
    backToShole: "← Back to SHOLÉ",
    productNotFound: "Product not found",
    imageComing: "Image coming soon",
    shopCol: "Shop",
    stylistCol: "Stylist",
    serviceCol: "Service",
    sararCol: "Sarar",
    footerShopItems: ["Women", "Accessories", "Shoes", "Tailoring", "Sale"],
    footerStylistItems: ["Ask SHOLÉ", "Try-on Studio", "Style quiz", "Wishlist"],
    footerServiceItems: ["Shipping", "Returns", "Size guide", "Care"],
    footerSararItems: ["Heritage", "Journal", "Stores", "Sustainability"],
    footerEst: "◇ Est. 1944 — Istanbul / ◇ A SARAR house",
    editorial: "Editorial",
    theJournal: "The Journal",
    chapter01: "Chapter 01",
    newLooksCount: "✦ new — 12 looks",
    lookSholeSays: "look 04 / sholé says",
    tryOnWithShole: "+ try on with sholé",
    sizeRange: "4 colours · xs–xl",
    theHouse: "◇ The house",
    statAtelier: "atelier opened",
    statTailoring: "years of tailoring",
    statPieces: "pieces per chapter",
    meetYourStylist: "Meet your stylist",
    chatPreviewUser: "I have a wedding in Istanbul next month. what's the vibe?",
    chatPreviewShole: "Istanbul weddings are chic but breezy. the atelier coat in terra would be stunning over the silk slip dress.",
    herosince: "— since 1944",
    onlineAiStylist: "online · ai stylist",
    chatPreviewBubble1: "A dinner Friday. not too dressed up. need a dress.",
    chatPreviewBubble2: "got it. weather says 17°C — i'll lean knit. three picks, low-effort, slightly off-duty:",
    chatPreviewBubble3: "want to try one on? send a full-body photo and i'll mock it up.",
    pressQuote1: '"Tailoring with a sense of humour."',
    pressQuote2: '"The AI you actually want around."',
    pressQuote3: '"SARAR\'s most playful chapter yet."',
  },



  tr: {
    announce: "✦ €200 üzeri ücretsiz kargo · SHOLÉ ile tanışın — AI stilistiniz · Yeni koleksiyon: ilkbahar 26",
    navWomen: "Kadın",
    navAccessories: "Aksesuar",
    navShoes: "Ayakkabı",
    navTailoring: "Terzilik",
    navJournal: "Dergi",
    askShole: "SHOLÉ'ye Sor",
    search: "Ara",
    account: "Hesap",
    bag: "Çanta",
    heroSubtitle: "İlkbahar / Yaz 2026 — Bölüm 01",
    heroTagline: "SARAR atölyesinden yeni bir bölüm. Vücudunuzu öğrenen terzilik, zamanla güzelleşen dokular ve gerçekten dinleyen bir stilist.",
    shopChapter: "Koleksiyonu keşfet →",
    tryStylist: "Stilisti dene",
    collectionTitle: "Yumuşak gelenler.",
    storyTitle: "Üç kuşak terzi, bir çok meraklı yapay zeka.",
    aiInviteTitle: "Merhaba, ben SHOLÉ. Akşam 8'de panik yapmamanıza yardım ediyorum.",
    aiInviteDesc: "Nereye gideceğinizi söyleyin. Neredeyse aldığınız elbiseyi gösterin. Bir fotoğraf gönderin — paltonun nasıl durduğunu göstereyim.",
    startConversation: "Sohbete başla →",
    styleQuiz: "Stil testini çöz",
    footerNewsletter: "SHOLÉ'den mektuplar — yeni parçalar, haberler ve ara sıra kıyafet acil durumları.",
    subscribe: "Abone ol →",
    greeting: "merhaba! ben sholé ✦ bugün ne giymek istiyorsun?",
    voiceGreeting: "SHOLÉ ile konuşmaya başla",
    welcome: "SHOLÉ ile Tanışın",
    welcomeDesc: "AI moda stilistiniz. Size mükemmel kıyafeti bulmanıza, kombinler önermenize ve nasıl göründüğünü göstermenize yardımcı olabilirim!",
    startVoice: "Sesli Sohbet Başlat",
    maybeLater: "Belki sonra",
    connecting: "Bağlanıyor...",
    micPlaceholder: "dinliyorum...",
    textPlaceholder: "sholé'ye ne giyeceğini söyle...",
    poweredBy: "◇ sholé · gemini ile güçlendirildi",
    uploadPhoto: "Deneme için fotoğraf gönder",
    tryOnTitle: "Sanal Deneme",
    selectSize: "Beden seçin",
    sizeLabel: "Beden",
    addToBag: "Sepete ekle",
    freeShippingDetail: "✦ €200 üzeri ücretsiz kargo · 14 gün içinde ücretsiz iade",
    theStory: "◇ Hikâye",
    fabricComposition: "◇ Kumaş içeriği",
    detailsLabel: "◇ Detaylar",
    careInstructions: "◇ Bakım talimatları",
    completeTheLook: "◇ Kombini tamamla",
    pairsBeautifully: "Mükemmel uyum sağlar",
    viewProduct: "Ürünü gör →",
    backToShole: "← SHOLÉ'ye dön",
    productNotFound: "Ürün bulunamadı",
    imageComing: "Görsel yakında",
    shopCol: "Mağaza",
    stylistCol: "Stilist",
    serviceCol: "Hizmet",
    sararCol: "Sarar",
    footerShopItems: ["Kadın", "Aksesuar", "Ayakkabı", "Terzilik", "İndirim"],
    footerStylistItems: ["SHOLÉ'ye Sor", "Deneme Stüdyosu", "Stil Testi", "Favoriler"],
    footerServiceItems: ["Kargo", "İade", "Beden Rehberi", "Bakım"],
    footerSararItems: ["Miras", "Dergi", "Mağazalar", "Sürdürülebilirlik"],
    footerEst: "◇ 1944'ten beri — İstanbul / ◇ Bir SARAR evi",
    editorial: "Editöryal",
    theJournal: "Dergi",
    chapter01: "Bölüm 01",
    newLooksCount: "✦ yeni — 12 görünüm",
    lookSholeSays: "görünüm 04 / sholé diyor ki",
    tryOnWithShole: "+ sholé ile dene",
    sizeRange: "4 renk · xs–xl",
    theHouse: "◇ Moda evi",
    statAtelier: "atölye açıldı",
    statTailoring: "yıllık terzilik mirası",
    statPieces: "parça her bölümde",
    meetYourStylist: "Stilistinizle tanışın",
    chatPreviewUser: "Gelecek ay İstanbul'da bir düğünüm var. Ortam nasıl?",
    chatPreviewShole: "İstanbul düğünleri şık ama havadardır. Terra rengi atelier palto, ipek slip elbise üzerine harika durur.",
    herosince: "— 1944'ten beri",
    onlineAiStylist: "çevrimiçi · ai stilist",
    chatPreviewBubble1: "Cuma akşamı bir akşam yemeği. Çok abartılı değil. Bir elbiseye ihtiyacım var.",
    chatPreviewBubble2: "Anlaşıldı. Hava 17°C — triko ağırlıklı gideceğim. Üç seçim, zahmetsiz ve şık:",
    chatPreviewBubble3: "Birini denemek ister misin? Tam boy bir fotoğraf gönder, hemen üzerine giydireyim.",
    pressQuote1: '"Mizah anlayışı olan terzilik."',
    pressQuote2: '"Gerçekten yanınızda olmasını isteyeceğiniz yapay zeka."',
    pressQuote3: '"SARAR\'ın şimdiye kadarki en eğlenceli bölümü."',
  },



  de: {
    announce: "✦ Kostenloser Versand ab €200 · Lernen Sie SHOLÉ kennen — Ihr AI-Stylist · Neue Kollektion: Frühling 26",
    navWomen: "Damen",
    navAccessories: "Accessoires",
    navShoes: "Schuhe",
    navTailoring: "Schneiderei",
    navJournal: "Journal",
    askShole: "SHOLÉ fragen",
    heroSubtitle: "Frühling / Sommer 2026 — Kapitel 01",
    heroTagline: "Ein neues Kapitel aus dem SARAR-Atelier. Schneiderei, die Ihre Form lernt, Texturen, die mit der Zeit besser werden.",
    shopChapter: "Kollektion entdecken →",
    tryStylist: "Stylist ausprobieren",
    collectionTitle: "Die sanften Ankömmlinge.",
    storyTitle: "Drei Generationen Schneider, eine sehr neugierige KI.",
    aiInviteTitle: "Hi, ich bin SHOLÉ. Ich helfe Ihnen, um 20 Uhr nicht in Panik zu geraten.",
    aiInviteDesc: "Sagen Sie mir, wohin Sie gehen. Zeigen Sie mir das Kleid, das Sie fast gekauft hätten. Schicken Sie ein Foto.",
    startConversation: "Gespräch starten →",
    styleQuiz: "Stil-Quiz machen",
    footerNewsletter: "Briefe von SHOLÉ — neue Teile, Nachrichten und gelegentliche Outfit-Notfälle.",
    subscribe: "Abonnieren →",
    greeting: "hallo! ich bin sholé ✦ was stylen wir heute?",
    voiceGreeting: "Sprechen Sie mit SHOLÉ",
    welcome: "Lernen Sie SHOLÉ kennen",
    welcomeDesc: "Ihr AI-Mode-Stylist. Ich helfe Ihnen, das perfekte Outfit zu finden und Kombinationen vorzuschlagen!",
    startVoice: "Sprachhat starten",
    maybeLater: "Vielleicht später",
    connecting: "Verbinde...",
    micPlaceholder: "höre zu...",
    textPlaceholder: "sagen Sie sholé, was Sie stylen...",
    poweredBy: "◇ sholé · powered by gemini",
    uploadPhoto: "Foto für Anprobe senden",
    tryOnTitle: "Virtuelle Anprobe",
  },
  it: {
    announce: "✦ Spedizione gratuita oltre €200 · Incontra SHOLÉ — il tuo stilista AI · Nuova collezione: primavera 26",
    navWomen: "Donna",
    navAccessories: "Accessori",
    navShoes: "Scarpe",
    navTailoring: "Sartoria",
    navJournal: "Diario",
    askShole: "Chiedi a SHOLÉ",
    heroSubtitle: "Primavera / Estate 2026 — Capitolo 01",
    heroTagline: "Un nuovo capitolo dall'atelier SARAR. Sartoria che impara la tua forma, tessuti che migliorano con il tempo.",
    shopChapter: "Scopri la collezione →",
    tryStylist: "Prova lo stilista",
    collectionTitle: "I morbidi arrivi.",
    storyTitle: "Tre generazioni di sarti, un'AI molto curiosa.",
    aiInviteTitle: "Ciao, sono SHOLÉ. Ti aiuto a non andare nel panico alle 20.",
    aiInviteDesc: "Dimmi dove stai andando. Mostrami il vestito che quasi hai comprato. Mandami una foto.",
    startConversation: "Inizia la conversazione →",
    styleQuiz: "Fai il quiz di stile",
    footerNewsletter: "Lettere da SHOLÉ — nuovi pezzi, notizie e occasionali emergenze outfit.",
    subscribe: "Iscriviti →",
    greeting: "ciao! sono sholé ✦ cosa stiliamo oggi?",
    voiceGreeting: "Parla con SHOLÉ",
    welcome: "Incontra SHOLÉ",
    welcomeDesc: "Il tuo stilista AI di moda. Posso aiutarti a trovare l'outfit perfetto e suggerire combinazioni!",
    startVoice: "Avvia Chat Vocale",
    maybeLater: "Forse dopo",
    connecting: "Connessione...",
    micPlaceholder: "ascolto...",
    textPlaceholder: "di' a sholé cosa stai preparando...",
    poweredBy: "◇ sholé · powered by gemini",
    uploadPhoto: "Invia foto per prova",
    tryOnTitle: "Prova Virtuale",
  },
  zh: {
    announce: "✦ 超过€200免费配送 · 认识SHOLÉ — 您的AI造型师 · 新系列：2026春季",
    navWomen: "女装",
    navAccessories: "配饰",
    navShoes: "鞋履",
    navTailoring: "定制",
    navJournal: "日志",
    askShole: "问SHOLÉ",
    heroSubtitle: "2026春夏 — 第一章",
    heroTagline: "来自SARAR工坊的新篇章。学习您身材的裁剪，随时间变好的质感，以及真正倾听的造型师。",
    shopChapter: "浏览系列 →",
    tryStylist: "试试造型师",
    collectionTitle: "柔软的新品。",
    storyTitle: "三代裁缝，一个非常好奇的AI。",
    aiInviteTitle: "你好，我是SHOLÉ。帮你在晚上8点不慌张。",
    aiInviteDesc: "告诉我你要去哪里。给我看你差点买的那件衣服。发张照片给我。",
    startConversation: "开始对话 →",
    styleQuiz: "做风格测试",
    footerNewsletter: "来自SHOLÉ的信 — 新品、资讯和偶尔的穿搭紧急情况。",
    subscribe: "订阅 →",
    greeting: "你好！我是sholé ✦ 今天想搭配什么？",
    voiceGreeting: "和SHOLÉ说话",
    welcome: "认识SHOLÉ",
    welcomeDesc: "您的AI时尚造型师。我可以帮您找到完美的搭配，建议组合！",
    startVoice: "开始语音聊天",
    maybeLater: "以后再说",
    connecting: "连接中...",
    micPlaceholder: "正在听...",
    textPlaceholder: "告诉sholé你想穿什么...",
    poweredBy: "◇ sholé · 由gemini驱动",
    uploadPhoto: "发送照片试穿",
    tryOnTitle: "虚拟试穿",
  },
};

export function getLabels(locale: Locale): Labels {
  return labels[locale] || labels.en;
}

export const SUPPORTED_LOCALES: Locale[] = ["en", "tr", "de", "it", "zh"];
export const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
  tr: "Türkçe",
  de: "Deutsch",
  it: "Italiano",
  zh: "中文",
};
