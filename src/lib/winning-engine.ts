export type WinningTier = "Viral Winner" | "Strong Product" | "Medium Potential" | "Weak Product";

export interface WinningProduct {
  id: string;
  name: string;
  platform: string;
  category: string;
  trendScore: number;
  profitMargin: number;
  competitionLevel: "Low" | "Medium" | "High";
  riskScore: number;
  winningScore: number;
  tier: WinningTier;
  estimatedSellingPrice: number;
  estimatedCost: number;
  image: string;
}

function competitionToNum(level: "Low" | "Medium" | "High"): number {
  return level === "Low" ? 20 : level === "Medium" ? 50 : 85;
}

function classifyTier(score: number): WinningTier {
  if (score > 80) return "Viral Winner";
  if (score > 60) return "Strong Product";
  if (score > 40) return "Medium Potential";
  return "Weak Product";
}

export function calculateWinningScore(
  trendScore: number,
  profitMargin: number,
  competitionLevel: "Low" | "Medium" | "High",
  riskScore: number
): { winningScore: number; tier: WinningTier } {
  const compScore = competitionToNum(competitionLevel);
  const marginCapped = Math.min(profitMargin, 100);
  const winningScore = Math.round(
    trendScore * 0.4 +
    marginCapped * 0.3 +
    (100 - compScore) * 0.2 +
    (100 - riskScore) * 0.1
  );
  return { winningScore, tier: classifyTier(winningScore) };
}

export function tierColor(tier: WinningTier): string {
  switch (tier) {
    case "Viral Winner": return "text-emerald-400";
    case "Strong Product": return "text-blue-400";
    case "Medium Potential": return "text-amber-400";
    case "Weak Product": return "text-red-400";
  }
}

export function tierBg(tier: WinningTier): string {
  switch (tier) {
    case "Viral Winner": return "bg-emerald-500/10 border-emerald-500/30";
    case "Strong Product": return "bg-blue-500/10 border-blue-500/30";
    case "Medium Potential": return "bg-amber-500/10 border-amber-500/30";
    case "Weak Product": return "bg-red-500/10 border-red-500/30";
  }
}
