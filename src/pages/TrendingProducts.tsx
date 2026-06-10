import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Package, Loader2, Radio, BarChart3, FileText, Flame, TrendingUp, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CJ_EMAIL = "bamir.global@gmail.com";
const CJ_API_KEY = "26689fbeeb5045f89ec8764c32aaada0";
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

const MOCK: CJProduct[] = Array.from({ length: 12 }).map((_, i) => ({
  pid: `mock-${i}`,
  productName: ["Wireless Bluetooth Earbuds Pro","LED Strip Light RGB 5M","Mini Portable Blender USB","Smart Watch Fitness Tracker","Magnetic Phone Car Mount","Pet Hair Remover Roller","Posture Corrector Back Brace","Silicone Kitchen Utensil Set","Foldable Laptop Stand","Massage Gun Deep Tissue","Electric Lint Remover","Solar LED Garden Lights"][i],
  productNameEn: ["Wireless Bluetooth Earbuds Pro","LED Strip Light RGB 5M","Mini Portable Blender USB","Smart Watch Fitness Tracker","Magnetic Phone Car Mount","Pet Hair Remover Roller","Posture Corrector Back Brace","Silicone Kitchen Utensil Set","Foldable Laptop Stand","Massage Gun Deep Tissue","Electric Lint Remover","Solar LED Garden Lights"][i],
  productImage: `https://picsum.photos/seed/cj${i}/400/400`,
  sellPrice: (5 + i * 1.3).toFixed(2),
}));

export default function TrendingProducts() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<CJProduct[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [countdown, setCountdown] = useState(REFRESH_INTERVAL / 1000);
  const navigate = useNavigate();

  const fetchTrending = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getAccessToken();
      const url = "https://developers.cjdropshipping.com/api2.0/v1/product/list?pageNum=1&pageSize=20&sortField=recentOrders&sortType=DESC";
      const res = await fetch(url, { headers: { "CJ-Access-Token": token } });
      const data = await res.json();
      if (!data?.data?.list) throw new Error(data?.message || "Veri alınamadı");
      setItems(data.data.list);
      setLastUpdated(new Date());
      setCountdown(REFRESH_INTERVAL / 1000);
    } catch (e: any) {
      setError(e?.message || "Hata");
      setItems(MOCK);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrending();
    const interval = setInterval(fetchTrending, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchTrending]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev <= 1 ? REFRESH_INTERVAL / 1000 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [lastUpdated]);

  const formatCountdown = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  const openProduct = (p: CJProduct) => {
    const url = p.productUrl || `https://cjdropshipping.com/product/-p-${p.pid}.html`;
    window.open(url, "_blank", "noreferrer");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-orange-500/10">
            <Flame className="h-5 w-5 text-orange-500" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
              CJ Trend Ürünler <span>🔥</span>
            </h1>
            <p className="text-xs text-muted-foreground">En çok sipariş alan ürünler — canlı CJdropshipping verisi</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <motion.span
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-orange-500/15 text-orange-500 border border-orange-500/30"
          >
            <Radio className="h-2.5 w-2.5" /> CANLI VERİ
          </motion.span>
          <button
            onClick={fetchTrending}
            disabled={loading}
            className="inline-flex items-center gap-1 text-[10px] font-medium px-2.5 py-1 rounded-md border border-border bg-card hover:bg-accent text-muted-foreground transition-colors"
          >
            <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
            {formatCountdown(countdown)}
          </button>
        </div>
      </div>

      {lastUpdated && (
        <p className="text-[10px] text-muted-foreground">
          Son güncelleme: {lastUpdated.toLocaleTimeString("tr-TR")} — 30 dk'da bir otomatik yenilenir
        </p>
      )}

      {error && (
        <div className="rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs px-3 py-2">
          API hatası: {error} — örnek veri gösteriliyor.
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-lg border border-border/50 bg-accent/20 overflow-hidden">
              <div className="aspect-square bg-muted animate-pulse" />
              <div className="p-3 space-y-2">
                <div className="h-3 bg-muted animate-pulse rounded" />
                <div className="h-3 bg-muted animate-pulse rounded w-2/3" />
                <div className="h-7 bg-muted animate-pulse rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {items.map((p, i) => {
            const cost = parseFloat(p.sellPrice || "0") || 0;
            const estSale = cost * 3;
            const margin = cost > 0 ? Math.round(((estSale - cost) / estSale) * 100) : 0;
            const img = p.productImage?.split(",")[0] || "";
            const displayName = getDisplayName(p);
            return (
              <motion.div
                key={p.pid || i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0, transition: { delay: i * 0.03 } }}
                className="group relative rounded-lg bg-accent/30 border border-border/50 overflow-hidden hover:border-orange-500/50 transition-colors flex flex-col"
              >
                {i < 3 && (
                  <span className="absolute top-2 left-2 z-10 inline-flex items-center gap-1 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-md bg-orange-500 text-white">
                    <TrendingUp className="h-2.5 w-2.5" /> TOP {i + 1}
                  </span>
                )}
                <div
                  onClick={() => openProduct(p)}
                  className="block aspect-square bg-background overflow-hidden cursor-pointer"
                >
                  {img ? (
                    <img src={img} alt={displayName} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <Package className="h-8 w-8" />
                    </div>
                  )}
                </div>
                <div className="p-3 space-y-2 flex-1 flex flex-col">
                  <p className="text-xs font-medium text-foreground line-clamp-2 min-h-[2rem]">{displayName}</p>
                  <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                    <div className="rounded bg-background/60 px-2 py-1">
                      <p className="text-muted-foreground">Maliyet</p>
                      <p className="font-mono font-bold text-foreground">${cost.toFixed(2)}</p>
                    </div>
                    <div className="rounded bg-orange-500/10 px-2 py-1">
                      <p className="text-muted-foreground">Satış</p>
                      <p className="font-mono font-bold text-orange-500">${estSale.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-muted-foreground">Kâr Marjı</span>
                    <span className="font-mono font-bold text-winning">%{margin}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 mt-auto pt-1">
                    <button
                      onClick={() => navigate(`/dashboard/analyzer?name=${encodeURIComponent(displayName)}&cost=${cost}&price=${estSale.toFixed(2)}`)}
                      className="h-7 rounded-md bg-primary/15 text-primary text-[10px] font-semibold hover:bg-primary/25 transition-colors flex items-center justify-center gap-1"
                    >
                      <BarChart3 className="h-3 w-3" /> Analiz Et
                    </button>
                    <button
                      onClick={() => navigate(`/dashboard/product-page-generator?name=${encodeURIComponent(displayName)}&image=${encodeURIComponent(img)}&price=${estSale.toFixed(2)}`)}
                      className="h-7 rounded-md bg-orange-500/15 text-orange-500 text-[10px] font-semibold hover:bg-orange-500/25 transition-colors flex items-center justify-center gap-1"
                    >
                      <FileText className="h-3 w-3" /> Sayfa Oluştur
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Loader2 className="h-3 w-3 animate-spin" /> CJ API'den trend ürünler çekiliyor...
        </div>
      )}
    </div>
  );
}
