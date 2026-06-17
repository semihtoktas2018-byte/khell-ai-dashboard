// Buraya yazdığın kelimelerden biri bir ürünün adında geçiyorsa, o ürün
// "⭐ Editör Seçimi" rozeti alır — yani sen onayladığın için kullanıcıya
// "bunu biz seçtik, güvenebilirsin" sinyali verir.
//
// Kullanımı: her gün (ya da ne zaman istersen) bu listeyi güncelle.
// Büyük/küçük harf önemli değil, kelimenin ürün adında GEÇMESİ yeterli
// (tam eşleşme aramana gerek yok). Örnek: "powerbank" yazarsan,
// "30000 mAh Manyetik Kablosuz Powerbank" da eşleşir.
//
// Boş bırakırsan hiçbir ürün rozet almaz, sistem sessizce devre dışı kalır.

export const EDITOR_PICKS: string[] = [
  // "powerbank",
  // "led strip light",
  // "duruş düzeltici",
];

export function isEditorPick(name: string): boolean {
  if (!name) return false;
  const lower = name.toLowerCase();
  return EDITOR_PICKS.some((k) => k.trim() && lower.includes(k.trim().toLowerCase()));
}
