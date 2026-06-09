/* ═══════════════════════════════════════════════════════════════════════
   Basic i18n labels for SHOLÉ — client-side, no framework needed
   ═══════════════════════════════════════════════════════════════════════ */

export type Locale = "en" | "tr" | "de" | "it";

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
  
  // New keys for landing pages
  heroHeadline1: string;
  heroHeadline2: string;
  heroHeadline3: string;
  lookSholeSaysQuote: string;
  categoriesList: string[];
  twelvePieces: string;
  houseDescription: string;
  heroHeadlineMobile: string;
  mobileGalleryQuote: string;
  mobileSoftArrivals: string;
  mobileViewCollection: string;
  mobileIntroTitle: string;
  mobileIntroDesc: string;
  mobileChatBubble1: string;
  mobileChatBubble2: string;
  mobileContinueChat: string;
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
    
    // New keys for landing pages
    heroHeadline1: "Wear it",
    heroHeadline2: "like it's",
    heroHeadline3: "yours",
    lookSholeSaysQuote: "the sleeve crops at the wrist on you — pair with the slim trouser.",
    categoriesList: ["All", "Tailoring", "Knit", "Shoes", "Bags"],
    twelvePieces: "twelve pieces",
    houseDescription: "SHOLÉ is a fully digital-native, autonomous fashion house born from the intersection of luxury craftsmanship and advanced machine intelligence. By replacing traditional supply chains with algorithmic design, digital-twin sizing, and generative aesthetics, we craft garments that respond directly to your body and movement. The result is clothing that is highly premium and infinitely modern—complemented by an AI stylist that is always in your pocket.",
    heroHeadlineMobile: "Wear it like it's yours — since 1944.",
    mobileGalleryQuote: "I need an outfit for a gallery opening...",
    mobileSoftArrivals: "The soft arrivals",
    mobileViewCollection: "View Complete Collection",
    mobileIntroTitle: "Hi, I'm SHOLÉ. Your personal stylist.",
    mobileIntroDesc: "I help you find exactly what you need, even when you don't know what it is yet.",
    mobileChatBubble1: "A dinner Friday. Not too dressed up. Need a dress.",
    mobileChatBubble2: "I have just the thing. Let's look at the bias cut silk slip, layered under the structured oversized blazer. Comfortable but very sharp.",
    mobileContinueChat: "Continue Chat",
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
    
    // New keys for landing pages
    heroHeadline1: "Kendin gibi",
    heroHeadline2: "taşı",
    heroHeadline3: "onu",
    lookSholeSaysQuote: "kol boyu bileğinde bitiyor — dar pantolonla kombinle.",
    categoriesList: ["Hepsi", "Terzilik", "Triko", "Ayakkabı", "Çanta"],
    twelvePieces: "on iki parça",
    houseDescription: "SHOLÉ, lüks zanaatkarlık ile ileri yapay zeka teknolojilerinin kesişiminden doğan, tamamen dijital öncelikli ve otonom bir moda evidir. Geleneksel tedarik zincirlerini algoritmik tasarım, dijital ikiz bedenleme ve üretken estetikle yeniden yapılandırarak doğrudan vücudunuza ve hareketlerinize yanıt veren kıyafetler üretiyoruz. Sonuç; her an yanınızda olan bir yapay zeka stilistiyle tamamlanan, son derece premium ve sonsuz derecede modern tasarımlardır.",
    heroHeadlineMobile: "Kendin gibi taşı — 1944'ten beri.",
    mobileGalleryQuote: "Galeri açılışı için bir kıyafet lazım...",
    mobileSoftArrivals: "Yumuşak Dokunuş",
    mobileViewCollection: "Tüm Koleksiyonu Gör",
    mobileIntroTitle: "Merhaba, ben SHOLÉ. Kişisel stilistiniz.",
    mobileIntroDesc: "Henüz ne olduğunu bilmediğinizde bile tam ihtiyacınız olanı bulmanıza yardım ederim.",
    mobileChatBubble1: "Cuma akşamı bir akşam yemeği. Çok abartılı değil. Bir elbiseye ihtiyacım var.",
    mobileChatBubble2: "Anlaşıldı. Hava 17°C — triko ağırlıklı gideceğim. Üç seçim, zahmetsiz ve şık. Birini denemek ister misin?",
    mobileContinueChat: "Sohbete Devam Et",
  },
  de: {
    announce: "✦ Kostenloser Versand ab 200 € · Treffen Sie SHOLÉ — Ihre KI-Stylistin · Neuer Drop: Spätfrühling 26",
    navWomen: "Damen",
    navAccessories: "Accessoires",
    navShoes: "Schufe",
    navTailoring: "Schneiderei",
    navJournal: "Journal",
    askShole: "Fragen Sie SHOLÉ",
    search: "Suche",
    account: "Mitglieder-Login",
    logout: "Abmelden",
    bag: "Warenkorb",
    heroSubtitle: "Frühling / Sommer 2026 — Kapitel 01",
    heroTagline: "Die Zukunft der Schneiderei. Ein digital-first Atelier, in dem neuronale Netze auf meisterhafte Handwerkskunst treffen, Stoffe Ihre Bewegungen erlernen und Ihre KI-Stylistin Ihnen stets zur Seite steht.",
    shopChapter: "Kollektion shoppen →",
    tryStylist: "Stylistin ausprobieren",
    collectionTitle: "Die sanften Ankünfte.",
    storyTitle: "Code, Faden und die Ära des autonomen Luxus.",
    aiInviteTitle: "Hallo, ich bin SHOLÉ. Ich helfe Ihnen, um 20 Uhr nicht in Panik zu geraten.",
    aiInviteDesc: "Sagen Sie mir, wohin Sie gehen. Zeigen Sie mir das Kleid, das Sie fast gekauft hätten. Senden Sie mir ein Foto — ich zeige Ihnen, wie der Mantel tatsächlich passt.",
    startConversation: "Gespräch beginnen →",
    styleQuiz: "Stil-Quiz machen",
    footerNewsletter: "Briefe von SHOLÉ — Drops, Berichte und der gelegentliche Outfit-Notfall.",
    subscribe: "Abonnieren →",
    greeting: "hallo! ich bin sholé ✦ was stylen wir heute?",
    voiceGreeting: "Sprechen Sie mit SHOLÉ",
    welcome: "Lernen Sie SHOLÉ kennen",
    welcomeDesc: "Ihre KI-Modestylistin. Ich kann Ihnen helfen, das perfekte Outfit zu finden, Kombinationen vorschlagen und Ihnen sogar zeigen, wie die Dinge aussehen — fragen Sie mich einfach!",
    startVoice: "Sprach-Chat starten",
    maybeLater: "Vielleicht später",
    connecting: "Verbindung wird hergestellt...",
    micPlaceholder: "zuhören...",
    textPlaceholder: "sagen Sie sholé, was Sie stylen...",
    poweredBy: "◇ sholé · powered by gemini",
    uploadPhoto: "Foto für Anprobe senden",
    tryOnTitle: "Virtuelle Anprobe",
    selectSize: "Größe wählen",
    sizeLabel: "Größe",
    addToBag: "In den Warenkorb",
    freeShippingDetail: "✦ Kostenloser Versand ab 200 € · Kostenlose Rückgabe innerhalb von 14 Tagen",
    theStory: "◇ Die Geschichte",
    fabricComposition: "◇ Stoffzusammensetzung",
    detailsLabel: "◇ Details",
    careInstructions: "◇ Pflegehinweise",
    completeTheLook: "◇ Vervollständigen Sie den Look",
    pairsBeautifully: "Lässt sich wunderbar kombinieren mit",
    viewProduct: "Produkt ansehen →",
    backToShole: "← Zurück zu SHOLÉ",
    productNotFound: "Produkt nicht gefunden",
    imageComing: "Bild folgt in Kürze",
    shopCol: "Shop",
    stylistCol: "Stylistin",
    serviceCol: "Service",
    sholeCol: "SHOLÉ",
    footerShopItems: ["Damen", "Accessoires", "Schuhe", "Schneiderei", "Sale"],
    footerStylistItems: ["Fragen Sie SHOLÉ", "Anprobe-Studio", "Stil-Quiz", "Wunschzettel"],
    footerServiceItems: ["Versand", "Rückgabe", "Größentabelle", "Pflege"],
    footerSholeItems: ["Digitales Atelier", "Moderne", "Innovation", "Virtueller Laufsteg"],
    footerEst: "◇ SHOLÉ Digital Atelier — Gegr. 2026 / ◇ Vollautonomes KI-Modehaus",
    editorial: "Editorial",
    theJournal: "Das Journal",
    chapter01: "Kapitel 01",
    newLooksCount: "✦ neu — 12 Looks",
    lookSholeSays: "Look 04 / Sholé sagt",
    tryOnWithShole: "+ mit Sholé anprobieren",
    sizeRange: "4 Farben · xs–xl",
    theHouse: "◇ Das Haus",
    statAtelier: "vollständig digital seit",
    statTailoring: "KI-Styling-Genauigkeit",
    statPieces: "Echtzeit-Personalisierung",
    meetYourStylist: "Lernen Sie Ihre Stylistin kennen",
    chatPreviewUser: "Ich bin nächsten Monat auf einer Hochzeit in Istanbul. Wie ist der Vibe?",
    chatPreviewShole: "Hochzeiten in Istanbul sind elegant, aber luftig. Der Atelier-Mantel in Terra über dem Seiden-Slipkleid wäre atemberaubend.",
    herosince: "— seit 1944",
    onlineAiStylist: "online · ki-stylistin",
    chatPreviewBubble1: "Ein Abendessen am Freitag. Nicht zu schick. Brauche ein Kleid.",
    chatPreviewBubble2: "Verstanden. Wetter sagt 17°C — ich empfehle Strick. Drei unkomplizierte, lässige Optionen:",
    chatPreviewBubble3: "Möchten Sie eines anprobieren? Senden Sie ein Ganzkörperfoto und ich erstelle einen Entwurf.",
    pressQuote1: '"Schneiderei mit Sinn für Humor."',
    pressQuote2: '"Die KI, die man wirklich um sich haben möchte."',
    pressQuote3: '"Eine Meisterklasse moderner digitaler Mode."',
    introRec: "aufn · kapitel 01 · sholé sieht sie",
    introSkip: "überspringen ↗",
    introLocation: "SHOLÉ Digital · Istanbul · gegr. 2026",
    introDesc: "treten sie ein —<br />die tür wurde für sie offengelassen.",
    introCue: "◇ hw26 — kapitel 01<br />präsentiert von sholé ✦ residierende ki-stylistin",
    introEnter: "das atelier betreten",
    
    // New keys for landing pages
    heroHeadline1: "Trage es",
    heroHeadline2: "als wäre es",
    heroHeadline3: "deins",
    lookSholeSaysQuote: "die Ärmellänge endet am Handgelenk — kombiniere es mit der schmalen Hose.",
    categoriesList: ["Alle", "Schneiderei", "Strick", "Schuhe", "Taschen"],
    twelvePieces: "zwölf Stücke",
    houseDescription: "SHOLÉ ist ein vollständig digital natives, autonomes Modehaus, das an der Schnittstelle von luxuriöser Handwerkskunst und fortschrittlicher maschineller Intelligenz entstanden ist. Durch den Ersatz traditioneller Lieferketten durch algorithmisches Design, Digital-Twin-Sizing und generative Ästhetik entwerfen wir Kleidungsstücke, die direkt auf Ihren Körper und Ihre Bewegung reagieren. Das Ergebnis ist Kleidung, die hochkarätig und unendlich modern ist – ergänzt durch eine KI-Stylistin, die Sie immer in der Tasche haben.",
    heroHeadlineMobile: "Trage es, als wäre es deins — seit 1944.",
    mobileGalleryQuote: "Ich brauche ein Outfit für eine Galerieeröffnung...",
    mobileSoftArrivals: "Die sanften Ankünfte",
    mobileViewCollection: "Vollständige Kollektion ansehen",
    mobileIntroTitle: "Hallo, ich bin SHOLÉ. Ihre persönliche Stylistin.",
    mobileIntroDesc: "Ich helfe Ihnen, genau das zu finden, was Sie brauchen, selbst wenn Sie es selbst noch nicht wissen.",
    mobileChatBubble1: "Ein Abendessen am Freitag. Nicht zu schick. Brauche ein Kleid.",
    mobileChatBubble2: "Ich habe genau das Richtige. Schauen wir uns das schräg geschnittene Seiden-Slipkleid an, getragen unter dem strukturierten Oversize-Blazer. Bequem, aber sehr elegant.",
    mobileContinueChat: "Chat fortsetzen",
  },
  it: {
    announce: "✦ Spedizione gratuita oltre €200 · Incontra SHOLÉ — il tuo stilista AI · Nuovo drop: tarda primavera 26",
    navWomen: "Donna",
    navAccessories: "Accessori",
    navShoes: "Scarpe",
    navTailoring: "Sartoria",
    navJournal: "Journal",
    askShole: "Chiedi a SHOLÉ",
    search: "Cerca",
    account: "Login Membri",
    logout: "Esci",
    bag: "Carrello",
    heroSubtitle: "Primavera / Estate 2026 — Capitolo 01",
    heroTagline: "Il futuro della sartoria. Un atelier digital-first dove le reti neurali incontrano la maestria artigianale, il tessuto impara i tuoi movimenti e il tuo stilista AI è sempre al tuo fianco.",
    shopChapter: "Acquista la collezione →",
    tryStylist: "Prova lo stilista",
    collectionTitle: "I morbidi arrivi.",
    storyTitle: "Codice, filo e l'era del lusso autonomo.",
    aiInviteTitle: "Ciao, sono SHOLÉ. Ti aiuto a non andare in panico alle 20:00.",
    aiInviteDesc: "Dimmi dove stai andando. Mostrami l'abito che hai quasi acquistato. Inviami una foto — ti mostrerò come calza realmente il cappotto.",
    startConversation: "Inizia la conversazione →",
    styleQuiz: "Fai il quiz di stile",
    footerNewsletter: "Lettere da SHOLÉ — novità, dispacci e l'occasionale emergenza outfit.",
    subscribe: "Iscriviti →",
    greeting: "ciao! sono sholé ✦ cosa vestiamo oggi?",
    voiceGreeting: "Parla con SHOLÉ",
    welcome: "Incontra SHOLÉ",
    welcomeDesc: "Il tuo stilista di moda AI. Posso aiutarti a trovare l'outfit perfetto, suggerire abbinamenti e persino mostrarti come stanno i capi — basta chiedere!",
    startVoice: "Avvia Chat Vocale",
    maybeLater: "Forse più tardi",
    connecting: "Connessione in corso...",
    micPlaceholder: "in ascolto...",
    textPlaceholder: "di' a sholé cosa vuoi vestire...",
    poweredBy: "◇ sholé · supportato da gemini",
    uploadPhoto: "Invia foto per la prova",
    tryOnTitle: "Prova Virtuale",
    selectSize: "Seleziona taglia",
    sizeLabel: "Taglia",
    addToBag: "Aggiungi al carrello",
    freeShippingDetail: "✦ Spedizione gratuita oltre €200 · Resi gratuiti entro 14 giorni",
    theStory: "◇ La storia",
    fabricComposition: "◇ Composizione del tessuto",
    detailsLabel: "◇ Dettagli",
    careInstructions: "◇ Istruzioni per la cura",
    completeTheLook: "◇ Completa il look",
    pairsBeautifully: "Si abbina splendidamente con",
    viewProduct: "Visualizza prodotto →",
    backToShole: "← Torna a SHOLÉ",
    productNotFound: "Prodotto non trovato",
    imageComing: "Immagine in arrivo",
    shopCol: "Acquista",
    stylistCol: "Stilista",
    serviceCol: "Servizio",
    sholeCol: "SHOLÉ",
    footerShopItems: ["Donna", "Accessori", "Scarpe", "Sartoria", "Saldi"],
    footerStylistItems: ["Chiedi a SHOLÉ", "Studio di Prova", "Quiz di stile", "Preferiti"],
    footerServiceItems: ["Spedizione", "Resi", "Guida alle taglie", "Cura"],
    footerSholeItems: ["Atelier Digitale", "Modernità", "Innovazione", "Sfilata Virtuale"],
    footerEst: "◇ SHOLÉ Digital Atelier — Fond. 2026 / ◇ Maison AI Completamente Autonoma",
    editorial: "Editoriale",
    theJournal: "Il Journal",
    chapter01: "Capitolo 01",
    newLooksCount: "✦ nuovo — 12 look",
    lookSholeSays: "look 04 / dice sholé",
    tryOnWithShole: "+ prova con sholé",
    sizeRange: "4 colori · xs–xl",
    theHouse: "◇ La maison",
    statAtelier: "completamente digitale dal",
    statTailoring: "precisione dello styling AI",
    statPieces: "personalizzazione in tempo reale",
    meetYourStylist: "Incontra il tuo stilista",
    chatPreviewUser: "Ho un matrimonio a Istanbul il mese prossimo. Qual è l'atmosfera?",
    chatPreviewShole: "I matrimoni a Istanbul sono eleganti ma freschi. Il cappotto atelier in terra sarebbe splendido sopra l'abito slip in seta.",
    herosince: "— dal 1944",
    onlineAiStylist: "online · stilista AI",
    chatPreviewBubble1: "Una cena venerdì. Non troppo elegante. Ho bisogno di un abito.",
    chatPreviewBubble2: "Capito. Le previsioni dicono 17°C — consiglierei la maglieria. Tre scelte informali e raffinate:",
    chatPreviewBubble3: "Vuoi provarne uno? Invia una foto a figura intera e farò un mock-up.",
    pressQuote1: '"Sartoria con senso dell\'umorismo."',
    pressQuote2: '"L\'intelligenza artificiale che vorresti davvero avere intorno."',
    pressQuote3: '"Una lezione magistrale di moda digitale moderna."',
    introRec: "reg · capitolo 01 · sholé ti vede",
    introSkip: "salta ↗",
    introLocation: "SHOLÉ Digitale · Istanbul · fond. 2026",
    introDesc: "entra —<br />la porta è stata lasciata aperta per te.",
    introCue: "◇ pe26 — capitolo 01<br />diretto da sholé ✦ stilista AI in residenza",
    introEnter: "entra nell'atelier",
    
    // New keys for landing pages
    heroHeadline1: "Indossalo",
    heroHeadline2: "come se fosse",
    heroHeadline3: "tuo",
    lookSholeSaysQuote: "la manica si accorcia al polso — abbinala al pantalone aderente.",
    categoriesList: ["Tutti", "Sartoria", "Maglieria", "Scarpe", "Borse"],
    twelvePieces: "dodici pezzi",
    houseDescription: "SHOLÉ è una maison di moda autonoma e nativa digitale, nata dall'intersezione tra artigianato di lusso e intelligenza artificiale avanzata. Sostituendo le tradizionali catene di fornitura con il design algoritmico, il dimensionamento tramite digital-twin e l'estetica generativa, creiamo capi che rispondono direttamente al corpo e al movimento. Il risultato è un abbigliamento altamente premium e infinitamente moderno, completato da uno stilista AI sempre a portata di mano.",
    heroHeadlineMobile: "Indossalo come se fosse tuo — dal 1944.",
    mobileGalleryQuote: "Ho bisogno di un outfit per l'inaugurazione di una galleria...",
    mobileSoftArrivals: "I morbidi arrivi",
    mobileViewCollection: "Visualizza collezione completa",
    mobileIntroTitle: "Ciao, sono SHOLÉ. Il tuo stilista personale.",
    mobileIntroDesc: "Ti aiuto a trovare esattamente quello di cui hai bisogno, anche quando non sai ancora cosa sia.",
    mobileChatBubble1: "Una cena venerdì. Non troppo elegante. Ho bisogno di un abito.",
    mobileChatBubble2: "Ho proprio quello che fa per te. Diamo un'occhiata all'abito slip in seta con taglio in sbieco, indossato sotto il blazer doppiopetto strutturato. Comodo ma molto sofisticato.",
    mobileContinueChat: "Continua la chat",
  },
};

export function getLabels(locale: Locale): Labels {
  return labels[locale] || labels.en;
}

export const SUPPORTED_LOCALES: Locale[] = ["en", "tr", "de", "it"];
export const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
  tr: "Türkçe",
  de: "Deutsch",
  it: "Italiano",
};
