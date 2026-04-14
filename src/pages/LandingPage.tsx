import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { BarChart3, TrendingUp, Search, ShieldCheck, Zap, Target, Check } from "lucide-react";
import heroImg from "@/assets/hero-dashboard.png";

const transition = { type: "spring" as const, stiffness: 300, damping: 30 };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition } };

const features = [
  { icon: BarChart3, title: "Kâr Analizi", desc: "Tüm maliyetleri hesaplayarak net kâr marjınızı görün." },
  { icon: TrendingUp, title: "Trend Ürünler", desc: "TikTok, Amazon ve AliExpress'ten trend ürünleri keşfedin." },
  { icon: Search, title: "Tedarikçi Bul", desc: "En iyi fiyatlı tedarikçileri anında karşılaştırın." },
  { icon: ShieldCheck, title: "Risk Analizi", desc: "Her ürünün risk seviyesini otomatik değerlendirin." },
  { icon: Zap, title: "Anlık Sonuçlar", desc: "Saniyeler içinde detaylı analiz sonuçları alın." },
  { icon: Target, title: "Karar Skoru", desc: "Kazanan ürünleri tek bakışta belirleyin." },
];

const steps = [
  { num: "01", title: "Ürün Bilgilerini Girin", desc: "Maliyet, kargo, reklam ve satış fiyatını girin." },
  { num: "02", title: "Analiz Edin", desc: "KHELL AI kârlılık, risk ve karar skorunu hesaplar." },
  { num: "03", title: "Kazananı Seçin", desc: "En kârlı ürünü kaydedin ve satışa başlayın." },
];

const plans = [
  {
    name: "Starter",
    price: "Ücretsiz",
    period: "",
    features: ["Günde 5 analiz", "Trend ürün keşfi", "Tedarikçi arama", "Temel risk analizi"],
    cta: "Ücretsiz Başla",
    popular: false,
  },
  {
    name: "Pro",
    price: "99₺",
    period: "/ay",
    features: ["Sınırsız analiz", "Gelişmiş risk skoru", "Tedarikçi karşılaştırma", "Ürün kaydetme", "Öncelikli destek"],
    cta: "Premium Ol - Aylık 99₺",
    popular: true,
    href: "https://www.shopier.com/bamironlinestore/46009500",
  },
  {
    name: "Enterprise",
    price: "$99",
    period: "/ay",
    features: ["Tüm Pro özellikleri", "API erişimi", "Takım yönetimi", "Özel entegrasyonlar", "7/24 destek"],
    cta: "İletişime Geç",
    popular: false,
  },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground tracking-tight">KHELL AI</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/dashboard/analyzer")} className="btn-ghost text-sm py-2 px-4">
              Giriş Yap
            </button>
            <button onClick={() => navigate("/dashboard/analyzer")} className="btn-primary text-sm py-2 px-4">
              Hemen Başla
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
        </div>

        <div className="container mx-auto relative z-10">
          <motion.div variants={stagger} initial="hidden" animate="visible" className="text-center max-w-4xl mx-auto">
            <motion.div variants={fadeUp} className="mb-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-winning pulse-glow" />
                E-Ticaret Kârlılık Platformu
              </span>
            </motion.div>

            <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-bold tracking-tighter mb-4">
              <span className="bg-gradient-to-b from-foreground to-muted-foreground bg-clip-text text-transparent">
                KHELL AI
              </span>
            </motion.h1>

            <motion.p variants={fadeUp} className="text-xl md:text-2xl text-muted-foreground mb-8 tracking-tight">
              Ürün Senden Analiz KHELL'den
            </motion.p>

            <motion.div variants={fadeUp} className="flex items-center justify-center mb-16">
              <button onClick={() => navigate("/dashboard/analyzer")} className="btn-primary text-base px-8 py-3">
                START FREE ANALYSIS
              </button>
            </motion.div>

            <motion.div variants={fadeUp} className="relative mx-auto max-w-5xl">
              <div className="relative rounded-xl overflow-hidden border border-border shadow-2xl">
                <img
                  src={heroImg}
                  alt="KHELL AI Dashboard - E-ticaret analiz platformu"
                  className="w-full h-auto"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-3">Nasıl Çalışır?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">3 adımda kazanan ürünü bulun.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {steps.map((s, i) => (
              <motion.div key={s.num} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, ...transition }} className="text-center">
                <div className="text-4xl font-bold font-mono text-primary/20 mb-3">{s.num}</div>
                <h3 className="font-semibold text-foreground mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-3">
              Kâr Marjınızı Saniyeler İçinde Görün
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Ürün maliyetlerini girin, anında kârlılık analizi ve karar skoru alın.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, ...transition }}
                whileHover={{ y: -4 }}
                className="card-glow rounded-xl p-6 cursor-default"
              >
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-3">Fiyatlandırma</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">İhtiyacınıza uygun planı seçin.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, ...transition }}
                className={`card-glow rounded-xl p-8 relative ${plan.popular ? "ring-2 ring-primary" : ""}`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-full">
                    Popüler
                  </span>
                )}
                <h3 className="text-lg font-bold text-foreground mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold font-mono text-foreground">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-winning shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                {plan.href ? (
                  <a
                    href={plan.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-3 rounded-lg font-semibold text-sm text-center transition-all btn-primary"
                  >
                    {plan.cta}
                  </a>
                ) : (
                  <button
                    onClick={() => navigate("/dashboard/analyzer")}
                    className={`w-full py-3 rounded-lg font-semibold text-sm transition-all btn-ghost`}
                  >
                    {plan.cta}
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card-glow rounded-2xl p-12 text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">Kazanan Ürünleri Bulmaya Başlayın</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Binlerce e-ticaret girişimcisi KHELL AI ile kârlı ürünleri keşfediyor.
            </p>
            <div className="flex items-center justify-center">
              <button onClick={() => navigate("/dashboard/analyzer")} className="btn-primary text-base px-8 py-3">
                START FREE ANALYSIS
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="container mx-auto flex items-center justify-between">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            A BAMİR Online Store's Production
          </p>
          <p className="text-xs text-muted-foreground">© 2026 KHELL AI</p>
        </div>
      </footer>
    </div>
  );
}
