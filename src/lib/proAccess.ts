// Basit, sunucusuz "PRO erişim kodu" sistemi.
// Birisi Shopier'den ödeme yaptığında, sen ona aşağıdaki kodlardan birini
// WhatsApp/e-posta ile manuel gönderiyorsun. Kodu sitede girince o tarayıcıda
// kalıcı olarak sınırsız erişim açılıyor.
//
// NOT: Bu gerçek bir kullanıcı hesabı sistemi değil — sadece "ödeyen kişiye
// gerçekten bir şey vermek" için hızlı bir çözüm. Temmuz'da Supabase Auth ile
// gerçek hesap sistemine geçeceğiz.
//
// Yeni kod eklemek için aşağıdaki listeye istediğin kadar satır ekleyebilirsin.
// Aynı kodu birden fazla kişiye verebilirsin ya da her satışta yeni bir kod
// üretip o müşteriye özel verebilirsin (kim kullandı takip etmek için).

const VALID_CODES = [
  "KHELL-PRO-2026",
  "KHELL-PRO-VIP1",
  "KHELL-PRO-VIP2",
];

const PRO_KEY = "khell_pro_unlocked";

export function isProUnlocked(): boolean {
  try {
    return localStorage.getItem(PRO_KEY) === "true";
  } catch {
    return false;
  }
}

export function redeemCode(code: string): boolean {
  const normalized = code.trim().toUpperCase();
  if (VALID_CODES.includes(normalized)) {
    try {
      localStorage.setItem(PRO_KEY, "true");
    } catch {
      // localStorage yazılamazsa (gizli sekme vb.) sessizce devam et
    }
    return true;
  }
  return false;
}
