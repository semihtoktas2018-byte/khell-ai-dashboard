import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, ShoppingBag, TrendingUp, DollarSign, ExternalLink, Tag, AlertCircle, Download, Star, Package } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { useAnalysisHistory } from "@/contexts/AnalysisHistoryContext";
import { supabase } from "@/integrations/supabase/client";
import BackButton from "@/components/BackButton";
import SEO from "@/components/SEO";
import { useToast } from "@/hooks/use-toast";
import BamirFooter from "@/components/BamirFooter";

const transition = { type: "spring" as const, stiffness: 300, damping: 30 };

interface EbayItem {
  title: string;
  price: string | null;
  currency: string | null;
  condition: string | null;
  image: string | null;
  seller: string | null;
  feedbackPct: string | null;
  shipping: string | null;
  itemWebUrl: string | null;
  soldQuantity: number | null;
}

interface EbayResult {
  total: number;
  marketplace: string;
  items: EbayItem[];
}

const MARKETPLACES = [
  { id: "EBAY_US", label: "🇺🇸 ABD", cur: "$" },
  { id: "EBAY_GB", label: "🇬🇧 İngiltere", cur: "£" },
  { id: "EBAY_DE", label: "🇩🇪 Almanya", cur: "€" },
  { id: "EBAY_FR", label: "🇫🇷 Fransa", cur: "€" },
  { id: "EBAY_IT", label: "🇮🇹 İtalya", cur: "€" },
  { id: "EBAY_ES", label: "🇪🇸 İspanya", cur: "€" },
  { id: "EBAY_AU", label: "🇦🇺 Avustralya", cur: "$" },
];

const EXAMPLE_QUERIES = [
  { q: "wireless earbuds", emoji: "🎧" },
  { q: "posture corrector", emoji: "🧍" },
  { q: "led strip lights", emoji: "💡" },
  { q: "car phone holder", emoji: "🚗" },
  { q: "mini projector", emoji: "📽️" },
  { q: "pet hair remover", emoji: "🐾" },
];

export default function EbayResearch() {
  const { locale, usdToTry } = useLocale();
  const isTr = locale === "tr";
  const { isPro } = useAnalysisHistory();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [query, setQuery] = useState("");
  const [marketplace, setMarketplace] = useState("EBAY_US");
  const [result, setResult] = useState<EbayResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);

  const FREE_USE_KEY = "khell_ebay_used_count";
  const FREE_LIMIT = 2;
  const getFreeUsed = () => parseInt(localStorage.getItem(FREE_USE_KEY) || "0", 10);
  const hasUsedFree = () => getFreeUsed() >= FREE_LIMIT;
  const proPriceLabel = locale === "tr" ? "249₺/ay" : locale === "fr" ? "29€/ay" : "$29/mo";
  const shopierLink = locale === "tr" ? "https://www.shopier.com/bamironlinestore/46009500" : "https://www.shopier.com/bamironlinestore/48494025";

  const handleSearch = async (targetQuery?: string) => {
    const q = (targetQuery ?? query).trim();
    if (!q) return;
    if (!isPro && hasUsedFree()) {
      setShowPaywall(true);
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("ebay-proxy", {
        body: { q, limit: 30, marketplace },
      });
      if (fnError) throw fnError;
      if (data?.error) {
        setError(isTr ? "eBay verisi alınamadı. Tekrar dene." : "Could not fetch eBay data. Try again.");
      } else {
        setResult(data as EbayResult);
        if (!isPro) localStorage.setItem(FREE_USE_KEY, String(getFreeUsed() + 1));
      }
    } catch {
      setError(isTr ? "eBay verisi alınamadı. Bağlantıyı kontrol edip tekrar dene." : "Could not fetch eBay data. Check the connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleImport = (it: EbayItem) => {
    const price = parseFloat(it.price || "0");
    if (!price) return;
    // eBay fiyatları seçilen ülkenin para biriminde; TR kullanıcısı için TL'ye çeviriyoruz (USD baz kabul).
    const rate = locale === "tr" ? usdToTry : 1;
    const sellingPrice = Math.round(price * rate * 100) / 100;
    const suggestedCost = Math.round(price * 0.5 * rate * 100) / 100;
    const params = new URLSearchParams({
      productName: it.title,
      selling_price: String(sellingPrice),
      product_cost: String(suggestedCost),
    });
    toast({
      title: isTr ? "Ürün aktarıldı" : "Product imported",
      description: isTr ? `${it.title} — Ürün Analizi'ne gönderildi` : `${it.title} — sent to Product Analyzer`,
    });
    navigate(`/dashboard/analyzer?${params.toString()}`);
  };

  const prices = result ? result.items.map((i) => parseFloat(i.price || "0")).filter((p) => p > 0) : [];
  const minPrice = prices.length ? Math.min(...prices) : 0;
  const maxPrice = prices.length ? Math.max(...prices) : 0;
  const avgPrice = prices.length ? prices.reduce((a, b) => a + b, 0) / prices.length : 0;
  const curSymbol = MARKETPLACES.find((m) => m.id === marketplace)?.cur || "$";

  return (
    <div className="space-y-6">
      <SEO
        title={isTr ? "eBay Araştırma | KHELL AI" : "eBay Research | KHELL AI"}
        description={isTr ? "eBay'de ürünleri, fiyatları ve rakipleri gerçek zamanlı araştır." : "Research eBay products, prices and competitors in real time."}
      />
      <BackButton />

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={transition}
        className="panel-glow p-6 md:p-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="h-9 w-9 rounded-xl bg-blue-500/20 flex items-center justify-center">
            <ShoppingBag className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-white">
              {isTr ? "eBay Ürün Araştırma" : "eBay Product Research"}
            </h1>
            <p className="text-xs text-muted-foreground">
              {isTr ? "Gerçek zamanlı eBay verisi — fiyat, satıcı, rakip sayısı" : "Real-time eBay data — price, seller, competition"}
            </p>
          </div>
        </div>
        <div className="mt-3 pill-glow">
          {isPro
            ? (isTr ? "PRO — sınırsız arama" : "PRO — unlimited search")
            : hasUsedFree()
              ? (isTr ? "Ücretsiz haklar bitti — PRO'ya geç" : "Free searches used — upgrade to PRO")
              : (isTr ? `${FREE_LIMIT - getFreeUsed()} ücretsiz arama hakkın var` : `${FREE_LIMIT - getFreeUsed()} free searches left`)}
        </div>
      </motion.div>

      {/* Search box */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ ...transition, delay: 0.1 }}
        className="panel-glow p-6"
      >
        <h3 className="text-sm font-semibold text-foreground mb-4">
          {isTr ? "Ürün Ara" : "Search Product"}
        </h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder={isTr ? "örn. wireless earbuds" : "e.g. wireless earbuds"}
              className="input-dark w-full pl-10"
            />
          </div>
          <select
            value={marketplace}
            onChange={(e) => setMarketplace(e.target.value)}
            className="input-dark sm:w-44"
          >
            {MARKETPLACES.map((m) => (
              <option key={m.id} value={m.id}>{m.label}</option>
            ))}
          </select>
          <button
            onClick={() => handleSearch()}
            disabled={loading || !query.trim()}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50"
            style={{ background: "hsl(217 91% 60%)", boxShadow: "0 0 20px hsl(217 91% 60% / 0.3)" }}
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            {isTr ? "Ara" : "Search"}
          </button>
        </div>

        {error && (
          <div className="mt-3 flex items-center gap-2 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/30 rounded-lg px-3 py-2">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            {error}
          </div>
        )}

        <div className="mt-4">
          <p className="text-[10px] text-muted-foreground mb-2">
            {isTr ? "Popüler aramalar:" : "Popular searches:"}
          </p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_QUERIES.map((ex) => (
              <button
                key={ex.q}
                onClick={() => { setQuery(ex.q); handleSearch(ex.q); }}
                disabled={loading}
                className="text-[11px] px-3 py-1.5 rounded-lg text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors disabled:opacity-50"
                style={{ background: "hsl(217 32% 12%)", border: "1px solid hsl(217 32% 20%)" }}>
                {ex.emoji} {ex.q}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Results */}
      {result && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={transition} className="space-y-4">

          {/* Overview */}
          <div className="panel-glow p-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: isTr ? "Toplam İlan" : "Total Listings", value: result.total.toLocaleString(), icon: Package, color: "text-blue-400" },
              { label: isTr ? "Ort. Fiyat" : "Avg. Price", value: `${curSymbol}${avgPrice.toFixed(2)}`, icon: DollarSign, color: "text-green-400" },
              { label: isTr ? "En Düşük" : "Lowest", value: `${curSymbol}${minPrice.toFixed(2)}`, icon: TrendingUp, color: "text-emerald-400" },
              { label: isTr ? "Fiyat Aralığı" : "Price Range", value: `${curSymbol}${minPrice.toFixed(0)}–${curSymbol}${maxPrice.toFixed(0)}`, icon: Tag, color: "text-amber-400" },
            ].map((s) => (
              <div key={s.label} className="stat-glow text-center">
                <s.icon className={`h-5 w-5 mx-auto mb-1 ${s.color}`} />
                <p className="text-lg font-bold text-white">{s.value}</p>
                <p className="text-[10px] text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Rekabet uyarısı */}
          <div className="panel-glow px-4 py-2.5 text-xs flex items-center gap-2">
            <span className="text-muted-foreground">
              {isTr ? "Rekabet:" : "Competition:"}{" "}
              <span className={`font-bold ${result.total <= 500 ? "text-green-400" : result.total <= 5000 ? "text-yellow-400" : "text-red-400"}`}>
                {result.total <= 500
                  ? (isTr ? "Az rakip 🟢 — fırsat olabilir" : "Low 🟢 — could be an opportunity")
                  : result.total <= 5000
                  ? (isTr ? "Orta 🟡 — dikkatli ol" : "Medium 🟡 — be careful")
                  : (isTr ? "Yüksek rekabet 🔴 — doygun pazar" : "High 🔴 — saturated market")}
              </span>
            </span>
          </div>

          {/* Product list */}
          <div className="panel-glow overflow-hidden">
            <div className="px-5 py-3 flex items-center justify-between border-b border-border">
              <h4 className="text-sm font-bold text-white">
                {isTr ? "🛍️ eBay Ürünleri" : "🛍️ eBay Products"}
              </h4>
              <span className="text-[10px] text-muted-foreground">{result.items.length} {isTr ? "sonuç" : "results"}</span>
            </div>
            <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
              {result.items.map((it, i) => (
                <div key={i} className="flex items-center justify-between px-5 py-3 hover:bg-accent/20 transition-colors gap-3">
                  <a href={it.itemWebUrl || "#"} target="_blank" rel="noreferrer" className="flex items-center gap-3 min-w-0 flex-1">
                    {it.image ? (
                      <img src={it.image} alt="" className="h-11 w-11 rounded-md object-cover shrink-0" />
                    ) : (
                      <div className="h-11 w-11 rounded-md bg-muted flex items-center justify-center shrink-0">
                        <Package className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{it.title}</p>
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                        {it.condition && <span>{it.condition}</span>}
                        {it.seller && (
                          <span className="flex items-center gap-0.5">
                            <Star className="h-2.5 w-2.5 text-amber-400" /> {it.feedbackPct ?? "-"}%
                          </span>
                        )}
                        {it.shipping !== null && (
                          <span>{parseFloat(it.shipping) === 0 ? (isTr ? "Ücretsiz kargo" : "Free ship") : `+${curSymbol}${it.shipping}`}</span>
                        )}
                      </div>
                    </div>
                  </a>
                  <div className="flex items-center gap-2 shrink-0">
                    <p className="text-sm font-bold text-white">{curSymbol}{it.price}</p>
                    <button
                      onClick={() => handleImport(it)}
                      title={isTr ? "Ürün Analizi'ne aktar" : "Import to Product Analyzer"}
                      className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg text-primary hover:bg-primary/10 border border-primary/30 transition-colors"
                    >
                      <Download className="h-3 w-3" />
                      {isTr ? "İçe Aktar" : "Import"}
                    </button>
                    <a href={it.itemWebUrl || "#"} target="_blank" rel="noreferrer">
                      <ExternalLink className="h-3 w-3 text-muted-foreground" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* How it works */}
      {!result && !loading && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ ...transition, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: "🔎", title: isTr ? "Ürün Ara" : "Search Product", desc: isTr ? "Ürün adını yaz, ülkeyi seç" : "Type a product name, pick a country" },
            { icon: "⚡", title: isTr ? "Anında Çeker" : "Fetches Instantly", desc: isTr ? "eBay'den fiyat, satıcı, rakip sayısını gerçek zamanlı çeker" : "Pulls price, seller and competition from eBay in real time" },
            { icon: "⬇️", title: isTr ? "Tek Tıkla Aktar" : "One-Click Import", desc: isTr ? "Beğendiğin ürünü direkt Ürün Analizi'ne gönder" : "Send any product straight to Product Analyzer" },
          ].map((s) => (
            <div key={s.title} className="stat-glow p-5 text-center">
              <div className="text-3xl mb-3">{s.icon}</div>
              <h4 className="text-sm font-bold text-white mb-1">{s.title}</h4>
              <p className="text-xs text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </motion.div>
      )}

      {/* Paywall */}
      {showPaywall && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/90 backdrop-blur-md">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-md mx-4 rounded-2xl border border-border bg-card p-8 shadow-2xl text-center">
            <div className="text-5xl mb-4">🛍️</div>
            <h2 className="text-2xl font-black text-foreground mb-2">
              {isTr ? "Sınırsız eBay Araştırma PRO'da" : "Unlimited eBay Research with PRO"}
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              {isTr ? "Ücretsiz arama hakkını kullandın. Sınırsız eBay ürün araştırması için PRO'ya geç." : "You've used your free searches. Upgrade to PRO for unlimited eBay product research."}
            </p>
            <div className="space-y-2 text-left mb-6">
              {[
                isTr ? "🛍️ Sınırsız eBay araştırma" : "🛍️ Unlimited eBay research",
                isTr ? "🕵️ Sınırsız mağaza analizi" : "🕵️ Unlimited store analysis",
                isTr ? "📊 Sınırsız ürün analizi" : "📊 Unlimited product analysis",
                isTr ? "🔔 Fiyat takibi ve bildirimler" : "🔔 Price tracking & alerts",
              ].map((f) => (
                <div key={f} className="flex items-center gap-2 text-sm text-foreground"><span className="text-winning">✔</span> {f}</div>
              ))}
            </div>
            <a href={shopierLink} target="_blank" rel="noopener noreferrer" className="block w-full rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold text-base py-3.5 transition-all shadow-lg shadow-amber-500/25">
              {isTr ? "Pro'ya Geç" : "Go Pro"} — {proPriceLabel}
            </a>
            <button onClick={() => setShowPaywall(false)} className="text-xs text-muted-foreground hover:underline mt-4 block w-full">
              {isTr ? "Şimdi değil" : "Not now"}
            </button>
          </motion.div>
        </div>
      )}

      {/* Footer imza */}
      <BamirFooter />
    </div>
  );
}
