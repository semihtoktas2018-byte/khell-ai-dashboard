import type { TrendProduct } from "./tiktokTrends";

export function fetchGoogleTrends(): TrendProduct[] {
  return [
    { id: "gt-1", name: "Standing Desk Converter", category: "Office", platform: "Google Trends", trendScore: 87, competitionLevel: "Medium", estimatedSellingPrice: 129.99, estimatedCost: 45.0, image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=200&h=200&fit=crop" },
    { id: "gt-2", name: "Blue Light Glasses", category: "Fashion", platform: "Google Trends", trendScore: 75, competitionLevel: "High", estimatedSellingPrice: 24.99, estimatedCost: 3.0, image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=200&h=200&fit=crop" },
    { id: "gt-3", name: "Resistance Bands Set", category: "Fitness", platform: "Google Trends", trendScore: 83, competitionLevel: "Low", estimatedSellingPrice: 19.99, estimatedCost: 4.0, image: "https://images.unsplash.com/photo-1598632640487-6ea4a4e8b963?w=200&h=200&fit=crop" },
    { id: "gt-4", name: "Electric Spin Scrubber", category: "Home & Decor", platform: "Google Trends", trendScore: 90, competitionLevel: "Low", estimatedSellingPrice: 39.99, estimatedCost: 12.0, image: "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=200&h=200&fit=crop" },
  ];
}
