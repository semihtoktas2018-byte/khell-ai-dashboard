import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Store, TrendingUp, Package, DollarSign, ExternalLink, Globe, AlertCircle, Crown, Download } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { useAnalysisHistory } from "@/contexts/AnalysisHistoryContext";
import { supabase } from "@/integrations/supabase/client";
import BackButton from "@/components/BackButton";
import SEO from "@/components/SEO";
import { useToast } from "@/hooks/use-toast";
import BamirFooter from "@/components/BamirFooter";

const transition = { type: "spring" as const, stiffness: 300, damping: 30 };

interface StoreProduct {
  name: string;
  vendor: string;
  category: string;
  price: number;
  image: string;
  url: string;
}

interface StoreResult {
  storeUrl: string;
  totalProducts: number;
  avgPrice: string;
  topCategory: string;
  products: StoreProduct[];
}

const EXAMPLE_STORES = [
  { domain: "allbirds.com", emoji: "👟" },
  { domain: "gymshark.com", emoji: "💪" },
  { domain: "colourpop.com", emoji: "💄" },
  { domain: "kigili.com", emoji: "🇹🇷" },
  { domain: "kismetbymilka.com", emoji: "💍" },
  { domain: "manuatelier.com", emoji: "👜" },
  { domain: "chubbiesshorts.com", emoji: "🩳" },
  { domain: "brooklinen.com", emoji: "🛏️" },
  { domain: "deathwishcoffee.com", emoji: "☕" },
];

export default function StoreSpy() {
  const { locale, usdToTry } = useLocale();
  const isTr = locale === "tr";
  const { isPro } = useAnalysisHistory();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<StoreResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);

  const FREE_USE_KEY = "khell_storespy_used_count";
  const FREE_LIMIT = 2;
  const getFreeUsed = () => parseInt(localStorage.getItem(FREE_USE_KEY) || "0", 10);
  const hasUsedFree = () => getFreeUsed() >= FREE_LIMIT;
  const proPriceLabel = locale === "tr" ? "249₺/ay" : locale === "fr" ? "29€/ay" : "$29/mo";
  const shopierLink = locale === "tr" ? "https://www.shopier.com/bamironlinestore/46009500" : "https://www.shopier.com/bamironlinestore/48494025";

  const handleAnalyze = async (targetUrl?: string) => {
    const u = (targetUrl ?? url).trim();
    if (!u) return;
    if (!isPro && hasUsedFree()) {
      setShowPaywall(true);
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("store-spy", { body: { url: u } });
      if (fnError) throw fnError;
      if (data?.error) {
        setError(data.error);
      } else {
        setResult(data as StoreResult);
        if (!isPro) localStorage.setItem(FREE_USE_KEY, String(getFreeUsed() + 1));
      }
    } catch (e: any) {
      setError(isTr ? "Mağaza analiz edilemedi. Bağlantıyı kontrol edip tekrar dene." : "Could not analyze store. Check the link and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleImport = (p: StoreProduct) => {
    // Rakip fiyatı referans alıp %35 kâr payı bırakacak bir maliyet öneriyoruz —
    // kullanıcı Ürün Analizi sayfasında bu rakamları kendi verisiyle düzeltebilir.
    // Store Spy fiyatları hep USD gelir, Ürün Analizi'nin beklediği para birimine çeviriyoruz.
    const rate = locale === "tr" ? usdToTry : 1;
    const sellingPrice = Math.round(p.price * rate * 100) / 100;
    const suggestedCost = Math.round(p.price * 0.5 * rate * 100) / 100;
    const params = new URLSearchParams({
      productName: p.name,
      selling_price: String(sellingPrice),
      product_cost: String(suggestedCost),
    });
    toast({
      title: isTr ? "Ürün aktarıldı" : "Product imported",
      description: isTr ? `${p.name} — Ürün Analizi'ne gönderildi` : `${p.name} — sent to Product Analyzer`,
    });
    navigate(`/dashboard/analyzer?${params.toString()}`);
  };

  const minPrice = result ? Math.min(...result.products.map((p) => p.price)) : 0;
  const maxPrice = result ? Math.max(...result.products.map((p) => p.price)) : 0;

  return (
    <div className="space-y-6">
      <SEO
        title={isTr ? "Mağaza Spy | KHELL AI" : "Store Spy | KHELL AI"}
        description={isTr ? "Rakip mağazaları analiz et, kazanan ürünleri bul." : "Analyze competitor stores and find winning products."}
      />
      <BackButton />

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={transition}
        className="rounded-2xl p-6 md:p-8"
        style={{
          background: "linear-gradient(135deg, hsl(222 47% 7%) 0%, hsl(222 47% 4%) 100%)",
          border: "1px solid hsl(217 32% 17%)",
        }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="h-9 w-9 rounded-xl bg-purple-500/20 flex items-center justify-center">
            <Store className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">
              {isTr ? "🕵️ Mağaza Spy" : "🕵️ Store Spy"}
            </h1>
            <p className="text-xs text-muted-foreground">
              {isTr ? "Rakip Shopify mağazasının ürünlerini gerçek zamanlı gör" : "See any competitor's Shopify store products in real time"}
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
          <span className={`w-1.5 h-1.5 rounded-full animate-pulse`} style={{ background: isPro ? "hsl(142 71% 55%)" : "hsl(38 92% 60%)" }} />
          {isPro
            ? (isTr ? "PRO — Sınırsız mağaza analizi" : "PRO — Unlimited store analysis")
            : hasUsedFree()
              ? (isTr ? "Ücretsiz haklar bitti — PRO'ya geç" : "Free analyses used — upgrade to PRO")
              : (isTr ? `${FREE_LIMIT - getFreeUsed()} ücretsiz analiz hakkın var` : `${FREE_LIMIT - getFreeUsed()} free analyses left`)}
        </div>
        <p className="mt-2 text-[11px] text-muted-foreground">
          {isTr ? "Şu an sadece Shopify mağazaları destekleniyor" : "Currently only Shopify stores are supported"}
        </p>
      </motion.div>

      {/* URL Input */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ ...transition, delay: 0.1 }}
        className="rounded-xl p-6"
        style={{
          background: "linear-gradient(160deg, hsl(222 47% 9% / 0.7), hsl(222 47% 6% / 0.85))",
          border: "1px solid hsl(217 91% 60% / 0.18)",
        }}
      >
        <h3 className="text-sm font-semibold text-foreground mb-4">
          {isTr ? "Mağaza URL'ini Gir" : "Enter Store URL"}
        </h3>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
              placeholder={isTr ? "https://shopify-magaza.com" : "https://shopify-store.com"}
              className="input-dark w-full pl-10"
            />
          </div>
          <button
            onClick={() => handleAnalyze()}
            disabled={loading || !url.trim()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50"
            style={{ background: "hsl(271 91% 60%)", boxShadow: "0 0 20px hsl(271 91% 60% / 0.3)" }}
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            {isTr ? "Analiz Et" : "Analyze"}
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
            {isTr ? "Deneyebileceğin bilinen Shopify mağazaları:" : "Try one of these known Shopify stores:"}
          </p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_STORES.map((ex) => (
              <button
                key={ex.domain}
                onClick={() => { setUrl(ex.domain); handleAnalyze(ex.domain); }}
                disabled={loading}
                className="text-[11px] px-3 py-1.5 rounded-lg text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors disabled:opacity-50"
                style={{ background: "hsl(217 32% 12%)", border: "1px solid hsl(217 32% 20%)" }}>
                {ex.emoji} {ex.domain}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Results */}
      {result && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={transition} className="space-y-4">

          {/* Store Overview */}
          <div className="rounded-xl p-5 grid grid-cols-2 sm:grid-cols-4 gap-4"
            style={{ background: "hsl(222 47% 8%)", border: "1px solid hsl(217 32% 17%)" }}>
            {[
              { label: isTr ? "Toplam Ürün" : "Total Products", value: String(result.totalProducts), icon: Package, color: "text-blue-400" },
              { label: isTr ? "Ort. Fiyat" : "Avg. Price", value: `$${result.avgPrice}`, icon: DollarSign, color: "text-green-400" },
              { label: isTr ? "En İyi Kategori" : "Top Category", value: result.topCategory || "-", icon: TrendingUp, color: "text-purple-400" },
              { label: isTr ? "Fiyat Aralığı" : "Price Range", value: `$${minPrice.toFixed(0)}–$${maxPrice.toFixed(0)}`, icon: Store, color: "text-amber-400" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <s.icon className={`h-5 w-5 mx-auto mb-1 ${s.color}`} />
                <p className="text-lg font-bold text-white">{s.value}</p>
                <p className="text-[10px] text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Product List */}
          <div className="rounded-xl overflow-hidden" style={{ border: "1px solid hsl(217 32% 17%)" }}>
            <div className="px-5 py-3 flex items-center justify-between" style={{ background: "hsl(222 47% 8%)" }}>
              <h4 className="text-sm font-bold text-white">
                {isTr ? "🛍️ Mağazadaki Ürünler" : "🛍️ Store Products"}
              </h4>
              <span className="text-[10px] text-muted-foreground">{isTr ? "En pahalıdan ucuza" : "Highest to lowest price"}</span>
            </div>
            <div className="divide-y divide-border max-h-[500px] overflow-y-auto">
              {result.products.map((p, i) => (
                <div key={i} className="flex items-center justify-between px-5 py-3 hover:bg-accent/20 transition-colors gap-3">
                  <a href={p.url} target="_blank" rel="noreferrer" className="flex items-center gap-3 min-w-0 flex-1">
                    {p.image ? (
                      <img src={p.image} alt="" className="h-9 w-9 rounded-md object-cover shrink-0" />
                    ) : (
                      <div className="h-9 w-9 rounded-md bg-muted flex items-center justify-center shrink-0">
                        <Package className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{p.name}</p>
                      {p.category && <p className="text-[10px] text-muted-foreground">{p.category}</p>}
                    </div>
                  </a>
                  <div className="flex items-center gap-2 shrink-0">
                    <p className="text-sm font-bold text-white">${p.price.toFixed(2)}</p>
                    <button
                      onClick={() => handleImport(p)}
                      title={isTr ? "Ürün Analizi'ne aktar" : "Import to Product Analyzer"}
                      className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg text-primary hover:bg-primary/10 border border-primary/30 transition-colors"
                    >
                      <Download className="h-3 w-3" />
                      {isTr ? "İçe Aktar" : "Import"}
                    </button>
                    <a href={p.url} target="_blank" rel="noreferrer">
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
            { icon: "🔗", title: isTr ? "URL Yapıştır" : "Paste URL", desc: isTr ? "Herhangi bir Shopify mağaza linkini gir" : "Enter any Shopify store link" },
            { icon: "🔍", title: isTr ? "Anında Çeker" : "Fetches Instantly", desc: isTr ? "Mağazadaki tüm ürünleri ve fiyatları gerçek zamanlı çeker" : "Pulls all products and prices in real time" },
            { icon: "⬇️", title: isTr ? "Tek Tıkla Aktar" : "One-Click Import", desc: isTr ? "Beğendiğin ürünü direkt Ürün Analizi'ne gönder, kâr marjını hesapla" : "Send any product straight to Product Analyzer and calculate your margin" },
          ].map((s) => (
            <div key={s.title} className="rounded-xl p-5 text-center"
              style={{ background: "hsl(222 47% 8%)", border: "1px solid hsl(217 32% 17%)" }}>
              <div className="text-3xl mb-3">{s.icon}</div>
              <h4 className="text-sm font-bold text-white mb-1">{s.title}</h4>
              <p className="text-xs text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </motion.div>
      )}
      {showPaywall && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/90 backdrop-blur-md">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-md mx-4 rounded-2xl border border-border bg-card p-8 shadow-2xl text-center">
            <div className="text-5xl mb-4">🕵️</div>
            <h2 className="text-2xl font-black text-foreground mb-2">
              {isTr ? "Sınırsız Mağaza Spy PRO'da" : "Unlimited Store Spy with PRO"}
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              {isTr ? "Ücretsiz analiz hakkını kullandın. Sınırsız rakip mağaza analizi için PRO'ya geç." : "You've used your free analysis. Upgrade to PRO for unlimited competitor store analysis."}
            </p>
            <div className="space-y-2 text-left mb-6">
              {[
                isTr ? "🕵️ Sınırsız mağaza analizi" : "🕵️ Unlimited store analysis",
                isTr ? "🔥 Sınırsız trend/kazanan ürün" : "🔥 Unlimited trending/winning products",
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
      <BamirFooter />
    </div>
  );
}
