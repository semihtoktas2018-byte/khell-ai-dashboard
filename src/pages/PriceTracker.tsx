import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Trash2, TrendingDown, TrendingUp, AlertCircle, Loader2, Lock } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { useAuth } from "@/contexts/AuthContext";
import { useAnalysisHistory } from "@/contexts/AnalysisHistoryContext";
import { supabase } from "@/integrations/supabase/client";
import BackButton from "@/components/BackButton";
import SEO from "@/components/SEO";

const transition = { type: "spring" as const, stiffness: 300, damping: 30 };
const FREE_TRACK_LIMIT = 2;

interface TrackedProduct {
  id: string;
  pid: string;
  product_name: string;
  image_url: string | null;
  product_url: string | null;
  initial_price: number;
  target_price: number | null;
  last_checked_price: number;
  created_at: string;
}

interface PriceAlert {
  id: string;
  product_name: string;
  old_price: number;
  new_price: number;
  change_pct: number;
  is_read: boolean;
  created_at: string;
}

export default function PriceTracker() {
  const { locale } = useLocale();
  const { user } = useAuth();
  const { isPro } = useAnalysisHistory();
  const isTr = locale === "tr";
  const [tracked, setTracked] = useState<TrackedProduct[]>([]);
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPaywall, setShowPaywall] = useState(false);

  const proPriceLabel = locale === "tr" ? "249₺/ay" : locale === "fr" ? "29€/ay" : "$29/mo";
  const shopierLink = locale === "tr" ? "https://www.shopier.com/bamironlinestore/46009500" : "https://www.shopier.com/bamironlinestore/48494025";

  const load = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const [trackedRes, alertsRes] = await Promise.all([
      supabase.from("tracked_products").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      supabase.from("price_alerts").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(20),
    ]);
    if (trackedRes.data) setTracked(trackedRes.data as TrackedProduct[]);
    if (alertsRes.data) setAlerts(alertsRes.data as PriceAlert[]);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (id: string) => {
    setTracked((prev) => prev.filter((t) => t.id !== id));
    await supabase.from("tracked_products").delete().eq("id", id);
  };

  const handleMarkRead = async (id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, is_read: true } : a)));
    await supabase.from("price_alerts").update({ is_read: true }).eq("id", id);
  };

  const unreadCount = alerts.filter((a) => !a.is_read).length;
  const atLimit = !isPro && tracked.length >= FREE_TRACK_LIMIT;

  return (
    <div className="space-y-6">
      <SEO
        title={isTr ? "Fiyat Takibi | KHELL AI" : "Price Tracker | KHELL AI"}
        description={isTr ? "Ürün fiyatlarını takip et, değişiklikte anında haber al." : "Track product prices and get notified when they change."}
      />
      <BackButton />

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={transition}
        className="rounded-2xl p-6 md:p-8"
        style={{ background: "linear-gradient(135deg, hsl(222 47% 7%) 0%, hsl(222 47% 4%) 100%)", border: "1px solid hsl(217 32% 17%)" }}
      >
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-blue-500/20 flex items-center justify-center">
            <Bell className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">{isTr ? "📊 Fiyat Takibi" : "📊 Price Tracker"}</h1>
            <p className="text-xs text-muted-foreground">
              {isTr ? "Trend/Kazanan Ürünler sayfasından bir ürünü takibe al, fiyatı değişince burada gör" : "Track a product from Trending/Winning Products, see changes here"}
            </p>
          </div>
        </div>

        <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
          style={{
            background: isPro ? "hsl(142 71% 45% / 0.12)" : "hsl(38 92% 50% / 0.12)",
            border: `1px solid ${isPro ? "hsl(142 71% 45% / 0.35)" : "hsl(38 92% 50% / 0.35)"}`,
            color: isPro ? "hsl(142 71% 55%)" : "hsl(38 92% 60%)",
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: isPro ? "hsl(142 71% 55%)" : "hsl(38 92% 60%)" }} />
          {isPro
            ? (isTr ? "PRO — Sınırsız ürün takibi" : "PRO — Unlimited price tracking")
            : (isTr ? `${Math.max(0, FREE_TRACK_LIMIT - tracked.length)} / ${FREE_TRACK_LIMIT} ücretsiz takip hakkın kaldı` : `${Math.max(0, FREE_TRACK_LIMIT - tracked.length)} / ${FREE_TRACK_LIMIT} free tracking slots left`)}
        </div>
      </motion.div>

      {!user ? (
        <div className="rounded-xl p-8 text-center" style={{ background: "hsl(222 47% 8%)", border: "1px solid hsl(217 32% 17%)" }}>
          <p className="text-sm text-muted-foreground">{isTr ? "Fiyat takibi için giriş yapmalısın." : "Please log in to use price tracking."}</p>
        </div>
      ) : loading ? (
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground py-10">
          <Loader2 className="h-4 w-4 animate-spin" /> {isTr ? "Yükleniyor..." : "Loading..."}
        </div>
      ) : (
        <>
          {atLimit && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-xl p-5 flex items-center justify-between gap-4"
              style={{ background: "hsl(38 92% 55% / 0.08)", border: "1px solid hsl(38 92% 55% / 0.35)" }}>
              <div className="flex items-center gap-3">
                <Lock className="h-5 w-5 text-amber-400 shrink-0" />
                <p className="text-xs text-foreground">
                  {isTr ? "Ücretsiz takip limitine ulaştın. Yeni ürün takip etmek için PRO'ya geç veya mevcut bir ürünü listeden çıkar." : "You've reached your free tracking limit. Upgrade to PRO or remove a tracked product to add a new one."}
                </p>
              </div>
              <button onClick={() => setShowPaywall(true)} className="shrink-0 text-xs font-bold px-4 py-2 rounded-lg text-white bg-gradient-to-r from-amber-500 to-orange-500">
                {isTr ? "PRO'ya Geç" : "Go PRO"}
              </button>
            </motion.div>
          )}

          {/* Alerts */}
          {alerts.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ ...transition, delay: 0.05 }}>
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-sm font-semibold text-foreground">{isTr ? "Fiyat Bildirimleri" : "Price Alerts"}</h3>
                {unreadCount > 0 && (
                  <span className="text-[10px] font-bold text-white bg-amber-500 px-1.5 py-0.5 rounded-full">{unreadCount}</span>
                )}
              </div>
              <div className="space-y-2">
                {alerts.map((a) => {
                  const up = a.change_pct >= 0;
                  return (
                    <button key={a.id} onClick={() => handleMarkRead(a.id)}
                      className="w-full text-left rounded-xl p-3.5 flex items-center justify-between transition-opacity"
                      style={{
                        background: a.is_read ? "hsl(222 47% 8%)" : "hsl(38 92% 55% / 0.08)",
                        border: `1px solid ${a.is_read ? "hsl(217 32% 17%)" : "hsl(38 92% 55% / 0.35)"}`,
                        opacity: a.is_read ? 0.6 : 1,
                      }}>
                      <div className="flex items-center gap-3">
                        <div className={`h-7 w-7 rounded-lg flex items-center justify-center ${up ? "bg-red-500/15" : "bg-green-500/15"}`}>
                          {up ? <TrendingUp className="h-3.5 w-3.5 text-red-400" /> : <TrendingDown className="h-3.5 w-3.5 text-green-400" />}
                        </div>
                        <div>
                          <p className="text-xs font-medium text-foreground">{a.product_name}</p>
                          <p className="text-[10px] text-muted-foreground">${a.old_price.toFixed(2)} → ${a.new_price.toFixed(2)}</p>
                        </div>
                      </div>
                      <span className={`text-xs font-bold ${up ? "text-red-400" : "text-green-400"}`}>
                        {up ? "+" : ""}{a.change_pct.toFixed(1)}%
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Tracked Products */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ ...transition, delay: 0.1 }}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-foreground">
                {isTr ? "Takip Edilen Ürünler" : "Tracked Products"}
                <span className="ml-2 text-[10px] text-muted-foreground bg-accent px-1.5 py-0.5 rounded-full">{tracked.length}</span>
              </h3>
            </div>

            {tracked.length === 0 ? (
              <div className="rounded-xl p-8 text-center" style={{ background: "hsl(222 47% 8%)", border: "1px solid hsl(217 32% 17%)" }}>
                <AlertCircle className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">
                  {isTr ? "Henüz takip ettiğin ürün yok. Trend Ürünler veya Kazanan Ürünler'den bir ürünü takibe al." : "No tracked products yet. Track one from Trending or Winning Products."}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <AnimatePresence>
                  {tracked.map((p) => {
                    const changed = p.last_checked_price !== p.initial_price;
                    const trend = p.last_checked_price > p.initial_price ? "up" : "down";
                    const changePct = p.initial_price > 0 ? ((p.last_checked_price - p.initial_price) / p.initial_price) * 100 : 0;
                    return (
                      <motion.div key={p.id} exit={{ opacity: 0, x: -20 }}
                        className="rounded-xl p-4 flex items-center justify-between"
                        style={{ background: "hsl(222 47% 8%)", border: `1px solid ${changed ? "hsl(38 92% 55% / 0.4)" : "hsl(217 32% 17%)"}` }}>
                        <div className="flex items-center gap-3 min-w-0">
                          {p.image_url ? (
                            <img src={p.image_url} alt="" className="h-9 w-9 rounded-lg object-cover shrink-0" />
                          ) : (
                            <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${trend === "down" ? "bg-green-500/15" : "bg-red-500/15"}`}>
                              {trend === "down" ? <TrendingDown className="h-4 w-4 text-green-400" /> : <TrendingUp className="h-4 w-4 text-red-400" />}
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{p.product_name}</p>
                            <p className="text-[10px] text-muted-foreground">CJ · {isTr ? "Başlangıç" : "Initial"}: ${p.initial_price.toFixed(2)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 shrink-0">
                          {changed && (
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${trend === "up" ? "text-red-400 bg-red-500/10 border-red-500/30" : "text-green-400 bg-green-500/10 border-green-500/30"}`}>
                              {trend === "up" ? "▲" : "▼"} {Math.abs(changePct).toFixed(1)}%
                            </span>
                          )}
                          <p className="text-sm font-bold text-white">${p.last_checked_price.toFixed(2)}</p>
                          <button onClick={() => handleDelete(p.id)} className="h-7 w-7 flex items-center justify-center rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ ...transition, delay: 0.2 }}
            className="rounded-xl p-5 text-center text-xs text-muted-foreground"
            style={{ background: "hsl(217 91% 60% / 0.06)", border: "1px solid hsl(217 91% 60% / 0.2)" }}>
            {isTr ? "Fiyatlar her saat başı otomatik kontrol edilir, %2'den fazla değişimde burada bildirim alırsın." : "Prices are checked automatically every hour — you'll get an alert here when they change by more than 2%."}
          </motion.div>
        </>
      )}

      {showPaywall && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/90 backdrop-blur-md">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-md mx-4 rounded-2xl border border-border bg-card p-8 shadow-2xl text-center">
            <div className="text-5xl mb-4">📊</div>
            <h2 className="text-2xl font-black text-foreground mb-2">
              {isTr ? "Sınırsız Fiyat Takibi PRO'da" : "Unlimited Price Tracking with PRO"}
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              {isTr ? "Ücretsiz takip hakkını kullandın. Sınırsız ürün takibi için PRO'ya geç." : "You've used your free tracking slots. Upgrade to PRO for unlimited tracking."}
            </p>
            <a href={shopierLink} target="_blank" rel="noopener noreferrer" className="block w-full rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold text-base py-3.5 transition-all shadow-lg shadow-amber-500/25">
              {isTr ? "Pro'ya Geç" : "Go Pro"} — {proPriceLabel}
            </a>
            <button onClick={() => setShowPaywall(false)} className="text-xs text-muted-foreground hover:underline mt-4 block w-full">
              {isTr ? "Şimdi değil" : "Not now"}
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
