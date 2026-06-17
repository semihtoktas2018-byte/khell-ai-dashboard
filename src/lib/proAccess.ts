// Basit, sunucusuz "PRO erişim kodu" sistemi.
//
// İKİ TÜR KOD VAR:
// 1) KALICI KODLAR — Shopier'den 249 TL ödeme yapan birine verilir, süresiz açar.
// 2) DENEME KODLARI — "ilk 100 kullanıcıya 1 ay ücretsiz" kampanyası için, 30 gün
//    sonra otomatik olarak normal (ücretsiz/limitli) duruma geri döner.
//
// NOT: Bu gerçek bir kullanıcı hesabı sistemi değil — sadece hızlı bir çözüm.
// Temmuz'da Supabase Auth ile gerçek hesap sistemine geçeceğiz.

const PERMANENT_CODES = [
  "KHELL-PRO-2026",
  "KHELL-PRO-VIP1",
  "KHELL-PRO-VIP2",
];

// Lansman kampanyası: ilk 100 kullanıcıya 1 ay ücretsiz Pro.
// Bu kodu paylaştığın kişi sayısını kendin takip et (örnek: bir not defteri/Excel).
// 100'ü doldurunca bu satırı silip kampanyayı bitirebilirsin.
const TRIAL_CODES = ["KHELL-LAUNCH100"];

const TRIAL_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 gün

const PRO_KEY = "khell_pro_unlocked";
const PRO_EXPIRY_KEY = "khell_pro_expiry"; // boşsa = süresiz (kalıcı kod)

export function isProUnlocked(): boolean {
  try {
    const unlocked = localStorage.getItem(PRO_KEY) === "true";
    if (!unlocked) return false;

    const expiry = localStorage.getItem(PRO_EXPIRY_KEY);
    if (expiry && Date.now() > Number(expiry)) {
      // Deneme süresi dolmuş — geri al.
      localStorage.removeItem(PRO_KEY);
      localStorage.removeItem(PRO_EXPIRY_KEY);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export function getProExpiry(): number | null {
  try {
    const expiry = localStorage.getItem(PRO_EXPIRY_KEY);
    return expiry ? Number(expiry) : null;
  } catch {
    return null;
  }
}

export function redeemCode(code: string): boolean {
  const normalized = code.trim().toUpperCase();

  if (PERMANENT_CODES.includes(normalized)) {
    try {
      localStorage.setItem(PRO_KEY, "true");
      localStorage.removeItem(PRO_EXPIRY_KEY); // süresiz
    } catch {
      // ignore
    }
    return true;
  }

  if (TRIAL_CODES.includes(normalized)) {
    try {
      localStorage.setItem(PRO_KEY, "true");
      localStorage.setItem(PRO_EXPIRY_KEY, String(Date.now() + TRIAL_DURATION_MS));
    } catch {
      // ignore
    }
    return true;
  }

  return false;
}
