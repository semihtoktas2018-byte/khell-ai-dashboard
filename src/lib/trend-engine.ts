import type { TrendProduct } from "./services/tiktokTrends";
import { fetchTikTokTrends } from "./services/tiktokTrends";
import { fetchAmazonTrends } from "./services/amazonTrends";
import { fetchAliExpressTrends } from "./services/aliexpressTrends";
import { fetchGoogleTrends } from "./services/googleTrends";

export interface ScoredTrendProduct extends TrendProduct {
  compositeTrendScore: number;
  profitMargin: number;
  isViral: boolean;
}

function calculateCompositeTrendScore(
  tiktokScore: number,
  amazonScore: number,
  aliexpressScore: number,
  googleScore: number
): number {
  return Math.round(
    tiktokScore * 0.35 +
    amazonScore * 0.25 +
    aliexpressScore * 0.20 +
    googleScore * 0.20
  );
}

export function getAllTrendProducts(): ScoredTrendProduct[] {
  const tiktok = fetchTikTokTrends();
  const amazon = fetchAmazonTrends();
  const aliexpress = fetchAliExpressTrends();
  const google = fetchGoogleTrends();

  const avgScores = {
    tiktok: tiktok.reduce((s, p) => s + p.trendScore, 0) / (tiktok.length || 1),
    amazon: amazon.reduce((s, p) => s + p.trendScore, 0) / (amazon.length || 1),
    aliexpress: aliexpress.reduce((s, p) => s + p.trendScore, 0) / (aliexpress.length || 1),
    google: google.reduce((s, p) => s + p.trendScore, 0) / (google.length || 1),
  };

  const all = [...tiktok, ...amazon, ...aliexpress, ...google];

  return all.map((p) => {
    const profitMargin = ((p.estimatedSellingPrice - p.estimatedCost) / p.estimatedSellingPrice) * 100;
    const composite = calculateCompositeTrendScore(
      p.platform === "TikTok" ? p.trendScore : avgScores.tiktok,
      p.platform === "Amazon" ? p.trendScore : avgScores.amazon,
      p.platform === "AliExpress" ? p.trendScore : avgScores.aliexpress,
      p.platform === "Google Trends" ? p.trendScore : avgScores.google
    );
    const isViral = p.trendScore > 70 && profitMargin > 25 && p.competitionLevel !== "High";

    return { ...p, compositeTrendScore: composite, profitMargin: Math.round(profitMargin * 10) / 10, isViral };
  });
}

export function detectViralProducts(products: ScoredTrendProduct[]): ScoredTrendProduct[] {
  return products
    .filter((p) => p.isViral)
    .sort((a, b) => b.compositeTrendScore - a.compositeTrendScore)
    .slice(0, 20);
}

export function getPlatformDistribution(products: ScoredTrendProduct[]) {
  const map: Record<string, number> = {};
  products.forEach((p) => { map[p.platform] = (map[p.platform] || 0) + 1; });
  return Object.entries(map).map(([name, value]) => ({ name, value }));
}

export function getCategoryDistribution(products: ScoredTrendProduct[]) {
  const map: Record<string, number> = {};
  products.forEach((p) => { map[p.category] = (map[p.category] || 0) + 1; });
  return Object.entries(map)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
}
