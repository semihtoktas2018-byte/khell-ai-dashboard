import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { BarChart3, TrendingUp, Search, ShieldCheck, Zap, Target, Check, Globe, Video, Hash, Copy, Package } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import BackButton from "@/components/BackButton";
import SEO from "@/components/SEO";
import FeatureShowcase from "@/components/FeatureShowcase";

const transition = { type: "spring" as const, stiffness: 300, damping: 30 };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition } };

const featureIcons = [BarChart3, TrendingUp, Search, ShieldCheck, Zap, Target];

export default function LandingPage() {
  const navigate = useNavigate();
  const { t, locale, setLocale } = useLocale();

  const features = [
    { icon: featureIcons[0], title: t("landing.feat1"), desc: t("landing.feat1Desc") },
    { icon: featureIcons[1], title: t("landing.feat2"), desc: t("landing.feat2Desc") },
    { icon: featureIcons[2], title: t("landing.feat3"), desc: t("landing.feat3Desc") },
    { icon: featureIcons[3], title: t("landing.feat4"), desc: t("landing.feat4Desc") },
    { icon: featureIcons[4], title: t("landing.feat5"), desc: t("landing.feat5Desc") },
    { icon: featureIcons[5], title: t("landing.feat6"), desc: t("landing.feat6Desc") },
  ];

  const steps = [
    { num: "01", title: t("landing.step1"), desc: t("landing.step1Desc") },
    { num: "02", title: t("landing.step2"), desc: t("landing.step2Desc") },
    { num: "03", title: t("landing.step3New"), desc: t("landing.step3NewDesc") },
  ];

  const plans = [
    {
      name: locale === "tr" ? "Başlangıç" : "Starter",
      price: locale === "tr" ? "Ücretsiz" : "Free",
      period: "",
      features: [t("landing.starterF1"), t("landing.starterF2"), t("landing.starterF3"), t("landing.starterF4")],
      cta: t("landing.starterCta"),
      popular: false,
    },
    {
      name: "Pro",
      price: locale === "tr" ? "249 ₺" : "$9",
      period: locale === "tr" ? "/ay" : "/mo",
      features: [t("landing.proF1"), t("landing.proF2"), t("landing.proF3New"), t("landing.proF4"), t("landing.proF5")],
      cta: t("landing.proCta"),
      popular: true,
      href: "https://www.shopier.com/bamironlinestore/46009500",
    },
    {
      name: locale === "tr" ? "Kurumsal" : "Enterprise",
      price: locale === "tr" ? "₺990" : "$99",
      period: locale === "tr" ? "/ay" : "/mo",
      features: [t("landing.entF1"), t("landing.entF2"), t("landing.entF3"), t("landing.entF4"), t("landing.entF5")],
      cta: t("landing.entCta"),
      popular: false,
      whatsapp: "https://wa.me/905446452430?text=KHELL%20AI%20Kurumsal%20plan%20hakk%C3%B4nda%20bilgi%20almak%20istiyorum",
    },
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <SEO
        title={
          locale === "tr"
            ? "KHELL AI — Kazanan Ürünü Bul, AI ile Analiz Et"
            : "KHELL AI — Find Winning Products, Analyze with AI"
        }
        description={
          locale === "tr"
            ? "AI destekli dropshipping analiz platformu. Gerçek CJ Dropshipping verileriyle kazanan ürünleri bul, kâr ve risk skorunu saniyeler içinde gör."
            : "AI-powered dropshipping analytics platform. Find winning products with real CJ Dropshipping data and instant profit & risk scores."
        }
      />

      {/* CJ Entegrasyon Banner */}
      <div className="flex items-center justify-center gap-2 bg-primary/10 border-b border-primary/20 py-1.5 px-4">
        <Package className="h-3 w-3 text-primary shrink-0" />
        <p className="text-[11px] text-primary font-medium">
          CJdropshipping ile entegre — gerçek zamanlı ürün verisi aktif
        </p>
        <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse shrink-0" />
      </div>

      {/* Nav */}
      <nav className="fixed top-7 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <BackButton />
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground tracking-tight">KHELL AI</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLocale(locale === "tr" ? "en" : "tr")}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-border bg-card hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
            >
              <Globe className="h-3.5 w-3.5" />
              {locale === "tr" ? "TR" : "EN"}
            </button>
            <button onClick={() => navigate("/dashboard/analyzer")} className="btn-ghost text-sm py-2 px-4">
              {t("landing.login")}
            </button>
            <button onClick={() => navigate("/dashboard/analyzer")} className="btn-primary text-sm py-2 px-4">
              {t("landing.start")}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-40 pb-20 px-6">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
        </div>
        <div className="container mx-auto relative z-10">
          <motion.div variants={stagger} initial="hidden" animate="visible" className="text-center max-w-4xl mx-auto">
            <motion.div variants={fadeUp} className="mb-4 flex flex-col items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-winning pulse-glow" />
                {t("landing.badge")}
              </span>
              <a
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
              >
                <Package className="h-3 w-3" />
                CJdropshipping entegrasyonu aktif — gerçek ürün verisi
                <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              </a>
            </motion.div>

            <motion.h1 variants={fadeUp} className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">
              <span className="bg-gradient-to-b from-foreground to-muted-foreground bg-clip-text text-transparent">
                {t("landing.heroTitle")}
              </span>
            </motion.h1>

            <motion.p variants={fadeUp} className="text-lg md:text-xl text-muted-foreground mb-8 tracking-tight">
              {t("landing.heroSubtext")}
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <button onClick={() => navigate("/dashboard/analyzer")} className="btn-primary text-base px-8 py-3">
                {t("landing.cta")}
              </button>
              <button onClick={() => navigate("/dashboard/content-engine")} className="btn-ghost text-base px-8 py-3 border border-border">
                <Video className="h-4 w-4 mr-2 inline" />
                {t("landing.ctaVideo")}
              </button>
            </motion.div>

            <motion.div variants={fadeUp} className="relative mx-auto max-w-5xl">
              <div className="relative rounded-xl overflow-hidden border border-border shadow-2xl">
                <img src="/og-image.png" alt="KHELL AI — Ürün senden, analiz Khell'den" className="w-full h-auto" loading="eager" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Özellik Vitrini — dönen, kendini tekrar eden tanıtım */}
      <section className="py-12 px-6">
        <div className="container mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-6">
            <h2 className="text-xl font-bold text-foreground">Gerçek Entegrasyonlar, Gerçek Veri</h2>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <FeatureShowcase />
          </motion.div>
        </div>
      </section>

      {/* Demo Output */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-foreground mb-2">{t("landing.demoTitle")}</h2>
            <p className="text-sm text-muted-foreground">{t("landing.demoDesc")}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="card-glow rounded-xl p-6 space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <Zap className="h-3.5 w-3.5 text-primary" /> Hook
              </div>
              <p className="text-lg font-bold text-foreground">"Bu herkes için değil."</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <Copy className="h-3.5 w-3.5 text-primary" /> Açıklama
              </div>
              <p className="text-sm text-foreground">"Bu tasarımı sadece birkaç kişi anlıyor."</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <Hash className="h-3.5 w-3.5 text-primary" /> Hashtag'ler
              </div>
              <div className="flex flex-wrap gap-2">
                {["#viral", "#tiktokshop", "#dropshipping", "#fyp", "#trending"].map((tag) => (
                  <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="pt-2">
              <button onClick={() => navigate("/dashboard/content-engine")} className="btn-primary text-sm px-6 py-2.5">
                {t("landing.tryNow")}
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-3">{t("landing.howItWorks")}</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">{t("landing.howItWorksDesc")}</p>
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
            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-3">{t("landing.featuresTitle")}</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">{t("landing.featuresDesc")}</p>
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

      {/* Detailed Features Banner (full visual overview) */}
      <section className="py-12 px-6">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-xl overflow-hidden border border-border shadow-2xl"
          >
            <img
              src="/features-section.png"
              alt="KHELL AI özellikleri: AI destekli ürün analizi, gerçek CJ Dropshipping verileri, kâr ve risk skoru, canlı trend takibi, AI ürün sayfası ve içerik üretimi"
              className="w-full h-auto"
              loading="lazy"
            />
          </motion.div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-3">{t("landing.pricing")}</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">{t("landing.pricingDesc")}</p>
            <div className="mt-6 inline-flex flex-col sm:flex-row items-center gap-2 rounded-xl border border-winning/30 bg-winning/10 px-5 py-3 text-sm">
              <span className="font-semibold text-winning">
                {locale === "tr" ? "🚀 İlk 100 kullanıcıya 1 ay ücretsiz Pro" : "🚀 First 100 users get 1 month of Pro free"}
              </span>
              <span className="text-muted-foreground">
                {locale === "tr" ? "— kod: " : "— code: "}
                <span className="font-mono font-bold text-foreground">LAUNCH100</span>
              </span>
            </div>
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
                    {t("landing.popular")}
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
                ) : plan.whatsapp ? (
                  <a
                    href={plan.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-3 rounded-lg font-semibold text-sm text-center transition-all btn-ghost"
                  >
                    {plan.cta}
                  </a>
                ) : (
                  <button
                    onClick={() => navigate("/dashboard/analyzer")}
                    className="w-full py-3 rounded-lg font-semibold text-sm transition-all btn-ghost"
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
            <h2 className="text-3xl font-bold text-foreground mb-4">{t("landing.ctaTitle")}</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">{t("landing.ctaDesc")}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button onClick={() => navigate("/dashboard/analyzer")} className="btn-primary text-base px-8 py-3">
                {t("landing.cta")}
              </button>
              <button onClick={() => navigate("/dashboard/content-engine")} className="btn-ghost text-base px-8 py-3 border border-border">
                {t("landing.ctaVideo")}
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="container mx-auto flex items-center justify-between">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            {t("nav.production")}
          </p>
          <p className="text-xs text-muted-foreground">© 2026 KHELL AI</p>
        </div>
      </footer>
    </div>
  );
}
