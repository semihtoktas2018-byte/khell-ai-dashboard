export interface ViralProduct {
  id: string;
  name: string;
  category: string;
  estimatedSellingPrice: number;
  estimatedCost: number;
  trendScore: number;
  demandLevel: "low" | "medium" | "high";
  competitionLevel: "low" | "medium" | "high";
  riskLevel: "Düşük" | "Orta" | "Yüksek";
  decisionScore: number;
}

function calcDecisionScore(
  margin: number,
  demand: "low" | "medium" | "high",
  competition: "low" | "medium" | "high",
  risk: "Düşük" | "Orta" | "Yüksek"
): number {
  const demandVal = demand === "high" ? 30 : demand === "medium" ? 18 : 8;
  const compVal = competition === "high" ? 25 : competition === "medium" ? 14 : 5;
  const riskVal = risk === "Yüksek" ? 20 : risk === "Orta" ? 10 : 3;
  const marginNorm = Math.min(margin, 80) * 0.625; // 0-50 range
  return Math.round(Math.min(100, Math.max(0, marginNorm + demandVal - compVal - riskVal + 30)));
}

const RAW: Omit<ViralProduct, "id" | "decisionScore">[] = [
  { name: "Magnetic Posture Corrector", category: "Sağlık", estimatedSellingPrice: 29.99, estimatedCost: 6.50, trendScore: 92, demandLevel: "high", competitionLevel: "medium", riskLevel: "Düşük" },
  { name: "LED Sunset Projection Lamp", category: "Ev & Dekor", estimatedSellingPrice: 24.99, estimatedCost: 7.20, trendScore: 88, demandLevel: "high", competitionLevel: "low", riskLevel: "Düşük" },
  { name: "Portable Blender Bottle", category: "Mutfak", estimatedSellingPrice: 34.99, estimatedCost: 9.80, trendScore: 85, demandLevel: "high", competitionLevel: "high", riskLevel: "Orta" },
  { name: "Smart Posture Reminder Necklace", category: "Teknoloji", estimatedSellingPrice: 39.99, estimatedCost: 11.00, trendScore: 78, demandLevel: "medium", competitionLevel: "low", riskLevel: "Düşük" },
  { name: "Anti-Gravity Humidifier", category: "Ev & Dekor", estimatedSellingPrice: 44.99, estimatedCost: 14.50, trendScore: 81, demandLevel: "high", competitionLevel: "medium", riskLevel: "Orta" },
  { name: "Wireless Earbuds Cleaning Kit", category: "Aksesuar", estimatedSellingPrice: 12.99, estimatedCost: 2.80, trendScore: 76, demandLevel: "medium", competitionLevel: "low", riskLevel: "Düşük" },
  { name: "Cloud Shaped Night Light", category: "Ev & Dekor", estimatedSellingPrice: 19.99, estimatedCost: 5.40, trendScore: 90, demandLevel: "high", competitionLevel: "medium", riskLevel: "Düşük" },
  { name: "Foldable Laptop Stand", category: "Teknoloji", estimatedSellingPrice: 27.99, estimatedCost: 8.00, trendScore: 72, demandLevel: "medium", competitionLevel: "high", riskLevel: "Orta" },
  { name: "Electric Scalp Massager", category: "Sağlık", estimatedSellingPrice: 22.99, estimatedCost: 6.00, trendScore: 83, demandLevel: "high", competitionLevel: "medium", riskLevel: "Düşük" },
  { name: "Mini Thermal Printer", category: "Teknoloji", estimatedSellingPrice: 49.99, estimatedCost: 18.00, trendScore: 70, demandLevel: "medium", competitionLevel: "medium", riskLevel: "Orta" },
  { name: "Self-Stirring Coffee Mug", category: "Mutfak", estimatedSellingPrice: 17.99, estimatedCost: 4.20, trendScore: 65, demandLevel: "medium", competitionLevel: "high", riskLevel: "Yüksek" },
  { name: "Reusable Silicone Stretch Lids", category: "Mutfak", estimatedSellingPrice: 14.99, estimatedCost: 3.10, trendScore: 68, demandLevel: "medium", competitionLevel: "low", riskLevel: "Düşük" },
  { name: "Neck & Shoulder Heating Pad", category: "Sağlık", estimatedSellingPrice: 32.99, estimatedCost: 10.50, trendScore: 87, demandLevel: "high", competitionLevel: "medium", riskLevel: "Orta" },
  { name: "UV Phone Sanitizer Box", category: "Teknoloji", estimatedSellingPrice: 26.99, estimatedCost: 8.50, trendScore: 60, demandLevel: "low", competitionLevel: "high", riskLevel: "Yüksek" },
  { name: "Minimalist Desk Organizer", category: "Ev & Dekor", estimatedSellingPrice: 21.99, estimatedCost: 5.80, trendScore: 74, demandLevel: "medium", competitionLevel: "low", riskLevel: "Düşük" },
  { name: "Smart Water Bottle with Temperature Display", category: "Sağlık", estimatedSellingPrice: 28.99, estimatedCost: 9.00, trendScore: 79, demandLevel: "high", competitionLevel: "medium", riskLevel: "Orta" },
  { name: "Acupressure Foot Mat", category: "Sağlık", estimatedSellingPrice: 18.99, estimatedCost: 4.00, trendScore: 82, demandLevel: "high", competitionLevel: "low", riskLevel: "Düşük" },
  { name: "Portable Ring Light with Tripod", category: "Aksesuar", estimatedSellingPrice: 36.99, estimatedCost: 12.00, trendScore: 73, demandLevel: "medium", competitionLevel: "high", riskLevel: "Orta" },
  { name: "Car Aromatherapy Diffuser", category: "Aksesuar", estimatedSellingPrice: 15.99, estimatedCost: 3.80, trendScore: 77, demandLevel: "high", competitionLevel: "medium", riskLevel: "Düşük" },
  { name: "Adjustable Dumbbells Set", category: "Spor", estimatedSellingPrice: 59.99, estimatedCost: 22.00, trendScore: 66, demandLevel: "medium", competitionLevel: "high", riskLevel: "Yüksek" },
];

export function getViralProducts(): ViralProduct[] {
  return RAW.map((p, i) => {
    const margin = ((p.estimatedSellingPrice - p.estimatedCost) / p.estimatedSellingPrice) * 100;
    return {
      ...p,
      id: `viral-${i}`,
      decisionScore: calcDecisionScore(margin, p.demandLevel, p.competitionLevel, p.riskLevel),
    };
  });
}
