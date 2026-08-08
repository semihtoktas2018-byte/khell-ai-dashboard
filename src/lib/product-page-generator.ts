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
  // Real, user-supplied social-proof data. Optional — never auto-generated.
  // Left undefined when the user hasn't provided it; the corresponding
  // output block is then omitted entirely rather than filled with a guess.
  reviewerName?: string;
  reviewText?: string;
  rating?: number;
  reviewCount?: number;
  soldCount?: number;
  stockCount?: number;
}

export interface SalesAngleSuggestion {
  angle: SalesAngle;
  reason: string;
}

/**
 * Derives a recommended sales angle from the product's real analysis data
 * (trend score, margin, risk level, price/cost). Returns null when there is
 * no usable signal yet (e.g. form still empty) so callers never fall back to
 * a fabricated recommendation.
 */
export function suggestSalesAngle(
  input: Pick<ProductPageInput, "trendScore" | "margin" | "riskLevel" | "sellingPrice" | "cost">,
  locale: "tr" | "en" | "fr" = "tr"
): SalesAngleSuggestion | null {
  const trendScore = Number.isFinite(input.trendScore) ? input.trendScore : 0;
  const margin = Number.isFinite(input.margin) ? input.margin : 0;
  const sellingPrice = Number.isFinite(input.sellingPrice) ? input.sellingPrice : 0;
  const cost = Number.isFinite(input.cost) ? input.cost : 0;
  const riskLevel = (input.riskLevel || "").toLowerCase();

  const hasSignal = trendScore > 0 || margin > 0 || (sellingPrice > 0 && cost > 0);
  if (!hasSignal) return null;

  const isHighRisk = riskLevel === "yüksek" || riskLevel === "high" || riskLevel === "élevé";
  const markupRatio = cost > 0 && sellingPrice > 0 ? sellingPrice / cost : 0;

  const t = (tr: string, en: string, fr: string) => (locale === "tr" ? tr : locale === "fr" ? fr : en);

  // 1) Strong trend/demand signal wins first — matches viral positioning.
  if (trendScore >= 70) {
    return {
      angle: "trend",
      reason: t(
        `Trend Skoru ${trendScore}/100 ile yüksek — güncel talep bu açıyı destekliyor.`,
        `Trend score is high (${trendScore}/100) — current demand supports this angle.`,
        `Score de tendance élevé (${trendScore}/100) — la demande actuelle soutient cet angle.`
      ),
    };
  }

  // 2) Healthy margin + strong markup + acceptable risk → premium positioning.
  if (margin >= 40 && markupRatio >= 3 && !isHighRisk) {
    return {
      angle: "premium",
      reason: t(
        `%${margin.toFixed(0)} kâr marjı ve güçlü fiyat konumlandırması premium algısını destekliyor.`,
        `${margin.toFixed(0)}% profit margin with strong price positioning supports a premium feel.`,
        `Marge bénéficiaire de ${margin.toFixed(0)} % avec un positionnement tarifaire fort — cohérent avec le premium.`
      ),
    };
  }

  // 3) Decent margin + affordable price point → deal/opportunity framing.
  if (margin >= 25 && sellingPrice > 0 && sellingPrice <= 30) {
    return {
      angle: "budget",
      reason: t(
        `%${margin.toFixed(0)} marj ve $${sellingPrice.toFixed(2)} uygun fiyat, fırsat algısını güçlendiriyor.`,
        `${margin.toFixed(0)}% margin at an affordable $${sellingPrice.toFixed(2)} price point reinforces the deal angle.`,
        `Marge de ${margin.toFixed(0)} % à un prix abordable de ${sellingPrice.toFixed(2)} $ renforce l'angle bonne affaire.`
      ),
    };
  }

  // 4) Fallback: no strong trend/premium/budget signal → lead with the problem it solves.
  return {
    angle: "problem",
    reason: isHighRisk
      ? t(
          `Risk seviyesi yüksek ve veriler net bir trend/premium sinyali göstermiyor — problem çözme odaklı konumlandırma daha güvenli.`,
          `Risk level is high and the data shows no strong trend/premium signal — a problem-focused angle is safer.`,
          `Le niveau de risque est élevé et les données ne montrent pas de signal fort de tendance/premium — un angle axé sur le problème est plus sûr.`
        )
      : t(
          `Mevcut veriler net bir trend/premium/fırsat sinyali göstermiyor — problem çözme odaklı konumlandırma öne çıkıyor.`,
          `The current data shows no strong trend/premium/deal signal — a problem-focused angle stands out best.`,
          `Les données actuelles ne montrent pas de signal fort de tendance/premium/bonne affaire — un angle axé sur le problème ressort le mieux.`
        ),
  };
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
  // Only present when the user supplied real data for them — never fabricated.
  trustReview?: { name: string; text: string; rating?: number };
  trustStats?: { rating?: number; reviewCount?: number; soldCount?: number };
  tiktokHooks: string[];
  facebookHooks: string[];
}

import { supabase } from "@/integrations/supabase/client";

/**
 * Builds trust/urgency content strictly from real, user-supplied data
 * (input.reviewText, input.rating, input.reviewCount, input.soldCount,
 * input.stockCount). Nothing here is generated or guessed — any field the
 * user left empty is simply omitted from the result.
 */
function buildTrustAndUrgency(
  input: ProductPageInput,
  loc: "tr" | "en" | "fr" = "tr"
): {
  trustReview?: { name: string; text: string; rating?: number };
  trustStats?: { rating?: number; reviewCount?: number; soldCount?: number };
  urgency: string[];
} {
  const reviewText = input.reviewText?.trim();
  const trustReview = reviewText
    ? {
        name: input.reviewerName?.trim() || { tr: "Müşteri", en: "Customer", fr: "Client" }[loc],
        text: reviewText,
        rating: input.rating,
      }
    : undefined;

  const hasTrustStats = input.rating != null || input.reviewCount != null || input.soldCount != null;
  const trustStats = hasTrustStats
    ? { rating: input.rating, reviewCount: input.reviewCount, soldCount: input.soldCount }
    : undefined;

  const urgency: string[] = [];
  if (input.stockCount != null && input.stockCount > 0) {
    urgency.push(
      { tr: `🔴 Sınırlı stok — Yalnızca ${input.stockCount} adet kaldı!`, en: `🔴 Limited stock — Only ${input.stockCount} left!`, fr: `🔴 Stock limité — Seulement ${input.stockCount} restants !` }[loc]
    );
  }
  if (input.soldCount != null && input.soldCount > 0) {
    urgency.push(
      { tr: `🏆 Son 30 günde ${input.soldCount.toLocaleString()}+ satış yapıldı!`, en: `🏆 ${input.soldCount.toLocaleString()}+ sold in the last 30 days!`, fr: `🏆 ${input.soldCount.toLocaleString()}+ ventes lors des 30 derniers jours !` }[loc]
    );
  }

  return { trustReview, trustStats, urgency };
}

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

IMPORTANT: Ground the copy for this Sales Angle in the real metrics listed above (trend score, margin, risk level, price/cost) wherever relevant. Do not invent customer reviews, ratings, stock counts, or sales/review numbers anywhere in this content — only use the real metrics explicitly provided above. If no real social-proof numbers were given, write copy without specific customer/sales statistics.

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

  const loc = input.locale || "tr";
  const fallbackCta = { tr: "🛒 Şimdi Sipariş Ver", en: "🛒 Order Now", fr: "🛒 Commander maintenant" }[loc];
  const { trustReview, trustStats, urgency } = buildTrustAndUrgency(input, loc);

  return {
    title: parsed.title || input.name,
    shortDescription: parsed.shortDescription || "",
    longDescription: parsed.longDescription || "",
    benefits: parsed.benefits || [],
    specs: parsed.specs || [],
    targetAudience: parsed.targetAudience || "",
    whyNow: parsed.whyNow || "",
    ctaText: parsed.ctaText || fallbackCta,
    urgency,
    trustReview,
    trustStats,
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
    input.reviewCount != null && input.rating != null
      ? `${input.reviewCount.toLocaleString()}+ müşteri tarafından ${input.rating}/5 ile değerlendirildi`
      : `Değişen ihtiyaçlara kolay uyum sağlayan esnek kullanım alanı`,
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
  const metaDescription = input.reviewCount != null
    ? `${input.name} — ${cat.emotion} hissetmenizi sağlayan, ${input.reviewCount.toLocaleString()}+ müşterinin tercihi. %${marginPct} kâr marjı, trend skoru ${input.trendScore}. Hızlı kargo!`
    : `${input.name} — ${cat.emotion} hissetmenizi sağlayan ürün. %${marginPct} kâr marjı, trend skoru ${input.trendScore}. Hızlı kargo!`;
  const seoTitle = `${input.name} | En Uygun Fiyat & Hızlı Kargo — KHELL AI`;

  const { trustReview, trustStats, urgency } = buildTrustAndUrgency(input, "tr");

  const tiktokHooks = [
    `Bu ürünü keşfetmem hayatımı değiştirdi — ${input.name} ile ${cat.pain} sorunu tamamen bitti 🤯`,
    `${cat.pain} yaşıyorsan dur ve izle: ${input.name} 3 günde fark yarattı 🔥`,
    `TikTok'ın en çok paylaşılan ürünü şimdi elimde — ${input.name} gerçek mi sahte mi?`,
  ];
  const facebookHooks = [
    input.soldCount != null
      ? `${cat.pain} yaşayan ${cat.audience} dikkat: ${input.name} artık hayatınızı kolaylaştırıyor. ${input.soldCount.toLocaleString()}+ kişi zaten denedi!`
      : `${cat.pain} yaşayan ${cat.audience} dikkat: ${input.name} artık hayatınızı kolaylaştırıyor!`,
    input.rating != null && input.reviewCount != null
      ? `⭐ ${input.rating}/5 puan ve ${input.reviewCount}+ değerlendirme: ${input.name} ile tanışın!`
      : `"Keşke daha önce bulsaydım" dedirten ${input.name} ile tanışın!`,
    `"Keşke daha önce alsaydım" diyeceksiniz — ${input.name} ile ${cat.emotion} hissedin. Sınırlı stok!`,
  ];

  return {
    title, shortDescription, longDescription, benefits, specs, targetAudience, whyNow, ctaText,
    shopifyTitle, shopifyBody, metaDescription, seoTitle, urgency, trustReview, trustStats, tiktokHooks, facebookHooks,
  };
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
