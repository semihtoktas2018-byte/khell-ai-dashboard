import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useLocale } from "@/contexts/LocaleContext";
import SEO from "@/components/SEO";
import AnimatedChart from "@/components/AnimatedChart";
import {
  Zap, Search, BarChart3, DollarSign, Package, FileText, Sparkles,
  Rocket, PlayCircle, ShieldCheck, Clock, XCircle, Lock, ArrowRight, Check, ChevronDown,
} from "lucide-react";

// ============================================================
//  KHELL AI — Landing (mor tema)  ·  A BAMIR ONLINE STORE'S PRODUCTION
//  Dürüstlük kuralı: uydurma istatistik / sahte yorum YOK.
// ============================================================

type L = "tr" | "en" | "fr";

const T: Record<L, any> = {
  tr: {
    nav: ["Özellikler", "Fiyatlar", "Rehberler"],
    login: "Giriş Yap", tryFree: "Ücretsiz Dene",
    badge: "AI destekli ürün araştırma platformu",
    h1a: "Kazanan Ürünleri", h1b: "AI ile Bul, Hızla Büyü!",
    sub: "Ürününü tahminle değil rakamla seç: kâr marjını, riskini ve 0–100 karar skorunu saniyeler içinde gör.",
    checks: ["AI Destekli Analiz", "Rakip & Pazar Analizi", "Gerçek Zamanlı Veriler", "Tedarikçi Entegrasyonları", "Kâr & Risk Hesabı", "Adım Adım Strateji"],
    ctaStart: "Ücretsiz Başla", ctaDemo: "Aracı İncele",
    trust: ["Güvenli Ödeme", "İptal Kolay", "Kart Gerekmez", "0 Uydurma Rakam"],
    logosTitle: "Büyük pazaryerlerini analiz ediyoruz",
    featEyebrow: "Özellikler", featTitle: "KHELL AI ile Gücünü Katla",
    featSub: "Tek platformda ihtiyacın olan tüm araçlar. Daha akıllı analiz et, daha hızlı karar ver.",
    feats: [
      { t: "AI Ürün Analizi", d: "Ürünü gir; kâr, marj ve 0–100 karar skorunu anında dürüst rakamlarla gör." },
      { t: "Pazar & Rakip Analizi", d: "Rekabet düzeyini, pazar doygunluğunu ve fırsat skorunu gerçek veriyle ölç." },
      { t: "Kâr Hesaplama", d: "Komisyon, kargo, reklam ve KDV dahil net kârını doğru hesapla." },
      { t: "Tedarikçi Entegrasyonu", d: "CJ Dropshipping ve AliExpress fiyatlarını tek tıkla karşılaştır." },
      { t: "İçerik & Reklam Araçları", d: "Ürün sayfası, reklam metni ve rakip reklam analizini AI ile üret." },
      { t: "Kâr Simülatörü", d: "Adet kaydır, aylık kâr ve ciro projeksiyonunu canlı gör." },
    ],
    detail: "Detayları İncele",
    whyEyebrow: "Neden KHELL AI", whyTitle: "Dürüst veri, gerçek karar",
    why: [
      { t: "Gerçek Veri", d: "CJ + eBay + AliExpress canlı ürün verisi" },
      { t: "0 Uydurma Rakam", d: "Sahte istatistik yok, hesaplar dürüst" },
      { t: "3 Dil Desteği", d: "Türkçe · İngilizce · Fransızca" },
      { t: "Ücretsiz Başla", d: "Kart gerekmez, saniyeler içinde" },
    ],
    guidesEyebrow: "Rehberler", guidesTitle: "Sıfırdan öğren",
    guidesSub: "Dropshipping'e yeni başlıyorsan bu ücretsiz rehberler yol gösterir.",
    priceEyebrow: "Fiyatlar", priceTitle: "Basit, net fiyat", priceSub: "Ücretsiz başla, hazır olunca yükselt.",
    free: "Ücretsiz", pro: "Pro", popular: "En Popüler", perMonth: "/ay",
    freeList: ["Günde sınırlı analiz", "1 kazanan ürün önizleme", "Temel risk skoru"],
    proList: ["Sınırsız analiz", "Tüm kazanan & trend ürünler", "Reklam casusu + tedarikçi karşılaştırma", "Fiyat takibi & bildirimler"],
    goPro: "Pro'ya Geç",
    finalTitle: "İlk ürününü şimdi puanla", finalSub: "Tahminle değil, rakamla karar ver. Kayıt olmadan denemeye başla.",
    footTagline: "AI destekli ürün araştırma platformu. E-ticarette kazanan sen ol.",
    footPlatform: "Platform", footRes: "Kaynaklar", footLegal: "Yasal",
    footLinks1: ["Özellikler", "Fiyatlar", "Güncellemeler"],
    footLegalLinks: ["Gizlilik Politikası", "Kullanım Şartları", "İade ve Teslimat"],
    demoScore: "KHELL SKORU", demoProfit: "TAHMİNİ AYLIK KÂR", demoComp: "REKABET", demoDemand: "TALEP",
    demoLow: "Düşük", demoHigh: "Yüksek", demoNote: "Örnek analiz",
  },
  en: {
    nav: ["Features", "Pricing", "Guides"],
    login: "Log In", tryFree: "Try Free",
    badge: "AI-powered product research platform",
    h1a: "Find Winning Products", h1b: "with AI, Scale Fast!",
    sub: "Choose products by numbers, not guesswork: see profit margin, risk and a 0–100 decision score in seconds.",
    checks: ["AI-Powered Analysis", "Competitor & Market Analysis", "Real-Time Data", "Supplier Integrations", "Profit & Risk Math", "Step-by-Step Strategy"],
    ctaStart: "Start Free", ctaDemo: "Explore Tool",
    trust: ["Secure Payment", "Easy Cancel", "No Card Needed", "0 Fake Numbers"],
    logosTitle: "We analyze major marketplaces",
    featEyebrow: "Features", featTitle: "Multiply Your Power with KHELL AI",
    featSub: "Every tool you need in one platform. Analyze smarter, decide faster.",
    feats: [
      { t: "AI Product Analysis", d: "Enter a product; get honest profit, margin and a 0–100 decision score instantly." },
      { t: "Market & Competitor Analysis", d: "Measure competition, saturation and opportunity with real data." },
      { t: "Profit Calculation", d: "Compute net profit including commission, shipping, ads and VAT." },
      { t: "Supplier Integration", d: "Compare CJ Dropshipping and AliExpress prices in one click." },
      { t: "Content & Ad Tools", d: "Generate product pages, ad copy and competitor ad analysis with AI." },
      { t: "Profit Simulator", d: "Slide order volume, see monthly profit and revenue projection live." },
    ],
    detail: "Learn More",
    whyEyebrow: "Why KHELL AI", whyTitle: "Honest data, real decisions",
    why: [
      { t: "Real Data", d: "Live CJ + eBay + AliExpress product data" },
      { t: "0 Fake Numbers", d: "No fake stats, honest calculations" },
      { t: "3 Languages", d: "Turkish · English · French" },
      { t: "Start Free", d: "No card, ready in seconds" },
    ],
    guidesEyebrow: "Guides", guidesTitle: "Learn from scratch",
    guidesSub: "New to dropshipping? These free guides show you the way.",
    priceEyebrow: "Pricing", priceTitle: "Simple, clear pricing", priceSub: "Start free, upgrade when ready.",
    free: "Free", pro: "Pro", popular: "Most Popular", perMonth: "/mo",
    freeList: ["Limited daily analyses", "1 winning product preview", "Basic risk score"],
    proList: ["Unlimited analyses", "All winning & trending products", "Ad spy + supplier comparison", "Price tracking & alerts"],
    goPro: "Go Pro",
    finalTitle: "Score your first product now", finalSub: "Decide by numbers, not guesswork. Start without signing up.",
    footTagline: "AI-powered product research platform. Win in e-commerce.",
    footPlatform: "Platform", footRes: "Resources", footLegal: "Legal",
    footLinks1: ["Features", "Pricing", "Updates"],
    footLegalLinks: ["Privacy Policy", "Terms of Service", "Refund & Delivery"],
    demoScore: "KHELL SCORE", demoProfit: "EST. MONTHLY PROFIT", demoComp: "COMPETITION", demoDemand: "DEMAND",
    demoLow: "Low", demoHigh: "High", demoNote: "Sample analysis",
  },
  fr: {
    nav: ["Fonctions", "Tarifs", "Guides"],
    login: "Connexion", tryFree: "Essai Gratuit",
    badge: "Plateforme de recherche produit par IA",
    h1a: "Trouvez les Produits Gagnants", h1b: "avec l'IA, Grandissez Vite!",
    sub: "Choisissez par les chiffres, pas au hasard : marge, risque et score de décision 0–100 en secondes.",
    checks: ["Analyse par IA", "Analyse Concurrence & Marché", "Données en Temps Réel", "Intégrations Fournisseurs", "Calcul Profit & Risque", "Stratégie Pas à Pas"],
    ctaStart: "Commencer Gratuitement", ctaDemo: "Explorer l'Outil",
    trust: ["Paiement Sécurisé", "Annulation Facile", "Sans Carte", "0 Faux Chiffre"],
    logosTitle: "Nous analysons les grandes marketplaces",
    featEyebrow: "Fonctions", featTitle: "Multipliez votre force avec KHELL AI",
    featSub: "Tous les outils dont vous avez besoin sur une plateforme.",
    feats: [
      { t: "Analyse Produit IA", d: "Entrez un produit ; profit, marge et score de décision 0–100 instantanés." },
      { t: "Analyse Marché & Concurrence", d: "Mesurez concurrence, saturation et opportunité avec des données réelles." },
      { t: "Calcul de Profit", d: "Profit net incluant commission, livraison, pub et TVA." },
      { t: "Intégration Fournisseur", d: "Comparez CJ Dropshipping et AliExpress en un clic." },
      { t: "Outils Contenu & Pub", d: "Générez pages produit, textes pub et analyse concurrente par IA." },
      { t: "Simulateur de Profit", d: "Faites glisser le volume, voyez la projection mensuelle en direct." },
    ],
    detail: "En Savoir Plus",
    whyEyebrow: "Pourquoi KHELL AI", whyTitle: "Données honnêtes, vraies décisions",
    why: [
      { t: "Données Réelles", d: "Données produit CJ + eBay + AliExpress en direct" },
      { t: "0 Faux Chiffre", d: "Aucune fausse stat, calculs honnêtes" },
      { t: "3 Langues", d: "Turc · Anglais · Français" },
      { t: "Commencer Gratuitement", d: "Sans carte, en quelques secondes" },
    ],
    guidesEyebrow: "Guides", guidesTitle: "Apprenez de zéro",
    guidesSub: "Nouveau en dropshipping ? Ces guides gratuits vous guident.",
    priceEyebrow: "Tarifs", priceTitle: "Tarif simple et clair", priceSub: "Commencez gratuitement, passez au Pro quand vous êtes prêt.",
    free: "Gratuit", pro: "Pro", popular: "Le Plus Populaire", perMonth: "/mois",
    freeList: ["Analyses quotidiennes limitées", "1 aperçu produit gagnant", "Score de risque de base"],
    proList: ["Analyses illimitées", "Tous les produits gagnants & tendance", "Espion pub + comparaison fournisseur", "Suivi de prix & alertes"],
    goPro: "Passer au Pro",
    finalTitle: "Notez votre premier produit", finalSub: "Décidez par les chiffres. Commencez sans inscription.",
    footTagline: "Plateforme de recherche produit par IA.",
    footPlatform: "Plateforme", footRes: "Ressources", footLegal: "Légal",
    footLinks1: ["Fonctions", "Tarifs", "Mises à jour"],
    footLegalLinks: ["Confidentialité", "Conditions", "Remboursement & Livraison"],
    demoScore: "SCORE KHELL", demoProfit: "PROFIT MENSUEL EST.", demoComp: "CONCURRENCE", demoDemand: "DEMANDE",
    demoLow: "Faible", demoHigh: "Élevée", demoNote: "Analyse d'exemple",
  },
};

const GUIDES = [
  { to: "/rehber/dropshipping-nedir-nasil-yapilir", tr: "Dropshipping Nedir?", en: "What is Dropshipping?", fr: "Qu'est-ce que le Dropshipping ?" },
  { to: "/rehber/kazanan-urun-nasil-bulunur", tr: "Kazanan Ürün Nasıl Bulunur?", en: "How to Find Winning Products?", fr: "Trouver des Produits Gagnants" },
  { to: "/rehber/dropshipping-karli-mi", tr: "Dropshipping Kârlı mı?", en: "Is Dropshipping Profitable?", fr: "Le Dropshipping est-il Rentable ?" },
  { to: "/rehber/2026-trend-dropshipping-urunleri", tr: "2026 Trend Ürünler", en: "2026 Trending Products", fr: "Produits Tendance 2026" },
];

const MARKETPLACES = ["eBay", "Amazon", "AliExpress", "Trendyol", "Hepsiburada", "N11", "Etsy"];
const FEAT_ICONS = [Search, BarChart3, DollarSign, Package, FileText, Rocket];

const SHOPIER_TR = "https://www.shopier.com/bamironlinestore/46009500";
const SHOPIER_INTL = "https://www.shopier.com/bamironlinestore/48494025";

// Sayıyı 0'dan hedefe kadar sayarak gösterir (görünüme girince bir kez çalışır)
function CountUp({ to, duration = 1.4, format }: { to: number; duration?: number; format: (n: number) => string }) {
  const [val, setVal] = useState(0);
  const ran = useRef(false);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !ran.current) {
        ran.current = true;
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - start) / (duration * 1000), 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setVal(Math.round(to * eased));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [to, duration]);
  return <span ref={ref}>{format(val)}</span>;
}

export default function LandingPage() {
  const navigate = useNavigate();
  const { locale, setLocale } = useLocale();
  const l = (locale as L) in T ? (locale as L) : "tr";
  const c = T[l];
  const shopier = l === "tr" ? SHOPIER_TR : SHOPIER_INTL;
  const proPrice = l === "tr" ? "₺249" : l === "fr" ? "29€" : "$29";

  const goAnalyzer = () => navigate("/dashboard/analyzer");
  const goAuth = () => navigate("/auth");

  const purple = "#8b5cf6", purpleD = "#7c3aed", ink = "#0a0e1a", ink2 = "#0f1424";

  return (
    <div style={{ background: ink, color: "#e8eef7", fontFamily: "'Segoe UI',system-ui,sans-serif" }}>
      <SEO
        title="KHELL AI — Kazanan Ürünleri AI ile Bul | Dropshipping Ürün Analizi"
        description="KHELL AI ile ürünlerin kâr marjını, riskini ve karar skorunu saniyeler içinde analiz et. Gerçek CJ + eBay verisi, dürüst hesaplar. Ücretsiz başla."
      />

      {/* NAV */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(10,14,26,.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(148,163,184,.12)" }}>
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5 font-extrabold tracking-tight">
            <span style={{ width: 34, height: 34, borderRadius: 9, background: `linear-gradient(135deg,${purple},${purpleD})`, display: "grid", placeItems: "center" }}><Zap className="h-4 w-4 text-white" /></span>
            KHELL AI
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm" style={{ color: "#94a3b8" }}>
            {c.nav.map((n: string) => <span key={n} className="cursor-pointer hover:text-white transition-colors">{n}</span>)}
          </div>
          <div className="flex items-center gap-2.5">
            <div className="hidden sm:flex items-center gap-1 rounded-lg px-1 py-1" style={{ border: "1px solid rgba(148,163,184,.15)" }}>
              {(["tr", "en", "fr"] as L[]).map((lng) => (
                <button key={lng} onClick={() => setLocale(lng)} className="text-[11px] font-bold px-2 py-0.5 rounded-md transition-colors"
                  style={{ background: l === lng ? purple : "transparent", color: l === lng ? "#fff" : "#94a3b8" }}>{lng.toUpperCase()}</button>
              ))}
            </div>
            <button onClick={goAuth} className="text-sm font-bold rounded-xl px-4 py-2" style={{ border: "1px solid rgba(148,163,184,.18)", color: "#e8eef7" }}>{c.login}</button>
            <button onClick={goAnalyzer} className="text-sm font-bold rounded-xl px-4 py-2 text-white" style={{ background: `linear-gradient(135deg,${purple},${purpleD})`, boxShadow: "0 8px 24px rgba(139,92,246,.3)" }}>{c.tryFree}</button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ background: `radial-gradient(700px 340px at 20% 0%, rgba(139,92,246,.20), transparent 70%)` }}>
        <header className="mx-auto max-w-6xl px-6 pt-16 pb-14 grid lg:grid-cols-2 gap-10 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 text-xs font-bold mb-5 px-3.5 py-1.5 rounded-full" style={{ color: "#c4b5fd", background: "rgba(139,92,246,.12)", border: "1px solid rgba(139,92,246,.3)" }}>
              <Sparkles className="h-3.5 w-3.5" /> {c.badge}
            </div>
            <h1 className="font-extrabold leading-[1.08] tracking-tight mb-4" style={{ fontSize: 46 }}>
              {c.h1a} <span style={{ background: `linear-gradient(120deg,${purple},#c4b5fd)`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>{c.h1b}</span>
            </h1>
            <p className="text-base mb-6" style={{ color: "#94a3b8", maxWidth: 520 }}>{c.sub}</p>
            <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 mb-7" style={{ maxWidth: 520 }}>
              {c.checks.map((ch: string) => (
                <div key={ch} className="flex items-center gap-2 text-sm"><span style={{ color: purple }}><Check className="h-4 w-4" /></span>{ch}</div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <button onClick={goAnalyzer} className="inline-flex items-center gap-2 text-white font-bold rounded-xl px-7 py-3.5" style={{ background: `linear-gradient(135deg,${purple},${purpleD})`, boxShadow: "0 10px 30px rgba(139,92,246,.35)" }}><Rocket className="h-4 w-4" /> {c.ctaStart}</button>
              <button onClick={goAnalyzer} className="inline-flex items-center gap-2 font-bold rounded-xl px-7 py-3.5" style={{ border: "1px solid rgba(148,163,184,.2)", color: "#e8eef7" }}><PlayCircle className="h-4 w-4" /> {c.ctaDemo}</button>
            </div>
            <div className="flex flex-wrap gap-4 mt-6 text-[13px]" style={{ color: "#94a3b8" }}>
              {[ShieldCheck, Clock, XCircle, Check].map((Ic, i) => (
                <span key={i} className="flex items-center gap-1.5"><Ic className="h-3.5 w-3.5" style={{ color: "#34d399" }} /> {c.trust[i]}</span>
              ))}
            </div>
          </motion.div>

          {/* DASHBOARD PREVIEW (örnek analiz — dürüst) */}
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.15 }}
            className="relative rounded-2xl p-4 overflow-hidden" style={{ background: `linear-gradient(160deg,${ink2},#080c17)`, border: "1px solid rgba(148,163,184,.14)", boxShadow: "0 30px 80px rgba(0,0,0,.5)" }}>

            {/* Arka planda yavaşça dönen ışık halesi */}
            <motion.div aria-hidden className="absolute -inset-24 pointer-events-none"
              style={{ background: `conic-gradient(from 0deg, ${purple}22, transparent 30%, transparent 70%, ${purple}18)` }}
              animate={{ rotate: 360 }} transition={{ duration: 22, repeat: Infinity, ease: "linear" }} />
            {/* Üstten kayan parıltı */}
            <motion.div aria-hidden className="absolute inset-y-0 w-1/3 pointer-events-none"
              style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,.06), transparent)" }}
              animate={{ x: ["-40%", "220%"] }} transition={{ duration: 3.2, repeat: Infinity, repeatDelay: 2.5, ease: "easeInOut" }} />

            <div className="relative flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2 text-xs font-bold" style={{ color: "#94a3b8" }}>
                <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.6, repeat: Infinity }} className="h-1.5 w-1.5 rounded-full inline-block" style={{ background: "#34d399" }} />
                <Zap className="h-3.5 w-3.5" style={{ color: purple }} /> KHELL AI
              </div>
              <div className="text-[10px]" style={{ color: "#64748b" }}>{c.demoNote}</div>
            </div>

            <div className="relative grid grid-cols-3 gap-2.5 mb-2.5">
              <motion.div whileHover={{ y: -3, boxShadow: "0 8px 24px rgba(139,92,246,.35)" }} transition={{ duration: 0.2 }}
                className="rounded-xl p-3 cursor-default" style={{ background: "rgba(139,92,246,.08)", border: "1px solid rgba(139,92,246,.2)" }}>
                <div className="text-[9px] tracking-wide" style={{ color: "#94a3b8" }}>{c.demoScore}</div>
                <div className="text-2xl font-black" style={{ color: "#c4b5fd" }}><CountUp to={73} format={(n) => String(n)} /><span className="text-xs" style={{ color: "#64748b" }}>/100</span></div>
              </motion.div>
              <motion.div whileHover={{ y: -3, boxShadow: "0 8px 24px rgba(52,211,153,.3)" }} transition={{ duration: 0.2 }}
                className="rounded-xl p-3 cursor-default" style={{ background: "rgba(52,211,153,.06)", border: "1px solid rgba(52,211,153,.2)" }}>
                <div className="text-[9px] tracking-wide" style={{ color: "#94a3b8" }}>{c.demoProfit}</div>
                <div className="text-xl font-black" style={{ color: "#34d399" }}>₺<CountUp to={140000} format={(n) => n.toLocaleString("tr-TR")} /></div>
              </motion.div>
              <motion.div whileHover={{ y: -3, boxShadow: "0 8px 24px rgba(148,163,184,.25)" }} transition={{ duration: 0.2 }}
                className="rounded-xl p-3 cursor-default" style={{ background: "rgba(148,163,184,.06)", border: "1px solid rgba(148,163,184,.14)" }}>
                <div className="text-[9px] tracking-wide" style={{ color: "#94a3b8" }}>{c.demoComp}</div>
                <div className="text-base font-black" style={{ color: "#34d399" }}>{c.demoLow}</div>
              </motion.div>
            </div>

            <div className="relative rounded-xl p-4" style={{ background: "rgba(148,163,184,.05)", border: "1px solid rgba(148,163,184,.1)" }}>
              <div className="text-[10px] mb-2" style={{ color: "#94a3b8" }}>{c.demoProfit}</div>
<div className="rounded-lg overflow-hidden" style={{ height: 140 }}>
                <AnimatedChart />
              </div>
              <div className="flex justify-between text-[9px] mt-1" style={{ color: "#64748b" }}>
                <span>Oca</span><span>Şub</span><span>Mar</span><span>Nis</span><span>May</span><span>Haz</span>
              </div>
            </div>
          </motion.div>
        </header>
      </div>

      {/* MARKETPLACE LOGOS */}
      <section className="py-8" style={{ background: "#0c1120", borderTop: "1px solid rgba(148,163,184,.08)", borderBottom: "1px solid rgba(148,163,184,.08)" }}>
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-center text-[11px] font-bold tracking-[2px] mb-5" style={{ color: "#64748b" }}>{c.logosTitle.toUpperCase()}</p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {MARKETPLACES.map((m) => <span key={m} className="text-lg font-bold" style={{ color: "#94a3b8", opacity: 0.7 }}>{m}</span>)}
          </div>
        </div>
      </section>

      {/* FEATURES (white) */}
      <section className="py-16" style={{ background: "#f8fafc", color: "#1e293b" }}>
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-center text-xs font-bold tracking-[3px] mb-2" style={{ color: purpleD }}>{c.featEyebrow.toUpperCase()}</p>
          <h2 className="text-center text-3xl font-extrabold mb-2" style={{ color: "#0f172a" }}>{c.featTitle}</h2>
          <p className="text-center mb-10" style={{ color: "#64748b", maxWidth: 560, margin: "0 auto 40px" }}>{c.featSub}</p>
          <div className="grid md:grid-cols-3 gap-5">
            {c.feats.map((f: any, i: number) => {
              const Ic = FEAT_ICONS[i];
              return (
                <motion.div key={f.t} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                  className="rounded-2xl p-6 bg-white cursor-pointer" style={{ border: "1px solid #e2e8f0", boxShadow: "0 4px 16px rgba(15,23,42,.04)" }} onClick={goAnalyzer}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(139,92,246,.1)", display: "grid", placeItems: "center", marginBottom: 12 }}><Ic className="h-5 w-5" style={{ color: purpleD }} /></div>
                  <h3 className="text-lg font-bold mb-1.5" style={{ color: "#0f172a" }}>{f.t}</h3>
                  <p className="text-sm mb-4" style={{ color: "#64748b" }}>{f.d}</p>
                  <span className="text-sm font-bold inline-flex items-center gap-1" style={{ color: purpleD }}>{c.detail} <ArrowRight className="h-3.5 w-3.5" /></span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* WHY (honest highlights — sahte istatistik yerine) */}
      <section className="py-14" style={{ background: ink2 }}>
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-center text-xs font-bold tracking-[3px] mb-2" style={{ color: "#c4b5fd" }}>{c.whyEyebrow.toUpperCase()}</p>
          <h2 className="text-center text-2xl font-extrabold mb-8 text-white">{c.whyTitle}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {c.why.map((w: any, i: number) => {
              const Ic = [ShieldCheck, XCircle, Sparkles, Rocket][i];
              return (
                <div key={w.t} className="rounded-2xl p-6 text-center" style={{ background: "rgba(139,92,246,.06)", border: "1px solid rgba(139,92,246,.18)" }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(139,92,246,.14)", display: "grid", placeItems: "center", margin: "0 auto 12px" }}><Ic className="h-5 w-5" style={{ color: "#c4b5fd" }} /></div>
                  <div className="font-bold text-white mb-1">{w.t}</div>
                  <div className="text-xs" style={{ color: "#94a3b8" }}>{w.d}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* GUIDES (uydurma yorum yerine — gerçek rehberler) */}
      <section className="py-16" style={{ background: "#f8fafc", color: "#1e293b" }}>
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-center text-xs font-bold tracking-[3px] mb-2" style={{ color: purpleD }}>{c.guidesEyebrow.toUpperCase()}</p>
          <h2 className="text-center text-3xl font-extrabold mb-2" style={{ color: "#0f172a" }}>{c.guidesTitle}</h2>
          <p className="text-center mb-10" style={{ color: "#64748b", maxWidth: 560, margin: "0 auto 40px" }}>{c.guidesSub}</p>
          <div className="grid md:grid-cols-2 gap-4">
            {GUIDES.map((g) => (
              <div key={g.to} onClick={() => navigate(g.to)} className="rounded-2xl p-5 bg-white cursor-pointer flex items-center justify-between" style={{ border: "1px solid #e2e8f0" }}>
                <span className="font-bold" style={{ color: "#0f172a" }}>{g[l]}</span>
                <ArrowRight className="h-4 w-4" style={{ color: purpleD }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="py-16" style={{ background: ink }}>
        <div className="mx-auto max-w-3xl px-6">
          <p className="text-center text-xs font-bold tracking-[3px] mb-2" style={{ color: "#c4b5fd" }}>{c.priceEyebrow.toUpperCase()}</p>
          <h2 className="text-center text-3xl font-extrabold mb-2 text-white">{c.priceTitle}</h2>
          <p className="text-center mb-10" style={{ color: "#94a3b8" }}>{c.priceSub}</p>
          <div className="grid md:grid-cols-2 gap-5">
            <div className="rounded-2xl p-7" style={{ background: ink2, border: "1px solid rgba(148,163,184,.14)" }}>
              <h3 className="font-bold" style={{ color: "#94a3b8" }}>{c.free}</h3>
              <div className="text-4xl font-black my-2 text-white">₺0</div>
              <ul className="space-y-2.5 my-5">
                {c.freeList.map((x: string) => <li key={x} className="flex items-start gap-2 text-sm text-white"><Check className="h-4 w-4 mt-0.5" style={{ color: "#34d399" }} />{x}</li>)}
              </ul>
              <button onClick={goAnalyzer} className="w-full rounded-xl py-3 font-bold" style={{ border: "1px solid rgba(148,163,184,.2)", color: "#e8eef7" }}>{c.ctaStart}</button>
            </div>
            <div className="rounded-2xl p-7 relative" style={{ background: ink2, border: `2px solid ${purple}`, boxShadow: "0 20px 60px rgba(139,92,246,.15)" }}>
              <span className="absolute left-1/2 -translate-x-1/2 -top-3 text-[11px] font-black px-3.5 py-1 rounded-full text-white" style={{ background: `linear-gradient(135deg,${purple},${purpleD})` }}>{c.popular}</span>
              <h3 className="font-bold" style={{ color: "#94a3b8" }}>{c.pro}</h3>
              <div className="text-4xl font-black my-2 text-white">{proPrice}<span className="text-base font-semibold" style={{ color: "#94a3b8" }}>{c.perMonth}</span></div>
              <ul className="space-y-2.5 my-5">
                {c.proList.map((x: string) => <li key={x} className="flex items-start gap-2 text-sm text-white"><Check className="h-4 w-4 mt-0.5" style={{ color: "#34d399" }} />{x}</li>)}
              </ul>
              <a href={shopier} target="_blank" rel="noopener noreferrer" className="block text-center w-full rounded-xl py-3 font-bold text-white" style={{ background: `linear-gradient(135deg,${purple},${purpleD})` }}>{c.goPro}</a>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-16" style={{ background: ink }}>
        <div className="mx-auto max-w-4xl px-6">
          <div className="rounded-3xl text-center px-6 py-12" style={{ background: `linear-gradient(135deg,${purpleD},${purple})`, boxShadow: "0 24px 70px rgba(139,92,246,.3)" }}>
            <h2 className="text-3xl font-extrabold text-white mb-2">{c.finalTitle}</h2>
            <p className="text-white/80 mb-6" style={{ maxWidth: 500, margin: "0 auto 24px" }}>{c.finalSub}</p>
            <button onClick={goAnalyzer} className="inline-flex items-center gap-2 bg-white font-bold rounded-xl px-8 py-3.5" style={{ color: purpleD }}><Rocket className="h-4 w-4" /> {c.ctaStart}</button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="pt-14 pb-8" style={{ background: "#070a13", borderTop: "1px solid rgba(148,163,184,.1)" }}>
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2.5 font-extrabold tracking-tight mb-3 text-white">
                <span style={{ width: 32, height: 32, borderRadius: 9, background: `linear-gradient(135deg,${purple},${purpleD})`, display: "grid", placeItems: "center" }}><Zap className="h-4 w-4 text-white" /></span>
                KHELL AI
              </div>
              <p className="text-sm" style={{ color: "#64748b" }}>{c.footTagline}</p>
            </div>
            <div>
              <div className="text-sm font-bold text-white mb-3">{c.footPlatform}</div>
              <div className="flex flex-col gap-2 text-sm" style={{ color: "#94a3b8" }}>
                {c.footLinks1.map((x: string) => <span key={x} className="cursor-pointer hover:text-white" onClick={goAnalyzer}>{x}</span>)}
              </div>
            </div>
            <div>
              <div className="text-sm font-bold text-white mb-3">{c.footRes}</div>
              <div className="flex flex-col gap-2 text-sm" style={{ color: "#94a3b8" }}>
                {GUIDES.map((g) => <span key={g.to} className="cursor-pointer hover:text-white" onClick={() => navigate(g.to)}>{g[l]}</span>)}
              </div>
            </div>
            <div>
              <div className="text-sm font-bold text-white mb-3">{c.footLegal}</div>
              <div className="flex flex-col gap-2 text-sm" style={{ color: "#94a3b8" }}>
                <span className="cursor-pointer hover:text-white" onClick={() => navigate("/privacy")}>{c.footLegalLinks[0]}</span>
                <span className="cursor-pointer hover:text-white" onClick={() => navigate("/terms")}>{c.footLegalLinks[1]}</span>
                <span className="cursor-pointer hover:text-white" onClick={() => navigate("/refund")}>{c.footLegalLinks[2]}</span>
              </div>
            </div>
          </div>
          <div className="pt-6 flex flex-col items-center gap-2" style={{ borderTop: "1px solid rgba(148,163,184,.1)" }}>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: "#22c55e" }} />
              <p className="text-[10px] font-bold tracking-[3px]" style={{ background: `linear-gradient(120deg,#a78bfa,${purple})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>A BAMIR ONLINE STORE'S PRODUCTION</p>
            </div>
            <p className="text-[11px]" style={{ color: "#475569" }}>© 2026 KHELL AI — Bamir Global</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
