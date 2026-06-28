import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Store, TrendingUp, Package, DollarSign, ExternalLink, Lock, Globe } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import BackButton from "@/components/BackButton";
import SEO from "@/components/SEO";

const transition = { type: "spring" as const, stiffness: 300, damping: 30 };

const DEMO_RESULTS = [
  { name: "Wireless Earbuds Pro X", price: "$24.99", orders: "1,200+", margin: "62%", trend: "↑ Hot", score: 88 },
  { name: "LED Desk Lamp USB-C", price: "$18.50", orders: "890+", margin: "54%", trend: "↑ Rising", score: 76 },
  { name: "Phone Stand Adjustable", price: "$9.99", orders: "2,100+", margin: "71%", trend: "🔥 Viral", score: 94 },
  { name: "Silicone Kitchen Set", price: "$32.00", orders: "540+", margin: "48%", trend: "→ Stable", score: 61 },
  { name: "Portable Fan Mini", price: "$14.99", orders: "3,400+", margin: "67%", trend: "🔥 Viral", score: 91 },
];

export default function StoreSpy() {
  const { locale } = useLocale();
  const isTr = locale === "tr";
  const [url, setUrl] = useState("");
  const [showDemo, setShowDemo] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = () => {
    if (!url.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowDemo(true);
    }, 1800);
  };

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
              {isTr ? "Rakip mağazanın en çok satan ürünlerini gör" : "See what's selling best in any competitor store"}
            </p>
          </div>
        </div>

        {/* Coming soon badge */}
        <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
          style={{
            background: "hsl(271 91% 65% / 0.12)",
            border: "1px solid hsl(271 91% 65% / 0.35)",
            color: "hsl(271 91% 75%)",
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
          {isTr ? "Backend entegrasyonu yakında aktif" : "Backend integration coming soon"}
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
              placeholder={isTr ? "https://shopify-magaza.com veya amazon.com/shops/..." : "https://shopify-store.com or amazon.com/shops/..."}
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

        <div className="mt-3 flex flex-wrap gap-2">
          {["shopify-store.com", "amazon.com/shops/example", "trendyol.com/magaza/ornek"].map((ex) => (
            <button key={ex} onClick={() => setUrl(`https://${ex}`)}
              className="text-[10px] px-2 py-1 rounded-md text-muted-foreground hover:text-primary transition-colors"
              style={{ background: "hsl(217 32% 12%)", border: "1px solid hsl(217 32% 20%)" }}>
              {ex}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Demo Results */}
      {showDemo && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={transition} className="space-y-4">
          
          {/* Store Overview */}
          <div className="rounded-xl p-5 grid grid-cols-2 sm:grid-cols-4 gap-4"
            style={{ background: "hsl(222 47% 8%)", border: "1px solid hsl(217 32% 17%)" }}>
            {[
              { label: isTr ? "Toplam Ürün" : "Total Products", value: "127", icon: Package, color: "text-blue-400" },
              { label: isTr ? "Ort. Fiyat" : "Avg. Price", value: "$20.09", icon: DollarSign, color: "text-green-400" },
              { label: isTr ? "En İyi Kategori" : "Top Category", value: isTr ? "Elektronik" : "Electronics", icon: TrendingUp, color: "text-purple-400" },
              { label: isTr ? "Tahmini Aylık Satış" : "Est. Monthly Sales", value: "$8,200+", icon: Store, color: "text-amber-400" },
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
                {isTr ? "🔥 En Çok Satan Ürünler" : "🔥 Best Selling Products"}
              </h4>
              <span className="text-[10px] text-muted-foreground">{isTr ? "Demo verisi" : "Demo data"}</span>
            </div>
            <div className="divide-y divide-border">
              {DEMO_RESULTS.map((p, i) => (
                <div key={i} className="flex items-center justify-between px-5 py-3 hover:bg-accent/20 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-muted-foreground w-4">#{i + 1}</span>
                    <div>
                      <p className="text-sm font-medium text-foreground">{p.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-muted-foreground">{p.orders} {isTr ? "sipariş" : "orders"}</span>
                        <span className="text-[10px] text-green-400">{p.trend}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <p className="text-sm font-bold text-white">{p.price}</p>
                      <p className="text-[10px] text-green-400">{p.margin} margin</p>
                    </div>
                    <div className={`text-lg font-black font-mono ${p.score >= 80 ? "text-green-400" : p.score >= 60 ? "text-amber-400" : "text-red-400"}`}>
                      {p.score}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Coming Soon Overlay CTA */}
          <div className="rounded-xl p-6 text-center"
            style={{ background: "hsl(271 91% 60% / 0.08)", border: "1px solid hsl(271 91% 60% / 0.25)" }}>
            <Lock className="h-8 w-8 text-purple-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-1">
              {isTr ? "Gerçek Veri Yakında Aktif" : "Real Data Coming Soon"}
            </h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              {isTr
                ? "Şu an demo verisi görüyorsun. Backend entegrasyonu tamamlanınca gerçek mağaza verileri burada olacak."
                : "You're seeing demo data. Once backend integration is complete, real store data will appear here."}
            </p>
          </div>
        </motion.div>
      )}

      {/* How it works */}
      {!showDemo && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ ...transition, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: "🔗", title: isTr ? "URL Yapıştır" : "Paste URL", desc: isTr ? "Shopify, Amazon veya Trendyol mağaza linkini gir" : "Enter any Shopify, Amazon or Trendyol store link" },
            { icon: "🔍", title: isTr ? "AI Analiz Eder" : "AI Analyzes", desc: isTr ? "En çok satan ürünleri, fiyatları ve satış hacmini çeker" : "Pulls best sellers, prices and sales volume" },
            { icon: "🎯", title: isTr ? "Boşlukları Bul" : "Find Gaps", desc: isTr ? "Rakibin hangi ürünlerde zayıf olduğunu gör, oraya gir" : "See where competitors are weak and enter those gaps" },
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
