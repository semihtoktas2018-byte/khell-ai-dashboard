export interface ViralProduct {
  id: string;
  name: string;
  nameTr: string;
  category: string;
  sellingPrice: number;
  cost: number;
  margin: number;
  trendScore: number;
  demandLevel: "low" | "medium" | "high";
  competitionLevel: "low" | "medium" | "high";
  riskLevel: "Düşük" | "Orta" | "Yüksek";
  decisionScore: number;
  isHot: boolean;
  platform: string;
  monthlySearchVolume: string;
  targetMarket: string;
  cjProductId?: string;
}

const demandWeight = { low: 20, medium: 50, high: 80 };
const competitionWeight = { low: 10, medium: 40, high: 70 };

function calcDecision(margin: number, trendScore: number, demand: "low" | "medium" | "high", competition: "low" | "medium" | "high"): number {
  return Math.round(margin * 0.4 + trendScore * 0.3 + demandWeight[demand] * 0.2 - competitionWeight[competition] * 0.1);
}

function deriveRisk(competition: "low" | "medium" | "high", trendScore: number): "Düşük" | "Orta" | "Yüksek" {
  if (competition === "low" && trendScore > 70) return "Düşük";
  if (competition === "high") return "Yüksek";
  return "Orta";
}

const RAW = [
  { name: "Magnetic Posture Corrector Belt", nameTr: "Manyetik Duruş Düzeltici Kemer", category: "Fitness", sellingPrice: 29.99, cost: 5.80, trendScore: 94, demandLevel: "high" as const, competitionLevel: "low" as const, platform: "TikTok & Amazon", monthlySearchVolume: "450K+", targetMarket: "Ofis çalışanları, 25-45 yaş", cjProductId: "CJZJ9968" },
  { name: "Air Conditioning Desk Fan USB", nameTr: "USB Klimalı Masa Fanı", category: "Home", sellingPrice: 34.99, cost: 8.20, trendScore: 96, demandLevel: "high" as const, competitionLevel: "low" as const, platform: "TikTok & Amazon", monthlySearchVolume: "520K+", targetMarket: "Ev & ofis kullanıcıları", cjProductId: "CJYD2446830" },
  { name: "Portable UV Toothbrush Sterilizer", nameTr: "UV Diş Fırçası Sterilizatörü", category: "Fitness", sellingPrice: 24.99, cost: 4.90, trendScore: 91, demandLevel: "high" as const, competitionLevel: "low" as const, platform: "TikTok & Amazon", monthlySearchVolume: "280K+", targetMarket: "Sağlık bilincli kullanıcılar", cjProductId: "CJWJ9892" },
  { name: "Lumbar Support Device for Chair", nameTr: "Sandalye Bel Destek Aparatı", category: "Fitness", sellingPrice: 39.99, cost: 7.50, trendScore: 92, demandLevel: "high" as const, competitionLevel: "low" as const, platform: "Amazon & TikTok", monthlySearchVolume: "390K+", targetMarket: "Uzaktan çalışanlar, ofis çalışanları", cjProductId: "CJYD1234" },
  { name: "Stick-and-Write Electrostatic Whiteboard", nameTr: "Yapışkan Elektrostatik Beyaz Tahta", category: "Home", sellingPrice: 27.99, cost: 5.40, trendScore: 88, demandLevel: "high" as const, competitionLevel: "low" as const, platform: "TikTok & Pinterest", monthlySearchVolume: "195K+", targetMarket: "Öğrenciler, ev ofis kullanıcıları", cjProductId: "CJYD5678" },
  { name: "Pet Hair Remover Mitt", nameTr: "Evcil Hayvan Tüy Temizleme Eldiveni", category: "Pet", sellingPrice: 19.99, cost: 3.80, trendScore: 93, demandLevel: "high" as const, competitionLevel: "low" as const, platform: "TikTok & Amazon", monthlySearchVolume: "340K+", targetMarket: "Kedi & köpek sahipleri", cjProductId: "CJYD9101" },
  { name: "Car Wireless Phone Charger Mount", nameTr: "Araç Kablosuz Şarjlı Telefon Tutucu", category: "Car", sellingPrice: 32.99, cost: 8.80, trendScore: 86, demandLevel: "high" as const, competitionLevel: "medium" as const, platform: "Amazon & Facebook", monthlySearchVolume: "520K+", targetMarket: "Araç kullanıcıları, 25-50 yaş", cjProductId: "CJYD1121" },
  { name: "LED Cloud Night Light", nameTr: "LED Bulut Gece Lambası", category: "Home", sellingPrice: 22.99, cost: 4.80, trendScore: 92, demandLevel: "high" as const, competitionLevel: "low" as const, platform: "TikTok & Pinterest", monthlySearchVolume: "240K+", targetMarket: "Çocuk odaları, genç yetişkinler", cjProductId: "CJYD3141" },
  { name: "Cashmere Home Slippers", nameTr: "Kaşmir Ev Terlikleri", category: "Home", sellingPrice: 28.99, cost: 7.20, trendScore: 84, demandLevel: "high" as const, competitionLevel: "low" as const, platform: "Instagram & Amazon", monthlySearchVolume: "185K+", targetMarket: "Lüks yaşam arayanlar, hediye alıcılar", cjProductId: "CJYD5161" },
  { name: "Devil Eyes LED Windshield Light", nameTr: "Şeytan Gözü LED Ön Cam Işığı", category: "Car", sellingPrice: 18.99, cost: 3.40, trendScore: 95, demandLevel: "high" as const, competitionLevel: "low" as const, platform: "TikTok & Instagram", monthlySearchVolume: "410K+", targetMarket: "Genç araç sahipleri, tuning meraklıları", cjProductId: "CJYD7181" },
  { name: "Automatic Electric Grape Peeler", nameTr: "Otomatik Elektrikli Üzüm Soyucu", category: "Home", sellingPrice: 24.99, cost: 5.60, trendScore: 89, demandLevel: "high" as const, competitionLevel: "low" as const, platform: "TikTok & YouTube", monthlySearchVolume: "220K+", targetMarket: "Mutfak gadget severler", cjProductId: "CJYD2589002" },
  { name: "Resistance Bands Set Door Anchor", nameTr: "Kapı Destekli Direnç Bandı Seti", category: "Fitness", sellingPrice: 21.99, cost: 4.30, trendScore: 90, demandLevel: "high" as const, competitionLevel: "low" as const, platform: "TikTok & Amazon", monthlySearchVolume: "780K+", targetMarket: "Ev sporcuları, fitness başlangıç", cjProductId: "CJYD9202" },
  { name: "Smart Temperature Water Bottle", nameTr: "Akıllı Sıcaklık Göstergeli Su Şişesi", category: "Fitness", sellingPrice: 28.99, cost: 8.50, trendScore: 81, demandLevel: "high" as const, competitionLevel: "medium" as const, platform: "Amazon & TikTok", monthlySearchVolume: "225K+", targetMarket: "Sporcu ve sağlık odaklı kullanıcılar", cjProductId: "CJYD1222" },
  { name: "Interactive Auto Cat Laser Toy", nameTr: "Otomatik Kedi Lazer Oyuncağı", category: "Pet", sellingPrice: 16.99, cost: 4.10, trendScore: 93, demandLevel: "high" as const, competitionLevel: "low" as const, platform: "TikTok & Instagram", monthlySearchVolume: "340K+", targetMarket: "Kedi sahipleri", cjProductId: "CJYD3232" },
  { name: "Silicone Microwave Splatter Cover", nameTr: "Silikon Mikrodalga Sıçrama Kapağı", category: "Home", sellingPrice: 14.99, cost: 2.80, trendScore: 85, demandLevel: "high" as const, competitionLevel: "low" as const, platform: "TikTok & Amazon", monthlySearchVolume: "165K+", targetMarket: "Ev hanımları, mutfak kullanıcıları", cjProductId: "CJYD2589002" },
  { name: "GPS Pet Tracker Collar", nameTr: "GPS'li Evcil Hayvan Takip Tasması", category: "Pet", sellingPrice: 34.99, cost: 11.50, trendScore: 79, demandLevel: "high" as const, competitionLevel: "medium" as const, platform: "Amazon & Facebook", monthlySearchVolume: "210K+", targetMarket: "Evcil hayvan sahipleri, 30-55 yaş", cjProductId: "CJYD4242" },
  { name: "Car Aromatherapy Diffuser", nameTr: "Araç İçi Aromaterapi Difüzörü", category: "Car", sellingPrice: 15.99, cost: 3.40, trendScore: 85, demandLevel: "high" as const, competitionLevel: "low" as const, platform: "TikTok & Amazon", monthlySearchVolume: "195K+", targetMarket: "Araç sahipleri, wellness odaklı", cjProductId: "CJYD5252" },
  { name: "Wireless Earbuds Cleaning Kit", nameTr: "Kablosuz Kulaklık Temizleme Kiti", category: "Tech", sellingPrice: 12.99, cost: 2.50, trendScore: 78, demandLevel: "medium" as const, competitionLevel: "low" as const, platform: "TikTok & Amazon", monthlySearchVolume: "120K+", targetMarket: "Kulaklık kullanıcıları", cjProductId: "CJYD6262" },
  { name: "Electric Scalp Massager", nameTr: "Elektrikli Kafa Derisi Masajı", category: "Fitness", sellingPrice: 22.99, cost: 5.40, trendScore: 89, demandLevel: "high" as const, competitionLevel: "low" as const, platform: "TikTok & Amazon", monthlySearchVolume: "390K+", targetMarket: "Stres altındaki yetişkinler", cjProductId: "CJYD7272" },
  { name: "Portable Pet Water Bottle", nameTr: "Taşınabilir Evcil Hayvan Su Şişesi", category: "Pet", sellingPrice: 18.99, cost: 3.90, trendScore: 88, demandLevel: "high" as const, competitionLevel: "low" as const, platform: "TikTok & Amazon", monthlySearchVolume: "280K+", targetMarket: "Köpek & kedi sahipleri", cjProductId: "CJYD8282" },
];

export function getViralProducts(): ViralProduct[] {
  return RAW.map((p, i) => {
    const margin = Math.round(((p.sellingPrice - p.cost) / p.sellingPrice) * 100 * 10) / 10;
    const riskLevel = deriveRisk(p.competitionLevel, p.trendScore);
    const decisionScore = calcDecision(margin, p.trendScore, p.demandLevel, p.competitionLevel);
    const isHot = p.trendScore > 88 && p.competitionLevel === "low";
    return { ...p, id: `viral-${i}`, margin, riskLevel, decisionScore, isHot };
  });
}
