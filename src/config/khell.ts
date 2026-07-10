// ============================================================
//  KHELL AI — MERKEZİ AYAR DOSYASI  (A BAMIR ONLINE STORE'S PRODUCTION)
// ============================================================
//  Bu dosya, en sık değiştirdiğin ayarların TEK yerde toplandığı yerdir.
//  Buradaki sayıları/metinleri değiştirdiğinde panelin ilgili yerleri
//  otomatik güncellenir. Kod bilmene gerek yok — sadece tırnak içindeki
//  değerleri veya sayıları değiştir, commit et.
// ============================================================


// ------------------------------------------------------------
//  1) PARA BİRİMİ
// ------------------------------------------------------------
//  ÖNEMLİ: Kullanıcı hangi para biriminde giriyorsa (₺, €, $),
//  sonuç AYNI birimde gösterilir. Gizli kur çevrimi YOKTUR.
//  (Eski hatada TL değerler dolar sanılıp ~45 ile çarpılıyordu; artık yok.)
//
//  Bir sayıyı kullanıcının diline göre biçimlendirir.
export type AppLocale = "tr" | "en" | "fr";

export function formatCurrency(val: number, locale: AppLocale): string {
  const n = Number.isFinite(val) ? val : 0;
  if (locale === "tr") {
    return `₺${n.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  if (locale === "fr") {
    return `${n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;
  }
  return `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

//  Giriş kutularının yanında görünen sembol (dile göre)
export function currencySymbolFor(locale: AppLocale): string {
  return locale === "tr" ? "₺" : locale === "fr" ? "€" : "$";
}


// ------------------------------------------------------------
//  2) ÜCRETSİZ KULLANIM LİMİTLERİ  (abone hunisi)
// ------------------------------------------------------------
//  Anonim ziyaretçi kaç analiz yapabilsin? (sonra "ücretsiz kaydol" kapısı)
export const ANON_LIMIT = 2;

//  Kayıtlı ücretsiz üye günde kaç analiz yapabilsin? (sonra Pro paywall)
export const FREE_DAILY_LIMIT = 5;


// ------------------------------------------------------------
//  3) FİYATLAR & SHOPIER LİNKLERİ
// ------------------------------------------------------------
//  Pro plan fiyat etiketi (dile göre gösterim metni)
export const PRO_PRICE_LABEL: Record<AppLocale, string> = {
  tr: "249₺/ay",
  en: "$29/mo",
  fr: "29€/mois",
};

//  Shopier ödeme linkleri (TR ve uluslararası)
export const SHOPIER_PRO_TR = "https://www.shopier.com/bamironlinestore/46009500";
export const SHOPIER_PRO_INTL = "https://www.shopier.com/bamironlinestore/48494025";

export function shopierLinkFor(locale: AppLocale): string {
  return locale === "tr" ? SHOPIER_PRO_TR : SHOPIER_PRO_INTL;
}


// ------------------------------------------------------------
//  4) MARKA / FOOTER
// ------------------------------------------------------------
export const BRAND_SIGNATURE = "A BAMIR ONLINE STORE'S PRODUCTION";
export const SITE_URL = "https://khellai.com";
