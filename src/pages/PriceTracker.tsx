import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Plus, Trash2, TrendingDown, TrendingUp, Link, Lock, AlertCircle } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import BackButton from "@/components/BackButton";
import SEO from "@/components/SEO";

const transition = { type: "spring" as const, stiffness: 300, damping: 30 };

const DEMO_TRACKED = [
  { name: "Wireless Earbuds TWS", platform: "AliExpress", currentPrice: "$8.50", targetPrice: "$7.00", change: "-5%", trend: "down", alert: false },
  { name: "LED Strip Light 5M", platform: "AliExpress", currentPrice: "$12.30", targetPrice: "$10.00", change: "+2%", trend: "up", alert: true },
  { name: "Phone Case iPhone 15", platform: "AliExpress", currentPrice: "$3.20", targetPrice: "$2.50", change: "-12%", trend: "down", alert: false },
];

export default function PriceTracker() {
  const { locale } = useLocale();
  const isTr = locale === "tr";
  const [url, setUrl] = useState("");
  const [targetPrice, setTargetPrice] = useState("");
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    if (!url.trim()) return;
    setAdded(true);
    setUrl("");
    setTargetPrice("");
    setTimeout(() => setAdded(false), 3000);
  };

  return (
    <div className="space-y-6">
      <SEO
        title={isTr ? "Fiyat Takibi | KHELL AI" : "Price Tracker | KHELL AI"}
        description={isTr ? "Ürün fiyatlarını takip et, hedef fiyata ulaşınca bildirim al." : "Track product prices and get notified when target price is reached."}
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
          <div className="h-9 w-9 rounded-xl bg-blue-500/20 flex items-center justify-center">
            <Bell className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">
              {isTr ? "📊 Fiyat Takibi" : "📊 Price Tracker"}
            </h1>
            <p className="text-xs text-muted-foreground">
              {isTr ? "Tedarikçi fiyatı değişince anında haber al" : "Get notified instantly when supplier price changes"}
            </p>
          </div>
        </div>

        <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
          style={{
            background: "hsl(217 91% 60% / 0.12)",
            border: "1px solid hsl(217 91% 60% / 0.35)",
            color: "hsl(217 91% 70%)",
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          {isTr ? "Backend entegrasyonu yakında aktif" : "Backend integration coming soon"}
        </div>
      </motion.div>

      {/* Add Product */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ ...transition, delay: 0.1 }}
        className="rounded-xl p-6"
        style={{
          background: "linear-gradient(160deg, hsl(222 47% 9% / 0.7), hsl(222 47% 6% / 0.85))",
          border: "1px solid hsl(217 91% 60% / 0.18)",
        }}
      >
        <h3 className="text-sm font-semibold text-foreground mb-4">
          {isTr ? "Ürün Ekle" : "Add Product"}
        </h3>
        <div className="space-y-3">
          <div className="relative">
            <Link className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={isTr ? "AliExpress ürün linki..." : "AliExpress product link..."}
              className="input-dark w-full pl-10"
            />
          </div>
          <div className="flex gap-3">
            <input
              type="number"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              placeholder={isTr ? "Hedef fiyat ($)" : "Target price ($)"}
              className="input-dark flex-1"
            />
            <button
              onClick={handleAdd}
              disabled={!url.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50"
              style={{ background: "hsl(217 91% 60%)", boxShadow: "0 0 20px hsl(217 91% 60% / 0.3)" }}
            >
              <Plus className="h-4 w-4" />
              {isTr ? "Takibe Al" : "Track"}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {added && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="mt-3 flex items-center gap-2 text-xs text-green-400 bg-green-500/10 rounded-lg px-3 py-2">
              <AlertCircle className="h-3.5 w-3.5" />
              {isTr ? "Ürün takip listesine eklendi (demo)" : "Product added to tracking list (demo)"}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Tracked Products */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ ...transition, delay: 0.2 }}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground">
            {isTr ? "Takip Edilen Ürünler" : "Tracked Products"}
            <span className="ml-2 text-[10px] text-muted-foreground bg-accent px-1.5 py-0.5 rounded-full">{DEMO_TRACKED.length} demo</span>
          </h3>
        </div>

        <div className="space-y-3">
          {DEMO_TRACKED.map((p, i) => (
            <div key={i} className="rounded-xl p-4 flex items-center justify-between"
              style={{
                background: "hsl(222 47% 8%)",
                border: `1px solid ${p.alert ? "hsl(38 92% 55% / 0.4)" : "hsl(217 32% 17%)"}`,
              }}
            >
              <div className="flex items-center gap-3">
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${p.trend === "down" ? "bg-green-500/15" : "bg-red-500/15"}`}>
                  {p.trend === "down"
                    ? <TrendingDown className="h-4 w-4 text-green-400" />
                    : <TrendingUp className="h-4 w-4 text-red-400" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{p.name}</p>
                  <p className="text-[10px] text-muted-foreground">{p.platform} · {isTr ? "Hedef" : "Target"}: {p.targetPrice}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {p.alert && (
                  <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                    {isTr ? "⚠ Fiyat Arttı" : "⚠ Price Up"}
                  </span>
                )}
                <div className="text-right">
                  <p className="text-sm font-bold text-white">{p.currentPrice}</p>
                  <p className={`text-[10px] font-medium ${p.trend === "down" ? "text-green-400" : "text-red-400"}`}>{p.change}</p>
                </div>
                <button className="h-7 w-7 flex items-center justify-center rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Coming Soon */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ ...transition, delay: 0.3 }}
        className="rounded-xl p-6 text-center"
        style={{ background: "hsl(217 91% 60% / 0.06)", border: "1px solid hsl(217 91% 60% / 0.2)" }}>
        <Lock className="h-8 w-8 text-blue-400 mx-auto mb-3" />
        <h3 className="text-base font-bold text-white mb-1">
          {isTr ? "Gerçek Bildirimler Yakında" : "Real Notifications Coming Soon"}
        </h3>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          {isTr
            ? "Backend hazır olunca fiyat değişikliklerini e-posta veya WhatsApp ile anında alacaksın."
            : "Once backend is ready, you'll receive price change alerts instantly via email or WhatsApp."}
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          {[
            { icon: "📧", label: isTr ? "E-posta Bildirimi" : "Email Alert" },
            { icon: "💬", label: "WhatsApp" },
            { icon: "📱", label: isTr ? "Uygulama İçi" : "In-App" },
          ].map((b) => (
            <span key={b.label} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg"
              style={{ background: "hsl(217 32% 12%)", border: "1px solid hsl(217 32% 20%)", color: "hsl(215 20% 65%)" }}>
              {b.icon} {b.label}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
