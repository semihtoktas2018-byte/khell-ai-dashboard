export interface ContentEngineInput {
  productName: string;
  imageFile: File;
  style: "dark" | "luxury" | "minimal";
  niche?: string;
}

export interface CaptionGroup {
  style: "aggressive" | "minimal";
  label: string;
  caption: string;
}

export interface HashtagGroup {
  category: "viral" | "niche" | "broad";
  label: string;
  tags: string[];
}

export interface ProductPositioning {
  targetAudience: string;
  priceRange: "low" | "mid" | "premium";
  priceLabel: string;
  salesAngle: string;
}

export interface VideoScene {
  second: string;
  visual: string;
  text: string;
}

export interface VideoScript {
  scenes: VideoScene[];
  voiceover: string;
  cta: string;
  onScreenTexts: string[];
}

export interface ContentEngineOutput {
  captions: CaptionGroup[];
  hooks: string[];
  hashtagGroups: HashtagGroup[];
  positioning: ProductPositioning;
  videoScript: VideoScript;
  videoPlaceholders: { label: string; description: string }[];
}

function generateCaptions(name: string): CaptionGroup[] {
  return [
    {
      style: "aggressive",
      label: "🔥 Agresif / Yüksek Dönüşümlü",
      caption: pickRandom([
        `Bu ${name} çok hızlı tükeniyor — kaçırmadan al 🚨 Bio'daki linke tıkla`,
        `Herkes bu ${name}'i alıyor. Son kalan sen olma 💀 Bio linki ⬇️`,
        `Bu ${name} ile 3 günde 2K kazandım. Uyuma üstüne 💰`,
        `Anın: ${name}'i buldun ve hayatın değişti. Bio'daki link 🔥`,
        `Kaydırmayı durdur. Bu ${name} oyunu değiştiriyor. Güven bana 🫠`,
      ]),
    },
    {
      style: "minimal",
      label: "✨ Minimal / Estetik",
      caption: pickRandom([
        `${name}. Hepsi bu kadar.`,
        `Daha az gürültü. Daha fazla ${name}. ◽`,
        `Sessiz lüks ${name} ile başlar.`,
        `Detaylar önemlidir. ${name}. ✦`,
        `${name} — bilenler için.`,
      ]),
    },
  ];
}

function generateHooks(): string[] {
  const pool = [
    "Bu herkes için değil.",
    "Sadece birkaç kişi anlayacak.",
    "Bunu görmen gerekiyordu.",
    "Dur. Şuna bak.",
    "Bekle…",
    "Kimse bundan bahsetmiyor.",
    "Viral olmadan önce sil bunu.",
    "Bu her şeyi değiştiriyor.",
    "Bunu kaçırıyorsun.",
    "Bu içeriği geçme.",
  ];
  return [...pool].sort(() => Math.random() - 0.5).slice(0, 3);
}

function generateHashtagGroups(name: string, niche?: string): HashtagGroup[] {
  const clean = name.toLowerCase().replace(/[^a-z0-9ğüşıöç]/g, "").replace(/[ğüşıöç]/g, c =>
    ({ ğ: "g", ü: "u", ş: "s", ı: "i", ö: "o", ç: "c" }[c] || c)
  );
  const nicheClean = niche ? niche.toLowerCase().replace(/\s+/g, "").replace(/[^a-z0-9]/g, "") : "";
  return [
    {
      category: "viral",
      label: "🔥 Viral",
      tags: ["#fyp", "#viral", "#tiktokmademebuyit", "#foryou", "#trending", "#blowthisup"],
    },
    {
      category: "niche",
      label: "🎯 Niş",
      tags: [
        `#${clean}`,
        `#${clean}review`,
        `#best${clean}`,
        "#mutlaka al",
        ...(nicheClean ? [`#${nicheClean}`, `#${nicheClean}style`] : ["#tiktokbulgusu"]),
        `#${clean}seven`,
      ],
    },
    {
      category: "broad",
      label: "🌍 Geniş Kitle",
      tags: ["#alışveriş", "#onlinealışveriş", "#ürünincelemesi", "#yaşamtarzı", "#trend", "#yeniürün", "#tiktokshop"],
    },
  ];
}

function generatePositioning(name: string, style: ContentEngineInput["style"]): ProductPositioning {
  const audiences: Record<ContentEngineInput["style"], string> = {
    dark: `18-30 yaş arası, cesur ve özgün estetiği seven gençler. Sınırlı hissi veren ürünlere yönelen dürtüsel alıcılar.`,
    luxury: `Kalite ve prestij arayan 25-40 yaş arası tüketiciler. Algılanan değere ve marka imajına göre satın alanlar.`,
    minimal: `Sade ve temiz tasarımı takdir eden Y ve Z kuşağı. Estetik üzerinden dönüşüm sağlayan bilinçli alıcılar.`,
  };
  const prices: Record<ContentEngineInput["style"], { range: "low" | "mid" | "premium"; label: string }> = {
    dark: { range: "mid", label: "₺500–₺1.000 — Orta segment anlık satın alma" },
    luxury: { range: "premium", label: "₺1.200–₺2.500 — Premium konumlandırma" },
    minimal: { range: "mid", label: "₺400–₺900 — Ulaşılabilir ama şık" },
  };
  const angles: Record<ContentEngineInput["style"], string> = {
    dark: `Dışlama & FOMO — "Bu ${name} herkesin taşıyabileceği bir şey değil." Cesur bir ifade olarak konumlandır.`,
    luxury: `Arzu & Statü — "${name} ile kendine en iyisini hak ediyorsun." Üst seviye yaşam tarzına duyulan özlemi tetikle.`,
    minimal: `Sadelik & Kalite — "${name} ile az ama öz." İnce zevki ve bilinçli yaşamı hedefle.`,
  };
  return {
    targetAudience: audiences[style],
    priceRange: prices[style].range,
    priceLabel: prices[style].label,
    salesAngle: angles[style],
  };
}

function generateVideoScript(name: string, style: ContentEngineInput["style"], hooks: string[]): VideoScript {
  const hook = hooks[0] || "Bu herkes için değil.";

  const sceneSets: Record<ContentEngineInput["style"], VideoScene[]> = {
    dark: [
      { second: "0-3s", visual: "Siyah ekran → flaşlı ürün açılışı", text: hook },
      { second: "3-8s", visual: "Yavaş zoom, sinematik ışık", text: `${name} ile tanış.` },
      { second: "8-15s", visual: "Yakın çekim detaylar, dramatik açılar", text: "Farklı üretildi. Cesurlar için tasarlandı." },
      { second: "15-22s", visual: "Yaşam tarzı çekimi — ürünü kullanan kişi", text: "Herkes anlamayacak." },
      { second: "22-27s", visual: "Özellik/fayda hızlı geçişleri", text: "Premium kalite. Sınırlı stok." },
      { second: "27-30s", visual: "Logo + CTA overlay", text: "Bio'daki link 🔥" },
    ],
    luxury: [
      { second: "0-3s", visual: "Zarif geçiş, altın parçacıklar", text: hook },
      { second: "3-8s", visual: "Mermer/kadife üzerinde ürün", text: `${name} ile tanış.` },
      { second: "8-15s", visual: "Ürün detayları üzerinde yavaş pan", text: "Daha fazlasını talep edenler için tasarlandı." },
      { second: "15-22s", visual: "Yaşam tarzı — premium ortam", text: "Her günü yükseltin." },
      { second: "22-27s", visual: "Sosyal kanıt / yorum overlay", text: "Binlerce kişi zaten yükseltti." },
      { second: "27-30s", visual: "Marka + CTA", text: "Şimdi al — Bio linki ✨" },
    ],
    minimal: [
      { second: "0-3s", visual: "Temiz beyaz arka plan, ürün düşüşü", text: hook },
      { second: "3-8s", visual: "Sabit ürün çekimi, yumuşak gölge", text: `${name}.` },
      { second: "8-15s", visual: "Yavaş dönüş / minimal animasyon", text: "Sade. Temiz. Temel." },
      { second: "15-22s", visual: "Yaşam öğeleriyle düz düzenleme", text: "Az ama öz." },
      { second: "22-27s", visual: "Özellik vurguları, temiz tipografi", text: "Bilinçle tasarlandı." },
      { second: "27-30s", visual: "Minimal CTA kartı", text: "Bio linki ◽" },
    ],
  };

  const voiceovers: Record<ContentEngineInput["style"], string> = {
    dark: `${hook} Bu ${name}. Trendleri takip etmeyen — onları belirleyen insanlar için. Premium kalite, sınırlı stok. Bilenler bilir. Bio'daki link.`,
    luxury: `${hook} ${name} ile tanış. Hayattan daha fazlasını talep edenler için tasarlandı. Her günü gerçekten özel bir şeyle yükseltin. Binlercesi zaten seçti. Sıra sende mi? Bio'daki link.`,
    minimal: `${hook} ${name}. Sade. Temiz. Temel. Kaliteyi miktarın önünde tutan insanlar için bilinçle tasarlandı. Bio'daki link.`,
  };

  const ctas: Record<ContentEngineInput["style"], string> = {
    dark: "🔥 Tükenmeden al — Bio'daki link",
    luxury: "✨ Şimdi al — Yaşam tarzını yükselt — Bio'daki link",
    minimal: "◽ Şimdi al — Bio'daki link",
  };

  return {
    scenes: sceneSets[style],
    voiceover: voiceovers[style],
    cta: ctas[style],
    onScreenTexts: sceneSets[style].map((s) => s.text),
  };
}

function generateVideoPlaceholders(): ContentEngineOutput["videoPlaceholders"] {
  return [
    { label: "Sinematik Açılış", description: "Yavaş zoom + metin overlay: \"Herkes anlamayacak.\"" },
    { label: "Hızlı Vitrin", description: "Hızlı geçişler + kalın metin: \"Sadece birkaç kişi pakete ait.\"" },
    { label: "Estetik Döngü", description: "Yumuşak pan + minimal metin: \"Bilenler bilir.\"" },
  ];
}

function pickRandom(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}

export async function generateContent(input: ContentEngineInput): Promise<ContentEngineOutput> {
  await new Promise((r) => setTimeout(r, 1500));
  const hooks = generateHooks();
  return {
    captions: generateCaptions(input.productName),
    hooks,
    hashtagGroups: generateHashtagGroups(input.productName, input.niche),
    positioning: generatePositioning(input.productName, input.style),
    videoScript: generateVideoScript(input.productName, input.style, hooks),
    videoPlaceholders: generateVideoPlaceholders(),
  };
}
