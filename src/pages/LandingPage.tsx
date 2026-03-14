import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { BarChart3, TrendingUp, Search, ShieldCheck, Zap, Target } from "lucide-react";
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
            <button onClick={() => navigate("/dashboard")} className="btn-ghost text-sm py-2 px-4">
              Demo Gör
            </button>
            <button onClick={() => navigate("/dashboard")} className="btn-primary text-sm py-2 px-4">
              Hemen Başla
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6">
        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
        </div>

        <div className="container mx-auto relative z-10">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="text-center max-w-4xl mx-auto"
          >
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

            <motion.div variants={fadeUp} className="flex items-center justify-center gap-4 mb-16">
              <button onClick={() => navigate("/dashboard")} className="btn-primary text-base">
                Hemen Başla
              </button>
              <button onClick={() => navigate("/dashboard")} className="btn-ghost text-base">
                Demo Gör
              </button>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="relative mx-auto max-w-5xl"
            >
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

      {/* Features */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
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
