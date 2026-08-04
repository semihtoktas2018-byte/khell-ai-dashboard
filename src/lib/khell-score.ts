// =============================================================================
// KHELL SCORE — TEK SKOR MOTORU (single source of truth)
// -----------------------------------------------------------------------------
// Amaç: Uygulamanın her yerinde aynı ürün AYNI mantıkla puanlansın.
// Daha önce analyzer.ts, TrendScore.tsx, DailyWinner.tsx, winning-engine.ts,
// auto-hunter.ts ve sales-decision-engine.ts birbirinden farklı formüller
// kullanıyordu ve iki ayrı yer "KHELL Skoru" adını taşıyordu. Artık hepsi
// bu dosyadaki fonksiyonları çağırır.
//
// Felsefe: KHELL Skoru 4 boyutun ağırlıklı birleşimidir (0..100):
//   Kâr (Profit)        %35  — marj ne kadar iyi?
//   Talep (Demand)      %25  — ürüne ilgi/sipariş sinyali ne kadar güçlü?
//   Rekabet (Comp.)     %25  — pazar ne kadar boş? (az rakip = yüksek puan)
//   Risk                %15  — operasyonel/tedarik riski ne kadar düşük?
//
// Bir modülde bu boyutlardan bazıları yoksa (ör. TrendScore'da marj yok),
// skor SADECE mevcut boyutlar üzerinden yeniden normalize edilir. Böylece
// eksik veriyle uydurma sayı üretilmez.
// =============================================================================

export const KHELL_SCORE_WEIGHTS = {
  profit: 0.35,
  demand: 0.25,
  competition: 0.25,
  risk: 0.15,
} as const;

export type CompetitionLevel = "Low" | "Medium" | "High" | "low" | "medium" | "high" | "LOW" | "MEDIUM" | "HIGH";
export type RiskLevel = "low" | "medium" | "high";

function clamp(n: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, n));
}

// --- Boyut dönüştürücüler: ham veri -> 0..100 boyut puanı --------------------

/** Marj yüzdesinden Kâr puanı. %60 marj = 100 (dropshipping'de üst düzey). */
export function profitScoreFromMargin(marginPct: number): number {
  return clamp((marginPct / 60) * 100);
}

/** Aylık/son sipariş adedinden Talep puanı. 500+ sipariş = 100. */
export function demandScoreFromOrders(orders: number): number {
  return clamp((orders / 500) * 100);
}

/** Rekabet seviyesinden Rekabet puanı. Az rakip = yüksek fırsat puanı. */
export function competitionScoreFromLevel(level: CompetitionLevel): number {
  const l = String(level).toLowerCase();
  if (l === "low") return 85;
  if (l === "medium") return 50;
  return 20; // high
}

/** Pazar doygunluğu (bulunan rakip ürün sayısı) -> Rekabet puanı. */
export function competitionScoreFromSaturation(count: number): number {
  if (count <= 15) return 90;
  if (count <= 50) return 65;
  if (count <= 150) return 40;
  return 20;
}

/** Risk seviyesinden Risk puanı (düşük risk = yüksek puan). */
export function riskScoreFromLevel(level: RiskLevel): number {
  if (level === "low") return 90;
  if (level === "medium") return 55;
  return 25; // high
}

/** Ham risk puanı (0..100, yüksek = daha riskli) -> fırsat puanına çevirir. */
export function riskScoreFromRaw(riskHigherIsWorse: number): number {
  return clamp(100 - riskHigherIsWorse);
}

// --- Ana skor: mevcut boyutlar üzerinden ağırlıklı + normalize ---------------

export interface KhellDimensions {
  profit?: number | null;      // 0..100
  demand?: number | null;      // 0..100
  competition?: number | null; // 0..100
  risk?: number | null;        // 0..100
}

/**
 * KHELL Skoru: verilen boyutların ağırlıklı ortalaması (0..100).
 * Eksik (null/undefined) boyutlar hesaba katılmaz, ağırlıklar kalanlar
 * üzerinden yeniden normalize edilir. Hiç boyut yoksa null döner.
 */
export function calculateKhellScore(dims: KhellDimensions): number | null {
  const parts: { value: number; weight: number }[] = [];
  if (dims.profit != null) parts.push({ value: clamp(dims.profit), weight: KHELL_SCORE_WEIGHTS.profit });
  if (dims.demand != null) parts.push({ value: clamp(dims.demand), weight: KHELL_SCORE_WEIGHTS.demand });
  if (dims.competition != null) parts.push({ value: clamp(dims.competition), weight: KHELL_SCORE_WEIGHTS.competition });
  if (dims.risk != null) parts.push({ value: clamp(dims.risk), weight: KHELL_SCORE_WEIGHTS.risk });

  const totalWeight = parts.reduce((s, p) => s + p.weight, 0);
  if (totalWeight === 0) return null;

  const weighted = parts.reduce((s, p) => s + p.value * p.weight, 0);
  return Math.round(weighted / totalWeight);
}

// --- Tek tier (seviye) sistemi -----------------------------------------------

export type KhellTier = "viral" | "strong" | "medium" | "weak";

/** Tek eşik seti. Uygulamanın her yerinde geçerli. */
export function khellTier(score: number): KhellTier {
  if (score >= 80) return "viral";
  if (score >= 60) return "strong";
  if (score >= 40) return "medium";
  return "weak";
}

export function khellTierLabel(tier: KhellTier, isTr: boolean): string {
  switch (tier) {
    case "viral": return isTr ? "💎 Gizli Hazine" : "💎 Hidden Gem";
    case "strong": return isTr ? "🔥 Güçlü Fırsat" : "🔥 Strong Opportunity";
    case "medium": return isTr ? "⚡ Orta Potansiyel" : "⚡ Medium Potential";
    case "weak": return isTr ? "Düşük Potansiyel" : "Low Potential";
  }
}

export function khellTierColor(tier: KhellTier): string {
  switch (tier) {
    case "viral": return "text-emerald-400";
    case "strong": return "text-blue-400";
    case "medium": return "text-amber-400";
    case "weak": return "text-red-400";
  }
}

export function khellTierBg(tier: KhellTier): string {
  switch (tier) {
    case "viral": return "bg-emerald-500/10 border-emerald-500/30";
    case "strong": return "bg-blue-500/10 border-blue-500/30";
    case "medium": return "bg-amber-500/10 border-amber-500/30";
    case "weak": return "bg-red-500/10 border-red-500/30";
  }
}

/**
 * TrendScore.tsx'in beklediği {label, color, glow} formatı — geriye dönük
 * uyum için tek kaynaktan üretilir.
 */
export function khellScoreMeta(score: number, isTr: boolean): { label: string; color: string; glow: string } {
  const tier = khellTier(score);
  const glow =
    tier === "viral" ? "shadow-[0_0_20px_rgba(52,211,153,0.5)]" :
    tier === "strong" ? "shadow-[0_0_14px_rgba(52,211,153,0.35)]" : "";
  const color = tier === "medium" ? "text-yellow-400" : khellTierColor(tier);
  return { label: khellTierLabel(tier, isTr), color, glow };
}
