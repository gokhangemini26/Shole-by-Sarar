/* ═══════════════════════════════════════════════════════════════════════
   Basic i18n labels for SHOLÉ — client-side, no framework needed
   ═══════════════════════════════════════════════════════════════════════ */

export type Locale = "en" | "tr";

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
  logout: string;
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
  sholeCol: string;
  footerShopItems: string[];
  footerStylistItems: string[];
  footerServiceItems: string[];
  footerSholeItems: string[];
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
  introRec: string;
  introSkip: string;
  introLocation: string;
  introDesc: string;
  introCue: string;
  introEnter: string;
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
    account: "Member Login",
    logout: "Logout",
    bag: "Bag",
    heroSubtitle: "Spring / Summer 2026 — Chapter 01",
    heroTagline: "The future of tailoring. A digital-first atelier where neural networks meet master craftsmanship, fabric learns your movements, and your AI stylist is always by your side.",
    shopChapter: "Shop the chapter →",
    tryStylist: "Try the stylist",
    collectionTitle: "The soft arrivals.",
    storyTitle: "Code, thread, and the era of autonomous luxury.",
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
    sholeCol: "SHOLÉ",
    footerShopItems: ["Women", "Accessories", "Shoes", "Tailoring", "Sale"],
    footerStylistItems: ["Ask SHOLÉ", "Try-on Studio", "Style quiz", "Wishlist"],
    footerServiceItems: ["Shipping", "Returns", "Size guide", "Care"],
    footerSholeItems: ["Digital Atelier", "Modernity", "Innovation", "Virtual Runway"],
    footerEst: "◇ SHOLÉ Digital Atelier — Est. 2026 / ◇ Fully Autonomous AI House",
    editorial: "Editorial",
    theJournal: "The Journal",
    chapter01: "Chapter 01",
    newLooksCount: "✦ new — 12 looks",
    lookSholeSays: "look 04 / sholé says",
    tryOnWithShole: "+ try on with sholé",
    sizeRange: "4 colours · xs–xl",
    theHouse: "◇ The house",
    statAtelier: "fully digital since",
    statTailoring: "AI styling accuracy",
    statPieces: "real-time personalization",
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
    pressQuote3: '"A masterclass in modern digital fashion."',
    introRec: "rec · chapter 01 · sholé sees you",
    introSkip: "skip ↗",
    introLocation: "SHOLÉ Digital · Istanbul · est. 2026",
    introDesc: "step inside —<br />the door's been left open for you.",
    introCue: "◇ ss26 — chapter 01<br />directed by sholé ✦ ai stylist in residence",
    introEnter: "enter the atelier",
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
    account: "Üye Girişi",
    logout: "Çıkış",
    bag: "Sepetim",
    heroSubtitle: "İlkbahar / Yaz 2026 — Bölüm 01",
    heroTagline: "Terziliğin geleceği. Yapay sinir ağları ile usta zanaatkarlığın buluştuğu, kumaşın hareketlerinizi öğrendiği ve AI stilistinizin her an yanınızda olduğu dijital öncelikli bir atölye.",
    shopChapter: "Koleksiyonu keşfet →",
    tryStylist: "Stilisti dene",
    collectionTitle: "Yeni koleksiyonumuzdan parçalar",
    storyTitle: "Kod, iplik ve otonom lüksün yeni dönemi.",
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
    sholeCol: "SHOLÉ",
    footerShopItems: ["Kadın", "Aksesuar", "Ayakkabı", "Terzilik", "İndirim"],
    footerStylistItems: ["SHOLÉ'ye Sor", "Deneme Stüdyosu", "Stil Testi", "Favoriler"],
    footerServiceItems: ["Kargo", "İade", "Beden Rehberi", "Bakım"],
    footerSholeItems: ["Dijital Atölye", "Modernite", "İnovasyon", "Sanal Defile"],
    footerEst: "◇ SHOLÉ Dijital Atölye — Krl. 2026 / ◇ Tam Otonom Yapay Zeka Evi",
    editorial: "Editöryal",
    theJournal: "Dergi",
    chapter01: "Bölüm 01",
    newLooksCount: "✦ yeni — 12 görünüm",
    lookSholeSays: "görünüm 04 / sholé diyor ki",
    tryOnWithShole: "+ sholé ile dene",
    sizeRange: "4 renk · xs–xl",
    theHouse: "◇ Moda evi",
    statAtelier: "tamamen dijital",
    statTailoring: "AI stil doğruluğu",
    statPieces: "gerçek zamanlı kişiselleştirme",
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
    pressQuote3: '"Modern dijital modada bir ustalık sınıfı."',
    introRec: "kayıt · bölüm 01 · sholé sizi görüyor",
    introSkip: "atla ↗",
    introLocation: "SHOLÉ Dijital · İstanbul · krl. 2026",
    introDesc: "içeriye adım atın,<br />kapımız size her zaman açık.",
    introCue: "◇ iy26 — bölüm 01<br />sholé ✦ misafir ai stilist yönetimiyle",
    introEnter: "atölyeye girin",
  },



};

export function getLabels(locale: Locale): Labels {
  return labels[locale] || labels.en;
}

export const SUPPORTED_LOCALES: Locale[] = ["en", "tr"];
export const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
  tr: "Türkçe",
};
