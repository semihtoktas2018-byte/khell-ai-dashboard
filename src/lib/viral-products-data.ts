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
  orders?: number;
  rating?: string;
  imageUrl?: string;
}

const RAPIDAPI_KEY = "0ff10b71d3msh3f8b4edd825040fp100f8djsn435e5bc57335";

const SEARCH_KEYWORDS = [
  { keyword: "posture corrector", category: "Fitness" },
  { keyword: "led night lamp", category: "Home" },
  { keyword: "pet water bottle", category: "Pet" },
  { keyword: "car phone mount wireless charger", category: "Car" },
  { keyword: "resistance bands set", category: "Fitness" },
  { keyword: "electric scalp massager", category: "Fitness" },
  { keyword: "cat laser toy", category: "Pet" },
  { keyword: "aromatherapy car diffuser", category: "Car" },
  { keyword: "smart water bottle", category: "Tech" },
  { keyword: "floating shelf", category: "Home" },
];

const demandWeight = { low: 20, medium: 50, high: 80 };
const competitionWeight = { low: 10, medium: 40, high: 70 };

function calcDecision(
  margin: number,
  trendScore: number,
  demand: "low" | "medium" | "high",
  competition: "low" | "medium" | "high"
): number {
  return Math.round(
    margin * 0.4 +
      trendScore * 0.3 +
      demandWeight[demand] * 0.2 -
      competitionWeight[competition] * 0.1
  );
}

function deriveRisk(
  competition: "low" | "medium" | "high",
  trendScore: number
): "Düşük" | "Orta" | "Yüksek" {
  if (competition === "low" && trendScore > 70) return "Düşük";
  if (competition === "high") return "Yüksek";
  return "Orta";
}

function deriveDemand(orders: number): "low" | "medium" | "high" {
  if (orders >= 1000) return "high";
  if (orders >= 200) return "medium";
  return "low";
}

function deriveCompetition(sellers: number): "low" | "medium" | "high" {
  if (sellers <= 5) return "low";
  if (sellers <= 15) return "medium";
  return "high";
}

function deriveTrendScore(orders: number, rating: number): number {
  const orderScore = Math.min(orders / 50, 50);
  const ratingScore = rating * 10;
  return Math.min(Math.round(orderScore + ratingScore), 99);
}

function estimateCost(price: number): number {
  return Math.round(price * 0.28 * 100) / 100;
}

async function fetchKeywordProducts(
  keyword: string,
  category: string,
  index: number
): Promise<ViralProduct | null> {
  try {
    const res = await fetch(
      `https://aliexpress-business-api.p.rapidapi.com/textsearch.php?keyWord=${encodeURIComponent(
        keyword
      )}&pageSize=10&pageIndex=1&country=TR&currency=USD&lang=en&filter=orders&sortBy=desc`,
      {
        headers: {
          "x-rapidapi-host": "aliexpress-business-api.p.rapidapi.com",
          "x-rapidapi-key": RAPIDAPI_KEY,
        },
      }
    );
    const data = await res.json();
    const items: any[] = data?.data?.itemList || [];
    if (!items.length) return null;

    const top = items[0];
    const sellingPrice =
      parseFloat(top?.salePrice || top?.originalPrice || "0") || 0;
    if (sellingPrice <= 0) return null;

    const totalCount = data?.data?.totalCount || 0;
    const orders = Math.min(totalCount, 9999);
    const rating = parseFloat(top?.averageStarRate || top?.starRating || "4.2") || 4.2;
    const sellers = Math.min(items.length, 20);

    const cost = estimateCost(sellingPrice);
    const margin =
      Math.round(((sellingPrice - cost) / sellingPrice) * 100 * 10) / 10;
    const demandLevel = deriveDemand(orders);
    const competitionLevel = deriveCompetition(sellers);
    const trendScore = deriveTrendScore(orders, rating);
    const riskLevel = deriveRisk(competitionLevel, trendScore);
    const decisionScore = calcDecision(margin, trendScore, demandLevel, competitionLevel);
    const isHot = trendScore > 80 && competitionLevel === "low";

    const rawName = top?.title || keyword;
    const name =
      rawName.length > 50 ? rawName.slice(0, 47) + "..." : rawName;

    return {
      id: `viral-${index}`,
      name,
      category,
      sellingPrice: Math.round(sellingPrice * 100) / 100,
      cost,
      margin,
      trendScore,
      demandLevel,
      competitionLevel,
      riskLevel,
      decisionScore,
      isHot,
      orders,
      rating: rating.toFixed(1),
      imageUrl: top?.itemMainPic || "",
    };
  } catch (e) {
    console.warn(`AliExpress fetch hatası (${keyword}):`, e);
    return null;
  }
}

// Fallback mock data — API başarısız olursa gösterilir
const FALLBACK: ViralProduct[] = [
  { id: "f-0", name: "Magnetic Posture Corrector", category: "Fitness", sellingPrice: 29.99, cost: 8.40, margin: 72.0, trendScore: 92, demandLevel: "high", competitionLevel: "low", riskLevel: "Düşük", decisionScore: 73, isHot: true },
  { id: "f-1", name: "LED Sunset Projection Lamp", category: "Home", sellingPrice: 24.99, cost: 7.00, margin: 72.0, trendScore: 88, demandLevel: "high", competitionLevel: "low", riskLevel: "Düşük", decisionScore: 70, isHot: true },
  { id: "f-2", name: "Portable Pet Water Bottle", category: "Pet", sellingPrice: 18.99, cost: 5.30, margin: 72.1, trendScore: 85, demandLevel: "high", competitionLevel: "low", riskLevel: "Düşük", decisionScore: 68, isHot: true },
  { id: "f-3", name: "Resistance Bands Set", category: "Fitness", sellingPrice: 21.99, cost: 6.20, margin: 71.8, trendScore: 89, demandLevel: "high", competitionLevel: "low", riskLevel: "Düşük", decisionScore: 71, isHot: true },
  { id: "f-4", name: "Interactive Cat Laser Toy", category: "Pet", sellingPrice: 16.99, cost: 4.80, margin: 71.7, trendScore: 91, demandLevel: "high", competitionLevel: "low", riskLevel: "Düşük", decisionScore: 72, isHot: true },
  { id: "f-5", name: "Aromatherapy Car Diffuser", category: "Car", sellingPrice: 15.99, cost: 4.50, margin: 71.9, trendScore: 84, demandLevel: "high", competitionLevel: "low", riskLevel: "Düşük", decisionScore: 66, isHot: false },
  { id: "f-6", name: "Electric Scalp Massager", category: "Fitness", sellingPrice: 22.99, cost: 6.40, margin: 72.1, trendScore: 86, demandLevel: "high", competitionLevel: "low", riskLevel: "Düşük", decisionScore: 69, isHot: true },
  { id: "f-7", name: "Smart Water Bottle", category: "Tech", sellingPrice: 28.99, cost: 8.10, margin: 72.0, trendScore: 79, demandLevel: "high", competitionLevel: "medium", riskLevel: "Orta", decisionScore: 64, isHot: false },
];

let cachedProducts: ViralProduct[] | null = null;
let cacheTime = 0;
const CACHE_DURATION = 10 * 60 * 1000; // 10 dakika

export async function fetchViralProducts(): Promise<ViralProduct[]> {
  const now = Date.now();
  if (cachedProducts && now - cacheTime < CACHE_DURATION) {
    return cachedProducts;
  }

  try {
    const results = await Promise.allSettled(
      SEARCH_KEYWORDS.map((item, i) =>
        fetchKeywordProducts(item.keyword, item.category, i)
      )
    );

    const products: ViralProduct[] = results
      .filter(
        (r): r is PromiseFulfilledResult<ViralProduct> =>
          r.status === "fulfilled" && r.value !== null
      )
      .map((r) => r.value);

    if (products.length < 3) {
      return FALLBACK;
    }

    cachedProducts = products.sort((a, b) => b.decisionScore - a.decisionScore);
    cacheTime = now;
    return cachedProducts;
  } catch (e) {
    console.warn("Viral products fetch hatası:", e);
    return FALLBACK;
  }
}

// Geriye dönük uyumluluk — eski kod getViralProducts() kullanıyorsa bozulmasın
export function getViralProducts(): ViralProduct[] {
  return FALLBACK;
}
