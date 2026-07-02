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

  const prompt = `Sen bir e-ticaret dropshipping uzmanısın. Bir ürün satış sayfası için yüksek dönüşümlü Türkçe içerik üreteceksin.

ÜRÜN BİLGİLERİ:
- Ürün Adı: ${input.name}
- Kategori: ${input.category}
- Satış Fiyatı: $${input.sellingPrice}
- Maliyet: $${input.cost}
- Net Kâr: $${profit}
- Kâr Marjı: %${marginPct}
- Trend Skoru: ${input.trendScore}/100
- Risk Seviyesi: ${input.riskLevel}
- Satış Açısı: ${angleLabels[input.salesAngle]}

SADECE JSON döndür, başka hiçbir şey yazma:

{
  "title": "Güçlü, SEO dostu ürün başlığı (max 80 karakter)",
  "shortDescription": "2-3 cümle, duygusal hook ile başlayan kısa açıklama",
  "longDescription": "4-5 cümle, ürünün hayatı nasıl değiştirdiğini anlatan detaylı açıklama",
  "benefits": ["Fayda 1","Fayda 2","Fayda 3","Fayda 4","Fayda 5"],
  "specs": ["Kategori: ${input.category}","Fiyat: $${input.sellingPrice}","Özellik 1","Özellik 2","Kargo: Hızlı teslimat","Garanti: Memnuniyet garantisi"],
  "targetAudience": "Kime uygun - 2 cümle",
  "whyNow": "Neden şimdi alınmalı - 2 cümle",
  "ctaText": "Güçlü CTA metni, emoji ile başlayan, max 60 karakter",
  "urgency": ["🔴 Stok mesajı","⏰ Zaman mesajı","🏆 Sosyal kanıt mesajı"],
  "trustReview": {"name": "Türk isim","text": "Gerçekçi müşteri yorumu","rating": 4.8},
  "tiktokHooks": ["Hook 1","Hook 2","Hook 3"],
  "facebookHooks": ["Hook 1","Hook 2","Hook 3"],
  "shopifyTitle": "Shopify SEO başlığı",
  "seoTitle": "Google SEO title",
  "metaDescription": "160 karakter meta description"
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

  return {
    title: parsed.title || input.name,
    shortDescription: parsed.shortDescription || "",
    longDescription: parsed.longDescription || "",
    benefits: parsed.benefits || [],
    specs: parsed.specs || [],
    targetAudience: parsed.targetAudience || "",
    whyNow: parsed.whyNow || "",
    ctaText: parsed.ctaText || "🛒 Şimdi Sipariş Ver",
    urgency: parsed.urgency || [
      `🔴 Sınırlı stok — Yalnızca ${stockNum} adet kaldı!`,
      `⏰ Bugüne özel indirim — Gece yarısına kadar geçerli!`,
      `🏆 Son 30 günde ${soldNum}+ satış yapıldı!`,
    ],
    trustReview: parsed.trustReview || { name: "Ayşe K.", text: "Harika ürün!", rating: 4.8 },
    trustStats: {
      rating: parsed.trustReview?.rating || 4.8,
      reviewCount,
      soldCount: soldNum,
    },
    tiktokHooks: parsed.tiktokHooks || [],
    facebookHooks: parsed.facebookHooks || [],
    shopifyTitle: parsed.shopifyTitle || input.name,
    shopifyBody: buildShopifyBody(parsed),
    seoTitle: parsed.seoTitle || `${input.name} | KHELL AI`,
    metaDescription: parsed.metaDescription || "",
  };
}

function buildShopifyBody(p: Record<string, unknown>): string {
  const benefits = Array.isArray(p.benefits) ? p.benefits : [];
  return `<h2>${p.title || ""}</h2>
<p>${p.shortDescription || ""}</p>
<h3>Neden Bu Ürünü Seçmelisiniz?</h3>
<p>${p.longDescription || ""}</p>
<h3>Faydaları</h3>
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
