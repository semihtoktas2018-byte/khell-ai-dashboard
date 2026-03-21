export interface ProductPageInput {
  name: string;
  category: string;
  sellingPrice: number;
  cost: number;
  margin: number;
  trendScore: number;
  riskLevel: string;
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
}

const categoryKeywords: Record<string, { emotion: string; pain: string; audience: string }> = {
  Fitness: { emotion: "sağlıklı ve enerjik", pain: "ağrı, yorgunluk ve hareketsizlik", audience: "spor tutkunları, ofis çalışanları ve sağlıklı yaşam severler" },
  Pet: { emotion: "mutlu ve güvende", pain: "evcil hayvan bakımında zorluk ve endişe", audience: "evcil hayvan sahipleri, hayvan severler ve yeni pet ebeveynleri" },
  Tech: { emotion: "modern ve pratik", pain: "zaman kaybı ve karmaşık çözümler", audience: "teknoloji meraklıları, öğrenciler ve uzaktan çalışanlar" },
  Home: { emotion: "huzurlu ve şık", pain: "sıkıcı ve düzensiz yaşam alanları", audience: "ev dekorasyon tutkunları, yeni ev sahipleri ve minimalistler" },
  Car: { emotion: "güvenli ve konforlu", pain: "araç içi düzensizlik ve güvenlik endişeleri", audience: "sürücüler, uzun yol yapanlar ve araç tutkunları" },
};

export function generateProductPage(input: ProductPageInput): ProductPageContent {
  const cat = categoryKeywords[input.category] || categoryKeywords.Tech;
  const profit = (input.sellingPrice - input.cost).toFixed(2);
  const marginPct = input.margin.toFixed(0);

  const title = `${input.name} — Premium Kalite, Hızlı Kargo`;

  const shortDescription = `${input.name}, günlük hayatınızı kolaylaştıran, ${cat.emotion} hissetmenizi sağlayan yenilikçi bir üründür. Şimdi sipariş verin, farkı yaşayın!`;

  const longDescription = `${input.name}, ${input.category} kategorisinde en çok tercih edilen ürünlerden biridir. ${cat.pain} sorunlarına pratik ve etkili bir çözüm sunar. Yüksek kaliteli malzemelerden üretilmiş olup dayanıklı ve uzun ömürlüdür. Ergonomik tasarımı sayesinde günlük kullanımda maksimum konfor sağlar. Binlerce müşterinin güvenini kazanmış bu ürün, trend skoru ${input.trendScore} ile sosyal medyada viral olmaya devam etmektedir. Hızlı kargo ve kolay iade seçenekleriyle güvenle sipariş verebilirsiniz.`;

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

  const ctaText = `🔥 Şimdi Sipariş Ver — Stoklar Tükenmeden Yakala!`;

  const shopifyTitle = `${input.name} | Premium Kalite | Hızlı Kargo`;

  const shopifyBody = `<h2>${input.name}</h2>
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

  return {
    title,
    shortDescription,
    longDescription,
    benefits,
    specs,
    targetAudience,
    whyNow,
    ctaText,
    shopifyTitle,
    shopifyBody,
    metaDescription,
    seoTitle,
  };
}
