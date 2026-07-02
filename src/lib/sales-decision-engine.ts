import { supabase } from "@/integrations/supabase/client";

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
  ai_analysis?: string;
}

const MIDDLE_EAST = ["turkey","türkiye","tr","saudi arabia","sa","uae","ae","qatar","qa","kuwait","kw","bahrain","oman","iraq","jordan","egypt"];
const HIGH_VISUAL_CATS = ["furniture","home decor","luxury decor","home design","fashion","jewelry","watches","bags","shoes","lighting","decoration","aksesuar","mobilya","dekorasyon"];
const LUXURY_CATS = ["luxury decor","jewelry","watches","premium","luxury","furniture","mobilya"];
const TREND_CATS = ["gadget","tech","electronics","phone accessories","tiktok","viral","fitness","beauty","kozmetik"];
const SATURATED_KEYWORDS = ["powerbank","power bank","phone case","kılıf","cable","kablo","charger","şarj","şarj cihazı","earbuds","kulaklık","mouse pad","screen protector","cam filmi","usb","hdmi","adapter","adaptör","selfie stick","pop socket","ring holder"];

function norm(v: number, min: number, max: number) {
  return Math.max(0, Math.min(100, ((v - min) / (max - min)) * 100));
}

export function runDecisionEngine(input: DecisionInput): DecisionOutput {
  const { product_name, product_price, cost_price, target_country, product_category } = input;
  const cat = product_category.toLowerCase();
  const country = target_country.toLowerCase();
  const name = product_name.toLowerCase();

  const margin = product_price > 0 ? ((product_price - cost_price) / product_price) * 100 : 0;
  const marginScore = norm(margin, 0, 60);

  const triggers: string[] = [];
  if (LUXURY_CATS.some(c => cat.includes(c) || name.includes(c))) triggers.push("status", "luxury");
  if (cat.includes("sofa") || cat.includes("furniture") || cat.includes("mobilya") || name.includes("sofa")) triggers.push("comfort");
  if (TREND_CATS.some(c => cat.includes(c) || name.includes(c))) triggers.push("trend");
  if (cat.includes("security") || cat.includes("health") || cat.includes("sağlık")) triggers.push("fear");
  if (triggers.length === 0) triggers.push("utility");
  const uniqueTriggers = [...new Set(triggers)];
  const triggerScore = Math.min(uniqueTriggers.length * 20, 60);

  const isME = MIDDLE_EAST.some(c => country.includes(c));
  const meBias = isME && (cat.includes("furniture") || cat.includes("decor") || cat.includes("luxury") || cat.includes("mobilya") || cat.includes("dekorasyon")) ? 25 : 0;
  const highTicketBonus = product_price > 500 ? 10 : 0;
  const marketFit = Math.min(100, Math.round(40 + meBias + highTicketBonus + triggerScore * 0.3));

  const isUnique = uniqueTriggers.includes("luxury") || uniqueTriggers.includes("status") || product_price > 300;
  const competitionLevel: "LOW" | "MEDIUM" | "HIGH" = isUnique ? "LOW" : margin < 30 ? "HIGH" : "MEDIUM";
  const compScore = competitionLevel === "LOW" ? 80 : competitionLevel === "MEDIUM" ? 50 : 20;

  const isVisual = HIGH_VISUAL_CATS.some(c => cat.includes(c) || name.includes(c));
  const adPotential = Math.min(100, Math.round((isVisual ? 70 : 40) + (uniqueTriggers.includes("trend") ? 15 : 0) + (margin > 40 ? 10 : 0)));

  const isSaturated = SATURATED_KEYWORDS.some(k => name.includes(k) || cat.includes(k));
  const saturationPenalty = isSaturated ? 30 : 0;

  const platforms: string[] = [];
  if (uniqueTriggers.includes("trend") || isVisual) platforms.push("tiktok", "instagram");
  if (product_price > 100 || uniqueTriggers.includes("luxury")) platforms.push("facebook");
  if (product_price > 300) platforms.push("google");
  if (platforms.length === 0) platforms.push("facebook", "instagram");

  const rawScore = Math.round(marginScore * 0.35 + marketFit * 0.25 + adPotential * 0.25 + compScore * 0.15);
  const totalScore = Math.max(0, rawScore - saturationPenalty);
  const confidence = Math.min(95, Math.max(15, totalScore + (triggerScore > 30 ? 5 : 0)));

  const canWin = margin > 35 && marketFit > 60 && competitionLevel !== "HIGH";
  let decision: "WINNER" | "LOSER";
  let action: "LAUNCH" | "TEST" | "REJECT";

  if (totalScore > 60 && canWin) {
    decision = "WINNER";
    action = totalScore > 70 ? "LAUNCH" : "TEST";
  } else if (totalScore > 50 && competitionLevel !== "HIGH") {
    decision = "LOSER";
    action = "TEST";
  } else {
    decision = "LOSER";
    action = "REJECT";
  }

  if (marketFit < 50) { decision = "LOSER"; if (action === "LAUNCH") action = "TEST"; }
  if ((competitionLevel === "MEDIUM" || competitionLevel === "HIGH") && !isUnique) {
    if (decision === "WINNER") { decision = "LOSER"; action = "TEST"; }
  }

  const ageRange = product_price > 300 ? "30-55" : "18-35";
  const genderHint = (cat.includes("beauty") || cat.includes("kozmetik") || cat.includes("fashion")) ? "kadın ağırlıklı" : "genel";
  const target_audience = `${ageRange} yaş, ${genderHint}, ${isME ? "Orta Doğu" : "global"} pazarı, ${uniqueTriggers[0]} odaklı alıcılar`;

  const pricing_strategy = margin > 50
    ? `Premium fiyatlandırma uygun — %${margin.toFixed(0)} marj ile agresif reklam bütçesi ayrılabilir.`
    : margin > 30
    ? `Orta segment fiyat — marj yeterli ama reklam maliyetlerine dikkat edilmeli.`
    : `Düşük marj — fiyat artırılmalı veya maliyet düşürülmeli, aksi halde kârsız.`;

  const quick_reason = decision === "WINNER"
    ? `%${margin.toFixed(0)} marj ve güçlü ${uniqueTriggers.join("+")} tetikleyicileri ile bu ürün satış potansiyeli yüksek.`
    : `%${margin.toFixed(0)} marj yetersiz ve rekabet seviyesi ${competitionLevel} — bu ürün riskli.`;

  return {
    decision, confidence_score: confidence,
    estimated_margin_percent: Math.round(margin * 10) / 10,
    target_audience, emotional_trigger: uniqueTriggers, market_fit: marketFit,
    competition_level: competitionLevel, ad_potential: adPotential,
    recommended_platform: [...new Set(platforms)],
    pricing_strategy, quick_reason, action,
  };
}

export async function runDecisionEngineAI(input: DecisionInput): Promise<string> {
  const base = runDecisionEngine(input);

  const prompt = `Sen bir e-ticaret ve dropshipping uzmanısın. Aşağıdaki ürün için kısa ve net bir AI değerlendirmesi yaz.

ÜRÜN BİLGİLERİ:
- Ürün: ${input.product_name}
- Kategori: ${input.product_category}
- Satış Fiyatı: ${input.product_price}
- Maliyet: ${input.cost_price}
- Kâr Marjı: %${base.estimated_margin_percent}
- Hedef Ülke: ${input.target_country}
- Algoritma Kararı: ${base.decision} (Skor: ${base.confidence_score}/100)
- Aksiyon: ${base.action}
${input.description ? `- Açıklama: ${input.description}` : ""}

Türkçe olarak 3-4 cümle yaz:
1. Bu ürünün gerçek pazar potansiyeli hakkında görüşün
2. En büyük risk nedir?
3. Eğer satacaksa hangi reklam stratejisini önerirsin?

Kısa, direkt ve pratik ol. "AI olarak" gibi ifadeler kullanma.`;

  try {
    const { data, error } = await supabase.functions.invoke("anthropic-proxy", {
      body: {
        model: "claude-haiku-4-5",
        max_tokens: 300,
        messages: [{ role: "user", content: prompt }],
      },
    });

    if (error) throw error;

    return data.content?.[0]?.text || "";
  } catch {
    return "";
  }
}
