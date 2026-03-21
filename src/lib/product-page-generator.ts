export type SalesAngle = "problem" | "trend" | "premium" | "budget";

export interface ProductPageInput {
  name: string;
  category: string;
  sellingPrice: number;
  cost: number;
  margin: number;
  trendScore: number;
  riskLevel: string;
  salesAngle: SalesAngle;
}

export interface ProductPageContent {
  title: string;
  shortDescription: string;
  longDescription: string;
  benefits: string[];
  specs: string[];
  targetAudience: string;
  whyNow: string;
  ctaText: string;
  shopifyTitle: string;
  shopifyBody: string;
  metaDescription: string;
  seoTitle: string;
  urgency: string[];
  trustReview: { name: string; text: string; rating: number };
  trustStats: { rating: number; reviewCount: number; soldCount: number };
  tiktokHooks: string[];
  facebookHooks: string[];
}

const categoryKeywords: Record<string, { emotion: string; pain: string; audience: string }> = {
  Fitness: { emotion: "sağlıklı ve enerjik", pain: "ağrı, yorgunluk ve hareketsizlik", audience: "spor tutkunları, ofis çalışanları ve sağlıklı yaşam severler" },
  Pet: { emotion: "mutlu ve güvende", pain: "evcil hayvan bakımında zorluk ve endişe", audience: "evcil hayvan sahipleri, hayvan severler ve yeni pet ebeveynleri" },
  Tech: { emotion: "modern ve pratik", pain: "zaman kaybı ve karmaşık çözümler", audience: "teknoloji meraklıları, öğrenciler ve uzaktan çalışanlar" },
  Home: { emotion: "huzurlu ve şık", pain: "sıkıcı ve düzensiz yaşam alanları", audience: "ev dekorasyon tutkunları, yeni ev sahipleri ve minimalistler" },
  Car: { emotion: "güvenli ve konforlu", pain: "araç içi düzensizlik ve güvenlik endişeleri", audience: "sürücüler, uzun yol yapanlar ve araç tutkunları" },
};

const angleConfig: Record<SalesAngle, { tone: string; headlineSuffix: string; ctaPrefix: string }> = {
  problem: { tone: "Bu sorunu çözen tek ürün.", headlineSuffix: "— Sorununuza Kalıcı Çözüm", ctaPrefix: "🛡️ Şimdi Çözümü Al" },
  trend: { tone: "Herkes bundan konuşuyor.", headlineSuffix: "— Sosyal Medyanın Yeni Fenomeni", ctaPrefix: "🔥 Trendi Yakala" },
  premium: { tone: "Kaliteye yatırım yapın.", headlineSuffix: "— Üstün Kalite, Eşsiz Deneyim", ctaPrefix: "💎 Premium Deneyimi Keşfet" },
  budget: { tone: "Bu fiyata başka yok.", headlineSuffix: "— İnanılmaz Fiyat Avantajı", ctaPrefix: "💰 Fırsatı Kaçırma" },
};

const reviewNames = ["Ayşe K.", "Mehmet D.", "Zeynep T.", "Burak S.", "Elif Y.", "Ahmet Ç."];

function seededRandom(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = ((h << 5) - h + seed.charCodeAt(i)) | 0;
  return Math.abs(h % 100) / 100;
}

export function generateProductPage(input: ProductPageInput): ProductPageContent {
  const cat = categoryKeywords[input.category] || categoryKeywords.Tech;
  const angle = angleConfig[input.salesAngle] || angleConfig.trend;
  const marginPct = input.margin.toFixed(0);
  const rand = seededRandom(input.name + input.category);

  const title = `${input.name} ${angle.headlineSuffix}`;

  const shortDescByAngle: Record<SalesAngle, string> = {
    problem: `${input.name}, ${cat.pain} sorununa son veren devrim niteliğinde bir üründür. Artık bu sorunu yaşamanıza gerek yok — hemen deneyin!`,
    trend: `${input.name}, sosyal medyada ${input.trendScore} trend skoruyla viral olan, ${cat.emotion} hissetmenizi sağlayan yenilikçi üründür. Herkes konuşuyor, siz de deneyin!`,
    premium: `${input.name}, üstün kalite malzeme ve zarif tasarımıyla fark yaratan bir üründür. Kendinize en iyisini hak ediyorsunuz.`,
    budget: `${input.name}, bu fiyata bulamayacağınız kalitede bir üründür. ${cat.emotion} hissetmenizi sağlarken cüzdanınızı zorlamaz!`,
  };
  const shortDescription = shortDescByAngle[input.salesAngle];

  const longDescription = `${input.name}, ${input.category} kategorisinde en çok tercih edilen ürünlerden biridir. ${angle.tone} ${cat.pain} sorunlarına pratik ve etkili bir çözüm sunar. Yüksek kaliteli malzemelerden üretilmiş olup dayanıklı ve uzun ömürlüdür. Ergonomik tasarımı sayesinde günlük kullanımda maksimum konfor sağlar. Binlerce müşterinin güvenini kazanmış bu ürün, trend skoru ${input.trendScore} ile sosyal medyada viral olmaya devam etmektedir. Hızlı kargo ve kolay iade seçenekleriyle güvenle sipariş verebilirsiniz.`;

  const benefits = [
    `Pratik ve kullanışlı tasarımıyla günlük hayatınızı kolaylaştırır`,
    `Premium kalite malzeme ile uzun ömürlü kullanım garantisi sunar`,
    `Ergonomik yapısı sayesinde konforlu ve rahat bir deneyim yaşatır`,
    `Kompakt boyutuyla taşıması kolay, her yerde kullanılabilir`,
    `Binlerce müşteri tarafından 5 yıldızla değerlendirilen güvenilir bir üründür`,
  ];

  const specs = [
    `Kategori: ${input.category}`,
    `Fiyat: $${input.sellingPrice.toFixed(2)}`,
    `Trend Skoru: ${input.trendScore}/100`,
    `Kâr Marjı: %${marginPct}`,
    `Risk Seviyesi: ${input.riskLevel}`,
    `Kargo: Hızlı ve ücretsiz kargo`,
  ];

  const targetAudience = `Bu ürün özellikle ${cat.audience} için tasarlanmıştır. ${cat.pain} yaşayan herkes bu üründen faydalanabilir. Kendine veya sevdiklerine özel bir hediye arayanlar için de mükemmel bir seçenektir.`;

  const whyNow = `Bu ürün şu an sosyal medyada ${input.trendScore} trend skoruyla viral olmaktadır. Stoklar hızla tükenmekte ve fiyat artışı beklenmektedir. %${marginPct} kâr marjı ile bu fırsatı kaçırmayın. Erken sipariş veren müşteriler özel indirimden yararlanmaktadır.`;

  const ctaText = `${angle.ctaPrefix} — Stoklar Tükenmeden Yakala!`;

  const shopifyTitle = `${input.name} | ${input.salesAngle === "premium" ? "Premium Kalite" : input.salesAngle === "budget" ? "Uygun Fiyat" : "Trend Ürün"} | Hızlı Kargo`;

  const shopifyBody = `<h2>${title}</h2>
<p>${shortDescription}</p>
<h3>Ürün Özellikleri</h3>
<p>${longDescription}</p>
<h3>Faydaları</h3>
<ul>
${benefits.map(b => `<li>${b}</li>`).join("\n")}
</ul>
<h3>Kime Uygun?</h3>
<p>${targetAudience}</p>
<h3>Neden Şimdi Almalısınız?</h3>
<p>${whyNow}</p>
<p><strong>${ctaText}</strong></p>`;

  const metaDescription = `${input.name} — ${cat.emotion} hissetmenizi sağlayan yenilikçi ürün. %${marginPct} kâr marjı, trend skoru ${input.trendScore}. Hızlı kargo ile kapınızda!`;
  const seoTitle = `${input.name} | En Uygun Fiyat & Hızlı Kargo — KHELL AI`;

  // Urgency
  const soldNum = Math.floor(1200 + rand * 3800);
  const stockNum = Math.floor(3 + rand * 15);
  const urgency = [
    `🔴 Sınırlı stok — Yalnızca ${stockNum} adet kaldı!`,
    `⏰ Bugüne özel %${Math.floor(15 + rand * 25)} indirim — Gece yarısına kadar geçerli!`,
    `🏆 En çok satan — Son 30 günde ${soldNum}+ satış yapıldı!`,
  ];

  // Trust
  const reviewerIdx = Math.floor(rand * reviewNames.length);
  const reviewTexts: Record<SalesAngle, string> = {
    problem: `Uzun süredir ${cat.pain} yaşıyordum. ${input.name} sayesinde artık bu sorun tamamen çözüldü. Kesinlikle tavsiye ederim!`,
    trend: `Sosyal medyada gördüm ve hemen aldım. ${input.name} gerçekten reklamlardaki kadar iyi! Arkadaşlarım da sipariş verdi.`,
    premium: `Kalitesi gerçekten üst düzey. ${input.name}'in her detayı özenle tasarlanmış. Fiyatına değen nadir ürünlerden.`,
    budget: `Bu fiyata bu kaliteyi beklemiyordum! ${input.name} beklentilerimi fazlasıyla aştı. Herkese öneriyorum.`,
  };
  const rating = parseFloat((4.4 + rand * 0.5).toFixed(1));
  const reviewCount = Math.floor(280 + rand * 720);

  const trustReview = {
    name: reviewNames[reviewerIdx],
    text: reviewTexts[input.salesAngle],
    rating,
  };
  const trustStats = { rating, reviewCount, soldCount: soldNum };

  // Ad hooks
  const tiktokHooks = [
    `Bu ürünü keşfetmemi isteyenler haklıydı… ${input.name} hayatımı değiştirdi 🤯`,
    `${input.name}'i denedim ve ${cat.pain} sorunum 3 günde bitti 🔥`,
    `TikTok'ta gördüğüm en iyi ürün — ${input.name} gerçekten işe yarıyor!`,
  ];
  const facebookHooks = [
    `${cat.pain} yaşıyorsanız ${input.name}'i mutlaka deneyin. ${soldNum}+ müşteri yanılamaz!`,
    `⭐ ${rating}/5 puanla değerlendirilen ${input.name} şimdi %${Math.floor(15 + rand * 25)} indirimde!`,
    `"Keşke daha önce alsaydım" diyeceksiniz — ${input.name} ile ${cat.emotion} hissedin.`,
  ];

  return {
    title, shortDescription, longDescription, benefits, specs, targetAudience, whyNow, ctaText,
    shopifyTitle, shopifyBody, metaDescription, seoTitle,
    urgency, trustReview, trustStats, tiktokHooks, facebookHooks,
  };
}
