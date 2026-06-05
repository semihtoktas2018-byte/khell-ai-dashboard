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
}

const demandWeight = { low: 20, medium: 50, high: 80 };
const competitionWeight = { low: 10, medium: 40, high: 70 };

function calcDecision(margin: number, trendScore: number, demand: "low" | "medium" | "high", competition: "low" | "medium" | "high"): number {
  return Math.round(
    margin * 0.4 + trendScore * 0.3 + demandWeight[demand] * 0.2 - competitionWeight[competition] * 0.1
  );
}

function deriveRisk(competition: "low" | "medium" | "high", trendScore: number): "Düşük" | "Orta" | "Yüksek" {
  if (competition === "low" && trendScore > 70) return "Düşük";
  if (competition === "high") return "Yüksek";
  return "Orta";
}

interface RawProduct {
  name: string;
  nameTr: string;
  category: string;
  sellingPrice: number;
  cost: number;
  trendScore: number;
  demandLevel: "low" | "medium" | "high";
  competitionLevel: "low" | "medium" | "high";
  platform: string;
  monthlySearchVolume: string;
  targetMarket: string;
}

// Gerçek 2024-2025 trend ürünleri — AliExpress & CJ Dropshipping verileri baz alınarak
const RAW: RawProduct[] = [
  {
    name: "Magnetic Posture Corrector Belt",
    nameTr: "Manyetik Duruş Düzeltici Kemer",
    category: "Fitness",
    sellingPrice: 29.99, cost: 5.80, trendScore: 94,
    demandLevel: "high", competitionLevel: "low",
    platform: "TikTok & Amazon",
    monthlySearchVolume: "450K+",
    targetMarket: "Ofis çalışanları, 25-45 yaş",
  },
  {
    name: "LED Sunset Projection Lamp",
    nameTr: "LED Gün Batımı Projeksiyon Lambası",
    category: "Home",
    sellingPrice: 24.99, cost: 6.20, trendScore: 91,
    demandLevel: "high", competitionLevel: "low",
    platform: "TikTok & Instagram",
    monthlySearchVolume: "320K+",
    targetMarket: "Genç yetişkinler, dekorasyon severler",
  },
  {
    name: "Portable Pet Water Bottle",
    nameTr: "Taşınabilir Evcil Hayvan Su Şişesi",
    category: "Pet",
    sellingPrice: 18.99, cost: 3.90, trendScore: 88,
    demandLevel: "high", competitionLevel: "low",
    platform: "TikTok & Amazon",
    monthlySearchVolume: "280K+",
    targetMarket: "Köpek & kedi sahipleri",
  },
  {
    name: "Electric Scalp Massager",
    nameTr: "Elektrikli Kafa Derisi Masajı",
    category: "Fitness",
    sellingPrice: 22.99, cost: 5.40, trendScore: 89,
    demandLevel: "high", competitionLevel: "low",
    platform: "TikTok & Amazon",
    monthlySearchVolume: "390K+",
    targetMarket: "Stres altındaki yetişkinler",
  },
  {
    name: "Anti-Gravity Humidifier",
    nameTr: "Anti-Gravity Ultrasonik Nemlendirici",
    category: "Home",
    sellingPrice: 44.99, cost: 13.50, trendScore: 83,
    demandLevel: "high", competitionLevel: "medium",
    platform: "Amazon & TikTok",
    monthlySearchVolume: "180K+",
    targetMarket: "Ev & ofis kullanıcıları",
  },
  {
    name: "Car Phone Mount Wireless Charger",
    nameTr: "Araç İçi Kablosuz Şarjlı Telefon Tutucu",
    category: "Car",
    sellingPrice: 32.99, cost: 8.80, trendScore: 86,
    demandLevel: "high", competitionLevel: "medium",
    platform: "Amazon & Facebook",
    monthlySearchVolume: "520K+",
    targetMarket: "Araç kullanıcıları, 25-50 yaş",
  },
  {
    name: "Cloud Shaped LED Night Light",
    nameTr: "Bulut Şeklinde LED Gece Lambası",
    category: "Home",
    sellingPrice: 19.99, cost: 4.80, trendScore: 92,
    demandLevel: "high", competitionLevel: "low",
    platform: "TikTok & Pinterest",
    monthlySearchVolume: "240K+",
    targetMarket: "Çocuk odaları, genç yetişkinler",
  },
  {
    name: "Smart Posture Reminder Necklace",
    nameTr: "Akıllı Duruş Hatırlatıcı Kolye",
    category: "Tech",
    sellingPrice: 39.99, cost: 10.50, trendScore: 80,
    demandLevel: "medium", competitionLevel: "low",
    platform: "Instagram & Amazon",
    monthlySearchVolume: "95K+",
    targetMarket: "Sağlık bilincli profesyoneller",
  },
  {
    name: "Foldable Laptop Stand",
    nameTr: "Katlanabilir Laptop Standı",
    category: "Tech",
    sellingPrice: 27.99, cost: 7.20, trendScore: 74,
    demandLevel: "medium", competitionLevel: "high",
    platform: "Amazon",
    monthlySearchVolume: "680K+",
    targetMarket: "Uzaktan çalışanlar, öğrenciler",
  },
  {
    name: "GPS Pet Tracker Collar",
    nameTr: "GPS'li Evcil Hayvan Takip Tasması",
    category: "Pet",
    sellingPrice: 34.99, cost: 11.50, trendScore: 79,
    demandLevel: "high", competitionLevel: "medium",
    platform: "Amazon & Facebook",
    monthlySearchVolume: "210K+",
    targetMarket: "Evcil hayvan sahipleri, 30-55 yaş",
  },
  {
    name: "Self-Heating Car Seat Cushion",
    nameTr: "Isıtmalı Araç Koltuk Minderi",
    category: "Car",
    sellingPrice: 38.99, cost: 12.50, trendScore: 76,
    demandLevel: "medium", competitionLevel: "high",
    platform: "Amazon & Facebook",
    monthlySearchVolume: "145K+",
    targetMarket: "Kış sürücüleri, soğuk iklim bölgeleri",
  },
  {
    name: "Resistance Bands Set Door Anchor",
    nameTr: "Kapı Destekli Direnç Bandı Seti",
    category: "Fitness",
    sellingPrice: 21.99, cost: 4.30, trendScore: 90,
    demandLevel: "high", competitionLevel: "low",
    platform: "TikTok & Amazon",
    monthlySearchVolume: "780K+",
    targetMarket: "Ev sporcuları, fitness başlangıç",
  },
  {
    name: "Automatic Pet Feeder with Timer",
    nameTr: "Zamanlayıcılı Otomatik Evcil Hayvan Mama Kabı",
    category: "Pet",
    sellingPrice: 49.99, cost: 17.50, trendScore: 84,
    demandLevel: "high", competitionLevel: "medium",
    platform: "Amazon & Instagram",
    monthlySearchVolume: "165K+",
    targetMarket: "Meşgul evcil hayvan sahipleri",
  },
  {
    name: "Mini Projector Home Cinema",
    nameTr: "Mini Ev Sineması Projektörü",
    category: "Tech",
    sellingPrice: 59.99, cost: 21.00, trendScore: 73,
    demandLevel: "medium", competitionLevel: "high",
    platform: "Amazon & YouTube Ads",
    monthlySearchVolume: "310K+",
    targetMarket: "Film severler, 20-40 yaş",
  },
  {
    name: "Aromatherapy Car Diffuser",
    nameTr: "Araç İçi Aromaterapi Difüzörü",
    category: "Car",
    sellingPrice: 15.99, cost: 3.40, trendScore: 85,
    demandLevel: "high", competitionLevel: "low",
    platform: "TikTok & Amazon",
    monthlySearchVolume: "195K+",
    targetMarket: "Araç sahipleri, wellness odaklı",
  },
  {
    name: "Smart Water Bottle Temperature Display",
    nameTr: "Sıcaklık Göstergeli Akıllı Su Şişesi",
    category: "Fitness",
    sellingPrice: 28.99, cost: 8.50, trendScore: 81,
    demandLevel: "high", competitionLevel: "medium",
    platform: "Amazon & TikTok",
    monthlySearchVolume: "225K+",
    targetMarket: "Sporcu ve sağlık odaklı kullanıcılar",
  },
  {
    name: "Interactive Cat Laser Toy Auto",
    nameTr: "Otomatik Kedi Lazer Oyuncağı",
    category: "Pet",
    sellingPrice: 16.99, cost: 4.10, trendScore: 93,
    demandLevel: "high", competitionLevel: "low",
    platform: "TikTok & Instagram",
    monthlySearchVolume: "340K+",
    targetMarket: "Kedi sahipleri, ev kedisi besleyenler",
  },
  {
    name: "Blind Spot Mirror Adjustable",
    nameTr: "Ayarlanabilir Kör Nokta Aynası",
    category: "Car",
    sellingPrice: 12.99, cost: 2.60, trendScore: 70,
    demandLevel: "medium", competitionLevel: "low",
    platform: "Amazon & Facebook",
    monthlySearchVolume: "290K+",
    targetMarket: "Tüm araç sürücüleri",
  },
  {
    name: "Floating Shelf Hidden Bracket",
    nameTr: "Gizli Braketli Yüzer Duvar Rafı",
    category: "Home",
    sellingPrice: 26.99, cost: 7.10, trendScore: 77,
    demandLevel: "medium", competitionLevel: "medium",
    platform: "Pinterest & Amazon",
    monthlySearchVolume: "185K+",
    targetMarket: "Ev dekorasyon tutkunları",
  },
  {
    name: "Wireless Earbuds Cleaning Kit",
    nameTr: "Kablosuz Kulaklık Temizleme Kiti",
    category: "Tech",
    sellingPrice: 12.99, cost: 2.50, trendScore: 78,
    demandLevel: "medium", competitionLevel: "low",
    platform: "TikTok & Amazon",
    monthlySearchVolume: "120K+",
    targetMarket: "AirPods & kulaklık kullanıcıları",
  },
];

export function getViralProducts(): ViralProduct[] {
  return RAW.map((p, i) => {
    const margin = Math.round(((p.sellingPrice - p.cost) / p.sellingPrice) * 100 * 10) / 10;
    const riskLevel = deriveRisk(p.competitionLevel, p.trendScore);
    const decisionScore = calcDecision(margin, p.trendScore, p.demandLevel, p.competitionLevel);
    const isHot = p.trendScore > 85 && p.competitionLevel === "low";
    return {
      ...p,
      id: `viral-${i}`,
      margin,
      riskLevel,
      decisionScore,
      isHot,
    };
  });
}
