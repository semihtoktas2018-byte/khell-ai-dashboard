import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Store, TrendingUp, Package, DollarSign, ExternalLink, Globe, AlertCircle } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { supabase } from "@/integrations/supabase/client";
import BackButton from "@/components/BackButton";
import SEO from "@/components/SEO";

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

export default function StoreSpy() {
  const { locale } = useLocale();
  const isTr = locale === "tr";
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<StoreResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("store-spy", { body: { url } });
      if (fnError) throw fnError;
      if (data?.error) {
        setError(data.error);
      } else {
        setResult(data as StoreResult);
      }
    } catch (e: any) {
      setError(isTr ? "Mağaza analiz edilemedi. Bağlantıyı kontrol edip tekrar dene." : "Could not analyze store. Check the link and try again.");
    } finally {
      setLoading(false);
    }
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
            background: "hsl(271 91% 65% / 0.12)",
            border: "1px solid hsl(271 91% 65% / 0.35)",
            color: "hsl(271 91% 75%)",
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
          {isTr ? "Şu an sadece Shopify mağazaları destekleniyor" : "Currently only Shopify stores are supported"}
        </div>
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
            onClick={handleAnalyze}
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
                <a key={i} href={p.url} target="_blank" rel="noreferrer"
                  className="flex items-center justify-between px-5 py-3 hover:bg-accent/20 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
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
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <p className="text-sm font-bold text-white">${p.price.toFixed(2)}</p>
                    <ExternalLink className="h-3 w-3 text-muted-foreground" />
                  </div>
                </a>
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
            { icon: "🎯", title: isTr ? "Fırsatları Bul" : "Find Opportunities", desc: isTr ? "Fiyat aralığını ve popüler kategorileri gör, kendi stratejini kur" : "See price range and popular categories to shape your strategy" },
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
    </div>
  );
}
