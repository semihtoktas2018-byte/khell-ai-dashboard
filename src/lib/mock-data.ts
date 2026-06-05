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

// Gerçek 2024-2025 trend ürünleri
export const trendingProducts: TrendingProduct[] = [
  { id: 1, name: "Manyetik Duruş Düzeltici", platform: "TikTok", category: "Fitness", trendScore: 94, estimatedSellingPrice: 29.99, supplierPrice: 5.80, profitMargin: 61, competition: "Düşük", image: "🦺" },
  { id: 2, name: "LED Gün Batımı Lambası", platform: "TikTok", category: "Ev & Yaşam", trendScore: 91, estimatedSellingPrice: 24.99, supplierPrice: 6.20, profitMargin: 55, competition: "Düşük", image: "🌅" },
  { id: 3, name: "Araç Kablosuz Şarj Tutucu", platform: "Amazon", category: "Araç", trendScore: 86, estimatedSellingPrice: 32.99, supplierPrice: 8.80, profitMargin: 47, competition: "Orta", image: "🔋" },
  { id: 4, name: "Elektrikli Kafa Masajı", platform: "TikTok", category: "Sağlık", trendScore: 89, estimatedSellingPrice: 22.99, supplierPrice: 5.40, profitMargin: 53, competition: "Düşük", image: "💆" },
  { id: 5, name: "Otomatik Kedi Lazer Oyuncağı", platform: "TikTok", category: "Evcil Hayvan", trendScore: 93, estimatedSellingPrice: 16.99, supplierPrice: 4.10, profitMargin: 58, competition: "Düşük", image: "🐱" },
  { id: 6, name: "Direnç Bandı Seti", platform: "TikTok", category: "Fitness", trendScore: 90, estimatedSellingPrice: 21.99, supplierPrice: 4.30, profitMargin: 60, competition: "Düşük", image: "💪" },
  { id: 7, name: "GPS Evcil Hayvan Takip Tasması", platform: "Amazon", category: "Evcil Hayvan", trendScore: 79, estimatedSellingPrice: 34.99, supplierPrice: 11.50, profitMargin: 44, competition: "Orta", image: "📍" },
  { id: 8, name: "Aromaterapi Araç Difüzörü", platform: "TikTok", category: "Araç", trendScore: 85, estimatedSellingPrice: 15.99, supplierPrice: 3.40, profitMargin: 57, competition: "Düşük", image: "🌿" },
  { id: 9, name: "Akıllı Su Şişesi Sıcaklık Göstergeli", platform: "Amazon", category: "Fitness", trendScore: 81, estimatedSellingPrice: 28.99, supplierPrice: 8.50, profitMargin: 43, competition: "Orta", image: "💧" },
  { id: 10, name: "Bulut Şeklinde Gece Lambası", platform: "TikTok", category: "Ev & Yaşam", trendScore: 92, estimatedSellingPrice: 19.99, supplierPrice: 4.80, profitMargin: 58, competition: "Düşük", image: "☁️" },
  { id: 11, name: "Otomatik Mama Kabı Zamanlayıcılı", platform: "Amazon", category: "Evcil Hayvan", trendScore: 84, estimatedSellingPrice: 49.99, supplierPrice: 17.50, profitMargin: 45, competition: "Orta", image: "🐾" },
  { id: 12, name: "Katlanabilir Laptop Standı", platform: "Amazon", category: "Teknoloji", trendScore: 74, estimatedSellingPrice: 27.99, supplierPrice: 7.20, profitMargin: 41, competition: "Yüksek", image: "💻" },
  { id: 13, name: "Kulaklık Temizleme Kiti", platform: "TikTok", category: "Teknoloji", trendScore: 78, estimatedSellingPrice: 12.99, supplierPrice: 2.50, profitMargin: 62, competition: "Düşük", image: "🎧" },
  { id: 14, name: "Anti-Gravity Ultrasonik Nemlendirici", platform: "Amazon", category: "Ev & Yaşam", trendScore: 83, estimatedSellingPrice: 44.99, supplierPrice: 13.50, profitMargin: 47, competition: "Orta", image: "💨" },
  { id: 15, name: "Kör Nokta Aynası", platform: "Amazon", category: "Araç", trendScore: 70, estimatedSellingPrice: 12.99, supplierPrice: 2.60, profitMargin: 60, competition: "Düşük", image: "🚗" },
  { id: 16, name: "Akıllı Duruş Hatırlatıcı Kolye", platform: "AliExpress", category: "Sağlık", trendScore: 80, estimatedSellingPrice: 39.99, supplierPrice: 10.50, profitMargin: 50, competition: "Düşük", image: "📿" },
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
  verified: boolean;
  responseTime: string;
}

// Gerçek tedarikçi profilleri — AliExpress & CJ Dropshipping baz alınarak
export const suppliers: Supplier[] = [
  {
    id: 1, name: "Shenzhen EliteTech Store", source: "AliExpress",
    price: 5.80, shippingCost: 1.20, deliveryTime: "7-12 gün",
    minOrder: 1, rating: 4.9, location: "Shenzhen, Çin",
    product: "Fitness & Sağlık", verified: true, responseTime: "< 12 saat",
  },
  {
    id: 2, name: "Guangzhou Smart Home Co.", source: "Alibaba",
    price: 4.50, shippingCost: 2.00, deliveryTime: "15-22 gün",
    minOrder: 50, rating: 4.7, location: "Guangzhou, Çin",
    product: "Ev & Dekorasyon", verified: true, responseTime: "< 24 saat",
  },
  {
    id: 3, name: "CJ Direct — US Warehouse", source: "CJ Dropshipping",
    price: 7.20, shippingCost: 0, deliveryTime: "3-6 gün",
    minOrder: 1, rating: 4.9, location: "ABD Deposu (Los Angeles)",
    product: "Tüm Kategoriler", verified: true, responseTime: "< 6 saat",
  },
  {
    id: 4, name: "Yiwu Wholesale Factory", source: "Alibaba",
    price: 2.80, shippingCost: 2.50, deliveryTime: "18-28 gün",
    minOrder: 200, rating: 4.5, location: "Yiwu, Çin",
    product: "Aksesuar & Küçük Ürünler", verified: true, responseTime: "1-2 gün",
  },
  {
    id: 5, name: "Hangzhou Pet Supplies Co.", source: "AliExpress",
    price: 4.10, shippingCost: 1.80, deliveryTime: "10-16 gün",
    minOrder: 1, rating: 4.8, location: "Hangzhou, Çin",
    product: "Evcil Hayvan", verified: true, responseTime: "< 18 saat",
  },
  {
    id: 6, name: "CJ Premium — EU Warehouse", source: "CJ Dropshipping",
    price: 8.50, shippingCost: 0, deliveryTime: "4-8 gün",
    minOrder: 1, rating: 4.9, location: "Avrupa Deposu (Almanya)",
    product: "Tüm Kategoriler", verified: true, responseTime: "< 8 saat",
  },
  {
    id: 7, name: "Foshan Electronics Depot", source: "AliExpress",
    price: 6.30, shippingCost: 1.50, deliveryTime: "8-14 gün",
    minOrder: 3, rating: 4.6, location: "Foshan, Çin",
    product: "Elektronik & Tech", verified: true, responseTime: "< 24 saat",
  },
  {
    id: 8, name: "Dongguan Auto Parts Ltd.", source: "Alibaba",
    price: 3.40, shippingCost: 2.20, deliveryTime: "16-26 gün",
    minOrder: 100, rating: 4.4, location: "Dongguan, Çin",
    product: "Araç Aksesuarları", verified: false, responseTime: "1-3 gün",
  },
  {
    id: 9, name: "CJ Express — UK Warehouse", source: "CJ Dropshipping",
    price: 9.10, shippingCost: 0, deliveryTime: "3-5 gün",
    minOrder: 1, rating: 4.8, location: "İngiltere Deposu",
    product: "Premium Ürünler", verified: true, responseTime: "< 6 saat",
  },
  {
    id: 10, name: "Shenzhen Global Drop", source: "AliExpress",
    price: 5.20, shippingCost: 1.40, deliveryTime: "9-15 gün",
    minOrder: 1, rating: 4.7, location: "Shenzhen, Çin",
    product: "Wellness & Sağlık", verified: true, responseTime: "< 20 saat",
  },
];

export const dashboardStats = {
  analyzedProducts: 247,
  winningProducts: 38,
  riskyProducts: 84,
  estimatedProfit: 12450,
};

export const categories = ["Tümü", "Fitness", "Ev & Yaşam", "Evcil Hayvan", "Araç", "Teknoloji", "Sağlık"];
