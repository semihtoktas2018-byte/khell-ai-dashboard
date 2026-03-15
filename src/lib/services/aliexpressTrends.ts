import type { TrendProduct } from "./tiktokTrends";

export function fetchAliExpressTrends(): TrendProduct[] {
  return [
    { id: "ae-1", name: "Magnetic Phone Mount", category: "Accessories", platform: "AliExpress", trendScore: 82, competitionLevel: "Low", estimatedSellingPrice: 14.99, estimatedCost: 2.8, image: "https://images.unsplash.com/photo-1586953208270-767889fa9b0e?w=200&h=200&fit=crop" },
    { id: "ae-2", name: "LED Strip Lights RGB", category: "Home & Decor", platform: "AliExpress", trendScore: 77, competitionLevel: "High", estimatedSellingPrice: 24.99, estimatedCost: 4.5, image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=200&h=200&fit=crop" },
    { id: "ae-3", name: "Silicone Kitchen Set", category: "Kitchen", platform: "AliExpress", trendScore: 69, competitionLevel: "Low", estimatedSellingPrice: 22.99, estimatedCost: 5.0, image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&fit=crop" },
    { id: "ae-4", name: "Digital Luggage Scale", category: "Travel", platform: "AliExpress", trendScore: 74, competitionLevel: "Medium", estimatedSellingPrice: 12.99, estimatedCost: 3.2, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=200&fit=crop" },
    { id: "ae-5", name: "Pet Grooming Glove", category: "Pets", platform: "AliExpress", trendScore: 86, competitionLevel: "Low", estimatedSellingPrice: 16.99, estimatedCost: 2.5, image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=200&h=200&fit=crop" },
    { id: "ae-6", name: "Neck Massage Pillow", category: "Health", platform: "AliExpress", trendScore: 80, competitionLevel: "Medium", estimatedSellingPrice: 27.99, estimatedCost: 8.0, image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=200&h=200&fit=crop" },
  ];
}
