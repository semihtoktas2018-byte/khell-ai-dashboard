import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { BarChart3, TrendingUp, Search, ShieldCheck, Zap, Target, Check, Globe, Video, Hash, Copy, Package, Star, Radio, ShoppingBag, Mail, MessageCircle } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import BackButton from "@/components/BackButton";
import SEO from "@/components/SEO";
import FeatureShowcase from "@/components/FeatureShowcase";
import ProductRevealDemo from "@/components/ProductRevealDemo";
import LiveTeaserAnalyzer from "@/components/LiveTeaserAnalyzer";

const transition = { type: "spring" as const, stiffness: 300, damping: 30 };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition } };

const featureIcons = [BarChart3, TrendingUp, Search, ShieldCheck, Zap, Target];

export default function LandingPage() {
  const navigate = useNavigate();
  const { t, locale, setLocale } = useLocale();
  const isTr = locale === "tr";
  const isFr = locale === "fr";

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
      name: isTr ? "Başlangıç" : isFr ? "Débutant" : "Starter",
      price: isTr ? "Ücretsiz" : isFr ? "Gratuit" : "Free",
      period: "",
      features: [t("landing.starterF1"), t("landing.starterF2"), t("landing.starterF3"), t("landing.starterF4")],
      cta: t("landing.starterCta"),
      popular: false,
    },
    {
      name: "Pro",
     price: isTr ? "249 ₺" : isFr ? "29 €" : "$29",
      period: isTr ? "/ay" : isFr ? "/mois" : "/mo",
      features: [t("landing.proF1"), t("landing.proF2"), t("landing.proF3New"), t("landing.proF4"), t("landing.proF5")],
      cta: t("landing.proCta"),
      popular: true,
     href: isTr ? "https://www.shopier.com/bamironlinestore/46009500" : "https://www.shopier.com/bamironlinestore/48494025",
    },
    {
      name: isTr ? "Kurumsal" : isFr ? "Entreprise" : "Enterprise",
     price: isTr ? "₺990" : isFr ? "€199" : "$199",
      period: isTr ? "/ay" : isFr ? "/mois" : "/mo",
      features: [t("landing.entF1"), t("landing.entF2"), t("landing.entF3"), t("landing.entF4"), t("landing.entF5")],
      cta: t("landing.entCta"),
      popular: false,
      whatsapp: "https://wa.me/905446452430?text=KHELL%20AI%20Kurumsal%20plan%20hakk%C3%B4nda%20bilgi%20almak%20istiyorum",
    },
  ];

  const whyKhell = locale === "tr" ? [
    { icon: "🎯", title: "Gerçek CJ Dropshipping Verisi", desc: "Uydurma değil, canlı tedarikçi fiyatları ve stok bilgisi" },
    { icon: "🤖", title: "AI Karar Skoru", desc: "Her ürün için 0-100 arası karar skoru — sat mı satma mı?" },
    { icon: "📦", title: "Hepsi Bir Arada", desc: "Analiz, içerik üretimi, risk skoru — tek platformda" },
    { icon: "⚡", title: "Saniyeler İçinde Sonuç", desc: "Ürün adını gir, 3 saniyede karar skoru ve kâr marjı" },
    { icon: "💰", title: "En Uygun Fiyat", desc: "Ayda 249₺ — tam özellikli profesyonel araç" },
    { icon: "🌍", title: "TR & Global Destek", desc: "Türkçe/İngilizce/Fransızca — her pazara hazır" },
  ] : locale === "fr" ? [
    { icon: "🎯", title: "Vraies données CJ Dropshipping", desc: "Prix fournisseurs en direct — aucune donnée fictive" },
    { icon: "🤖", title: "Score de décision IA", desc: "Score 0-100 pour chaque produit — vendre ou passer ?" },
    { icon: "📦", title: "Tout-en-un", desc: "Analyse, création de contenu, score de risque — une seule plateforme" },
    { icon: "⚡", title: "Résultats en secondes", desc: "Entrez le nom du produit, obtenez le score en 3 secondes" },
    { icon: "💰", title: "Meilleur rapport qualité-prix", desc: "9$/mois — outil professionnel complet" },
    { icon: "🌍", title: "Support mondial", desc: "Français/Anglais/Turc — prêt pour tous les marchés" },
  ] : [
    { icon: "🎯", title: "Real CJ Dropshipping Data", desc: "Live supplier prices and stock info — no fake numbers" },
    { icon: "🤖", title: "AI Decision Score", desc: "0-100 score for every product — sell or skip?" },
    { icon: "📦", title: "All-in-One Platform", desc: "Analysis, content creation, risk score — one platform" },
    { icon: "⚡", title: "Results in Seconds", desc: "Enter product name, get decision score and profit margin in 3 seconds" },
    { icon: "💰", title: "Best Value", desc: "$9/mo — full-featured professional tool" },
    { icon: "🌍", title: "TR & Global Support", desc: "Turkish/English/French — ready for any market" },
  ];

  const whyTitle = locale === "tr" ? "Neden KHELL AI?" : locale === "fr" ? "Pourquoi KHELL AI ?" : "Why KHELL AI?";
  const whySubtitle = locale === "tr" ? "Sadece Analiz Değil — Karar" : locale === "fr" ? "Pas seulement l'analyse — la décision" : "Not Just Analysis — Decisions";
  const whyDesc = locale === "tr"
    ? "KHELL AI sana sayı değil, karar verir. Ürünü sat mı satma mı — saniyeler içinde."
    : locale === "fr"
    ? "KHELL AI ne vous donne pas que des chiffres — il vous donne des décisions. Vendre ou passer — en secondes."
    : "KHELL AI doesn't just give you numbers — it gives you decisions. Sell or skip — in seconds.";

  const langBannerText = locale === "tr"
    ? "🌍 KHELL AI artık Türkçe, İngilizce ve Fransızca destekliyor — dil değiştirmek için sağ üstteki butona tıklayın"
    : locale === "fr"
    ? "🌍 KHELL AI est disponible en français, anglais et turc — cliquez sur le bouton en haut à droite pour changer de langue"
    : "🌍 KHELL AI is now available in English, French and Turkish — click the button in the top right to switch languages";

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <SEO
        title={isTr ? "KHELL AI — Kazanan Ürünü Bul, AI ile Analiz Et" : isFr ? "KHELL AI — Trouvez des produits gagnants, analysez avec l'IA" : "KHELL AI — Find Winning Products, Analyze with AI"}
        description={isTr
          ? "AI destekli dropshipping analiz platformu. Gerçek CJ Dropshipping verileriyle kazanan ürünleri bul, kâr ve risk skorunu saniyeler içinde gör."
          : isFr
          ? "Plateforme d'analyse dropshipping IA. Trouvez des produits gagnants avec les vraies données CJ Dropshipping."
          : "AI-powered dropshipping analytics platform. Find winning products with real CJ Dropshipping data and instant profit & risk scores."}
      />

      <div className="sticky top-0 z-50 bg-background">
        {/* Dil İlanı Banner */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-2 py-2 px-4 text-center"
          style={{ background: "linear-gradient(90deg, hsl(271 91% 60% / 0.15), hsl(217 91% 60% / 0.15))", borderBottom: "1px solid hsl(271 91% 60% / 0.2)" }}
        >
          <p className="text-[11px] font-medium" style={{ color: "hsl(271 91% 75%)" }}>
            {langBannerText}
          </p>
          <div className="flex gap-1 shrink-0">
            {(["tr", "en", "fr"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLocale(l)}
                className="text-[10px] font-bold px-2 py-0.5 rounded-md transition-all"
                style={{
                  background: locale === l ? "hsl(271 91% 60% / 0.3)" : "transparent",
                  color: locale === l ? "hsl(271 91% 80%)" : "hsl(215 20% 55%)",
                  border: `1px solid ${locale === l ? "hsl(271 91% 60% / 0.5)" : "transparent"}`,
                }}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </motion.div>

        {/* CJ Entegrasyon Banner */}
        <div className="flex items-center justify-center gap-2 bg-primary/10 border-b border-primary/20 py-1.5 px-4">
          <Package className="h-3 w-3 text-primary shrink-0" />
          <p className="text-[11px] text-primary font-medium">
            {isTr ? "CJdropshipping ile entegre — gerçek zamanlı ürün verisi aktif" : isFr ? "Intégré avec CJdropshipping — données produit en temps réel actives" : "Integrated with CJdropshipping — real-time product data active"}
          </p>
          <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse shrink-0" />
        </div>

        {/* Nav */}
        <nav className="border-b border-border bg-background/80 backdrop-blur-md">
          <div className="container mx-auto flex h-16 items-center justify-between px-3 sm:px-6 gap-2">
            <div className="flex items-center gap-1.5 sm:gap-3">
              <BackButton />
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
                <Zap className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-sm sm:text-lg font-bold text-foreground tracking-tight whitespace-nowrap">KHELL AI</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
              <button
                onClick={() => setLocale(locale === "tr" ? "en" : locale === "en" ? "fr" : "tr")}
                className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg text-[11px] sm:text-xs font-medium border border-border bg-card hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
              >
                <Globe className="h-3.5 w-3.5" />
                <span className="hidden xs:inline">{locale === "tr" ? "TR" : locale === "en" ? "EN" : "FR"}</span>
              </button>
              <button onClick={() => navigate("/auth")} className="btn-ghost text-xs sm:text-sm py-1.5 px-2 sm:py-2 sm:px-4 whitespace-nowrap">
                {t("landing.login")}
              </button>
              <button onClick={() => navigate("/dashboard/analyzer")} className="btn-primary text-xs sm:text-sm py-1.5 px-2 sm:py-2 sm:px-4 whitespace-nowrap">
                {t("landing.start")}
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* Hero */}
      <section className="relative pt-12 sm:pt-16 pb-20 px-6">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
          {/* KHELL AI Arc Reactor Core */}
          <div className="absolute top-[24%] left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.6]">
            <svg width="330" height="330" viewBox="0 0 480 480" className="max-w-[60vw]">
              <defs>
                <radialGradient id="arGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#d9f9e5" stopOpacity="0.7" />
                  <stop offset="30%" stopColor="#4ade80" stopOpacity="0.3" />
                  <stop offset="65%" stopColor="#a855f7" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#6d28d9" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="arCore" cx="50%" cy="50%" r="55%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="30%" stopColor="#fde68a" />
                  <stop offset="60%" stopColor="#4ade80" />
                  <stop offset="100%" stopColor="#a855f7" />
                </radialGradient>
                <linearGradient id="arCopper" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#fbbf7a" />
                  <stop offset="50%" stopColor="#c2703c" />
                  <stop offset="100%" stopColor="#7c3f1d" />
                </linearGradient>
                <linearGradient id="arRing" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7c3aed" />
                  <stop offset="45%" stopColor="#2a6a5a" />
                  <stop offset="100%" stopColor="#1e1b3a" />
                </linearGradient>
                <linearGradient id="arTri" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="30%" stopColor="#22d3ee" />
                  <stop offset="55%" stopColor="#4ade80" />
                  <stop offset="78%" stopColor="#facc15" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
              <circle cx="240" cy="240" r="230" fill="url(#arGlow)" />
              <g transform="translate(240,240)">
                <circle r="185" fill="none" stroke="url(#arRing)" strokeWidth="18" />
                <g>
                  <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="40s" repeatCount="indefinite" />
                  <g transform="rotate(0)"><rect x="-16" y="-172" width="32" height="52" rx="5" fill="#1e293b" stroke="#334155" strokeWidth="1"/><rect x="-13" y="-168" width="26" height="44" rx="3" fill="url(#arCopper)"/><line x1="-13" y1="-160" x2="13" y2="-160" stroke="#7c3f1d" strokeWidth="0.8"/><line x1="-13" y1="-152" x2="13" y2="-152" stroke="#7c3f1d" strokeWidth="0.8"/><line x1="-13" y1="-144" x2="13" y2="-144" stroke="#7c3f1d" strokeWidth="0.8"/><line x1="-13" y1="-136" x2="13" y2="-136" stroke="#7c3f1d" strokeWidth="0.8"/></g>
                  <g transform="rotate(30)"><rect x="-16" y="-172" width="32" height="52" rx="5" fill="#1e293b" stroke="#334155" strokeWidth="1"/><rect x="-13" y="-168" width="26" height="44" rx="3" fill="url(#arCopper)"/><line x1="-13" y1="-160" x2="13" y2="-160" stroke="#7c3f1d" strokeWidth="0.8"/><line x1="-13" y1="-152" x2="13" y2="-152" stroke="#7c3f1d" strokeWidth="0.8"/><line x1="-13" y1="-144" x2="13" y2="-144" stroke="#7c3f1d" strokeWidth="0.8"/><line x1="-13" y1="-136" x2="13" y2="-136" stroke="#7c3f1d" strokeWidth="0.8"/></g>
                  <g transform="rotate(60)"><rect x="-16" y="-172" width="32" height="52" rx="5" fill="#1e293b" stroke="#334155" strokeWidth="1"/><rect x="-13" y="-168" width="26" height="44" rx="3" fill="url(#arCopper)"/><line x1="-13" y1="-160" x2="13" y2="-160" stroke="#7c3f1d" strokeWidth="0.8"/><line x1="-13" y1="-152" x2="13" y2="-152" stroke="#7c3f1d" strokeWidth="0.8"/><line x1="-13" y1="-144" x2="13" y2="-144" stroke="#7c3f1d" strokeWidth="0.8"/><line x1="-13" y1="-136" x2="13" y2="-136" stroke="#7c3f1d" strokeWidth="0.8"/></g>
                  <g transform="rotate(90)"><rect x="-16" y="-172" width="32" height="52" rx="5" fill="#1e293b" stroke="#334155" strokeWidth="1"/><rect x="-13" y="-168" width="26" height="44" rx="3" fill="url(#arCopper)"/><line x1="-13" y1="-160" x2="13" y2="-160" stroke="#7c3f1d" strokeWidth="0.8"/><line x1="-13" y1="-152" x2="13" y2="-152" stroke="#7c3f1d" strokeWidth="0.8"/><line x1="-13" y1="-144" x2="13" y2="-144" stroke="#7c3f1d" strokeWidth="0.8"/><line x1="-13" y1="-136" x2="13" y2="-136" stroke="#7c3f1d" strokeWidth="0.8"/></g>
                  <g transform="rotate(120)"><rect x="-16" y="-172" width="32" height="52" rx="5" fill="#1e293b" stroke="#334155" strokeWidth="1"/><rect x="-13" y="-168" width="26" height="44" rx="3" fill="url(#arCopper)"/><line x1="-13" y1="-160" x2="13" y2="-160" stroke="#7c3f1d" strokeWidth="0.8"/><line x1="-13" y1="-152" x2="13" y2="-152" stroke="#7c3f1d" strokeWidth="0.8"/><line x1="-13" y1="-144" x2="13" y2="-144" stroke="#7c3f1d" strokeWidth="0.8"/><line x1="-13" y1="-136" x2="13" y2="-136" stroke="#7c3f1d" strokeWidth="0.8"/></g>
                  <g transform="rotate(150)"><rect x="-16" y="-172" width="32" height="52" rx="5" fill="#1e293b" stroke="#334155" strokeWidth="1"/><rect x="-13" y="-168" width="26" height="44" rx="3" fill="url(#arCopper)"/><line x1="-13" y1="-160" x2="13" y2="-160" stroke="#7c3f1d" strokeWidth="0.8"/><line x1="-13" y1="-152" x2="13" y2="-152" stroke="#7c3f1d" strokeWidth="0.8"/><line x1="-13" y1="-144" x2="13" y2="-144" stroke="#7c3f1d" strokeWidth="0.8"/><line x1="-13" y1="-136" x2="13" y2="-136" stroke="#7c3f1d" strokeWidth="0.8"/></g>
                  <g transform="rotate(180)"><rect x="-16" y="-172" width="32" height="52" rx="5" fill="#1e293b" stroke="#334155" strokeWidth="1"/><rect x="-13" y="-168" width="26" height="44" rx="3" fill="url(#arCopper)"/><line x1="-13" y1="-160" x2="13" y2="-160" stroke="#7c3f1d" strokeWidth="0.8"/><line x1="-13" y1="-152" x2="13" y2="-152" stroke="#7c3f1d" strokeWidth="0.8"/><line x1="-13" y1="-144" x2="13" y2="-144" stroke="#7c3f1d" strokeWidth="0.8"/><line x1="-13" y1="-136" x2="13" y2="-136" stroke="#7c3f1d" strokeWidth="0.8"/></g>
                  <g transform="rotate(210)"><rect x="-16" y="-172" width="32" height="52" rx="5" fill="#1e293b" stroke="#334155" strokeWidth="1"/><rect x="-13" y="-168" width="26" height="44" rx="3" fill="url(#arCopper)"/><line x1="-13" y1="-160" x2="13" y2="-160" stroke="#7c3f1d" strokeWidth="0.8"/><line x1="-13" y1="-152" x2="13" y2="-152" stroke="#7c3f1d" strokeWidth="0.8"/><line x1="-13" y1="-144" x2="13" y2="-144" stroke="#7c3f1d" strokeWidth="0.8"/><line x1="-13" y1="-136" x2="13" y2="-136" stroke="#7c3f1d" strokeWidth="0.8"/></g>
                  <g transform="rotate(240)"><rect x="-16" y="-172" width="32" height="52" rx="5" fill="#1e293b" stroke="#334155" strokeWidth="1"/><rect x="-13" y="-168" width="26" height="44" rx="3" fill="url(#arCopper)"/><line x1="-13" y1="-160" x2="13" y2="-160" stroke="#7c3f1d" strokeWidth="0.8"/><line x1="-13" y1="-152" x2="13" y2="-152" stroke="#7c3f1d" strokeWidth="0.8"/><line x1="-13" y1="-144" x2="13" y2="-144" stroke="#7c3f1d" strokeWidth="0.8"/><line x1="-13" y1="-136" x2="13" y2="-136" stroke="#7c3f1d" strokeWidth="0.8"/></g>
                  <g transform="rotate(270)"><rect x="-16" y="-172" width="32" height="52" rx="5" fill="#1e293b" stroke="#334155" strokeWidth="1"/><rect x="-13" y="-168" width="26" height="44" rx="3" fill="url(#arCopper)"/><line x1="-13" y1="-160" x2="13" y2="-160" stroke="#7c3f1d" strokeWidth="0.8"/><line x1="-13" y1="-152" x2="13" y2="-152" stroke="#7c3f1d" strokeWidth="0.8"/><line x1="-13" y1="-144" x2="13" y2="-144" stroke="#7c3f1d" strokeWidth="0.8"/><line x1="-13" y1="-136" x2="13" y2="-136" stroke="#7c3f1d" strokeWidth="0.8"/></g>
                  <g transform="rotate(300)"><rect x="-16" y="-172" width="32" height="52" rx="5" fill="#1e293b" stroke="#334155" strokeWidth="1"/><rect x="-13" y="-168" width="26" height="44" rx="3" fill="url(#arCopper)"/><line x1="-13" y1="-160" x2="13" y2="-160" stroke="#7c3f1d" strokeWidth="0.8"/><line x1="-13" y1="-152" x2="13" y2="-152" stroke="#7c3f1d" strokeWidth="0.8"/><line x1="-13" y1="-144" x2="13" y2="-144" stroke="#7c3f1d" strokeWidth="0.8"/><line x1="-13" y1="-136" x2="13" y2="-136" stroke="#7c3f1d" strokeWidth="0.8"/></g>
                  <g transform="rotate(330)"><rect x="-16" y="-172" width="32" height="52" rx="5" fill="#1e293b" stroke="#334155" strokeWidth="1"/><rect x="-13" y="-168" width="26" height="44" rx="3" fill="url(#arCopper)"/><line x1="-13" y1="-160" x2="13" y2="-160" stroke="#7c3f1d" strokeWidth="0.8"/><line x1="-13" y1="-152" x2="13" y2="-152" stroke="#7c3f1d" strokeWidth="0.8"/><line x1="-13" y1="-144" x2="13" y2="-144" stroke="#7c3f1d" strokeWidth="0.8"/><line x1="-13" y1="-136" x2="13" y2="-136" stroke="#7c3f1d" strokeWidth="0.8"/></g>
                </g>
                <circle r="118" fill="none" stroke="#3b2a5a" strokeWidth="8" />
                <circle r="118" fill="#0f0820" />
                <circle r="95" fill="none" stroke="#4ade80" strokeWidth="1.5" strokeOpacity="0.55">
                  <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="22s" repeatCount="indefinite" />
                </circle>
                <circle r="78" fill="#0b1220" />
                <circle r="78" fill="url(#arGlow)" />
                <polygon points="0,-64 56,32 -56,32" fill="none" stroke="url(#arTri)" strokeWidth="10" strokeLinejoin="round" opacity="1">
                  <animate attributeName="opacity" values="0.75;1;0.75" dur="3s" repeatCount="indefinite" />
                </polygon>
                <polygon points="0,-46 40,23 -40,23" fill="url(#arCore)" stroke="#ffffff" strokeWidth="1.5">
                  <animate attributeName="opacity" values="0.85;1;0.85" dur="2.4s" repeatCount="indefinite" />
                </polygon>
                <circle r="11" fill="#fdf4ff">
                  <animate attributeName="r" values="9;13;9" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle r="118" fill="#ffffff">
                  <animate attributeName="opacity" values="0;0;0;1;0.15;1;0;0;0" keyTimes="0;0.7;0.74;0.75;0.78;0.8;0.84;0.9;1" dur="4.5s" repeatCount="indefinite" />
                </circle>
                <circle r="72" fill="#dbeafe">
                  <animate attributeName="opacity" values="0;0;0;1;0.3;1;0" keyTimes="0;0.7;0.745;0.75;0.79;0.8;0.88" dur="4.5s" repeatCount="indefinite" />
                </circle>
                <circle fill="none" stroke="#ffffff" strokeWidth="8">
                  <animate attributeName="r" values="40;185" keyTimes="0;1" dur="4.5s" begin="0s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0;0;1;0" keyTimes="0;0.75;0.76;0.86" dur="4.5s" repeatCount="indefinite" />
                  <animate attributeName="stroke-width" values="10;0.5" keyTimes="0;1" dur="4.5s" repeatCount="indefinite" />
                </circle>
              </g>
            </svg>
          </div>
        </div>
        <div className="container mx-auto relative z-10">
          <motion.div variants={stagger} initial="hidden" animate="visible" className="text-center max-w-4xl mx-auto">
            <motion.div variants={fadeUp} className="mb-6 flex flex-wrap items-center justify-center gap-2.5">
              <motion.a
                href="/dashboard/ebay"
                animate={{
                  boxShadow: [
                    "0 0 12px hsl(217 91% 60% / 0.4)",
                    "0 0 28px hsl(217 91% 60% / 0.75)",
                    "0 0 12px hsl(217 91% 60% / 0.4)",
                  ],
                }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-black uppercase tracking-wide text-white hover:scale-105 transition-transform"
                style={{ background: "linear-gradient(135deg, hsl(217 91% 60%), hsl(224 76% 48%))" }}
              >
                <ShoppingBag className="h-3.5 w-3.5" />
                {isTr ? "🔥 Gerçek Zamanlı eBay Verisi" : isFr ? "🔥 Données eBay en temps réel" : "🔥 Real-Time eBay Data"}
              </motion.a>

              <motion.a
                href="/dashboard/analyzer"
                animate={{
                  boxShadow: [
                    "0 0 12px hsl(45 93% 55% / 0.4)",
                    "0 0 28px hsl(45 93% 55% / 0.75)",
                    "0 0 12px hsl(45 93% 55% / 0.4)",
                  ],
                }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-black uppercase tracking-wide text-black hover:scale-105 transition-transform"
                style={{ background: "linear-gradient(135deg, hsl(45 93% 58%), hsl(38 92% 52%))" }}
              >
                <Radio className="h-3.5 w-3.5" />
                {isTr ? "⚡ 5 Dakikada Bir Yenilenen Gerçek CJ Verisi" : isFr ? "⚡ Vraies données CJ actualisées toutes les 5 minutes" : "⚡ Real CJ Data Refreshed Every 5 Minutes"}
              </motion.a>
            </motion.div>

            <motion.h1 variants={fadeUp} className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">
              <span className="bg-gradient-to-b from-foreground to-muted-foreground bg-clip-text text-transparent">
                {t("landing.heroTitle")}
              </span>
            </motion.h1>

            <motion.p variants={fadeUp} className="text-lg md:text-xl text-muted-foreground mb-6 tracking-tight">
              {t("landing.heroSubtext")}
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-2.5 mb-8">
              {[
                isTr ? "Ücretsiz Başla" : isFr ? "Commencez Gratuitement" : "Start Free",
                isTr ? "Kredi Kartı Gerekmez" : isFr ? "Aucune Carte Requise" : "No Credit Card",
                isTr ? "Google ile 10 Saniyede" : isFr ? "Google en 10 Secondes" : "Google in 10 Seconds",
              ].map((txt, i) => (
                <span key={i}
                  className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-foreground"
                  style={{ background: "hsl(142 71% 45% / 0.12)", border: "1px solid hsl(142 71% 45% / 0.35)" }}>
                  <Check className="h-4 w-4 text-winning shrink-0" strokeWidth={3} />
                  {txt}
                </span>
              ))}
            </motion.div>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-3">
              <button onClick={() => navigate("/dashboard/analyzer")} className="btn-primary text-base px-8 py-3">
                {t("landing.cta")}
              </button>
              <button
                onClick={() => navigate("/dashboard/content-engine")}
                className="group relative text-base px-8 py-3 rounded-xl font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-[1.03]"
                style={{
                  background: "linear-gradient(160deg, hsl(217 91% 60% / 0.15), hsl(224 76% 48% / 0.08))",
                  backdropFilter: "blur(10px)",
                  border: "1px solid hsl(217 91% 65% / 0.4)",
                  boxShadow: "0 0 20px hsl(217 91% 60% / 0.25), inset 0 1px 0 hsl(0 0% 100% / 0.1)",
                }}
              >
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                  style={{ background: "linear-gradient(90deg, transparent, hsl(0 0% 100% / 0.15), transparent)" }} />
                <span className="relative flex items-center justify-center">
                  <Video className="h-4 w-4 mr-2" />
                  {t("landing.ctaVideo")}
                </span>
              </button>
            </motion.div>

            <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 mb-2 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1"><Check className="h-3 w-3 text-winning" /> {isTr ? "Sürekli geliştiriliyor" : isFr ? "Amélioré en continu" : "Continuously improved"}</span>
              <span className="flex items-center gap-1"><Check className="h-3 w-3 text-winning" /> {isTr ? "Gerçek ürün verisi" : isFr ? "Vraies données produit" : "Real product data"}</span>
              <span className="flex items-center gap-1"><Check className="h-3 w-3 text-winning" /> {isTr ? "Topluluk geri bildirimiyle" : isFr ? "Avec les retours de la communauté" : "Built with community feedback"}</span>
            </motion.div>

            <motion.div variants={fadeUp} className="flex justify-center mb-8">
              <button onClick={() => navigate("/dashboard/analyzer")} className="text-xs text-primary/80 hover:text-primary underline underline-offset-2 transition-colors">
                {isTr ? "veya kayıt olmadan hızlıca dene →" : isFr ? "ou essayez sans inscription →" : "or try without signing up →"}
              </button>
            </motion.div>

            <motion.div variants={fadeUp} className="mb-10">
              <LiveTeaserAnalyzer isTr={isTr} />
            </motion.div>

            <motion.div variants={fadeUp} className="relative mx-auto max-w-3xl">
              <div className="relative rounded-2xl overflow-hidden p-8 sm:p-10"
                style={{
                  background: "linear-gradient(160deg, hsl(222 47% 7% / 0.85), hsl(222 47% 4% / 0.95))",
                  backdropFilter: "blur(16px)",
                  border: "1px solid hsl(217 60% 70% / 0.18)",
                  boxShadow: "0 0 70px hsl(217 91% 60% / 0.12)",
                }}
              >
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-1">
                  <span style={{ background: "linear-gradient(90deg, hsl(217 91% 60%), hsl(166 76% 50%), hsl(48 96% 55%))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    KHELL AI
                  </span>
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground mb-5">
                  <span style={{ color: "hsl(215 20% 75%)" }}>
                    {isTr ? "Ürün senden, " : isFr ? "Votre produit, " : "Your product, "}
                  </span>
                  <span style={{ color: "hsl(142 71% 55%)", fontWeight: 700 }}>
                    {isTr ? "analiz Khell'den." : isFr ? "l'analyse de KHELL." : "KHELL's analysis."}
                  </span>
                </p>

                <div className="grid grid-cols-2 gap-2 mb-6 max-w-md">
                  {[
                    { label: isTr ? "AI Destekli Analiz" : isFr ? "Analyse IA" : "AI-Powered Analysis", color: "hsl(199 89% 60%)" },
                    { label: isTr ? "Gerçek CJ Verileri" : isFr ? "Vraies données CJ" : "Real CJ Data", color: "hsl(142 71% 50%)" },
                    { label: isTr ? "Kâr & Risk Skoru" : isFr ? "Score Profit & Risque" : "Profit & Risk Score", color: "hsl(38 92% 55%)" },
                    { label: isTr ? "Canlı Trend Takibi" : isFr ? "Suivi des tendances" : "Live Trend Tracking", color: "hsl(24 95% 58%)" },
                  ].map((b) => (
                    <span key={b.label} className="text-[11px] font-semibold px-2.5 py-1.5 rounded-lg text-center"
                      style={{ background: `${b.color}1a`, color: b.color, border: `1px solid ${b.color}40` }}>
                      {b.label}
                    </span>
                  ))}
                </div>

                <div className="h-[380px] max-w-md mx-auto">
                  <ProductRevealDemo />
                </div>
              </div>
            </motion.div>

            {/* Early Access + Topluluk kartları */}
            <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto mt-6">
              <div className="rounded-2xl p-5 text-left"
                style={{ background: "linear-gradient(160deg, hsl(217 91% 60% / 0.1), hsl(222 47% 6% / 0.8))", backdropFilter: "blur(12px)", border: "1px solid hsl(217 91% 60% / 0.28)" }}>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-lg">🚀</span>
                  <h3 className="text-sm font-bold text-white">{isTr ? "Erken Erişim" : isFr ? "Accès Anticipé" : "Early Access"}</h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {isTr ? "KHELL AI sürekli gelişiyor. Erken katıl, erken fiyat avantajından yararlan ve geri bildirimlerinle platformun geleceğini birlikte şekillendir." : isFr ? "KHELL AI évolue en continu. Rejoignez tôt, profitez du tarif de lancement et façonnez l'avenir de la plateforme." : "KHELL AI is continuously evolving. Join early, benefit from early pricing, and help shape the future with your feedback."}
                </p>
              </div>
              <div className="rounded-2xl p-5 text-left"
                style={{ background: "linear-gradient(160deg, hsl(142 71% 45% / 0.1), hsl(222 47% 6% / 0.8))", backdropFilter: "blur(12px)", border: "1px solid hsl(142 71% 45% / 0.28)" }}>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-lg">💡</span>
                  <h3 className="text-sm font-bold text-white">{isTr ? "KHELL AI'ı Birlikte Büyütelim" : isFr ? "Construisons KHELL AI Ensemble" : "Build KHELL AI Together"}</h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {isTr ? "Fikirlerin bizim için değerli. Her öneri tek tek incelenir ve KHELL AI'ı herkes için daha iyi hale getirmemize yardım eder." : isFr ? "Vos idées comptent. Chaque suggestion est examinée et aide à améliorer KHELL AI pour tous." : "Your ideas matter. Every suggestion is reviewed and helps improve KHELL AI for everyone."}
                </p>
              </div>
            </motion.div>

            {/* Gerçek istatistikler için hazır component — veri gelince STATS_READY=true yap */}
            {(() => {
              const STATS_READY = false;
              const stats = { analyses: 0, users: 0, countries: 0, premium: 0 };
              if (!STATS_READY) return null;
              return (
                <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-6 max-w-3xl mx-auto mt-6 py-4 rounded-2xl"
                  style={{ background: "hsl(222 47% 6% / 0.6)", border: "1px solid hsl(217 32% 17%)" }}>
                  {[
                    { icon: "⭐", val: stats.analyses, label: isTr ? "Ürün Analizi" : "Analyses" },
                    { icon: "🔥", val: stats.users, label: isTr ? "Aktif Kullanıcı" : "Active Users" },
                    { icon: "🌍", val: stats.countries, label: isTr ? "Ülke" : "Countries" },
                    { icon: "💎", val: stats.premium, label: isTr ? "Pro Üye" : "Pro Members" },
                  ].map((s2) => (
                    <div key={s2.label} className="text-center">
                      <p className="text-xl font-black text-white">{s2.icon} {s2.val.toLocaleString()}</p>
                      <p className="text-[10px] text-muted-foreground">{s2.label}</p>
                    </div>
                  ))}
                </motion.div>
              );
            })()}
          </motion.div>
        </div>
      </section>

      {/* Feature Showcase */}
      <section className="py-16 px-6">
        <div className="container mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-6">
            <h2 className="text-xl font-bold text-foreground">
              {isTr ? "Gerçek Entegrasyonlar, Gerçek Veri" : isFr ? "Vraies intégrations, vraies données" : "Real Integrations, Real Data"}
            </h2>
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
              <p className="text-lg font-bold text-foreground">
                {isTr ? '"Bu herkes için değil."' : isFr ? '"Ce n\'est pas pour tout le monde."' : '"This is not for everyone."'}
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <Copy className="h-3.5 w-3.5 text-primary" /> {isTr ? "Açıklama" : isFr ? "Légende" : "Caption"}
              </div>
              <p className="text-sm text-foreground">
                {isTr ? '"Bu tasarımı sadece birkaç kişi anlıyor."' : isFr ? '"Seules quelques personnes comprennent ce design."' : '"Only a few people understand this design."'}
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <Hash className="h-3.5 w-3.5 text-primary" /> Hashtags
              </div>
              <div className="flex flex-wrap gap-2">
                {["#viral", "#tiktokshop", "#dropshipping", "#fyp", "#trending"].map((tag) => (
                  <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">{tag}</span>
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
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05, ...transition }} whileHover={{ y: -4 }} className="card-glow rounded-xl p-6 cursor-default">
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

      {/* Features Banner */}
      <section className="py-12 px-6">
        <div className="container mx-auto max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-xl overflow-hidden border border-border shadow-2xl">
            <img src="/features-section.png" alt="KHELL AI features" className="w-full h-auto" loading="lazy" />
          </motion.div>
        </div>
      </section>

      {/* Why KHELL AI */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4"
              style={{ background: "hsl(142 71% 45% / 0.12)", border: "1px solid hsl(142 71% 45% / 0.35)", color: "hsl(142 71% 55%)" }}>
              <Star className="h-3 w-3" />
              {whyTitle}
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-3">{whySubtitle}</h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm">{whyDesc}</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {whyKhell.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05, ...transition }}
                className="rounded-xl p-5"
                style={{ background: "hsl(222 47% 8%)", border: "1px solid hsl(217 32% 17%)" }}>
                <div className="text-2xl mb-3">{item.icon}</div>
                <h4 className="text-sm font-bold text-white mb-1">{item.title}</h4>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
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
                {isTr ? "🚀 İlk 100 kullanıcıya 1 ay ücretsiz Pro" : isFr ? "🚀 1 mois Pro gratuit pour les 100 premiers utilisateurs" : "🚀 First 100 users get 1 month of Pro free"}
              </span>
              <span className="text-muted-foreground">
                {isTr ? "— kod: " : isFr ? "— code : " : "— code: "}
                <span className="font-mono font-bold text-foreground">LAUNCH100</span>
              </span>
            </div>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan, i) => (
              <motion.div key={plan.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, ...transition }}
                className={`card-glow rounded-xl p-8 relative ${plan.popular ? "ring-2 ring-primary" : ""}`}>
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-full">
                    {t("landing.popular")}
                  </span>
                )}
                <h3 className="text-lg font-bold text-foreground mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold font-mono text-foreground">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">{plan.period}</span>
                  {plan.popular && (
                    <div className="mt-2">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full"
                        style={{ background: "hsl(38 92% 50% / 0.15)", color: "hsl(38 92% 60%)", border: "1px solid hsl(38 92% 50% / 0.35)" }}>
                        🎁 {isTr ? "Erken Erişim Fiyatı" : isFr ? "Tarif Accès Anticipé" : "Early Access Pricing"}
                      </span>
                    </div>
                  )}
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
                  <a href={plan.href} target="_blank" rel="noopener noreferrer" className="block w-full py-3 rounded-lg font-semibold text-sm text-center transition-all btn-primary">
                    {plan.cta}
                  </a>
                ) : plan.whatsapp ? (
                  <a href={plan.whatsapp} target="_blank" rel="noopener noreferrer" className="block w-full py-3 rounded-lg font-semibold text-sm text-center transition-all btn-ghost">
                    {plan.cta}
                  </a>
                ) : (
                  <button onClick={() => navigate("/dashboard/analyzer")} className="w-full py-3 rounded-lg font-semibold text-sm transition-all btn-ghost">
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
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="card-glow rounded-2xl p-12 text-center max-w-3xl mx-auto">
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
      <footer className="border-t border-border pt-10 pb-8 px-6">
        <div className="container mx-auto max-w-5xl">
          {/* Topluluk mesajı */}
          <div className="text-center mb-10 pb-8 border-b border-border">
            <p className="text-sm text-muted-foreground">
              <span className="text-primary">💙</span>{" "}
              {isTr ? "KHELL AI sürekli gelişiyor — her güncelleme gerçek kullanıcı geri bildirimiyle şekilleniyor." : isFr ? "KHELL AI évolue en continu — chaque mise à jour est façonnée par les retours réels des utilisateurs." : "KHELL AI is continuously evolving — every update is shaped by real user feedback."}
            </p>
            <a href="https://wa.me/905446452430?text=KHELL%20AI%20için%20bir%20önerim%20var" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-3 text-xs font-semibold text-primary hover:gap-2.5 transition-all">
              <MessageCircle className="h-3.5 w-3.5" />
              {isTr ? "Bir öneride bulun" : isFr ? "Suggérer une fonctionnalité" : "Suggest a feature"}
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
                  <Zap className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="text-base font-bold text-foreground">KHELL AI</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {isTr ? "Modern dropshipper'lar için geliştirilen AI destekli ürün araştırma platformu. Gerçek zamanlı pazar verileriyle kârlı ürünleri keşfet." : isFr ? "Plateforme de recherche produit IA pour dropshippers modernes. Découvrez des produits rentables avec des données de marché en temps réel." : "AI-powered product research platform built for modern dropshippers. Discover profitable products with real-time market intelligence."}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-foreground mb-3 uppercase tracking-wide">{isTr ? "Platform" : "Platform"}</h4>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li><button onClick={() => navigate("/dashboard")} className="hover:text-primary hover:translate-x-0.5 transition-all">{isTr ? "Panel" : "Dashboard"}</button></li>
                <li><button onClick={() => navigate("/dashboard/analyzer")} className="hover:text-primary hover:translate-x-0.5 transition-all">{isTr ? "Ürün Analizi" : "Product Analysis"}</button></li>
                <li><button onClick={() => navigate("/dashboard/ebay")} className="hover:text-primary hover:translate-x-0.5 transition-all">{isTr ? "eBay Araştırma" : "eBay Research"}</button></li>
                <li><button onClick={() => navigate("/dashboard/winning")} className="hover:text-primary hover:translate-x-0.5 transition-all">{isTr ? "Kazanan Ürünler" : "Winning Products"}</button></li>
                <li><button onClick={() => navigate("/dashboard/content-engine")} className="hover:text-primary hover:translate-x-0.5 transition-all">{isTr ? "İçerik Motoru" : "Content Engine"}</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-foreground mb-3 uppercase tracking-wide">{isTr ? "Yasal" : "Legal"}</h4>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li><button onClick={() => navigate("/privacy")} className="hover:text-primary hover:translate-x-0.5 transition-all">{isTr ? "Gizlilik Politikası" : "Privacy Policy"}</button></li>
                <li><button onClick={() => navigate("/terms")} className="hover:text-primary hover:translate-x-0.5 transition-all">{isTr ? "Kullanım Şartları" : "Terms of Service"}</button></li>
                <li><button onClick={() => navigate("/refund")} className="hover:text-primary hover:translate-x-0.5 transition-all">{isTr ? "İade ve Teslimat" : "Refund & Delivery"}</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-foreground mb-3 uppercase tracking-wide">{isTr ? "İletişim" : "Contact"}</h4>
              <div className="space-y-2.5">
                <a href="mailto:bamir.global@gmail.com" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors group">
                  <span className="h-7 w-7 rounded-lg bg-card border border-border flex items-center justify-center group-hover:border-primary/50 transition-colors">
                    <Mail className="h-3.5 w-3.5" />
                  </span>
                  <span className="break-all">{isTr ? "E-posta" : "Email"}</span>
                </a>
                <a href="https://wa.me/905446452430" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors group">
                  <span className="h-7 w-7 rounded-lg bg-card border border-border flex items-center justify-center group-hover:border-primary/50 transition-colors">
                    <MessageCircle className="h-3.5 w-3.5" />
                  </span>
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <a href="https://bamir.store" target="_blank" rel="noopener noreferrer"
              className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors">
              {isTr ? "Bir " : "A "}<span className="font-semibold text-foreground/80">BAMIR Online Store</span>{isTr ? " prodüksiyonu" : " production"}
            </a>
            <p className="text-xs text-muted-foreground">© 2026 KHELL AI — Bamir Global</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
