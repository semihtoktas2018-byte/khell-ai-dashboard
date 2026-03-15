export interface TrendProduct {
  id: string;
  name: string;
  category: string;
  platform: string;
  trendScore: number;
  competitionLevel: "Low" | "Medium" | "High";
  estimatedSellingPrice: number;
  estimatedCost: number;
  image: string;
}

export function fetchTikTokTrends(): TrendProduct[] {
  return [
    { id: "tt-1", name: "LED Sunset Lamp", category: "Home & Decor", platform: "TikTok", trendScore: 92, competitionLevel: "Medium", estimatedSellingPrice: 34.99, estimatedCost: 8.5, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop" },
    { id: "tt-2", name: "Cloud Slides", category: "Fashion", platform: "TikTok", trendScore: 88, competitionLevel: "High", estimatedSellingPrice: 29.99, estimatedCost: 5.2, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop" },
    { id: "tt-3", name: "Portable Blender", category: "Kitchen", platform: "TikTok", trendScore: 85, competitionLevel: "Low", estimatedSellingPrice: 39.99, estimatedCost: 11.0, image: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=200&h=200&fit=crop" },
    { id: "tt-4", name: "Smart Posture Corrector", category: "Health", platform: "TikTok", trendScore: 79, competitionLevel: "Low", estimatedSellingPrice: 24.99, estimatedCost: 6.0, image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=200&h=200&fit=crop" },
    { id: "tt-5", name: "Mini Projector", category: "Electronics", platform: "TikTok", trendScore: 91, competitionLevel: "Medium", estimatedSellingPrice: 89.99, estimatedCost: 32.0, image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=200&h=200&fit=crop" },
    { id: "tt-6", name: "Reusable Water Bottle", category: "Lifestyle", platform: "TikTok", trendScore: 72, competitionLevel: "High", estimatedSellingPrice: 19.99, estimatedCost: 3.5, image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=200&h=200&fit=crop" },
  ];
}
