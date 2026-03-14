export interface AnalyzerInput {
  product_cost: number;
  shipping_cost: number;
  ads_cost: number;
  selling_price: number;
  monthly_orders_estimate: number;
}

export interface AnalyzerResult {
  gross_profit: number;
  profit_margin: number;
  monthly_profit: number;
  decision_score: number;
  risk_level: "low" | "medium" | "high";
  verdict: Verdict;
  cost_breakdown: CostItem[];
}

export interface Verdict {
  label: string;
  labelTr: string;
  class: string;
  color: string;
}

export interface CostItem {
  name: string;
  value: number;
  color: string;
}

export function getVerdict(margin: number): Verdict {
  if (margin >= 40) return { label: "Winning Product", labelTr: "Kazanan Ürün", class: "verdict-winning", color: "hsl(142 71% 45%)" };
  if (margin >= 25) return { label: "Good", labelTr: "İyi Ürün", class: "verdict-good", color: "hsl(217 91% 60%)" };
  if (margin >= 10) return { label: "Risky", labelTr: "Riskli Ürün", class: "verdict-risky", color: "hsl(38 92% 50%)" };
  return { label: "Bad Product", labelTr: "Kötü Ürün", class: "verdict-bad", color: "hsl(0 84% 60%)" };
}

export function getRiskLevel(margin: number, orders: number): "low" | "medium" | "high" {
  if (margin >= 35 && orders >= 50) return "low";
  if (margin >= 20 && orders >= 20) return "medium";
  return "high";
}

export function calculateDecisionScore(margin: number, orders: number, riskLevel: "low" | "medium" | "high"): number {
  const marginScore = Math.min(margin / 50 * 40, 40); // max 40 points
  const demandScore = Math.min(orders / 200 * 30, 30); // max 30 points
  const riskScore = riskLevel === "low" ? 30 : riskLevel === "medium" ? 15 : 5; // max 30 points
  return Math.round(Math.min(marginScore + demandScore + riskScore, 100));
}

export function analyzeProduct(input: AnalyzerInput): AnalyzerResult {
  const totalCost = input.product_cost + input.shipping_cost + input.ads_cost;
  const gross_profit = input.selling_price - totalCost;
  const profit_margin = input.selling_price > 0 ? (gross_profit / input.selling_price) * 100 : 0;
  const monthly_profit = gross_profit * input.monthly_orders_estimate;
  const risk_level = getRiskLevel(profit_margin, input.monthly_orders_estimate);
  const decision_score = calculateDecisionScore(profit_margin, input.monthly_orders_estimate, risk_level);

  const cost_breakdown: CostItem[] = [
    { name: "Ürün Maliyeti", value: input.product_cost, color: "hsl(0 84% 60%)" },
    { name: "Kargo", value: input.shipping_cost, color: "hsl(38 92% 50%)" },
    { name: "Reklam", value: input.ads_cost, color: "hsl(280 60% 55%)" },
    { name: "Net Kâr", value: Math.max(0, gross_profit), color: "hsl(142 71% 45%)" },
  ].filter((d) => d.value > 0);

  return {
    gross_profit,
    profit_margin,
    monthly_profit,
    decision_score,
    risk_level,
    verdict: getVerdict(profit_margin),
    cost_breakdown,
  };
}

// Risk analysis
export interface RiskFactor {
  name: string;
  score: number; // 0-100 (higher = more risky)
  level: "low" | "medium" | "high";
  description: string;
}

export function analyzeRisk(input: AnalyzerInput): RiskFactor[] {
  const margin = input.selling_price > 0 ? ((input.selling_price - input.product_cost - input.shipping_cost - input.ads_cost) / input.selling_price) * 100 : 0;

  const competitionScore = margin < 15 ? 80 : margin < 30 ? 50 : 20;
  const shippingRisk = input.shipping_cost > input.product_cost * 0.5 ? 75 : input.shipping_cost > input.product_cost * 0.3 ? 45 : 20;
  const supplierRisk = input.product_cost < 2 ? 70 : input.product_cost < 5 ? 40 : 15;
  const adsRisk = input.ads_cost > input.selling_price * 0.3 ? 85 : input.ads_cost > input.selling_price * 0.15 ? 50 : 20;

  const getLevel = (s: number): "low" | "medium" | "high" => s >= 60 ? "high" : s >= 35 ? "medium" : "low";

  return [
    { name: "Rekabet Seviyesi", score: competitionScore, level: getLevel(competitionScore), description: competitionScore >= 60 ? "Yüksek rekabet — marj düşük" : competitionScore >= 35 ? "Orta rekabet seviyesi" : "Düşük rekabet — avantajlı" },
    { name: "Kargo Riski", score: shippingRisk, level: getLevel(shippingRisk), description: shippingRisk >= 60 ? "Kargo maliyeti çok yüksek" : shippingRisk >= 35 ? "Kargo maliyeti kabul edilebilir" : "Kargo maliyeti düşük" },
    { name: "Tedarikçi Güvenilirliği", score: supplierRisk, level: getLevel(supplierRisk), description: supplierRisk >= 60 ? "Çok düşük fiyat — kalite riski" : supplierRisk >= 35 ? "Fiyat normal seviyede" : "Güvenilir fiyat aralığı" },
    { name: "Reklam Maliyeti Riski", score: adsRisk, level: getLevel(adsRisk), description: adsRisk >= 60 ? "Reklam maliyeti kârı yiyor" : adsRisk >= 35 ? "Reklam maliyeti orta seviye" : "Reklam maliyeti düşük" },
  ];
}
