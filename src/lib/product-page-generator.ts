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
  locale?: "tr" | "en" | "fr";
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

import { supabase } from "@/integrations/supabase/client";

export async function generateProductPageAI(input: ProductPageInput): Promise<ProductPageContent> {
  const marginPct = input.margin.toFixed(0);
  const profit = (input.sellingPrice - input.cost).toFixed(2);

  const angleLabels: Record<SalesAngle, string> = {
    problem: "Problem Çözen / Pain Point Odaklı",
    trend: "Trend / Viral Odaklı",
    premium: "Premium / Kalite Odaklı",
    budget: "Bütçe Dostu / Fırsat Odaklı",
  };

  const languageNames: Record<string, string> = {
    tr: "Turkish (Türkçe)",
    en: "English",
    fr: "French (Français)",
  };
  const targetLanguage = languageNames[input.locale || "tr"] || languageNames.tr;

  const prompt = `You are an e-commerce dropshipping expert. You will write high-converting sales page content for a product listing.

IMPORTANT: Write ALL text content (title, descriptions, benefits, everything) entirely in ${targetLanguage}. Do not mix languages. The JSON keys below must stay in English exactly as shown, but every value must be written in ${targetLanguage}.

PRODUCT INFO:
- Product Name: ${input.name}
- Category: ${input.category}
- Selling Price: $${input.sellingPrice}
- Cost: $${input.cost}
- Net Profit: $${profit}
- Profit Margin: ${marginPct}%
- Trend Score: ${input.trendScore}/100
- Risk Level: ${input.riskLevel}
- Sales Angle: ${angleLabels[input.salesAngle]}

Return ONLY JSON, nothing else:

{
  "title": "Strong, SEO-friendly product title (max 80 characters)",
  "shortDescription": "2-3 sentences, starting with an emotional hook",
  "longDescription": "4-5 sentences describing how the product changes the buyer's life",
  "benefits": ["Benefit 1","Benefit 2","Benefit 3","Benefit 4","Benefit 5"],
  "specs": ["Category: ${input.category}","Price: $${input.sellingPrice}","Feature 1","Feature 2","Shipping: Fast delivery","Warranty: Satisfaction guarantee"],
  "targetAudience": "Who it's for — 2 sentences",
  "whyNow": "Why buy now — 2 sentences",
  "ctaText": "Strong CTA text, starting with an emoji, max 60 characters",
  "urgency": ["🔴 Stock message","⏰ Urgency message","🏆 Social proof message"],
  "trustReview": {"name": "A realistic customer name in ${targetLanguage}-speaking culture","text": "Realistic customer review","rating": 4.8},
  "tiktokHooks": ["Hook 1","Hook 2","Hook 3"],
  "facebookHooks": ["Hook 1","Hook 2","Hook 3"],
  "shopifyTitle": "Shopify SEO title",
  "seoTitle": "Google SEO title",
  "metaDescription": "160 character meta description"
}`;

  const { data, error } = await supabase.functions.invoke("anthropic-proxy", {
    body: {
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }],
    },
  });
  if (error) throw error;
  const text = data.content?.map((i: { type: string; text?: string }) => i.text || "").join("") || "";
  const clean = text.replace(/```json|```/g, "").trim();
  const match = clean.match(/\{[\s\S]*\}/);
  const parsed = JSON.parse(match ? match[0] : clean);

  const rand = seededRandom(input.name + input.category);
  const soldNum = Math.floor(1200 + rand * 3800);
  const stockNum = Math.floor(3 + rand * 15);
  const reviewCount = Math.floor(280 + rand * 720);

  const loc = input.locale || "tr";
  const fallbackCta = { tr: "🛒 Şimdi Sipariş Ver", en: "🛒 Order Now", fr: "🛒 Commander maintenant" }[loc];
  const fallbackUrgency = {
    tr: [`🔴 Sınırlı stok — Yalnızca ${stockNum} adet kaldı!`, `⏰ Bugüne özel indirim — Gece yarısına kadar geçerli!`, `🏆 Son 30 günde ${soldNum}+ satış yapıldı!`],
    en: [`🔴 Limited stock — Only ${stockNum} left!`, `⏰ Today's special discount — Valid until midnight!`, `🏆 ${soldNum}+ sold in the last 30 days!`],
    fr: [`🔴 Stock limité — Seulement ${stockNum} restants !`, `⏰ Réduction spéciale du jour — Valable jusqu'à minuit !`, `🏆 ${soldNum}+ ventes lors des 30 derniers jours !`],
  }[loc];
  const fallbackReview = {
    tr: { name: "Ayşe K.", text: "Harika ürün!", rating: 4.8 },
    en: { name: "Sarah M.", text: "Amazing product!", rating: 4.8 },
    fr: { name: "Camille B.", text: "Produit incroyable !", rating: 4.8 },
  }[loc];

  return {
    title: parsed.title || input.name,
    shortDescription: parsed.shortDescription || "",
    longDescription: parsed.longDescription || "",
    benefits: parsed.benefits || [],
    specs: parsed.specs || [],
    targetAudience: parsed.targetAudience || "",
    whyNow: parsed.whyNow || "",
    ctaText: parsed.ctaText || fallbackCta,
    urgency: parsed.urgency || fallbackUrgency,
    trustReview: parsed.trustReview || fallbackReview,
    trustStats: {
      rating: parsed.trustReview?.rating || 4.8,
      reviewCount,
      soldCount: soldNum,
    },
    tiktokHooks: parsed.tiktokHooks || [],
    facebookHooks: parsed.facebookHooks || [],
    shopifyTitle: parsed.shopifyTitle || input.name,
    shopifyBody: buildShopifyBody(parsed, loc),
    seoTitle: parsed.seoTitle || `${input.name} | KHELL AI`,
    metaDescription: parsed.metaDescription || "",
  };
}

function buildShopifyBody(p: Record<string, unknown>, loc: "tr" | "en" | "fr" = "tr"): string {
  const benefits = Array.isArray(p.benefits) ? p.benefits : [];
  const whyHeader = { tr: "Neden Bu Ürünü Seçmelisiniz?", en: "Why Choose This Product?", fr: "Pourquoi choisir ce produit ?" }[loc];
  const benefitsHeader = { tr: "Faydaları", en: "Benefits", fr: "Avantages" }[loc];
  return `<h2>${p.title || ""}</h2>
<p>${p.shortDescription || ""}</p>
<h3>${whyHeader}</h3>
<p>${p.longDescription || ""}</p>
<h3>${benefitsHeader}</h3>
<ul>
${benefits.map((b: unknown) => `<li>${b}</li>`).join("\n")}
</ul>
<h3>Kime Uygun?</h3>
<p>${p.targetAudience || ""}</p>
<h3>Neden Şimdi Almalısınız?</h3>
<p>${p.whyNow || ""}</p>
<p><strong>${p.ctaText || ""}</strong></p>`;
}

export function generateProductPage(input: ProductPageInput): ProductPageContent {
  const cat = categoryKeywords[input.category] || categoryKeywords.Tech;
  const angle = angleConfig[input.salesAngle] || angleConfig.trend;
  const marginPct = input.margin.toFixed(0);
  const rand = seededRandom(input.name + input.category);

  const title = `${input.name} ${angle.headlineSuffix}`;

  const shortDescByAngle: Record<SalesAngle, string> = {
    problem: `${input.name}, ${cat.pain} sorununa son veren, binlerce kullanıcının hayatını değiştiren devrim niteliğinde bir üründür. "Keşke daha önce bulsaydım" dedirtecek bu çözümü şimdi keşfedin.`,
    trend: `${input.name} şu an sosyal medyayı kasıp kavuruyor — ${input.trendScore} trend skoru, viral olmanın eşiğinde! ${cat.emotion} hissetmek isteyenlerin ilk tercihi haline geldi.`,
    premium: `${input.name}, titizlikle seçilmiş premium malzemeler ve mühendislik harikası tasarımıyla sıradan ürünlerden farklı bir deneyim sunar. Kendinize en iyisini hak ediyorsunuz.`,
    budget: `${input.name}, bu fiyata başka yerde bulamayacağınız bir kalite-fiyat dengesini sunuyor. Cüzdanınızı zorlamadan ${cat.emotion} hissedin!`,
  };
  const shortDescription = shortDescByAngle[input.salesAngle];

  const longDescByAngle: Record<SalesAngle, string> = {
    problem: `Her gün ${cat.pain} ile mi mücadele ediyorsunuz? ${input.name} tam da bunun için tasarlandı. Pratik kullanımı, dayanıklı yapısı ve kanıtlanmış etkinliğiyle bu sorunu kökten çözüyor. ${input.trendScore} trend skoru ile sosyal medyada herkesin konuştuğu bu ürün, %${marginPct} kâr marjı sunarak dropshipper'lar için de altın fırsat. Hızlı kargo ve kolay iade ile risksiz deneyin.`,
    trend: `${input.name} sosyal medyayı kasıp kavuruyor! ${input.trendScore} trend skoru ile ${input.category} kategorisinin zirvesinde. ${cat.audience} arasında hızla yayılan bu ürün, ${cat.emotion} hissini yaşatıyor. Yüksek kalite malzeme, ergonomik tasarım ve %${marginPct} kâr marjı ile hem kullanıcı hem satıcı için ideal. Stoklar hızla tükeniyor, geç kalmayın.`,
    premium: `${input.name}, ${input.category} kategorisinde kalite standartlarını yeniden belirliyor. Her detay özenle tasarlanmış; malzeme kalitesi, işçilik ve estetik bir arada. %${marginPct} kâr marjı ile premium fiyata premium değer sunuyor. ${cat.audience} için mükemmel bir hediye ya da kendinize yapabileceğiniz en iyi yatırım. Güvenli ödeme, hızlı kargo, tam memnuniyet garantisi.`,
    budget: `${input.name} ile kaliteyi fiyata feda etmek zorunda değilsiniz! $${input.cost} maliyetle $${input.sellingPrice} satış fiyatı — bu kadar basit. %${marginPct} kâr marjı hem alıcıya hem satıcıya kazan-kazan. ${cat.pain} sorununu uygun fiyata çözen bu ürün, ${cat.audience} için biçilmiş kaftan. Binlerce memnun müşteri yanılmaz!`,
  };
  const longDescription = longDescByAngle[input.salesAngle];

  const benefits = [
    `${cat.pain} sorununu kalıcı olarak çözer — artık bu stresi yaşamayın`,
    `Premium kalite malzeme ile günlük yoğun kullanıma dayanıklı`,
    `Ergonomik ve sezgisel tasarım — sıfır öğrenme eğrisi, anında kullanım`,
    `Kompakt ve hafif yapısıyla yanınızdan hiç ayrılmaz`,
    `${(280 + Math.floor(rand * 720)).toLocaleString()}+ memnun müşteri tarafından 4.8/5 ile değerlendirildi`,
  ];

  const specs = [
    `Kategori: ${input.category}`,
    `Fiyat: $${input.sellingPrice.toFixed(2)}`,
    `Trend Skoru: ${input.trendScore}/100`,
    `Kâr Marjı: %${marginPct}`,
    `Risk: ${input.riskLevel}`,
    `Kargo: Hızlı & güvenli teslimat`,
  ];

  const targetAudience = `Bu ürün özellikle ${cat.audience} için tasarlandı. ${cat.pain} ile baş başa kalan ve pratik, güvenilir bir çözüm arayan herkes için mükemmel seçim.`;
  const whyNow = `${input.name} şu an ${input.trendScore} trend skoruyla zirvedeyken stoklar hızla tükeniyor. %${marginPct} kâr marjı ve sınırlı stok — bu fırsatı kaçırmak istemezsiniz. Fiyat artışı başlamadan şimdi sipariş verin!`;
  const ctaText = `${angle.ctaPrefix} — Stoklar Tükenmeden Yakala!`;
  const shopifyTitle = `${input.name} | ${input.salesAngle === "premium" ? "Premium Kalite" : input.salesAngle === "budget" ? "Uygun Fiyat" : "Trend Ürün"} | Hızlı Kargo`;
  const shopifyBody = buildShopifyBody({ title, shortDescription, longDescription, benefits, targetAudience, whyNow, ctaText });
  const metaDescription = `${input.name} — ${cat.emotion} hissetmenizi sağlayan, ${(280 + Math.floor(rand * 720)).toLocaleString()}+ müşterinin tercihi. %${marginPct} kâr marjı, trend skoru ${input.trendScore}. Hızlı kargo!`;
  const seoTitle = `${input.name} | En Uygun Fiyat & Hızlı Kargo — KHELL AI`;

  const soldNum = Math.floor(1200 + rand * 3800);
  const stockNum = Math.floor(3 + rand * 15);
  const reviewCount = Math.floor(280 + rand * 720);

  const urgency = [
    `🔴 Sınırlı stok — Yalnızca ${stockNum} adet kaldı!`,
    `⏰ Bugüne özel %${Math.floor(15 + rand * 25)} indirim — Gece yarısına kadar geçerli!`,
    `🏆 En çok satan — Son 30 günde ${soldNum.toLocaleString()}+ satış yapıldı!`,
  ];

  const reviewNames = ["Ayşe K.", "Mehmet D.", "Zeynep T.", "Burak S.", "Elif Y.", "Ahmet Ç.", "Selin M.", "Emre A."];
  const reviewerIdx = Math.floor(rand * reviewNames.length);
  const reviewTexts: Record<SalesAngle, string> = {
    problem: `${cat.pain} yaşıyordum ve ${input.name}'i denemekten çekiniyordum. Ama şimdi hayatıma nasıl girmedi diye düşünüyorum! Kesinlikle her kuruşuna değer.`,
    trend: `TikTok'ta gördüm ve hemen sipariş verdim — gerçekten reklamlarda göründüğü kadar iyi! Kargo da beklenenden çabuk geldi.`,
    premium: `Kalitesi gerçekten premium seviyede. Her detayı özenle düşünülmüş. Bu fiyata bu kaliteyi bulmak zor.`,
    budget: `Bu fiyata bu kaliteyi beklemiyordum! Beklentilerimi fazlasıyla aştı. Fiyat-performans açısından piyasanın en iyisi.`,
  };

  const rating = parseFloat((4.5 + rand * 0.45).toFixed(1));
  const trustReview = { name: reviewNames[reviewerIdx], text: reviewTexts[input.salesAngle], rating };
  const trustStats = { rating, reviewCount, soldCount: soldNum };

  const tiktokHooks = [
    `Bu ürünü keşfetmem hayatımı değiştirdi — ${input.name} ile ${cat.pain} sorunu tamamen bitti 🤯`,
    `${cat.pain} yaşıyorsan dur ve izle: ${input.name} 3 günde fark yarattı 🔥`,
    `TikTok'ın en çok paylaşılan ürünü şimdi elimde — ${input.name} gerçek mi sahte mi?`,
  ];
  const facebookHooks = [
    `${cat.pain} yaşayan ${cat.audience} dikkat: ${input.name} artık hayatınızı kolaylaştırıyor. ${soldNum.toLocaleString()}+ kişi zaten denedi!`,
    `⭐ ${rating}/5 puan ve ${reviewCount}+ değerlendirme: ${input.name} şimdi indirimde!`,
    `"Keşke daha önce alsaydım" diyeceksiniz — ${input.name} ile ${cat.emotion} hissedin. Sınırlı stok!`,
  ];

  return {
    title, shortDescription, longDescription, benefits, specs, targetAudience, whyNow, ctaText,
    shopifyTitle, shopifyBody, metaDescription, seoTitle, urgency, trustReview, trustStats, tiktokHooks, facebookHooks,
  };
}

function seededRandom(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = ((h << 5) - h + seed.charCodeAt(i)) | 0;
  return Math.abs(h % 100) / 100;
}

const categoryKeywords: Record<string, { emotion: string; pain: string; audience: string }> = {
  Fitness: { emotion: "sağlıklı, güçlü ve enerjik", pain: "ağrı, yorgunluk ve hareketsizlik", audience: "spor tutkunları, ofis çalışanları ve sağlıklı yaşam severler" },
  Pet: { emotion: "huzurlu ve güvende", pain: "evcil hayvan bakımında zorluk ve endişe", audience: "evcil hayvan sahipleri, hayvan severler ve yeni pet ebeveynleri" },
  Tech: { emotion: "modern, akıllı ve üretken", pain: "zaman kaybı, karmaşıklık ve verimsizlik", audience: "teknoloji meraklıları, öğrenciler ve uzaktan çalışanlar" },
  Home: { emotion: "huzurlu, şık ve organize", pain: "dağınıklık, sıkıcılık ve yetersiz alan kullanımı", audience: "ev dekorasyon tutkunları, yeni ev sahipleri ve minimalistler" },
  Car: { emotion: "güvenli, rahat ve özgür", pain: "araç içi düzensizlik, güvenlik endişeleri ve yolculuk yorgunluğu", audience: "günlük sürücüler, uzun yol yapanlar ve araç tutkunları" },
};

const angleConfig: Record<SalesAngle, { tone: string; headlineSuffix: string; ctaPrefix: string }> = {
  problem: { tone: "Bu sorunu çözen tek ürün.", headlineSuffix: "— Sorununuza Kalıcı Çözüm", ctaPrefix: "🛡️ Şimdi Çözümü Al" },
  trend: { tone: "Sosyal medyayı kasıp kavuruyor.", headlineSuffix: "— Herkes Konuşuyor", ctaPrefix: "🔥 Trendi Yakala" },
  premium: { tone: "Kaliteye yatırım yapın.", headlineSuffix: "— Üstün Kalite, Eşsiz Deneyim", ctaPrefix: "💎 Premium Deneyimi Keşfet" },
  budget: { tone: "Bu fiyata başka yok.", headlineSuffix: "— İnanılmaz Fiyat Avantajı", ctaPrefix: "💰 Fırsatı Kaçırma" },
};
