import type { TrendProduct } from "./tiktokTrends";

export function fetchAmazonTrends(): TrendProduct[] {
  return [
    { id: "az-1", name: "Ergonomic Mouse Pad", category: "Office", platform: "Amazon", trendScore: 78, competitionLevel: "Medium", estimatedSellingPrice: 19.99, estimatedCost: 4.2, image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=200&h=200&fit=crop" },
    { id: "az-2", name: "Wireless Earbuds Pro", category: "Electronics", platform: "Amazon", trendScore: 84, competitionLevel: "High", estimatedSellingPrice: 49.99, estimatedCost: 12.0, image: "https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=200&h=200&fit=crop" },
    { id: "az-3", name: "Aromatherapy Diffuser", category: "Home & Decor", platform: "Amazon", trendScore: 76, competitionLevel: "Low", estimatedSellingPrice: 29.99, estimatedCost: 7.5, image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=200&h=200&fit=crop" },
    { id: "az-4", name: "Laptop Stand Adjustable", category: "Office", platform: "Amazon", trendScore: 81, competitionLevel: "Medium", estimatedSellingPrice: 34.99, estimatedCost: 9.0, image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=200&h=200&fit=crop" },
    { id: "az-5", name: "Smart Water Flosser", category: "Health", platform: "Amazon", trendScore: 73, competitionLevel: "Low", estimatedSellingPrice: 44.99, estimatedCost: 14.0, image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=200&h=200&fit=crop" },
  ];
}
