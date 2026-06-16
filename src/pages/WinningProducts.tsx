import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Package, Loader2, Radio, BarChart3, RefreshCw, TrendingUp, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLocale } from "@/contexts/LocaleContext";
import SEO from "@/components/SEO";
import { translateProducts } from "@/lib/translate";

const CJ_EMAIL = import.meta.env.VITE_CJ_EMAIL || "bamir.global@gmail.com";
const CJ_API_KEY = import.meta.env.VITE_CJ_API_KEY || "26689fbeeb5045f89ec8764c32aaada0";
const REFRESH_INTERVAL = 30 * 60 * 1000;

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
];

export default function WinningProducts() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<CJProduct[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [countdown, setCountdown] = useState(REFRESH_INTERVAL / 1000);
  const [marginFilter, setMarginFilter] = useState(0);
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const { currency } = useLocale();

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
      // Farklı kategorilerden ürün çek, karıştır → her seferinde farklı görünüm
      const randomTerms = [...SEARCH_TERMS].sort(() => Math.random() - 0.5).slice(0, 3);
      const results: CJProduct[] = [];

      for (const term of randomTerms) {
        const url = `https://developers.cjdropshipping.com/api2.0/v1/product/list?pageNum=1&pageSize=8&sortField=recentOrders&sortType=DESC&productNameEn=${encodeURIComponent(term)}`;
        const res = await fetch(url, { headers: { "CJ-Access-Token": token } });
        const data = await res.json();
        if (data?.data?.list) results.push(...data.data.list);
      }

      // Tekrarları temizle, kâr marjı hesapla, yüksek kârlıları öne çıkar
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
      setLastUpdated(new Date());
      // Ürün adlarını Türkçeye çevir
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
    const timer = setInterval(() => {
      setCountdown((prev) => (prev <= 1 ? REFRESH_INTERVAL / 1000 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [lastUpdated]);

  const formatCountdown = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  const filteredItems = (items as any[]).filter((p) => p._margin >= marginFilters[marginFilter].min);

  return (
    <div className="space-y-6">
      <SEO title="Kazanan Ürünler | KHELL AI" description="CJ Dropshipping'den gerçek zamanlı yüksek kârlı ürünler." />

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10">
            <TrendingUp className="h-5 w-5 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
              Kazanan Ürünler
              <motion.span
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-500 border border-emerald-500/30"
              >
                <Radio className="h-2.5 w-2.5" /> CANLI VERİ
              </motion.span>
            </h1>
            <p className="text-xs text-muted-foreground">CJ'den en çok sipariş alan, yüksek kârlı ürünler</p>
          </div>
        </div>
        <button
          onClick={fetchWinning}
          disabled={loading}
          className="inline-flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-md border border-border bg-card hover:bg-accent text-muted-foreground transition-colors"
        >
          <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
          {formatCountdown(countdown)}
        </button>
      </div>

      {/* Margin Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="h-3.5 w-3.5 text-muted-foreground" />
        {marginFilters.map((f, i) => (
          <button
            key={f.label}
            onClick={() => setMarginFilter(i)}
            className={`px-3 py-1 text-xs rounded-md transition-colors ${marginFilter === i ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:text-foreground"}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {lastUpdated && (
        <p className="text-[10px] text-muted-foreground">
          Son güncelleme: {lastUpdated.toLocaleTimeString("tr-TR")} · {filteredItems.length} ürün bulundu
        </p>
      )}

      {error && (
        <div className="rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs px-3 py-2">
          API hatası: {error}
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border/50 bg-accent/20 overflow-hidden">
              <div className="aspect-square bg-muted animate-pulse" />
              <div className="p-4 space-y-2">
                <div className="h-3 bg-muted animate-pulse rounded" />
                <div className="h-3 bg-muted animate-pulse rounded w-2/3" />
                <div className="h-8 bg-muted animate-pulse rounded mt-3" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredItems.map((p: any, i: number) => {
            const marginMeta = getMarginLabel(p._margin);
            const img = p.productImage?.split(",")[0] || "";
            const rawName = getDisplayName(p);
              const displayName = translations[rawName] || rawName;
            return (
              <motion.div
                key={p.pid || i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03, ...transition }}
                whileHover={{ y: -4 }}
                className="card-glow rounded-xl overflow-hidden flex flex-col group"
              >
                {/* Görsel */}
                <a
                  href={p.productUrl || `https://cjdropshipping.com/product/-p-${p.pid}.html`}
                  target="_blank"
                  rel="noreferrer"
                  className="block aspect-square bg-background overflow-hidden relative"
                >
                  {img ? (
                    <img src={img} alt={displayName} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <Package className="h-8 w-8" />
                    </div>
                  )}
                  <span className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-md border ${marginMeta.bg} ${marginMeta.color}`}>
                    {marginMeta.label}
                  </span>
                </a>

                {/* İçerik */}
                <div className="p-4 space-y-2 flex-1 flex flex-col">
                  <h3 className="text-xs font-semibold text-foreground line-clamp-2 min-h-[2rem]">{displayName}</h3>

                  <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                    <div className="rounded bg-background/60 px-2 py-1.5">
                      <p className="text-muted-foreground">Tedarikçi</p>
                      <p className="font-mono font-bold text-foreground">${p._cost.toFixed(2)}</p>
                    </div>
                    <div className="rounded bg-emerald-500/10 px-2 py-1.5">
                      <p className="text-muted-foreground">Tahmini Satış</p>
                      <p className="font-mono font-bold text-emerald-400">${p._sale.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-muted-foreground">Kâr Marjı</span>
                    <span className={`font-mono font-bold ${marginMeta.color}`}>%{p._margin}</span>
                  </div>

                  <button
                    onClick={() => navigate(`/dashboard/analyzer?productName=${encodeURIComponent(displayName)}&selling_price=${p._sale.toFixed(2)}&product_cost=${p._cost.toFixed(2)}`)}
                    className="mt-auto w-full h-8 rounded-md bg-primary/15 text-primary text-[10px] font-semibold hover:bg-primary/25 transition-colors flex items-center justify-center gap-1"
                  >
                    <BarChart3 className="h-3 w-3" /> Analiz Et
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {!loading && filteredItems.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-sm">Bu filtreye uygun ürün bulunamadı.</p>
        </div>
      )}
    </div>
  );
}
