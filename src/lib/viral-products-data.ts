export interface ViralProduct {
  id: string;
  name: string;
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
  category: string;
  sellingPrice: number;
  cost: number;
  trendScore: number;
  demandLevel: "low" | "medium" | "high";
  competitionLevel: "low" | "medium" | "high";
}

const RAW: RawProduct[] = [
  { name: "Magnetic Posture Corrector", category: "Fitness", sellingPrice: 29.99, cost: 6.50, trendScore: 92, demandLevel: "high", competitionLevel: "medium" },
  { name: "LED Sunset Projection Lamp", category: "Home", sellingPrice: 24.99, cost: 7.20, trendScore: 88, demandLevel: "high", competitionLevel: "low" },
  { name: "Portable Pet Water Bottle", category: "Pet", sellingPrice: 18.99, cost: 4.30, trendScore: 85, demandLevel: "high", competitionLevel: "low" },
  { name: "Smart Posture Reminder Necklace", category: "Tech", sellingPrice: 39.99, cost: 11.00, trendScore: 78, demandLevel: "medium", competitionLevel: "low" },
  { name: "Anti-Gravity Humidifier", category: "Home", sellingPrice: 44.99, cost: 14.50, trendScore: 81, demandLevel: "high", competitionLevel: "medium" },
  { name: "Car Phone Mount with Wireless Charger", category: "Car", sellingPrice: 32.99, cost: 9.80, trendScore: 83, demandLevel: "high", competitionLevel: "medium" },
  { name: "Cloud Shaped Night Light", category: "Home", sellingPrice: 19.99, cost: 5.40, trendScore: 90, demandLevel: "high", competitionLevel: "low" },
  { name: "Foldable Laptop Stand", category: "Tech", sellingPrice: 27.99, cost: 8.00, trendScore: 72, demandLevel: "medium", competitionLevel: "high" },
  { name: "Electric Scalp Massager", category: "Fitness", sellingPrice: 22.99, cost: 6.00, trendScore: 86, demandLevel: "high", competitionLevel: "low" },
  { name: "GPS Pet Tracker Collar", category: "Pet", sellingPrice: 34.99, cost: 12.00, trendScore: 77, demandLevel: "high", competitionLevel: "medium" },
  { name: "Self-Heating Car Seat Cushion", category: "Car", sellingPrice: 38.99, cost: 13.00, trendScore: 74, demandLevel: "medium", competitionLevel: "high" },
  { name: "Resistance Bands Set with Door Anchor", category: "Fitness", sellingPrice: 21.99, cost: 4.80, trendScore: 89, demandLevel: "high", competitionLevel: "low" },
  { name: "Automatic Pet Feeder with Timer", category: "Pet", sellingPrice: 49.99, cost: 18.00, trendScore: 82, demandLevel: "high", competitionLevel: "medium" },
  { name: "Mini Projector for Home Cinema", category: "Tech", sellingPrice: 59.99, cost: 22.00, trendScore: 71, demandLevel: "medium", competitionLevel: "high" },
  { name: "Aromatherapy Car Diffuser", category: "Car", sellingPrice: 15.99, cost: 3.80, trendScore: 84, demandLevel: "high", competitionLevel: "low" },
  { name: "Smart Water Bottle with Temperature Display", category: "Fitness", sellingPrice: 28.99, cost: 9.00, trendScore: 79, demandLevel: "high", competitionLevel: "medium" },
  { name: "Interactive Cat Laser Toy", category: "Pet", sellingPrice: 16.99, cost: 4.50, trendScore: 91, demandLevel: "high", competitionLevel: "low" },
  { name: "Blind Spot Mirror for Car", category: "Car", sellingPrice: 12.99, cost: 2.80, trendScore: 68, demandLevel: "medium", competitionLevel: "low" },
  { name: "Floating Shelf with Hidden Bracket", category: "Home", sellingPrice: 26.99, cost: 7.50, trendScore: 75, demandLevel: "medium", competitionLevel: "medium" },
  { name: "Wireless Earbuds Cleaning Kit", category: "Tech", sellingPrice: 12.99, cost: 2.80, trendScore: 76, demandLevel: "medium", competitionLevel: "low" },
];

export function getViralProducts(): ViralProduct[] {
  return RAW.map((p, i) => {
    const margin = Math.round(((p.sellingPrice - p.cost) / p.sellingPrice) * 100 * 10) / 10;
    const riskLevel = deriveRisk(p.competitionLevel, p.trendScore);
    const decisionScore = calcDecision(margin, p.trendScore, p.demandLevel, p.competitionLevel);
    const isHot = p.trendScore > 80 && p.competitionLevel === "low";
    return { ...p, id: `viral-${i}`, margin, riskLevel, decisionScore, isHot };
  });
}
