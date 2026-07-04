import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Package, Loader2, Radio, BarChart3, FileText, Flame, TrendingUp, RefreshCw, Crown, Bell, BellRing } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLocale } from "@/contexts/LocaleContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { translateProducts } from "@/lib/translate";
import { isEditorPick } from "@/lib/editorPicks";
import { getNewPids, markSeen } from "@/lib/newProductTracker";
import { useAnalysisHistory } from "@/contexts/AnalysisHistoryContext";
import SEO from "@/components/SEO";

const REFRESH_INTERVAL = 5 * 60 * 1000;
const FREE_LIMIT = 4;
const FREE_TRACK_LIMIT = 2;

interface CJProduct {
  pid: string;
  productName: string;
  productNameEn?: string;
  productImage: string;
  sellPrice?: string;
  productUrl?: string;
  categoryName?: string;
  shippingCountryCodes?: string[];
}

function shippingSpeedMeta(codes: string[] | undefined, isTr: boolean): { label: string; color: string; bg: string } | null {
  if (!codes || codes.length === 0) return null;
  const localWarehouse = codes.find((c) => !c.includes("_") && c !== "CN");
  if (localWarehouse) return {
    label: isTr ? `🚀 Yerel Depo (${localWarehouse}) — Hızlı Kargo` : `🚀 Local Warehouse (${localWarehouse}) — Fast Shipping`,
    color: "hsl(142 71% 55%)",
    bg: "hsl(142 71% 45% / 0.12)",
  };
  const fromChina = codes.some((c) => c.startsWith("CN_"));
  if (fromChina) return {
    label: isTr ? "🐢 Çin'den Kargo — Standart Süre" : "🐢 Ships from China — Standard Time",
    color: "hsl(38 92% 60%)",
    bg: "hsl(38 92% 50% / 0.12)",
  };
  return null;
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

const COPY = {
  tr: {
    proFeature: "PRO Özellik",
    seeProduct: "Bu ürünü görmek için Pro'ya geç",
    goPro: "Pro'ya Geç",
    liveData: "CANLI VERİ",
    lastUpdate: "Son güncelleme",
    autoRefresh: "5 dk'da bir otomatik yenilenir",
    proUnlocks: (n: number) => `${n} ürün PRO ile açılır`,
    bannerTitle: (n: number) => `+${n} Trend Ürün PRO ile Açılır`,
    bannerDesc: "Rakipler fark etmeden önce en çok satan ürünleri sen gör",
    modalTitle: "Tüm En Çok Satanları Gör",
    modalDesc: "CJ'nin en çok satan 24 ürününü görmek için PRO'ya geç.",
    features: ["🔥 24 trend ürüne tam erişim", "🆕 Yeni ürünleri ilk sen gör", "📊 Sınırsız ürün analizi", "🎯 Gelişmiş risk & trend skoru", "🎬 Sınırsız video reklam üretimi"],
    later: "Şimdi değil",
    apiError: "API hatası",
    mockNote: "örnek veri gösteriliyor.",
    fetching: "CJ API'den trend ürünler çekiliyor...",
    top: "TOP",
    editorPick: "Editör Seçimi",
    newBadge: "Yeni",
    cost: "Maliyet",
    sale: "Satış",
    margin: "Kâr Marjı",
    searchAd: "Reklamda Ara",
    searchTiktok: "TikTok'ta Ara",
    analyze: "Analiz Et",
    createPage: "Sayfa Oluştur",
    track: "Takibe Al",
    tracking: "Takipte",
    trackLimitTitle: "Sınırsız Fiyat Takibi PRO'da",
    trackLimitDesc: "Ücretsiz hesapta en fazla 2 ürün takip edebilirsin. Sınırsız takip için PRO'ya geç.",
  },
  en: {
    proFeature: "PRO Feature",
    seeProduct: "Upgrade to Pro to see this product",
    goPro: "Go Pro",
    liveData: "LIVE DATA",
    lastUpdate: "Last updated",
    autoRefresh: "auto-refreshes every 30 min",
    proUnlocks: (n: number) => `${n} products unlock with PRO`,
    bannerTitle: (n: number) => `+${n} Trending Products Unlock with PRO`,
    bannerDesc: "See best-sellers before your competitors do",
    modalTitle: "See All Trending Products",
    modalDesc: "Upgrade to PRO to see CJ's top 24 best-selling products.",
    features: ["🔥 Full access to 24 trending products", "🆕 Be the first to see new products", "📊 Unlimited product analysis", "🎯 Advanced risk & trend score", "🎬 Unlimited video ad generation"],
    later: "Not now",
    apiError: "API error",
    mockNote: "showing sample data.",
    fetching: "Fetching trending products from CJ API...",
    top: "TOP",
    editorPick: "Editor's Pick",
    newBadge: "New",
    cost: "Cost",
    sale: "Sale",
    margin: "Profit Margin",
    searchAd: "Search in Ads",
    searchTiktok: "Search on TikTok",
    analyze: "Analyze",
    createPage: "Create Page",
    track: "Track Price",
    tracking: "Tracking",
    trackLimitTitle: "Unlimited Price Tracking with PRO",
    trackLimitDesc: "Free accounts can track up to 2 products. Upgrade to PRO for unlimited tracking.",
  },
  fr: {
    proFeature: "Fonction PRO",
    seeProduct: "Passez à Pro pour voir ce produit",
    goPro: "Passer au Pro",
    liveData: "DONNÉES EN DIRECT",
    lastUpdate: "Dernière mise à jour",
    autoRefresh: "actualisation auto toutes les 30 min",
    proUnlocks: (n: number) => `${n} produits débloqués avec PRO`,
    bannerTitle: (n: number) => `+${n} produits tendance débloqués avec PRO`,
    bannerDesc: "Découvrez les meilleures ventes avant vos concurrents",
    modalTitle: "Voir tous les produits tendance",
    modalDesc: "Passez à PRO pour voir les 24 meilleurs produits de CJ.",
    features: ["🔥 Accès complet à 24 produits tendance", "🆕 Découvrez les nouveaux produits en premier", "📊 Analyses de produits illimitées", "🎯 Score de risque & tendance avancé", "🎬 Génération illimitée de pubs vidéo"],
    later: "Pas maintenant",
    apiError: "Erreur API",
    mockNote: "affichage de données d'exemple.",
    fetching: "Récupération des produits tendance depuis l'API CJ...",
    top: "TOP",
    editorPick: "Choix de l'éditeur",
    newBadge: "Nouveau",
    cost: "Coût",
    sale: "Vente",
    margin: "Marge bénéficiaire",
    searchAd: "Chercher en pub",
    searchTiktok: "Chercher sur TikTok",
    analyze: "Analyser",
    createPage: "Créer une page",
    track: "Suivre le prix",
    tracking: "Suivi",
    trackLimitTitle: "Suivi de prix illimité avec PRO",
    trackLimitDesc: "Les comptes gratuits peuvent suivre jusqu'à 2 produits. Passez à PRO pour un suivi illimité.",
  },
} as const;

export default function BestSellers() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<CJProduct[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [countdown, setCountdown] = useState(REFRESH_INTERVAL / 1000);
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [newPids, setNewPids] = useState<Set<string>>(new Set());
  const [showPaywall, setShowPaywall] = useState(false);
  const [showTrackPaywall, setShowTrackPaywall] = useState(false);
  const navigate = useNavigate();
  const { isPro } = useAnalysisHistory();
  const { locale } = useLocale();
  const { user } = useAuth();
  const c = COPY[locale] || COPY.en;
  const proPriceLabel = locale === "tr" ? "249₺/ay" : locale === "fr" ? "29€/ay" : "$29/mo";
  const shopierLink = locale === "tr" ? "https://www.shopier.com/bamironlinestore/46009500" : "https://www.shopier.com/bamironlinestore/48494025";
  const [trackedPids, setTrackedPids] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!user) return;
    supabase.from("tracked_products").select("pid").eq("user_id", user.id).then(({ data }) => {
      if (data) setTrackedPids(new Set(data.map((d: any) => d.pid)));
    });
  }, [user]);

  const toggleTrack = async (p: CJProduct, cost: number, img: string, displayName: string) => {
    if (!user) return;
    if (trackedPids.has(p.pid)) {
      setTrackedPids((prev) => { const next = new Set(prev); next.delete(p.pid); return next; });
      await supabase.from("tracked_products").delete().eq("user_id", user.id).eq("pid", p.pid);
    } else {
      if (!isPro && trackedPids.size >= FREE_TRACK_LIMIT) {
        setShowTrackPaywall(true);
        return;
      }
      setTrackedPids((prev) => new Set(prev).add(p.pid));
      await supabase.from("tracked_products").upsert({
        user_id: user.id,
        pid: p.pid,
        product_name: displayName,
        image_url: img || null,
        product_url: p.productUrl || null,
        initial_price: cost,
        last_checked_price: cost,
      }, { onConflict: "user_id,pid" });
    }
  };

  const fetchBestSellers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fnErr } = await supabase.functions.invoke("cj-proxy", {
        body: {
          path: "/api2.0/v1/product/list",
          query: { pageNum: "1", pageSize: "24", sortField: "recentOrders", sortType: "DESC" },
        },
      });
      if (fnErr) throw fnErr;
      if (!data?.data?.list) throw new Error(data?.message || "Veri alınamadı");
      setItems(data.data.list);
      const pids = data.data.list.map((p: CJProduct) => p.pid);
      setNewPids(getNewPids("bestsellers", pids));
      markSeen("bestsellers", pids);
      setLastUpdated(new Date());
      setCountdown(REFRESH_INTERVAL / 1000);
      const names = data.data.list.map((p: CJProduct) => getDisplayName(p)).filter(Boolean);
      translateProducts(names).then(setTranslations).catch(() => {});
    } catch (e: any) {
      setError(e?.message || "Hata");
      setItems(MOCK);
      const names = MOCK.map(getDisplayName);
      translateProducts(names).then(setTranslations).catch(() => {});
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBestSellers();
    const interval = setInterval(fetchBestSellers, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchBestSellers]);

  useEffect(() => {
    const timer = setInterval(() => setCountdown((prev) => (prev <= 1 ? REFRESH_INTERVAL / 1000 : prev - 1)), 1000);
    return () => clearInterval(timer);
  }, [lastUpdated]);

  const formatCountdown = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
  const openProduct = (p: CJProduct) => window.open(p.productUrl || `https://cjdropshipping.com/product/-p-${p.pid}.html`, "_blank", "noreferrer");
  const dateLocale = locale === "tr" ? "tr-TR" : locale === "fr" ? "fr-FR" : "en-US";

  const visibleItems = isPro ? items : items.slice(0, FREE_LIMIT);
  const lockedItems = isPro ? [] : items.slice(FREE_LIMIT);

  return (
    <div className="space-y-6">
      <SEO
        title="En Çok Satanlar — KHELL AI"
        description="CJ Dropshipping'te en çok sipariş alan trend ürünler. Maliyet, satış ve marjı canlı görüntüle."
      />
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl" style={{ background: "linear-gradient(145deg, hsl(24 95% 53% / 0.18), hsl(24 95% 53% / 0.06))", border: "1px solid hsl(24 95% 53% / 0.3)", boxShadow: "0 4px 16px hsl(24 95% 53% / 0.15)" }}>
            <Flame className="h-5 w-5 text-orange-500" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground flex items-center gap-2">CJ En Çok Satanlar <span>🏆</span></h1>
            <p className="text-xs text-muted-foreground">En çok sipariş alan ürünler — canlı CJdropshipping verisi</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <motion.span animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 2, repeat: Infinity }}
            className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md"
            style={{ background: "linear-gradient(135deg, hsl(24 95% 53% / 0.18), hsl(24 95% 53% / 0.08))", color: "hsl(24 95% 58%)", border: "1px solid hsl(24 95% 53% / 0.35)", boxShadow: "0 2px 12px hsl(24 95% 53% / 0.15)" }}>
            <Radio className="h-2.5 w-2.5" /> {c.liveData}
          </motion.span>
          <button onClick={fetchBestSellers} disabled={loading} className="inline-flex items-center gap-1 text-[10px] font-medium px-2.5 py-1 rounded-md border border-border bg-card hover:bg-accent text-muted-foreground transition-colors">
            <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
            {formatCountdown(countdown)}
          </button>
        </div>
      </div>

      {lastUpdated && (
        <p className="text-[10px] text-muted-foreground">
          {c.lastUpdate}: {lastUpdated.toLocaleTimeString(dateLocale)} — {c.autoRefresh} {!isPro && lockedItems.length > 0 && `· ${c.proUnlocks(lockedItems.length)}`}
        </p>
      )}

      {error && <div className="rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs px-3 py-2">{c.apiError}: {error} — {c.mockNote}</div>}

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-lg border border-border/50 bg-accent/20 overflow-hidden">
              <div className="aspect-square bg-muted animate-pulse" />
              <div className="p-3 space-y-2"><div className="h-3 bg-muted animate-pulse rounded" /><div className="h-3 bg-muted animate-pulse rounded w-2/3" /><div className="h-7 bg-muted animate-pulse rounded" /></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
            {visibleItems.map((p, i) => {
              const cost = parseFloat(p.sellPrice || "0") || 0;
              const estSale = cost * 3;
              const margin = cost > 0 ? Math.round(((estSale - cost) / estSale) * 100) : 0;
              const img = p.productImage?.split(",")[0] || "";
              const rawName = getDisplayName(p);
              const displayName = translations[rawName] || rawName;
              const marginAccent = margin >= 60 ? "hsl(142 71% 50%)" : margin >= 40 ? "hsl(199 89% 60%)" : "hsl(38 92% 55%)";
              const isPick = isEditorPick(rawName);
              const shipMeta = shippingSpeedMeta(p.shippingCountryCodes, locale === "tr");
              return (
                <motion.div key={p.pid || i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0, transition: { delay: i * 0.03 } }} whileHover={{ y: -3 }}
                  className="group relative rounded-xl overflow-hidden flex flex-col transition-shadow duration-300"
                  style={{ background: "linear-gradient(160deg, hsl(222 47% 9% / 0.7), hsl(222 47% 6% / 0.85))", backdropFilter: "blur(12px)", border: "1px solid hsl(217 32% 22% / 0.7)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.border = `1px solid ${marginAccent}55`; (e.currentTarget as HTMLDivElement).style.boxShadow = `0 12px 32px ${marginAccent}22`; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.border = "1px solid hsl(217 32% 22% / 0.7)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}>
                  {i < 3 && <span className="absolute top-2 left-2 z-10 inline-flex items-center gap-1 text-[9px] font-bold uppercase px-2 py-1 rounded-md text-white" style={{ background: "linear-gradient(135deg, hsl(24 95% 58%), hsl(38 92% 50%))", boxShadow: "0 4px 12px hsl(24 95% 53% / 0.4)" }}><TrendingUp className="h-2.5 w-2.5" /> {c.top} {i + 1}</span>}
                  {isPick && <span className="absolute top-2 right-2 z-10 inline-flex items-center gap-1 text-[9px] font-bold px-2 py-1 rounded-md text-white" style={{ background: "linear-gradient(135deg, hsl(45 93% 47%), hsl(38 92% 50%))", boxShadow: "0 4px 14px hsl(45 93% 47% / 0.45)" }}>⭐ {c.editorPick}</span>}
                  <div onClick={() => openProduct(p)} className="block aspect-square bg-background overflow-hidden cursor-pointer relative">
                    {img ? <img src={img} alt={displayName} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" /> : <div className="w-full h-full flex items-center justify-center text-muted-foreground"><Package className="h-8 w-8" /></div>}
                    {user && (
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleTrack(p, cost, img, displayName); }}
                        title={trackedPids.has(p.pid) ? c.tracking : c.track}
                        className="absolute bottom-2 right-2 z-10 h-7 w-7 rounded-full flex items-center justify-center transition-colors"
                        style={{
                          background: trackedPids.has(p.pid) ? "hsl(199 89% 60%)" : "hsl(222 47% 6% / 0.85)",
                          border: `1px solid ${trackedPids.has(p.pid) ? "hsl(199 89% 60%)" : "hsl(217 32% 30% / 0.6)"}`,
                          backdropFilter: "blur(6px)",
                        }}>
                        {trackedPids.has(p.pid) ? <BellRing className="h-3.5 w-3.5 text-white" /> : <Bell className="h-3.5 w-3.5 text-muted-foreground" />}
                      </button>
                    )}
                  </div>
                  <div className="p-2.5 space-y-1.5 flex-1 flex flex-col">
                    <div className="flex items-center gap-1.5">
                      {newPids.has(p.pid) && <span className="text-[8px] font-bold uppercase px-1.5 py-0.5 rounded shrink-0" style={{ background: "hsl(199 89% 60% / 0.18)", color: "hsl(199 89% 65%)", border: "1px solid hsl(199 89% 60% / 0.4)" }}>🆕 {c.newBadge}</span>}
                      <p className="text-xs font-medium text-foreground line-clamp-2 min-h-[2rem]">{displayName}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                      <div className="rounded-lg px-2 py-1.5" style={{ background: "hsl(217 32% 12% / 0.6)", border: "1px solid hsl(217 32% 20% / 0.5)" }}><p className="text-muted-foreground">{c.cost}</p><p className="font-mono font-bold text-foreground">${cost.toFixed(2)}</p></div>
                      <div className="rounded-lg px-2 py-1.5" style={{ background: "hsl(24 95% 53% / 0.1)", border: "1px solid hsl(24 95% 53% / 0.25)" }}><p className="text-muted-foreground">{c.sale}</p><p className="font-mono font-bold text-orange-500">${estSale.toFixed(2)}</p></div>
                    </div>
                    <div className="flex items-center justify-between text-[10px] rounded-lg px-2 py-1.5" style={{ background: `${marginAccent}14`, border: `1px solid ${marginAccent}33` }}>
                      <span className="text-muted-foreground">{c.margin}</span>
                      <span className="font-mono font-bold" style={{ color: marginAccent }}>%{margin}</span>
                    </div>
                    {shipMeta && (
                      <div className="text-[9px] font-semibold text-center py-1 rounded-md" style={{ color: shipMeta.color, background: shipMeta.bg }}>
                        {shipMeta.label}
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-1.5">
                      <a href={`https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=ALL&q=${encodeURIComponent(rawName)}&search_type=keyword_unordered`} target="_blank" rel="noreferrer" className="h-6 rounded-md text-[9px] font-medium flex items-center justify-center gap-1 transition-colors" style={{ background: "hsl(217 91% 60% / 0.1)", color: "hsl(217 91% 65%)", border: "1px solid hsl(217 91% 60% / 0.25)" }}>📘 {c.searchAd}</a>
                      <a href={`https://www.tiktok.com/search?q=${encodeURIComponent(rawName)}`} target="_blank" rel="noreferrer" className="h-6 rounded-md text-[9px] font-medium flex items-center justify-center gap-1 transition-colors" style={{ background: "hsl(0 0% 100% / 0.06)", color: "hsl(215 20% 70%)", border: "1px solid hsl(217 32% 30% / 0.4)" }}>🎵 {c.searchTiktok}</a>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 mt-auto pt-1">
                      <button onClick={() => navigate(`/dashboard/analyzer?name=${encodeURIComponent(rawName)}&cost=${cost}&price=${estSale.toFixed(2)}`)} className="h-7 rounded-md bg-primary/15 text-primary text-[10px] font-semibold hover:bg-primary/25 transition-colors flex items-center justify-center gap-1"><BarChart3 className="h-3 w-3" /> {c.analyze}</button>
                      <button onClick={() => navigate(`/dashboard/product-page-generator?name=${encodeURIComponent(rawName)}&image=${encodeURIComponent(img)}&price=${estSale.toFixed(2)}`)} className="h-7 rounded-md bg-orange-500/15 text-orange-500 text-[10px] font-semibold hover:bg-orange-500/25 transition-colors flex items-center justify-center gap-1"><FileText className="h-3 w-3" /> {c.createPage}</button>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {lockedItems.map((p, i) => (
              <motion.div key={`locked-${p.pid || i}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0, transition: { delay: (FREE_LIMIT + i) * 0.03 } }}
                className="rounded-xl overflow-hidden flex flex-col relative cursor-pointer"
                style={{ background: "linear-gradient(160deg, hsl(222 47% 9% / 0.7), hsl(222 47% 6% / 0.85))", border: "1px solid hsl(217 32% 22% / 0.7)" }}
                onClick={() => setShowPaywall(true)}>
                <div className="aspect-square bg-background overflow-hidden" style={{ filter: "blur(8px)" }}>
                  {p.productImage?.split(",")[0] ? <img src={p.productImage.split(",")[0]} alt="" loading="lazy" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-muted" />}
                </div>
                <div className="p-3 space-y-2" style={{ filter: "blur(4px)" }}>
                  <div className="h-3 bg-muted rounded w-3/4" /><div className="h-3 bg-muted rounded w-1/2" /><div className="h-7 bg-primary/20 rounded" />
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl" style={{ background: "hsl(222 47% 6% / 0.75)", backdropFilter: "blur(2px)" }}>
                  <Crown className="h-8 w-8 text-amber-400 mb-2" />
                  <p className="text-xs font-bold text-white mb-1">{c.proFeature}</p>
                  <p className="text-[10px] text-muted-foreground text-center px-4">{c.seeProduct}</p>
                  <button className="mt-3 px-4 py-1.5 rounded-lg text-[11px] font-bold text-white" style={{ background: "linear-gradient(135deg, hsl(38 92% 50%), hsl(24 95% 53%))" }}>{c.goPro}</button>
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
              <h3 className="text-base font-bold text-white mb-1">{c.bannerTitle(lockedItems.length)}</h3>
              <p className="text-xs text-muted-foreground mb-4">{c.bannerDesc}</p>
              <button className="px-8 py-2.5 rounded-xl text-sm font-bold text-white" style={{ background: "linear-gradient(135deg, hsl(38 92% 50%), hsl(24 95% 53%))", boxShadow: "0 4px 20px hsl(38 92% 50% / 0.3)" }}>
                {c.goPro} — {proPriceLabel}
              </button>
            </motion.div>
          )}
        </>
      )}

      {loading && <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground"><Loader2 className="h-3 w-3 animate-spin" /> {c.fetching}</div>}

      {showPaywall && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/90 backdrop-blur-md">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-md mx-4 rounded-2xl border border-border bg-card p-8 shadow-2xl text-center">
            <div className="text-5xl mb-4">🔥</div>
            <h2 className="text-2xl font-black text-foreground mb-2">{c.modalTitle}</h2>
            <p className="text-sm text-muted-foreground mb-6">{c.modalDesc}</p>
            <div className="space-y-2 text-left mb-6">
              {c.features.map((f) => (
                <div key={f} className="flex items-center gap-2 text-sm text-foreground"><span className="text-winning">✔</span> {f}</div>
              ))}
            </div>
            <a href={shopierLink} target="_blank" rel="noopener noreferrer" className="block w-full rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold text-base py-3.5 transition-all shadow-lg shadow-amber-500/25">
              {c.goPro} — {proPriceLabel}
            </a>
            <button onClick={() => setShowPaywall(false)} className="text-xs text-muted-foreground hover:underline mt-4 block w-full">{c.later}</button>
          </motion.div>
        </div>
      )}

      {showTrackPaywall && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/90 backdrop-blur-md">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-md mx-4 rounded-2xl border border-border bg-card p-8 shadow-2xl text-center">
            <div className="text-5xl mb-4">📊</div>
            <h2 className="text-2xl font-black text-foreground mb-2">{c.trackLimitTitle}</h2>
            <p className="text-sm text-muted-foreground mb-6">{c.trackLimitDesc}</p>
            <a href={shopierLink} target="_blank" rel="noopener noreferrer" className="block w-full rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold text-base py-3.5 transition-all shadow-lg shadow-amber-500/25">
              {c.goPro} — {proPriceLabel}
            </a>
            <button onClick={() => setShowTrackPaywall(false)} className="text-xs text-muted-foreground hover:underline mt-4 block w-full">{c.later}</button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
