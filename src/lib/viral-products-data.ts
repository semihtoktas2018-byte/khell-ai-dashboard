export interface ViralProduct {
  id: string;
  name: string;
  nameTr: string;
  category: string;
  sellingPrice: number;
  cost: number;
  margin: number;
  trendScore: number;
  riskLevel: "Düşük" | "Orta" | "Yüksek";
  decisionScore: number;
  isHot: boolean;
  platform: string;
  monthlySearchVolume: string;
  targetMarket: string;
  image: string; // Canlı fotoğraflar için zorunlu alan
}

// Bu fonksiyon artık ön yüzde hata vermemesi için boş bir dizi dönecek, 
// çünkü verileri doğrudan canlı API'den çekeceğiz!
export function getViralProducts(): ViralProduct[] {
  return [];
}
