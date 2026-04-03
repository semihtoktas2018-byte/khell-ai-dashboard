export interface DecisionInput {
  product_name: string;
  product_price: number;
  cost_price: number;
  target_country: string;
  product_category: string;
  product_link?: string;
  description?: string;
}

export interface DecisionOutput {
  decision: "WINNER" | "LOSER";
  confidence_score: number;
  estimated_margin_percent: number;
  target_audience: string;
  emotional_trigger: string[];
  market_fit: number;
  competition_level: "LOW" | "MEDIUM" | "HIGH";
  ad_potential: number;
  recommended_platform: string[];
  pricing_strategy: string;
  quick_reason: string;
  action: "LAUNCH" | "TEST" | "REJECT";
}

const MIDDLE_EAST = ["turkey","türkiye","tr","saudi arabia","sa","uae","ae","qatar","qa","kuwait","kw","bahrain","oman","iraq","jordan","egypt"];
const HIGH_VISUAL_CATS = ["furniture","home decor","luxury decor","home design","fashion","jewelry","watches","bags","shoes","lighting","decoration","aksesuar","mobilya","dekorasyon"];
const LUXURY_CATS = ["luxury decor","jewelry","watches","premium","luxury","furniture","mobilya"];
const TREND_CATS = ["gadget","tech","electronics","phone accessories","tiktok","viral","fitness","beauty","kozmetik"];

function norm(v: number, min: number, max: number) {
  return Math.max(0, Math.min(100, ((v - min) / (max - min)) * 100));
}

export function runDecisionEngine(input: DecisionInput): DecisionOutput {
  const { product_name, product_price, cost_price, target_country, product_category } = input;
  const cat = product_category.toLowerCase();
  const country = target_country.toLowerCase();
  const name = product_name.toLowerCase();

  // 1. MARGIN
  const margin = product_price > 0 ? ((product_price - cost_price) / product_price) * 100 : 0;
  const marginScore = norm(margin, 0, 60);

  // 2. EMOTIONAL TRIGGERS
  const triggers: string[] = [];
  if (LUXURY_CATS.some(c => cat.includes(c) || name.includes(c))) triggers.push("status", "luxury");
  if (cat.includes("sofa") || cat.includes("furniture") || cat.includes("mobilya") || name.includes("sofa")) triggers.push("comfort");
  if (TREND_CATS.some(c => cat.includes(c) || name.includes(c))) triggers.push("trend");
  if (cat.includes("security") || cat.includes("health") || cat.includes("sağlık")) triggers.push("fear");
  if (triggers.length === 0) triggers.push("utility");
  const uniqueTriggers = [...new Set(triggers)];
  const triggerScore = Math.min(uniqueTriggers.length * 20, 60);

  // 3. MARKET FIT
  const isME = MIDDLE_EAST.some(c => country.includes(c));
  const meBias = isME && (cat.includes("furniture") || cat.includes("decor") || cat.includes("luxury") || cat.includes("mobilya") || cat.includes("dekorasyon")) ? 25 : 0;
  const highTicketBonus = product_price > 500 ? 10 : 0;
  const marketFit = Math.min(100, Math.round(40 + meBias + highTicketBonus + triggerScore * 0.3));

  // 4. COMPETITION
  const isUnique = uniqueTriggers.includes("luxury") || uniqueTriggers.includes("status") || product_price > 300;
  const competitionLevel: "LOW" | "MEDIUM" | "HIGH" = isUnique ? "LOW" : margin < 30 ? "HIGH" : "MEDIUM";
  const compScore = competitionLevel === "LOW" ? 80 : competitionLevel === "MEDIUM" ? 50 : 20;

  // 5. AD POTENTIAL
  const isVisual = HIGH_VISUAL_CATS.some(c => cat.includes(c) || name.includes(c));
  const adPotential = Math.min(100, Math.round((isVisual ? 70 : 40) + (uniqueTriggers.includes("trend") ? 15 : 0) + (margin > 40 ? 10 : 0)));

  // 6. PLATFORMS
  const platforms: string[] = [];
  if (uniqueTriggers.includes("trend") || isVisual) platforms.push("tiktok", "instagram");
  if (product_price > 100 || uniqueTriggers.includes("luxury")) platforms.push("facebook");
  if (product_price > 300) platforms.push("google");
  if (platforms.length === 0) platforms.push("facebook", "instagram");

  // 7. FINAL SCORE
  const totalScore = Math.round(marginScore * 0.35 + marketFit * 0.25 + adPotential * 0.25 + compScore * 0.15);
  const confidence = Math.min(95, Math.max(15, totalScore + (triggerScore > 30 ? 5 : 0)));

  const decision: "WINNER" | "LOSER" = totalScore > 60 ? "WINNER" : "LOSER";
  const action: "LAUNCH" | "TEST" | "REJECT" = totalScore > 70 ? "LAUNCH" : totalScore > 50 ? "TEST" : "REJECT";

  // 8. AUDIENCE
  const ageRange = product_price > 300 ? "30-55" : "18-35";
  const genderHint = (cat.includes("beauty") || cat.includes("kozmetik") || cat.includes("fashion")) ? "kadın ağırlıklı" : "genel";
  const target_audience = `${ageRange} yaş, ${genderHint}, ${isME ? "Orta Doğu" : "global"} pazarı, ${uniqueTriggers[0]} odaklı alıcılar`;

  // 9. PRICING
  const pricing_strategy = margin > 50
    ? `Premium fiyatlandırma uygun — %${margin.toFixed(0)} marj ile agresif reklam bütçesi ayrılabilir.`
    : margin > 30
    ? `Orta segment fiyat — marj yeterli ama reklam maliyetlerine dikkat edilmeli.`
    : `Düşük marj — fiyat artırılmalı veya maliyet düşürülmeli, aksi halde kârsız.`;

  // 10. REASON
  const quick_reason = decision === "WINNER"
    ? `%${margin.toFixed(0)} marj ve güçlü ${uniqueTriggers.join("+")} tetikleyicileri ile bu ürün satış potansiyeli yüksek.`
    : `%${margin.toFixed(0)} marj yetersiz ve rekabet seviyesi ${competitionLevel} — bu ürün riskli.`;

  return {
    decision,
    confidence_score: confidence,
    estimated_margin_percent: Math.round(margin * 10) / 10,
    target_audience,
    emotional_trigger: uniqueTriggers,
    market_fit: marketFit,
    competition_level: competitionLevel,
    ad_potential: adPotential,
    recommended_platform: [...new Set(platforms)],
    pricing_strategy,
    quick_reason,
    action,
  };
}
