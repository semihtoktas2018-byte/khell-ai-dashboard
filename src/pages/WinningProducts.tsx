import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Package, Radio, BarChart3, RefreshCw, TrendingUp, Filter, Bell, Lock, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLocale } from "@/contexts/LocaleContext";
import SEO from "@/components/SEO";
import { translateProducts } from "@/lib/translate";
import { isEditorPick } from "@/lib/editorPicks";
import { getNewPids, markSeen } from "@/lib/newProductTracker";
import { useAnalysisHistory } from "@/contexts/AnalysisHistoryContext";

const CJ_EMAIL = import.meta.env.VITE_CJ_EMAIL || "bamir.global@gmail.com";
const CJ_API_KEY = import.meta.env.VITE_CJ_API_KEY || "26689fbeeb5045f89ec8764c32aaada0";
const REFRESH_INTERVAL = 30 * 60 * 1000;
const FREE_LIMIT = 4;

interface CJProduct {
  pid: string;
  productName: string;
  productNameEn?: string;
  productImage: string;
  sellPrice?: string;
  productUrl?: string;
  categoryName?: string;
}

let cachedToken: { token: string; exp: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.exp > Date.now()) return cachedToken.token;
  const res = await fetch("https://developers.cjdropshipping.com/api2.0/v1/authentication/getAccessToken", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: CJ_EMAIL, password: CJ_API_KEY }),
  });
  const data = await res.json();
  if (!data?.data?.accessToken) throw new Error(data?.message || "Token alınamadı");
  cachedToken = { token: data.data.accessToken, exp: Date.now() + 1000 * 60 * 60 * 12 };
  return cachedToken.token;
}

function getDisplayName(p: CJProduct): string {
  if (p.productNameEn && p.productNameEn.trim() && !/[\u4e00-\u9fff]/.test(p.productNameEn)) return p.productNameEn;
  if (p.productName && !/[\u4e00-\u9fff]/.test(p.productName)) return p.productName;
  return "CJ Product";
}

function getMarginLabel(margin: number): { label: string; color: string; bg: string } {
  if (margin >= 60) return { label: "🔥 Yüksek Kâr", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/30" };
  if (margin >= 40) return { label: "✅ İyi Kâr", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/30" };
  return { label: "⚠️ Düşük Kâr", color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/30" };
}

const transition = { type: "spring" as const, stiffness: 300, damping: 30 };

const SEARCH_TERMS = [
  "wireless earbuds", "led strip light", "portable blender", "phone holder",
  "massage gun", "smart watch", "posture corrector", "pet grooming",
  "laptop stand", "kitchen gadget", "car organizer", "fitness band",
  "ring light", "cooling fan", "electric toothbrush", "desk organizer",
];

export default function WinningProducts() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<CJProduct[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [countdown, setCountdown] = useState(REFRESH_INTERVAL / 1000);
  const [marginFilter, setMarginFilter] = useState(0);
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [newPids, setNewPids] = useState<Set<string>>(new Set());
  const [showPaywall, setShowPaywall] = useState(false);
  const [showNewOnly, setShowNewOnly] = useState(false);
  const navigate = useNavigate();
  const { currency } = useLocale();
  const { isPro } = useAnalysisHistory();

  const marginFilters = [
    { label: "Tümü", min: 0 },
    { label: "%40+", min: 40 },
    { label: "%50+", min: 50 },
    { label: "%60+", min: 60 },
  ];

  const fetchWinning = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getAccessToken();
      const randomTerms = [...SEARCH_TERMS].sort(() => Math.random() - 0.5).slice(0, 4);
      const results: CJProduct[] = [];
      for (const term of randomTerms) {
        const url = `https://developers.cjdropshipping.com/api2.0/v1/product/list?pageNum=1&pageSize=8&sortField=recentOrders&sortType=DESC&productNameEn=${encodeURIComponent(term)}`;
        const res = await fetch(url, { headers: { "CJ-Access-Token": token } });
        const data = await res.json();
        if (data?.data?.list) results.push(...data.data.list);
      }
      const unique = Array.from(new Map(results.map((p) => [p.pid, p])).values());
      const withMargin = unique
        .map((p) => {
          const cost = parseFloat(p.sellPrice || "0") || 0;
          const estSale = cost * 3;
          const margin = cost > 0 ? Math.round(((estSale - cost) / estSale) * 100) : 0;
          return { ...p, _cost: cost, _sale: estSale, _margin: margin };
        })
        .filter((p) => p._cost > 0)
        .sort((a, b) => b._margin - a._margin);
      setItems(withMargin as any);
      const pids = withMargin.map((p: any) => p.pid);
      setNewPids(getNewPids("winning", pids));
      markSeen("winning", pids);
      setLastUpdated(new Date());
      const names = withMargin.map((p: any) => p.productNameEn || p.productName).filter(Boolean);
      translateProducts(names).then(setTranslations).catch(() => {});
      setCountdown(REFRESH_INTERVAL / 1000);
    } catch (e: any) {
      setError(e?.message || "Hata");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWinning();
    const interval = setInterval(fetchWinning, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchWinning]);

  useEffect(() => {
    const timer = setInterval(() => setCountdown((prev) => (prev <= 1 ? REFRESH_INTERVAL / 1000 : prev - 1)), 1000);
    return () => clearInterval(timer);
  }, [lastUpdated]);

  const formatCountdown = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  const allFiltered = (items as any[])
    .filter((p) => p._margin >= marginFilters[marginFilter].min)
    .filter((p) => !showNewOnly || newPids.has(p.pid));

  const visibleItems = isPro ? allFiltered : allFiltered.slice(0, FREE_LIMIT);
  const lockedItems = isPro ? [] : allFiltered.slice(FREE_LIMIT);

  const ProductCard = ({ p, i }: { p: any; i: number }) => {
    const marginMeta = getMarginLabel(p._margin);
    const img = p.productImage?.split(",")[0] || "";
    const rawName = getDisplayName(p);
    const displayName = translations[rawName] || rawName;
    const marginAccent = p._margin >= 60 ? "hsl(142 71% 50%)" : p._margin >= 40 ? "hsl(199 89% 60%)" : "hsl(38 92% 55%)";
    const isPick = isEditorPick(rawName);
    return (
      <motion.div key={p.pid || i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.03, ...transition }} whileHover={{ y: -4 }}
        className="rounded-xl overflow-hidden flex flex-col group transition-shadow duration-300"
        style={{ background: "linear-gradient(160deg, hsl(222 47% 9% / 0.7), hsl(222 47% 6% / 0.85))", backdropFilter: "blur(12px)", border: "1px solid hsl(217 32% 22% / 0.7)" }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.border = `1px solid ${marginAccent}55`; (e.currentTarget as HTMLDivElement).style.boxShadow = `0 14px 36px ${marginAccent}22`; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.border = "1px solid hsl(217 32% 22% / 0.7)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}>
        <a href={p.productUrl || `https://cjdropshipping.com/product/-p-${p.pid}.html`} target="_blank" rel="noreferrer" className="block aspect-square bg-background overflow-hidden relative">
          {img ? <img src={img} alt={displayName} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" /> : <div className="w-full h-full flex items-center justify-center text-muted-foreground"><Package className="h-8 w-8" /></div>}
          {isPick && <span className="absolute top-2 left-2 z-10 inline-flex items-center gap-1 text-[9px] font-bold px-2 py-1 rounded-md text-white" style={{ background: "linear-gradient(135deg, hsl(45 93% 47%), hsl(38 92% 50%))", boxShadow: "0 4px 14px hsl(45 93% 47% / 0.45)" }}>⭐ Editör Seçimi</span>}
          <span className="absolute top-2 right-2 text-[10px] font-bold px-2 py-1 rounded-md" style={{ background: "hsl(222 47% 6% / 0.85)", backdropFilter: "blur(6px)", border: `1px solid ${marginAccent}55`, color: marginAccent }}>{marginMeta.label}</span>
        </a>
        <div className="p-4 space-y-2 flex-1 flex flex-col">
          <div className="flex items-center gap-1.5">
            {newPids.has(p.pid) && <span className="text-[8px] font-bold uppercase px-1.5 py-0.5 rounded shrink-0" style={{ background: "hsl(199 89% 60% / 0.18)", color: "hsl(199 89% 65%)", border: "1px solid hsl(199 89% 60% / 0.4)" }}>🆕 Yeni</span>}
            <h3 className="text-xs font-semibold text-foreground line-clamp-2 min-h-[2rem]">{displayName}</h3>
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-[10px]">
            <div className="rounded-lg px-2 py-1.5" style={{ background: "hsl(217 32% 12% / 0.6)", border: "1px solid hsl(217 32% 20% / 0.5)" }}><p className="text-muted-foreground">Tedarikçi</p><p className="font-mono font-bold text-foreground">${p._cost.toFixed(2)}</p></div>
            <div className="rounded-lg px-2 py-1.5" style={{ background: "hsl(142 71% 45% / 0.1)", border: "1px solid hsl(142 71% 45% / 0.25)" }}><p className="text-muted-foreground">Tahmini Satış</p><p className="font-mono font-bold text-emerald-400">${p._sale.toFixed(2)}</p></div>
          </div>
          <div className="flex items-center justify-between text-[10px] rounded-lg px-2 py-1.5" style={{ background: `${marginAccent}14`, border: `1px solid ${marginAccent}33` }}>
            <span className="text-muted-foreground">Kâr Marjı</span>
            <span className="font-mono font-bold" style={{ color: marginAccent }}>%{p._margin}</span>
          </div>
          <button onClick={() => navigate(`/dashboard/analyzer?productName=${encodeURIComponent(displayName)}&selling_price=${p._sale.toFixed(2)}&product_cost=${p._cost.toFixed(2)}`)} className="mt-auto w-full h-8 rounded-md bg-primary/15 text-primary text-[10px] font-semibold hover:bg-primary/25 transition-colors flex items-center justify-center gap-1">
            <BarChart3 className="h-3 w-3" /> Analiz Et
          </button>
          <div className="grid grid-cols-2 gap-1.5">
            <a href={`https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=ALL&q=${encodeURIComponent(rawName)}&search_type=keyword_unordered`} target="_blank" rel="noreferrer" className="h-6 rounded-md text-[9px] font-medium flex items-center justify-center gap-1" style={{ background: "hsl(217 91% 60% / 0.1)", color: "hsl(217 91% 65%)", border: "1px solid hsl(217 91% 60% / 0.25)" }}>📘 Reklamda Ara</a>
            <a href={`https://www.tiktok.com/search?q=${encodeURIComponent(rawName)}`} target="_blank" rel="noreferrer" className="h-6 rounded-md text-[9px] font-medium flex items-center justify-center gap-1" style={{ background: "hsl(0 0% 100% / 0.06)", color: "hsl(215 20% 70%)", border: "1px solid hsl(217 32% 30% / 0.4)" }}>🎵 TikTok'ta Ara</a>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      <SEO title="Kazanan Ürünler | KHELL AI" description="CJ Dropshipping'den gerçek zamanlı yüksek kârlı ürünler." />

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl" style={{ background: "linear-gradient(145deg, hsl(142 71% 45% / 0.18), hsl(142 71% 45% / 0.06))", border: "1px solid hsl(142 71% 45% / 0.3)", boxShadow: "0 4px 16px hsl(142 71% 45% / 0.15)" }}>
            <TrendingUp className="h-5 w-5 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
              Kazanan Ürünler
              <motion.span animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 2, repeat: Infinity }}
                className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md"
                style={{ background: "linear-gradient(135deg, hsl(142 71% 45% / 0.18), hsl(142 71% 45% / 0.08))", color: "hsl(142 71% 50%)", border: "1px solid hsl(142 71% 45% / 0.35)", boxShadow: "0 2px 12px hsl(142 71% 45% / 0.15)" }}>
                <Radio className="h-2.5 w-2.5" /> CANLI VERİ
              </motion.span>
            </h1>
            <p className="text-xs text-muted-foreground">CJ'den en çok sipariş alan, yüksek kârlı ürünler</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => { if (!isPro) { setShowPaywall(true); return; } setShowNewOnly((v) => !v); }}
            className="inline-flex items-center gap-1 text-[11px] font-semibold px-3 py-1.5 rounded-md transition-all"
            style={{ background: showNewOnly && isPro ? "hsl(142 71% 45% / 0.25)" : "hsl(142 71% 45% / 0.12)", color: "hsl(142 71% 55%)", border: `1px solid ${showNewOnly && isPro ? "hsl(142 71% 45% / 0.6)" : "hsl(142 71% 45% / 0.3)"}` }}>
            {isPro ? <Bell className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
            {showNewOnly && isPro ? "🆕 Sadece Yeniler" : "🔔 Yeni Ürünleri Gör"}
            {!isPro && <span className="ml-1 text-[9px] opacity-70">PRO</span>}
          </button>
          <button onClick={fetchWinning} disabled={loading} className="inline-flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-md border border-border bg-card hover:bg-accent text-muted-foreground transition-colors">
            <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
            {formatCountdown(countdown)}
          </button>
        </div>
      </div>

      {showNewOnly && isPro && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg px-4 py-2.5 text-xs font-medium flex items-center gap-2" style={{ background: "hsl(199 89% 60% / 0.12)", border: "1px solid hsl(199 89% 60% / 0.3)", color: "hsl(199 89% 65%)" }}>
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          Sadece bu oturumda ilk kez görünen yeni ürünler — {newPids.size} yeni ürün bulundu
        </motion.div>
      )}

      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="h-3.5 w-3.5 text-muted-foreground" />
        {marginFilters.map((f, i) => (
          <button key={f.label} onClick={() => setMarginFilter(i)} className={`px-3 py-1 text-xs rounded-md transition-colors ${marginFilter === i ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:text-foreground"}`}>{f.label}</button>
        ))}
      </div>

      {lastUpdated && (
        <p className="text-[10px] text-muted-foreground">
          Son güncelleme: {lastUpdated.toLocaleTimeString("tr-TR")} · {allFiltered.length} ürün bulundu {!isPro && lockedItems.length > 0 && `· ${lockedItems.length} ürün PRO ile açılır`}
        </p>
      )}

      {error && <div className="rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs px-3 py-2">API hatası: {error}</div>}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border/50 bg-accent/20 overflow-hidden">
              <div className="aspect-square bg-muted animate-pulse" />
              <div className="p-4 space-y-2"><div className="h-3 bg-muted animate-pulse rounded" /><div className="h-3 bg-muted animate-pulse rounded w-2/3" /><div className="h-8 bg-muted animate-pulse rounded mt-3" /></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {visibleItems.map((p: any, i: number) => <ProductCard key={p.pid || i} p={p} i={i} />)}
            {lockedItems.map((p: any, i: number) => (
              <motion.div key={`locked-${p.pid || i}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: (FREE_LIMIT + i) * 0.03, ...transition }}
                className="rounded-xl overflow-hidden flex flex-col relative cursor-pointer"
                style={{ background: "linear-gradient(160deg, hsl(222 47% 9% / 0.7), hsl(222 47% 6% / 0.85))", border: "1px solid hsl(217 32% 22% / 0.7)" }}
                onClick={() => setShowPaywall(true)}>
                <div className="aspect-square bg-background overflow-hidden" style={{ filter: "blur(8px)" }}>
                  {p.productImage?.split(",")[0] ? <img src={p.productImage.split(",")[0]} alt="" loading="lazy" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-muted" />}
                </div>
                <div className="p-4 space-y-2" style={{ filter: "blur(4px)" }}>
                  <div className="h-3 bg-muted rounded w-3/4" /><div className="h-3 bg-muted rounded w-1/2" /><div className="h-8 bg-primary/20 rounded mt-2" />
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl" style={{ background: "hsl(222 47% 6% / 0.75)", backdropFilter: "blur(2px)" }}>
                  <Crown className="h-8 w-8 text-amber-400 mb-2" />
                  <p className="text-xs font-bold text-white mb-1">PRO Özellik</p>
                  <p className="text-[10px] text-muted-foreground text-center px-4">Bu ürünü görmek için Pro'ya geç</p>
                  <button className="mt-3 px-4 py-1.5 rounded-lg text-[11px] font-bold text-white" style={{ background: "linear-gradient(135deg, hsl(38 92% 50%), hsl(24 95% 53%))" }}>Pro'ya Geç</button>
                </div>
              </motion.div>
            ))}
          </div>

          {!isPro && lockedItems.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="rounded-xl p-6 text-center cursor-pointer"
              style={{ background: "linear-gradient(135deg, hsl(38 92% 50% / 0.1), hsl(24 95% 53% / 0.08))", border: "1px solid hsl(38 92% 50% / 0.3)" }}
              onClick={() => setShowPaywall(true)}>
              <Crown className="h-10 w-10 text-amber-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white mb-1">+{lockedItems.length} Ürün PRO ile Açılır</h3>
              <p className="text-xs text-muted-foreground mb-4">Rakipler fark etmeden önce trend ürünleri sen gör</p>
              <button className="px-8 py-2.5 rounded-xl text-sm font-bold text-white" style={{ background: "linear-gradient(135deg, hsl(38 92% 50%), hsl(24 95% 53%))", boxShadow: "0 4px 20px hsl(38 92% 50% / 0.3)" }}>
                Pro'ya Geç — 249₺/ay
              </button>
            </motion.div>
          )}
        </>
      )}

      {!loading && allFiltered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-sm">{showNewOnly ? "Bu oturumda henüz yeni ürün yok." : "Bu filtreye uygun ürün bulunamadı."}</p>
        </div>
      )}

      {showPaywall && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/90 backdrop-blur-md">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-md mx-4 rounded-2xl border border-border bg-card p-8 shadow-2xl text-center">
            <div className="text-5xl mb-4">👑</div>
            <h2 className="text-2xl font-black text-foreground mb-2">PRO ile Kilidi Aç</h2>
            <p className="text-sm text-muted-foreground mb-6">Tüm kazanan ürünleri görmek ve rakipten önce harekete geçmek için PRO'ya geç.</p>
            <div className="space-y-2 text-left mb-6">
              {["🏆 Tüm kazanan ürünlere erişim (32 ürün)", "🆕 Yeni ürünleri ilk sen gör", "📊 Sınırsız ürün analizi", "🎯 Gelişmiş risk & trend skoru", "🎬 Sınırsız video reklam üretimi"].map((f) => (
                <div key={f} className="flex items-center gap-2 text-sm text-foreground"><span className="text-winning">✔</span> {f}</div>
              ))}
            </div>
            <a href="https://www.shopier.com/bamironlinestore/46009500" target="_blank" rel="noopener noreferrer" className="block w-full rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold text-base py-3.5 transition-all shadow-lg shadow-amber-500/25">
              Pro'ya Geç — 249₺/ay
            </a>
            <button onClick={() => setShowPaywall(false)} className="text-xs text-muted-foreground hover:underline mt-4 block w-full">Şimdi değil</button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
