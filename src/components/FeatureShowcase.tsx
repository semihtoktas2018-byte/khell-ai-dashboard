import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Database, Music2, Megaphone, Sparkles, TrendingUp } from "lucide-react";

const SLIDE_MS = 3000;

const slides = [
  {
    icon: Database,
    badge: "GERÇEK VERİ",
    title: "CJ Dropshipping ile Canlı Bağlantı",
    desc: "Uydurma örnek değil — gerçek tedarikçi fiyatları, gerçek sipariş hacmi, anlık güncellenen veri.",
    accent: "hsl(217 91% 60%)",
  },
  {
    icon: Music2,
    badge: "TIKTOK",
    title: "TikTok'ta Tek Tıkla Doğrulama",
    desc: "Her ürün kartından doğrudan TikTok'a git, o ürün gerçekten viral mi anında gör.",
    accent: "hsl(330 81% 60%)",
  },
  {
    icon: Megaphone,
    badge: "FACEBOOK",
    title: "Facebook Reklam Kütüphanesi Entegrasyonu",
    desc: "Bir ürüne reklam veren var mı, hangi görselle satılıyor — tek tıkla Facebook Ad Library'de ara.",
    accent: "hsl(217 91% 60%)",
  },
  {
    icon: Sparkles,
    badge: "AI DESTEKLİ",
    title: "Saniyeler İçinde AI Analizi",
    desc: "Kâr marjı, risk skoru, karar skoru — yapay zeka hepsini anında hesaplar.",
    accent: "hsl(142 71% 50%)",
  },
  {
    icon: TrendingUp,
    badge: "CANLI TREND",
    title: "30 Dakikada Bir Güncellenen Trendler",
    desc: "En çok sipariş alan ürünler sürekli takip edilir, kaçırmazsın.",
    accent: "hsl(38 92% 55%)",
  },
];

export default function FeatureShowcase() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), SLIDE_MS);
    return () => clearInterval(t);
  }, []);

  const s = slides[index];
  const Icon = s.icon;

  return (
    <div
      className="relative rounded-2xl overflow-hidden mx-auto max-w-2xl"
      style={{ perspective: 1000 }}
    >
      <div
        className="relative h-[220px] sm:h-[200px] rounded-2xl"
        style={{
          background: "linear-gradient(160deg, hsl(222 47% 8% / 0.9), hsl(222 47% 4% / 0.95))",
          backdropFilter: "blur(16px)",
          border: `1px solid ${s.accent}40`,
          boxShadow: `0 0 60px ${s.accent}1a`,
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, rotateY: 35, scale: 0.92 }}
            animate={{ opacity: 1, rotateY: 0, scale: 1 }}
            exit={{ opacity: 0, rotateY: -35, scale: 0.92 }}
            transition={{ duration: 0.55, ease: "easeInOut" }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 sm:px-10"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div
              className="h-12 w-12 rounded-xl flex items-center justify-center mb-3"
              style={{ background: `${s.accent}1f`, border: `1px solid ${s.accent}55`, boxShadow: `0 4px 20px ${s.accent}33` }}
            >
              <Icon className="h-6 w-6" style={{ color: s.accent }} />
            </div>
            <span
              className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-2"
              style={{ background: `${s.accent}1f`, color: s.accent }}
            >
              {s.badge}
            </span>
            <h3 className="text-base sm:text-lg font-bold text-foreground mb-1.5">{s.title}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-md">{s.desc}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* İlerleme noktaları */}
      <div className="flex items-center justify-center gap-1.5 mt-4">
        {slides.map((_, i) => (
          <span
            key={i}
            className="h-1 rounded-full transition-all duration-300"
            style={{
              width: i === index ? 22 : 7,
              background: i === index ? s.accent : "hsl(217 32% 22%)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
