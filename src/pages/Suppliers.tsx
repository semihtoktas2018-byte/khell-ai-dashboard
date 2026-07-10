import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Star, CheckCircle, Clock, Zap, Shield, TrendingUp, Package, ExternalLink, Award, AlertTriangle, Loader2, Lock } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { useAnalysisHistory } from "@/contexts/AnalysisHistoryContext";
import { supabase } from "@/integrations/supabase/client";
import SEO from "@/components/SEO";
import BamirFooter from "@/components/BamirFooter";

const transition = { type: "spring" as const, stiffness: 300, damping: 30 };

const PLATFORMS = [
  {
    id: "cj",
    name: "CJ Dropshipping",
    badge: "⚡ KHELL Entegre",
    badgeColor: "bg-primary/20 text-primary border-primary/30",
    logo: "📦",
    rating: 4.7,
    reviews: "12.000+",
    delivery: "7-15 gün",
    minOrder: 1,
    commission: "%0",
    shipping: "Ücretsiz (çoğu ürün)",
    pros: ["KHELL AI ile doğrudan entegre", "Otomatik sipariş yönetimi", "1 adet sipariş imkanı", "Türkçe destek mevcut", "Gerçek zamanlı stok takibi"],
    cons: ["Bazı ürünlerde uzun teslimat", "Ürün kalitesi değişken olabilir"],
    link: "https://cjdropshipping.com",
    recommended: true,
    color: "border-primary/40 bg-primary/5",
    glowColor: "hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]",
  },
  {
    id: "aliexpress",
    name: "AliExpress",
    badge: "🌍 Popüler",
    badgeColor: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    logo: "🛒",
    rating: 4.3,
    reviews: "100M+",
    delivery: "10-30 gün",
    minOrder: 1,
    commission: "%0",
    shipping: "Ücretsiz veya düşük",
    pros: ["Devasa ürün yelpazesi", "Düşük fiyatlar", "1 adet sipariş imkanı", "Küresel erişim"],
    cons: ["Manuel sipariş yönetimi", "Uzun teslimat süreleri", "KHELL entegrasyonu yok", "İade süreci zor"],
    link: "https://aliexpress.com",
    recommended: false,
    color: "border-orange-500/20 bg-orange-500/5",
    glowColor: "hover:shadow-[0_0_20px_rgba(249,115,22,0.15)]",
  },
  {
    id: "alibaba",
    name: "Alibaba",
    badge: "🏭 Toptan",
    badgeColor: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    logo: "🏭",
    rating: 4.5,
    reviews: "50M+",
    delivery: "15-45 gün",
    minOrder: 100,
    commission: "%0",
    shipping: "Değişken",
    pros: ["En düşük toptan fiyatlar", "Özel markalama imkanı", "Büyük hacimde sipariş", "Güvenilir tedarikçiler"],
    cons: ["Yüksek minimum sipariş", "Dropshipping için uygun değil", "Önceden sermaye gerekli", "Uzun süreç"],
    link: "https://alibaba.com",
    recommended: false,
    color: "border-yellow-500/20 bg-yellow-500/5",
    glowColor: "hover:shadow-[0_0_20px_rgba(234,179,8,0.15)]",
  },
  {
    id: "temu",
    name: "Temu",
    badge: "🆕 Yeni",
    badgeColor: "bg-pink-500/20 text-pink-400 border-pink-500/30",
    logo: "🛍️",
    rating: 3.8,
    reviews: "5M+",
    delivery: "7-20 gün",
    minOrder: 1,
    commission: "%0",
    shipping: "Genellikle ücretsiz",
    pros: ["Çok düşük fiyatlar", "Hızlı büyüyen platform", "Geniş ürün yelpazesi"],
    cons: ["Dropshipping resmi desteği yok", "Kalite tutarsızlığı", "KHELL entegrasyonu yok", "İade politikası belirsiz"],
    link: "https://temu.com",
    recommended: false,
    color: "border-pink-500/20 bg-pink-500/5",
    glowColor: "hover:shadow-[0_0_20px_rgba(236,72,153,0.15)]",
  },
];

const TIPS = [
  { icon: "🎯", title: "CJ ile Başla", desc: "KHELL ile entegre olduğu için en kolay başlangıç CJ Dropshipping'dir. Siparişler otomatik yönetilir." },
  { icon: "💰", title: "Fiyat Karşılaştır", desc: "Aynı ürünü birden fazla platformda ara. CJ + AliExpress karşılaştırması %20-30 tasarruf sağlayabilir." },
  { icon: "⭐", title: "Tedarikçi Puanı", desc: "4.5+ puan ve 100+ değerlendirmeli tedarikçilerle çalış. Düşük puanlı tedarikçiler iade ve müşteri şikayetine yol açar." },
  { icon: "📦", title: "Test Siparişi Ver", desc: "Büyük ölçeğe geçmeden önce mutlaka 1-2 adet test siparişi ver. Ürün kalitesini ve paketlemeyi bizzat kontrol et." },
  { icon: "🚀", title: "ePacket / Hızlı Kargo", desc: "Mümkünse ePacket veya CJ Packet kargo seçeneklerini tercih et. Teslimat süresi 7-15 güne düşebilir." },
  { icon: "🔄", title: "Stok Takibi", desc: "CJ entegrasyonu sayesinde KHELL stok durumunu anlık takip eder. Stok biten ürün satmaktan kaçın." },
];

// Not: Bu istatistikler KHELL AI'nin kendi kullanıcı performansı hakkında bir
// iddia değil — sadece platformlar hakkında genel, doğrulanabilir bilgiler
// (CJ'nin kendi katalog büyüklüğü ve teslimat süresi gibi) ya da bu sayfanın
// kendi içeriğinden hesaplanan gerçek sayılardır (örnek: kaç platform
// karşılaştırılıyor). Uydurma "kullanıcı başarı oranı" gibi şeyler yok.
const STATS = [
  { value: "1M+", label: "CJ Katalogunda Ürün", icon: Package },
  { value: `${PLATFORMS.length}`, label: "Karşılaştırılan Platform", icon: TrendingUp },
  { value: "7-15", label: "CJ Gün Ortalama Teslimat", icon: Clock },
  { value: "%0", label: "CJ Komisyon Ücreti", icon: Shield },
];

export default function Suppliers() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const { t, locale } = useLocale();
  const { isPro } = useAnalysisHistory();
  const [showPaywall, setShowPaywall] = useState(false);
  const COMPARE_USE_KEY = "khell_supplier_compare_used";
  const FREE_COMPARE_LIMIT = 1; // 1 ücretsiz karşılaştırma, sonrası Pro
  const getCompareUsed = () => parseInt(localStorage.getItem(COMPARE_USE_KEY) || "0", 10);
  const shopierLink = locale === "tr" ? "https://www.shopier.com/bamironlinestore/46009500" : "https://www.shopier.com/bamironlinestore/48494025";

  const [productQuery, setProductQuery] = useState("");
  const [comparing, setComparing] = useState(false);
  const [compareResult, setCompareResult] = useState<{ count: number; minPrice: number; maxPrice: number; items: any[] } | null>(null);
  const [compareError, setCompareError] = useState(false);
  const [showCompareList, setShowCompareList] = useState(false);

  const handleCompare = async () => {
    const name = productQuery.trim();
    if (!name || comparing) return;
    if (!isPro && getCompareUsed() >= FREE_COMPARE_LIMIT) {
      setShowPaywall(true);
      return;
    }
    setComparing(true);
    setCompareError(false);
    setCompareResult(null);
    setShowCompareList(false);
    try {
      const { data, error } = await supabase.functions.invoke("cj-proxy", {
        body: { path: "/api2.0/v1/product/list", query: { pageNum: "1", pageSize: "20", productNameEn: name } },
      });
      if (error) throw error;
      const list = data?.data?.list || [];
      if (list.length === 0) throw new Error("no results");
      const prices = list.map((p: any) => parseFloat(p.sellPrice || "0")).filter((p: number) => p > 0);
      setCompareResult({
        count: data?.data?.total ?? list.length,
        minPrice: Math.min(...prices),
        maxPrice: Math.max(...prices),
        items: list,
      });
      if (!isPro) localStorage.setItem(COMPARE_USE_KEY, String(getCompareUsed() + 1));
    } catch {
      setCompareError(true);
    } finally {
      setComparing(false);
    }
  };

  const filtered = PLATFORMS.filter((p) => {
    if (filter === "recommended" && !p.recommended) return false;
    if (query && !p.name.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-10">
      <SEO title="Tedarikçi Rehberi | KHELL AI" description="Dropshipping için en iyi tedarikçi platformlarını karşılaştır. CJ, AliExpress, Alibaba, Temu." />

      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={transition}
        className="relative rounded-2xl overflow-hidden border border-border bg-gradient-to-br from-primary/10 via-background to-emerald-500/5 p-8">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/30">
              <Zap className="h-3 w-3" /> KHELL AI Tedarikçi Rehberi
            </span>
          </div>
          <h1 className="text-3xl font-black text-foreground mb-2">
            Doğru tedarikçi = <span className="bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">daha yüksek kâr</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mb-6">
            Yanlış tedarikçi seçimi dropshipping başarısızlıklarının #1 sebebidir. KHELL AI ile entegre çalışan platfomları karşılaştır, en kârlı tedarikçiyi bul.
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckCircle className="h-4 w-4" /> CJ Dropshipping entegre
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-emerald-400" /> Otomatik sipariş yönetimi
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-emerald-400" /> Gerçek zamanlı stok takibi
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {STATS.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05, ...transition }}
            className="card-glow rounded-xl p-4 text-center">
            <s.icon className="h-5 w-5 text-primary mx-auto mb-2" />
            <p className="text-2xl font-black font-mono text-foreground">{s.value}</p>
            <p className="text-[11px] text-muted-foreground mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Ürün Bazlı Tedarikçi Karşılaştırması */}
      <div className="card-glow rounded-2xl p-6 space-y-4">
        <div>
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Search className="h-4 w-4 text-primary" /> Ürün Bazlı Karşılaştır
          </h2>
          <p className="text-xs text-muted-foreground mt-1">Sattığın ürünün adını yaz, hangi tedarikçide ne fiyata bulunduğunu gör.</p>
        </div>
        <div className="flex gap-2">
          <input
            value={productQuery}
            onChange={(e) => setProductQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleCompare(); }}
            placeholder="Örn: kablosuz kulaklık"
            className="input-dark flex-1"
          />
          <button onClick={handleCompare} disabled={comparing || !productQuery.trim()} className="btn-primary px-5 flex items-center gap-1.5 disabled:opacity-50">
            {comparing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            Karşılaştır
          </button>
        </div>

        {compareError && <p className="text-xs text-destructive">Sonuç bulunamadı, farklı bir isim dene.</p>}

        <AnimatePresence>
          {compareResult && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-xl p-4 border" style={{ background: "hsl(217 91% 60% / 0.08)", borderColor: "hsl(217 91% 60% / 0.3)" }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-foreground flex items-center gap-1.5">📦 CJ Dropshipping</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">Canlı Veri</span>
                </div>
                <button onClick={() => setShowCompareList((v) => !v)} className="text-xs text-muted-foreground mb-1 underline decoration-dotted hover:text-foreground transition-colors">
                  {compareResult.count} eşleşen ürün bulundu {showCompareList ? "▲" : "▼"}
                </button>
                <p className="text-lg font-black font-mono text-foreground">${compareResult.minPrice.toFixed(2)} <span className="text-xs font-normal text-muted-foreground">– ${compareResult.maxPrice.toFixed(2)}</span></p>
                <p className="text-[10px] text-muted-foreground mt-1">7-15 gün teslimat · Min. 1 adet</p>

                {showCompareList && (
                  <div className="mt-3 pt-3 border-t border-border/40 space-y-1.5 max-h-60 overflow-y-auto">
                    {compareResult.items.map((item: any, i: number) => {
                      const img = item.productImage?.split(",")[0] || "";
                      const name = item.productNameEn || item.productName || "CJ Ürün";
                      const price = parseFloat(item.sellPrice || "0");
                      return (
                        <a
                          key={item.pid || i}
                          href={item.productUrl || `https://cjdropshipping.com/product/-p-${item.pid}.html`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2 rounded-lg bg-background/40 px-2 py-1.5 hover:bg-background/70 transition-colors"
                        >
                          {img ? <img src={img} alt="" className="h-8 w-8 rounded object-cover shrink-0" /> : <div className="h-8 w-8 rounded bg-muted shrink-0" />}
                          <span className="text-[11px] text-foreground truncate flex-1">{name}</span>
                          <span className="text-[11px] font-mono font-bold text-foreground shrink-0">${price.toFixed(2)}</span>
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="rounded-xl p-4 border relative overflow-hidden" style={{ background: "hsl(217 32% 15% / 0.3)", borderColor: "hsl(217 32% 25% / 0.5)" }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-foreground flex items-center gap-1.5">🛒 AliExpress</span>
                </div>
                <div className="flex flex-col items-center justify-center py-3 gap-1.5 text-center">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Bu entegrasyon yakında ekleniyor</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Platform Karşılaştırması */}
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="text-xl font-bold text-foreground">Platform Karşılaştırması</h2>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Platform ara..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-9 pl-9 pr-3 rounded-lg bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 w-44"
              />
            </div>
            <button onClick={() => setFilter("all")}
              className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${filter === "all" ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground"}`}>
              Tümü
            </button>
            <button onClick={() => setFilter("recommended")}
              className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${filter === "recommended" ? "bg-emerald-500 text-white" : "bg-card border border-border text-muted-foreground"}`}>
              ✅ Önerilen
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05, ...transition }}
              className={`rounded-xl border p-5 transition-all duration-300 ${p.color} ${p.glowColor} relative overflow-hidden`}>

              {p.recommended && (
                <div className="absolute top-3 right-3">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    <Award className="h-3 w-3" /> KHELL ÖNERİSİ
                  </span>
                </div>
              )}

              <div className="flex items-start gap-3 mb-4">
                <span className="text-3xl">{p.logo}</span>
                <div>
                  <h3 className="font-bold text-foreground text-lg">{p.name}</h3>
                  <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full border ${p.badgeColor}`}>
                    {p.badge}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-4 text-[11px]">
                <div className="rounded-lg bg-background/40 px-2 py-1.5 text-center">
                  <p className="text-muted-foreground">Teslimat</p>
                  <p className="font-bold text-foreground">{p.delivery}</p>
                </div>
                <div className="rounded-lg bg-background/40 px-2 py-1.5 text-center">
                  <p className="text-muted-foreground">Min. Sipariş</p>
                  <p className="font-bold text-foreground">{p.minOrder} adet</p>
                </div>
                <div className="rounded-lg bg-background/40 px-2 py-1.5 text-center">
                  <p className="text-muted-foreground">Puan</p>
                  <p className="font-bold text-yellow-400 flex items-center justify-center gap-1">
                    <Star className="h-3 w-3 fill-current" /> {p.rating}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4 text-[11px]">
                <div>
                  <p className="text-emerald-400 font-semibold mb-1.5">✅ Avantajlar</p>
                  <ul className="space-y-1">
                    {p.pros.map((pro) => (
                      <li key={pro} className="text-muted-foreground flex items-start gap-1.5">
                        <span className="text-emerald-400 mt-0.5">+</span> {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-red-400 font-semibold mb-1.5">⚠️ Dezavantajlar</p>
                  <ul className="space-y-1">
                    {p.cons.map((con) => (
                      <li key={con} className="text-muted-foreground flex items-start gap-1.5">
                        <span className="text-red-400 mt-0.5">-</span> {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <a href={p.link} target="_blank" rel="noreferrer"
                className={`flex items-center justify-center gap-2 w-full py-2 rounded-lg text-sm font-semibold transition-colors ${
                  p.recommended
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-background/60 text-muted-foreground hover:text-foreground border border-border"
                }`}>
                <ExternalLink className="h-3.5 w-3.5" /> {p.name}'e Git
              </a>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Pro Tips */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-foreground">💡 Uzman İpuçları</h2>
          <span className="text-[11px] text-muted-foreground">Dropshipping'de en sık karşılaşılan hatalardan</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {TIPS.map((tip, i) => (
            <motion.div key={tip.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05, ...transition }}
              className="card-glow rounded-xl p-4 hover:border-primary/30 transition-colors">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{tip.icon}</span>
                <div>
                  <h3 className="font-semibold text-foreground text-sm mb-1">{tip.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{tip.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Banner */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, ...transition }}
        className="rounded-2xl border border-primary/30 bg-gradient-to-r from-primary/10 via-primary/5 to-emerald-500/10 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-foreground text-lg mb-1">CJ Dropshipping'den ürün bul, hemen analiz et</h3>
          <p className="text-sm text-muted-foreground">KHELL AI ile CJ'deki ürünleri kâr marjı, risk ve rakip analiziyle değerlendir.</p>
        </div>
        <a href="/dashboard/analyzer"
          className="shrink-0 flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
          <Zap className="h-4 w-4" /> Ürün Analiz Et
        </a>
      </motion.div>
      <AnimatePresence>
        {showPaywall && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-background/90 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="w-full max-w-md mx-4 rounded-2xl border border-amber-500/30 bg-card p-8 shadow-2xl text-center">
              <div className="mx-auto mb-4 h-14 w-14 rounded-2xl bg-amber-500/15 flex items-center justify-center">
                <Lock className="h-7 w-7 text-amber-400" />
              </div>
              <h2 className="text-2xl font-black text-foreground mb-2">Tedarikçi Karşılaştırma PRO'da</h2>
              <p className="text-sm text-muted-foreground mb-6">Ücretsiz karşılaştırma hakkını kullandın. Sınırsız tedarikçi ve fiyat karşılaştırması için PRO'ya geç.</p>
              <div className="text-left mb-6 space-y-3">
                <div className="flex items-center gap-3"><span className="text-emerald-400 text-base">✔</span><span className="text-sm text-foreground">Sınırsız ürün-tedarikçi karşılaştırması</span></div>
                <div className="flex items-center gap-3"><span className="text-emerald-400 text-base">✔</span><span className="text-sm text-foreground">CJ + AliExpress canlı fiyat farkı</span></div>
                <div className="flex items-center gap-3"><span className="text-emerald-400 text-base">✔</span><span className="text-sm text-foreground">Tüm kazanan ve trend ürünlerin kilidi</span></div>
              </div>
              <a href={shopierLink} target="_blank" rel="noopener noreferrer" className="block w-full rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold text-base py-3.5 transition-all shadow-lg shadow-amber-500/25">Pro'ya Geç</a>
              <button onClick={() => setShowPaywall(false)} className="text-xs text-muted-foreground hover:underline mt-4">Şimdi değil</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <BamirFooter />
    </div>
  );
}
