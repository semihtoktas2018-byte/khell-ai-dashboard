export interface TrendingProduct {
  id: number;
  name: string;
  platform: "TikTok" | "Amazon" | "AliExpress";
  category: string;
  trendScore: number;
  estimatedSellingPrice: number;
  supplierPrice: number;
  profitMargin: number;
  competition: "Düşük" | "Orta" | "Yüksek";
  image: string;
}

export const trendingProducts: TrendingProduct[] = [
  { id: 1, name: "LED Gece Lambası Projektör", platform: "TikTok", category: "Ev & Yaşam", trendScore: 94, estimatedSellingPrice: 29.99, supplierPrice: 8.50, profitMargin: 52, competition: "Düşük", image: "🌙" },
  { id: 2, name: "Kablosuz Araç Şarj Tutucu", platform: "Amazon", category: "Elektronik", trendScore: 87, estimatedSellingPrice: 34.99, supplierPrice: 12.00, profitMargin: 38, competition: "Orta", image: "🔋" },
  { id: 3, name: "Mini Termal Yazıcı", platform: "TikTok", category: "Elektronik", trendScore: 91, estimatedSellingPrice: 24.99, supplierPrice: 9.50, profitMargin: 45, competition: "Düşük", image: "🖨️" },
  { id: 4, name: "Akıllı Kupa Isıtıcı", platform: "Amazon", category: "Ev & Yaşam", trendScore: 78, estimatedSellingPrice: 19.99, supplierPrice: 7.80, profitMargin: 33, competition: "Yüksek", image: "☕" },
  { id: 5, name: "Taşınabilir Blender", platform: "TikTok", category: "Mutfak", trendScore: 89, estimatedSellingPrice: 22.99, supplierPrice: 8.00, profitMargin: 41, competition: "Orta", image: "🥤" },
  { id: 6, name: "Manyetik Telefon Kılıfı", platform: "AliExpress", category: "Aksesuar", trendScore: 82, estimatedSellingPrice: 15.99, supplierPrice: 3.20, profitMargin: 55, competition: "Düşük", image: "📱" },
  { id: 7, name: "UV Sterilizatör Kutusu", platform: "Amazon", category: "Sağlık", trendScore: 73, estimatedSellingPrice: 39.99, supplierPrice: 15.00, profitMargin: 29, competition: "Yüksek", image: "🔆" },
  { id: 8, name: "Katlanır Drone Mini", platform: "TikTok", category: "Elektronik", trendScore: 96, estimatedSellingPrice: 49.99, supplierPrice: 22.00, profitMargin: 35, competition: "Orta", image: "🚁" },
  { id: 9, name: "Akıllı Saat Fitness", platform: "AliExpress", category: "Elektronik", trendScore: 85, estimatedSellingPrice: 27.99, supplierPrice: 11.00, profitMargin: 42, competition: "Orta", image: "⌚" },
  { id: 10, name: "Silikon Mutfak Seti", platform: "Amazon", category: "Mutfak", trendScore: 76, estimatedSellingPrice: 18.99, supplierPrice: 5.50, profitMargin: 48, competition: "Düşük", image: "🍳" },
  { id: 11, name: "Aroma Difüzör", platform: "TikTok", category: "Ev & Yaşam", trendScore: 92, estimatedSellingPrice: 32.99, supplierPrice: 10.00, profitMargin: 50, competition: "Düşük", image: "🌸" },
  { id: 12, name: "Kablosuz Kulaklık Pro", platform: "AliExpress", category: "Elektronik", trendScore: 88, estimatedSellingPrice: 44.99, supplierPrice: 18.00, profitMargin: 36, competition: "Yüksek", image: "🎧" },
  { id: 13, name: "Taşınabilir Projektör", platform: "TikTok", category: "Elektronik", trendScore: 90, estimatedSellingPrice: 59.99, supplierPrice: 25.00, profitMargin: 40, competition: "Orta", image: "📽️" },
  { id: 14, name: "Masaj Tabancası Mini", platform: "Amazon", category: "Sağlık", trendScore: 84, estimatedSellingPrice: 35.99, supplierPrice: 14.00, profitMargin: 38, competition: "Orta", image: "💆" },
  { id: 15, name: "LED Makyaj Aynası", platform: "TikTok", category: "Güzellik", trendScore: 93, estimatedSellingPrice: 19.99, supplierPrice: 6.00, profitMargin: 52, competition: "Düşük", image: "💄" },
  { id: 16, name: "Akıllı Su Şişesi", platform: "AliExpress", category: "Sağlık", trendScore: 79, estimatedSellingPrice: 24.99, supplierPrice: 8.50, profitMargin: 44, competition: "Orta", image: "💧" },
];

export interface Supplier {
  id: number;
  name: string;
  source: "AliExpress" | "Alibaba" | "CJ Dropshipping";
  price: number;
  shippingCost: number;
  deliveryTime: string;
  minOrder: number;
  rating: number;
  location: string;
  product: string;
}

export const suppliers: Supplier[] = [
  { id: 1, name: "Shenzhen Light Co.", source: "AliExpress", price: 3.20, shippingCost: 1.50, deliveryTime: "7-12 gün", minOrder: 1, rating: 4.8, location: "Shenzhen, Çin", product: "LED Lamba" },
  { id: 2, name: "Guangzhou Tech Ltd.", source: "Alibaba", price: 2.80, shippingCost: 2.00, deliveryTime: "15-25 gün", minOrder: 100, rating: 4.6, location: "Guangzhou, Çin", product: "LED Lamba" },
  { id: 3, name: "CJ Smart Supply", source: "CJ Dropshipping", price: 4.10, shippingCost: 0, deliveryTime: "5-8 gün", minOrder: 1, rating: 4.9, location: "Yiwu, Çin", product: "LED Lamba" },
  { id: 4, name: "Dongguan Factory", source: "Alibaba", price: 4.50, shippingCost: 1.80, deliveryTime: "18-30 gün", minOrder: 200, rating: 4.5, location: "Dongguan, Çin", product: "Elektronik" },
  { id: 5, name: "Hangzhou Import Co.", source: "AliExpress", price: 6.30, shippingCost: 2.50, deliveryTime: "10-15 gün", minOrder: 1, rating: 4.7, location: "Hangzhou, Çin", product: "Mutfak" },
  { id: 6, name: "CJ Direct Ship", source: "CJ Dropshipping", price: 5.80, shippingCost: 0, deliveryTime: "3-7 gün", minOrder: 1, rating: 4.8, location: "ABD Deposu", product: "Elektronik" },
  { id: 7, name: "Foshan Electronics", source: "AliExpress", price: 3.90, shippingCost: 1.60, deliveryTime: "12-18 gün", minOrder: 5, rating: 4.4, location: "Foshan, Çin", product: "Aksesuar" },
  { id: 8, name: "Yiwu Wholesale", source: "Alibaba", price: 2.10, shippingCost: 2.20, deliveryTime: "20-35 gün", minOrder: 500, rating: 4.3, location: "Yiwu, Çin", product: "Ev & Yaşam" },
  { id: 9, name: "CJ Premium Store", source: "CJ Dropshipping", price: 7.20, shippingCost: 0, deliveryTime: "2-5 gün", minOrder: 1, rating: 4.9, location: "Avrupa Deposu", product: "Güzellik" },
  { id: 10, name: "Shenzhen Global", source: "AliExpress", price: 5.00, shippingCost: 1.90, deliveryTime: "8-14 gün", minOrder: 2, rating: 4.6, location: "Shenzhen, Çin", product: "Sağlık" },
];

export const dashboardStats = {
  analyzedProducts: 247,
  winningProducts: 38,
  riskyProducts: 84,
  estimatedProfit: 12450,
};

export const categories = ["Tümü", "Elektronik", "Ev & Yaşam", "Mutfak", "Aksesuar", "Sağlık", "Güzellik"];
