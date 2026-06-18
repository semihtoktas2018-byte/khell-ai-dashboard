import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Star, CheckCircle, Clock, Zap, Shield, TrendingUp, Package, ExternalLink, Award, AlertTriangle } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import SEO from "@/components/SEO";

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
  const { t } = useLocale();

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
    </div>
  );
}
