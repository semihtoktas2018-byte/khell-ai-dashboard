import { fetchTikTokTrends } from "./services/tiktokTrends";
import { fetchAmazonTrends } from "./services/amazonTrends"
import { fetchAliExpressTrends } from "./services/aliexpressTrends";

const CACHE_KEY = "khell_hunter_cache";
const CACHE_TTL = 6 * 60 * 60 * 1000; // 6 saat

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
  decision: "SAT" | "TEST" | "KAÇIN";
  confidence: number;
  image: string;
}

function getCache(): HunterCandidate[] | null {
  const raw = localStorage.getItem(CACHE_KEY);
  if (!raw) return null;

  const parsed = JSON.parse(raw);
  if (Date.now() - parsed.time > CACHE_TTL) return null;

  return parsed.data;
}

function setCache(data: HunterCandidate[]) {
  localStorage.setItem(
    CACHE_KEY,
    JSON.stringify({
      time: Date.now(),
      data,
    })
  );
}

function competitionScore(level: "Low" | "Medium" | "High") {
  if (level === "Low") return 90;
  if (level === "Medium") return 55;
  return 20;
}

function platformBoost(platform: string) {
  if (platform === "TikTok") return 5;
  if (platform === "Amazon") return 3;
  if (platform === "AliExpress") return 2;
  return 1;
}

function generateEngagement(trend: number) {
  return Math.min(100, Math.round(trend * (0.8 + Math.random() * 0.3)));
}

function calcScore(
  trend: number,
  engagement: number,
  marginScore: number,
  compScore: number,
  platform: string
) {
  return Math.round(
    trend * 0.35 +
      engagement * 0.25 +
      marginScore * 0.25 +
      compScore * 0.15 +
      platformBoost(platform)
  );
}

function decision(score: number): "SAT" | "TEST" | "KAÇIN" {
  if (score > 80) return "SAT";
  if (score > 60) return "TEST";
  return "KAÇIN";
}

function process(products: any[]): HunterCandidate[] {
  return products.map((p) => {
    const adCost = p.estimatedSellingPrice * 0.25;
    const shipping = 4;

    const margin =
      ((p.estimatedSellingPrice - (p.estimatedCost + adCost + shipping)) /
        p.estimatedSellingPrice) *
      100;

    const engagement = generateEngagement(p.trendScore);
    const compScore = competitionScore(p.competitionLevel);
    const marginScore = Math.min(100, margin * 1.5);

    const score = calcScore(
      p.trendScore,
      engagement,
      marginScore,
      compScore,
      p.platform
    );

    return {
      id: "hunt-" + p.id,
      name: p.name,
      category: p.category,
      platform: p.platform,
      trendScore: p.trendScore,
      engagementScore: engagement,
      competitionLevel: p.competitionLevel,
      estimatedMargin: Math.round(margin * 10) / 10,
      estimatedSellingPrice: p.estimatedSellingPrice,
      estimatedCost: p.estimatedCost,
      hunterScore: score,
      decision: decision(score),
      confidence: Math.min(100, Math.round(score * 1.1)),
      image: p.image,
    };
  });
}

export function scanAllProducts(): HunterCandidate[] {
  const cache = getCache();
  if (cache) return cache;

  const products = [
    ...fetchTikTokTrends(),
    ...fetchAmazonTrends(),
    ...fetchAliExpressTrends(),
  ];

  const result = process(products)
    .sort((a, b) => b.hunterScore - a.hunterScore)
    .slice(0, 5);

  setCache(result);

  return result;
}