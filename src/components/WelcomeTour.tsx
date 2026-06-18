import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, BarChart3, Rocket, X } from "lucide-react";

const STORAGE_KEY = "khell_welcome_seen";

export default function WelcomeTour() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setShow(true);
    } catch {
      // localStorage yoksa sessizce gösterme
    }
  }, []);

  const dismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // ignore
    }
    setShow(false);
  };

  const steps = [
    { icon: Search, title: "1. Ürün Bul", desc: "Trend Ürünler veya Kazanan Ürünler'den bir ürün keşfet, ya da kendi ürününü ekle." },
    { icon: BarChart3, title: "2. AI ile Analiz Et", desc: "Kâr marjı, risk skoru ve karar skorunu saniyeler içinde gör." },
    { icon: Rocket, title: "3. Satışa Başla", desc: "İçerik Motoru ile reklam/sayfa içeriği üret, satmaya başla." },
  ];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-background/90 backdrop-blur-md px-4"
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-md rounded-2xl p-7 relative"
            style={{
              background: "linear-gradient(160deg, hsl(222 47% 9% / 0.95), hsl(222 47% 5% / 0.98))",
              backdropFilter: "blur(20px)",
              border: "1px solid hsl(217 91% 60% / 0.25)",
              boxShadow: "0 0 60px hsl(217 91% 60% / 0.15)",
            }}
          >
            <button onClick={dismiss} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors">
              <X className="h-4 w-4" />
            </button>

            <h2 className="text-xl font-bold text-foreground mb-1">KHELL AI'a Hoş Geldin! 👋</h2>
            <p className="text-sm text-muted-foreground mb-6">3 adımda kazanan ürünü bul ve satışa başla.</p>

            <div className="space-y-4 mb-6">
              {steps.map((s) => (
                <div key={s.title} className="flex items-start gap-3">
                  <div
                    className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: "hsl(217 91% 60% / 0.12)", border: "1px solid hsl(217 91% 60% / 0.3)" }}
                  >
                    <s.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{s.title}</p>
                    <p className="text-xs text-muted-foreground">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={dismiss} className="btn-primary w-full">
              Başlayalım 🚀
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
