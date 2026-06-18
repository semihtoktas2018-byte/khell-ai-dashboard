// Kullanıcının daha önce hangi ürünleri gördüğünü tarayıcısında saklar.
// Yeni bir fetch geldiğinde, önceki ziyaretinde olmayan ürünleri tespit eder
// — bu sayede "🆕 Yeni" rozeti backend olmadan çalışır, tamamen kullanıcının
// kendi tarayıcısında tutulur.

const SEEN_KEY_PREFIX = "khell_seen_pids_";

export function getNewPids(pageKey: string, currentPids: string[]): Set<string> {
  let seen: string[] = [];
  try {
    seen = JSON.parse(localStorage.getItem(SEEN_KEY_PREFIX + pageKey) || "[]");
  } catch {
    seen = [];
  }
  const seenSet = new Set(seen);
  // İlk ziyarette (hiç kayıt yoksa) hiçbir şeyi "yeni" diye işaretleme —
  // aksi halde ilk gelişte tüm ürünler "yeni" görünür, anlamsız olur.
  if (seen.length === 0) return new Set();
  return new Set(currentPids.filter((pid) => pid && !seenSet.has(pid)));
}

export function markSeen(pageKey: string, currentPids: string[]) {
  try {
    localStorage.setItem(SEEN_KEY_PREFIX + pageKey, JSON.stringify(currentPids.filter(Boolean)));
  } catch {
    // ignore
  }
}
