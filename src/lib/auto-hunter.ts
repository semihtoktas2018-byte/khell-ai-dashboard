import { fetchTikTokTrends } from "./services/tiktokTrends";
import { fetchAmazonTrends } from "./services/amazonTrends";
import { fetchAliExpressTrends } from "./services/aliexpressTrends";

export interface HunterCandidate {
  id: string;
  name: string;
  category: string;
  platform: string;
  trendScore: number;
  engagementScore: number;
  competitionLevel: "Low" | "Medium" | "High";
  estimatedMargin: number;
  estimatedSellingPrice: number;
  estimatedCost: number;
  hunterScore: number;
  image: string;
}

function competitionToScore(level: "Low" | "Medium" | "High"): number {
  return level === "Low" ? 90 : level === "Medium" ? 55 : 20;
}

function generateEngagement(trendScore: number, competitionLevel: "Low" | "Medium" | "High"): number {
  const multiplier = competitionLevel === "Low" ? 1.1 : competitionLevel === "Medium" ? 1.0 : 0.9;
  return Math.min(100, Math.round(trendScore * multiplier));
}

function calcHunterScore(trend: number, engagement: number, margin: number, compScore: number): number {
  return Math.round(trend * 0.4 + engagement * 0.3 + margin * 0.2 + compScore * 0.1);
}

function processProducts(products: ReturnType<typeof fetchTikTokTrends>): HunterCandidate[] {
  return products.map((p) => {
    const margin = ((p.estimatedSellingPrice - p.estimatedCost) / p.estimatedSellingPrice) * 100;
    const engagement = generateEngagement(p.trendScore, p.competitionLevel);
    const compScore = competitionToScore(p.competitionLevel);
    const marginScore = Math.min(100, margin * 1.5);
    const hunterScore = calcHunterScore(p.trendScore, engagement, marginScore, compScore);

    return {
      id: `hunt-${p.id}`,
      name: p.name,
      category: p.category,
      platform: p.platform,
      trendScore: p.trendScore,
      engagementScore: engagement,
      competitionLevel: p.competitionLevel,
      estimatedMargin: Math.round(margin * 10) / 10,
      estimatedSellingPrice: p.estimatedSellingPrice,
      estimatedCost: p.estimatedCost,
      hunterScore,
      image: p.image,
    };
  });
}

export function scanAllProducts(): HunterCandidate[] {
  const all = [
    ...processProducts(fetchTikTokTrends()),
    ...processProducts(fetchAmazonTrends()),
    ...processProducts(fetchAliExpressTrends()),
  ];
  return all.sort((a, b) => b.hunterScore - a.hunterScore).slice(0, 10);
}
