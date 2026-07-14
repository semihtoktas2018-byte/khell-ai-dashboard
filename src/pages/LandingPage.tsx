import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { useLocale } from "@/contexts/LocaleContext";
import SEO from "@/components/SEO";
import AnimatedChart from "@/components/AnimatedChart";
import {
  Zap, Search, BarChart3, DollarSign, Package, FileText, Sparkles,
  Rocket, PlayCircle, ShieldCheck, Clock, XCircle, ArrowRight, Check, ChevronDown, Info,
} from "lucide-react";

// ============================================================
//  KHELL AI — Landing (mor tema, premium SaaS revizyonu)
//  A BAMIR ONLINE STORE'S PRODUCTION
//  Durustluk kurali: uydurma istatistik / sahte yorum / sahte logo YOK.
//  Not: Resmi marka logolari (eBay/Amazon/... SVG) telif/marka nedeniyle
//  burada uretilmedi; marka isimleri kendi rengine yakin tipografiyle gosterilir.
// ============================================================

type L = "tr" | "en" | "fr";

const T: Record<L, any> = {
  tr: {
    nav: ["Özellikler", "Pazaryerleri", "Fiyatlar", "Rehberler", "SSS"],
    login: "Giriş Yap", tryFree: "Ücretsiz Dene",
    badge: "AI destekli ürün araştırma platformu",
    h1a: "Kazanan Ürünleri", h1b: "AI ile Bul, Hızla Büyü!",
    sub: "Ürününü tahminle değil rakamla seç: kâr marjını, riskini ve 0–100 karar skorunu saniyeler içinde gör.",
    checks: ["AI Destekli Analiz", "Rakip & Pazar Analizi", "Gerçek Zamanlı Veriler", "Tedarikçi Entegrasyonları", "Kâr & Risk Hesabı", "Adım Adım Strateji"],
    ctaStart: "Ücretsiz Başla", ctaDemo: "Aracı İncele",
    trust: ["Güvenli Ödeme", "İptal Kolay", "Kart Gerekmez", "0 Uydurma Rakam"],
    logosTitle: "Büyük pazaryerlerini analiz ediyoruz",
    mpNote: "CJ Dropshipping ve eBay: canlı veri entegrasyonu. Diğer pazaryerleri komisyon/KDV karşılaştırması içindir.",
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
      { t: "Gerçek Veri", d: "CJ + eBay canlı ürün verisi" },
      { t: "0 Uydurma Rakam", d: "Sahte istatistik yok, hesaplar dürüst" },
      { t: "3 Dil Desteği", d: "Türkçe · İngilizce · Fransızca" },
      { t: "Ücretsiz Başla", d: "Kart gerekmez, saniyeler içinde" },
    ],
    guidesEyebrow: "Rehberler", guidesTitle: "Sıfırdan öğren",
    guidesSub: "Dropshipping'e yeni başlıyorsan bu ücretsiz rehberler yol gösterir.",
    readTime: "5 dk okuma",
    priceEyebrow: "Fiyatlar", priceTitle: "Basit, net fiyat", priceSub: "Ücretsiz başla, hazır olunca yükselt.",
    free: "Ücretsiz", pro: "Pro", popular: "En Popüler", perMonth: "/ay",
    freeList: ["Günde sınırlı analiz", "1 kazanan ürün önizleme", "Temel risk skoru"],
    proList: ["Sınırsız analiz", "Tüm kazanan & trend ürünler", "Reklam casusu + tedarikçi karşılaştırma", "Fiyat takibi & bildirimler"],
    goPro: "Pro'ya Geç",
    sssEyebrow: "SSS", sssTitle: "Sık Sorulan Sorular",
    faq: [
      { q: "Dropshipping nedir?", a: "Stoksuz satış modeli — ürünü elinde tutmadan satarsın, tedarikçi doğrudan müşteriye gönderir. Detaylar için rehberler bölümüne bakabilirsin." },
      { q: "KHELL AI ürün araştırmasını nasıl yapıyor?", a: "CJ Dropshipping ve eBay'den canlı ürün verisi çeker; fiyat, maliyet ve talep sinyallerine göre kâr marjını ve 0–100 karar skorunu hesaplar." },
      { q: "KHELL AI kimler için?", a: "Dropshipping'e yeni başlayanlar ve mevcut mağazasını büyütmek isteyen satıcılar için. Deneyim ya da teknik bilgi gerekmez." },
      { q: "Fiyatlandırma nasıl çalışıyor?", a: "Ücretsiz planda günlük sınırlı analiz yapabilirsin. Pro plan sınırsız analiz, tüm kazanan ürünler ve ek araçları açar; istediğin an iptal edebilirsin." },
      { q: "Hesaplamalar ne kadar doğru?", a: "Kâr, marj, komisyon ve KDV hesapları gerçek formüllerle yapılır — uydurma rakam veya şişirilmiş istatistik kullanılmaz." },
      { q: "Hangi pazaryerlerini destekliyorsunuz?", a: "CJ Dropshipping ve eBay için canlı ürün verisi var. Trendyol, Hepsiburada, Amazon TR ve N11 için ise komisyon/KDV karşılaştırma hesaplayıcısı sunuyoruz." },
    ],
    finalTitle: "İlk ürününü şimdi puanla", finalSub: "Tahminle değil, rakamla karar ver. Kayıt olmadan denemeye başla.",
    footTagline: "AI destekli ürün araştırma platformu. E-ticarette kazanan sen ol.",
    footPlatform: "Platform", footRes: "Kaynaklar", footLegal: "Yasal",
    footLinks1: ["Özellikler", "Fiyatlar", "Pazaryerleri"],
    footLegalLinks: ["Gizlilik Politikası", "Kullanım Şartları", "İade ve Teslimat"],
    demoScore: "KHELL SKORU", demoProfit: "TAHMİNİ AYLIK KÂR", demoComp: "REKABET", demoDemand: "TALEP",
    demoLow: "Düşük", demoHigh: "Yüksek", demoNote: "Örnek analiz",
  },
  en: {
    nav: ["Features", "Marketplace", "Pricing", "Guides", "FAQ"],
    login: "Log In", tryFree: "Try Free",
    badge: "AI-powered product research platform",
    h1a: "Find Winning Products", h1b: "with AI, Scale Fast!",
    sub: "Choose products by numbers, not guesswork: see profit margin, risk and a 0–100 decision score in seconds.",
    checks: ["AI-Powered Analysis", "Competitor & Market Analysis", "Real-Time Data", "Supplier Integrations", "Profit & Risk Math", "Step-by-Step Strategy"],
    ctaStart: "Start Free", ctaDemo: "Explore Tool",
    trust: ["Secure Payment", "Easy Cancel", "No Card Needed", "0 Fake Numbers"],
    logosTitle: "We analyze major marketplaces",
    mpNote: "CJ Dropshipping and eBay: live data integration. Other marketplaces are for commission/VAT comparison.",
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
      { t: "Real Data", d: "Live CJ + eBay product data" },
      { t: "0 Fake Numbers", d: "No fake stats, honest calculations" },
      { t: "3 Languages", d: "Turkish · English · French" },
      { t: "Start Free", d: "No card, ready in seconds" },
    ],
    guidesEyebrow: "Guides", guidesTitle: "Learn from scratch",
    guidesSub: "New to dropshipping? These free guides show you the way.",
    readTime: "5 min read",
    priceEyebrow: "Pricing", priceTitle: "Simple, clear pricing", priceSub: "Start free, upgrade when ready.",
    free: "Free", pro: "Pro", popular: "Most Popular", perMonth: "/mo",
    freeList: ["Limited daily analyses", "1 winning product preview", "Basic risk score"],
    proList: ["Unlimited analyses", "All winning & trending products", "Ad spy + supplier comparison", "Price tracking & alerts"],
    goPro: "Go Pro",
    sssEyebrow: "FAQ", sssTitle: "Frequently Asked Questions",
    faq: [
      { q: "What is dropshipping?", a: "A model where you sell without holding stock — the supplier ships directly to the customer. See our guides for details." },
      { q: "How does KHELL AI research products?", a: "It pulls live product data from CJ Dropshipping and eBay, then computes profit margin and a 0–100 decision score from price, cost and demand signals." },
      { q: "Who is KHELL AI for?", a: "Beginners starting dropshipping and existing sellers looking to grow. No experience or technical skill required." },
      { q: "How does pricing work?", a: "The free plan allows limited daily analyses. Pro unlocks unlimited analyses, all winning products and extra tools; cancel anytime." },
      { q: "How accurate are the calculations?", a: "Profit, margin, commission and VAT are computed with real formulas — no fabricated numbers or inflated statistics." },
      { q: "Which marketplaces do you support?", a: "Live product data for CJ Dropshipping and eBay. For Trendyol, Hepsiburada, Amazon TR and N11 we offer a commission/VAT comparison calculator." },
    ],
    finalTitle: "Score your first product now", finalSub: "Decide by numbers, not guesswork. Start without signing up.",
    footTagline: "AI-powered product research platform. Win in e-commerce.",
    footPlatform: "Platform", footRes: "Resources", footLegal: "Legal",
    footLinks1: ["Features", "Pricing", "Marketplace"],
    footLegalLinks: ["Privacy Policy", "Terms of Service", "Refund & Delivery"],
    demoScore: "KHELL SCORE", demoProfit: "EST. MONTHLY PROFIT", demoComp: "COMPETITION", demoDemand: "DEMAND",
    demoLow: "Low", demoHigh: "High", demoNote: "Sample analysis",
  },
  fr: {
    nav: ["Fonctions", "Marketplaces", "Tarifs", "Guides", "FAQ"],
    login: "Connexion", tryFree: "Essai Gratuit",
    badge: "Plateforme de recherche produit par IA",
    h1a: "Trouvez les Produits Gagnants", h1b: "avec l'IA, Grandissez Vite!",
    sub: "Choisissez par les chiffres, pas au hasard : marge, risque et score de décision 0–100 en secondes.",
    checks: ["Analyse par IA", "Analyse Concurrence & Marché", "Données en Temps Réel", "Intégrations Fournisseurs", "Calcul Profit & Risque", "Stratégie Pas à Pas"],
    ctaStart: "Commencer Gratuitement", ctaDemo: "Explorer l'Outil",
    trust: ["Paiement Sécurisé", "Annulation Facile", "Sans Carte", "0 Faux Chiffre"],
    logosTitle: "Nous analysons les grandes marketplaces",
    mpNote: "CJ Dropshipping et eBay : intégration de données en direct. Les autres marketplaces servent à comparer commissions/TVA.",
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
      { t: "Données Réelles", d: "Données produit CJ + eBay en direct" },
      { t: "0 Faux Chiffre", d: "Aucune fausse stat, calculs honnêtes" },
      { t: "3 Langues", d: "Turc · Anglais · Français" },
      { t: "Commencer Gratuitement", d: "Sans carte, en quelques secondes" },
    ],
    guidesEyebrow: "Guides", guidesTitle: "Apprenez de zéro",
    guidesSub: "Nouveau en dropshipping ? Ces guides gratuits vous guident.",
    readTime: "5 min de lecture",
    priceEyebrow: "Tarifs", priceTitle: "Tarif simple et clair", priceSub: "Commencez gratuitement, passez au Pro quand vous êtes prêt.",
    free: "Gratuit", pro: "Pro", popular: "Le Plus Populaire", perMonth: "/mois",
    freeList: ["Analyses quotidiennes limitées", "1 aperçu produit gagnant", "Score de risque de base"],
    proList: ["Analyses illimitées", "Tous les produits gagnants & tendance", "Espion pub + comparaison fournisseur", "Suivi de prix & alertes"],
    goPro: "Passer au Pro",
    sssEyebrow: "FAQ", sssTitle: "Questions Fréquentes",
    faq: [
      { q: "Qu'est-ce que le dropshipping ?", a: "Un modèle où vous vendez sans stock — le fournisseur expédie directement au client. Voir nos guides pour plus de détails." },
      { q: "Comment KHELL AI analyse-t-il les produits ?", a: "Il récupère des données produit en direct depuis CJ Dropshipping et eBay, puis calcule la marge et un score de décision 0–100." },
      { q: "KHELL AI est pour qui ?", a: "Débutants en dropshipping et vendeurs souhaitant développer leur boutique. Aucune expérience requise." },
      { q: "Comment fonctionne la tarification ?", a: "Le plan gratuit permet des analyses quotidiennes limitées. Pro débloque des analyses illimitées et plus d'outils ; annulez à tout moment." },
      { q: "Quelle est la précision des calculs ?", a: "Profit, marge, commission et TVA sont calculés avec de vraies formules — aucun chiffre fabriqué." },
      { q: "Quelles marketplaces sont supportées ?", a: "Données en direct pour CJ Dropshipping et eBay. Pour Trendyol, Hepsiburada, Amazon TR et N11, un comparateur de commission/TVA est proposé." },
    ],
    finalTitle: "Notez votre premier produit", finalSub: "Décidez par les chiffres. Commencez sans inscription.",
    footTagline: "Plateforme de recherche produit par IA.",
    footPlatform: "Plateforme", footRes: "Ressources", footLegal: "Légal",
    footLinks1: ["Fonctions", "Tarifs", "Marketplaces"],
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

const MARKETPLACE_STYLES: Record<string, { font: string; color: string; weight?: string; tracking?: string; caseStyle?: string }> = {
  eBay: { font: "'Segoe UI', Arial, sans-serif", color: "#3665F3", weight: "800", tracking: "-0.5px" },
  Amazon: { font: "Arial, sans-serif", color: "#e8eef7", weight: "700", caseStyle: "lowercase" },
  AliExpress: { font: "Arial, sans-serif", color: "#FF4747", weight: "800" },
  Trendyol: { font: "'Segoe UI', Arial, sans-serif", color: "#FF6000", weight: "800" },
  Hepsiburada: { font: "Arial, sans-serif", color: "#FF6000", weight: "700" },
  N11: { font: "Arial, sans-serif", color: "#FF6600", weight: "900" },
  Etsy: { font: "Georgia, 'Times New Roman', serif", color: "#F1641E", weight: "700", caseStyle: "lowercase" },
};
const LIVE_MARKETPLACES = ["eBay"];
const FEAT_ICONS = [Search, BarChart3, DollarSign, Package, FileText, Rocket];

const SHOPIER_TR = "https://www.shopier.com/bamironlinestore/46009500";
const SHOPIER_INTL = "https://www.shopier.com/bamironlinestore/48494025";

const SECTION_IDS = ["ozellikler", "pazaryerleri", "fiyatlar", "rehberler", "sss"];

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

function FloatingGlow({ mx, my, factor, size, color, style }: { mx: any; my: any; factor: number; size: number; color: string; style?: React.CSSProperties }) {
  const x = useTransform(mx, (v: number) => v * factor);
  const y = useTransform(my, (v: number) => v * factor);
  return (
    <motion.div
      aria-hidden
      className="absolute rounded-full pointer-events-none"
      style={{ width: size, height: size, background: color, filter: "blur(60px)", x, y, ...style }}
      animate={{ scale: [1, 1.15, 1], opacity: [0.45, 0.65, 0.45] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

function FaqItem({ q, a, isOpen, onClick, purple }: { q: string; a: string; isOpen: boolean; onClick: () => void; purple: string }) {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${isOpen ? purple + "55" : "#e2e8f0"}`, background: "#fff", transition: "border-color .2s" }}>
      <button onClick={onClick} className="w-full flex items-center justify-between gap-4 text-left px-5 py-4">
        <span className="font-bold text-sm sm:text-base" style={{ color: "#0f172a" }}>{q}</span>
        <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }} className="shrink-0">
          <ChevronDown className="h-4 w-4" style={{ color: isOpen ? purple : "#94a3b8" }} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
            <p className="px-5 pb-4 text-sm" style={{ color: "#64748b" }}>{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
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

  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    const els = SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = SECTION_IDS.indexOf(entry.target.id);
            if (idx !== -1) setActiveSection(idx);
          }
        });
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const mvX = useMotionValue(0);
  const mvY = useMotionValue(0);
  const springX = useSpring(mvX, { stiffness: 40, damping: 18 });
  const springY = useSpring(mvY, { stiffness: 40, damping: 18 });
  const onHeroMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mvX.set(((e.clientX - rect.left) / rect.width - 0.5) * 40);
    mvY.set(((e.clientY - rect.top) / rect.height - 0.5) * 40);
  };

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div style={{ background: ink, color: "#e8eef7", fontFamily: "'Segoe UI',system-ui,sans-serif" }}>
      <SEO
        title="KHELL AI — Kazanan Ürünleri AI ile Bul | Dropshipping Ürün Analizi"
        description="KHELL AI ile ürünlerin kâr marjını, riskini ve karar skorunu saniyeler içinde analiz et. Gerçek CJ + eBay verisi, dürüst hesaplar. Ücretsiz başla."
      />

      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(10,14,26,.72)", backdropFilter: "blur(16px) saturate(160%)",
        borderBottom: `1px solid rgba(139,92,246,${scrolled ? 0.22 : 0.12})`,
        boxShadow: scrolled ? "0 8px 30px rgba(139,92,246,.12)" : "none",
        transition: "all .3s ease",
      }}>
        <div className="mx-auto max-w-6xl px-6 flex items-center justify-between transition-all duration-300" style={{ height: scrolled ? 56 : 68 }}>
          <div className="flex items-center gap-2.5 font-extrabold tracking-tight shrink-0">
            <span style={{ width: 34, height: 34, borderRadius: 9, background: `linear-gradient(135deg,${purple},${purpleD})`, display: "grid", placeItems: "center", boxShadow: `0 0 16px ${purple}55` }}><Zap className="h-4 w-4 text-white" /></span>
            KHELL AI
          </div>
          <div className="hidden md:flex items-center gap-1 text-sm" style={{ color: "#94a3b8" }}>
            {c.nav.map((n: string, i: number) => (
              <button key={n} onClick={() => document.getElementById(SECTION_IDS[i])?.scrollIntoView({ behavior: "smooth" })}
                className="relative px-3 py-2 transition-colors" style={{ color: activeSection === i ? "#fff" : "#94a3b8" }}>
                {n}
                {activeSection === i && (
                  <motion.span layoutId="navUnderline" className="absolute left-3 right-3 -bottom-0.5 h-[2px] rounded-full"
                    style={{ background: `linear-gradient(90deg,${purple},#c4b5fd)` }} transition={{ type: "spring", stiffness: 380, damping: 30 }} />
                )}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="hidden sm:flex items-center gap-1 rounded-lg px-1 py-1" style={{ border: "1px solid rgba(148,163,184,.15)" }}>
              {(["tr", "en", "fr"] as L[]).map((lng) => (
                <button key={lng} onClick={() => setLocale(lng)} className="text-[11px] font-bold px-2 py-0.5 rounded-md transition-colors"
                  style={{ background: l === lng ? purple : "transparent", color: l === lng ? "#fff" : "#94a3b8" }}>{lng.toUpperCase()}</button>
              ))}
            </div>
            <button onClick={goAuth} className="text-sm font-bold rounded-xl px-4 py-2 transition-colors" style={{ border: "1px solid rgba(148,163,184,.18)", color: "#e8eef7" }}>{c.login}</button>
            <button onClick={goAnalyzer} className="text-sm font-bold rounded-xl px-4 py-2 text-white transition-transform hover:scale-[1.03]" style={{ background: `linear-gradient(135deg,${purple},${purpleD})`, boxShadow: "0 8px 24px rgba(139,92,246,.3)" }}>{c.tryFree}</button>
          </div>
        </div>
      </nav>

      <div onMouseMove={onHeroMouseMove} className="relative overflow-hidden" style={{ background: `radial-gradient(700px 340px at 20% 0%, rgba(139,92,246,.20), transparent 70%)` }}>
        <FloatingGlow mx={springX} my={springY} factor={0.5} size={340} color="rgba(139,92,246,.25)" style={{ top: -80, left: "8%" }} />
        <FloatingGlow mx={springX} my={springY} factor={-0.35} size={260} color="rgba(192,132,252,.18)" style={{ top: 60, right: "6%" }} />
        <FloatingGlow mx={springX} my={springY} factor={0.25} size={200} color="rgba(52,211,153,.12)" style={{ bottom: -40, left: "40%" }} />

        <header className="relative mx-auto max-w-6xl px-6 pt-16 pb-14 grid lg:grid-cols-2 gap-10 items-center">
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
              <button onClick={goAnalyzer} className="inline-flex items-center gap-2 text-white font-bold rounded-xl px-7 py-3.5 transition-transform hover:scale-[1.02]" style={{ background: `linear-gradient(135deg,${purple},${purpleD})`, boxShadow: "0 10px 30px rgba(139,92,246,.35)" }}><Rocket className="h-4 w-4" /> {c.ctaStart}</button>
              <button onClick={goAnalyzer} className="inline-flex items-center gap-2 font-bold rounded-xl px-7 py-3.5 transition-colors" style={{ border: "1px solid rgba(148,163,184,.2)", color: "#e8eef7" }}><PlayCircle className="h-4 w-4" /> {c.ctaDemo}</button>
            </div>
            <div className="flex flex-wrap gap-4 mt-6 text-[13px]" style={{ color: "#94a3b8" }}>
              {[ShieldCheck, Clock, XCircle, Check].map((Ic, i) => (
                <span key={i} className="flex items-center gap-1.5"><Ic className="h-3.5 w-3.5" style={{ color: "#34d399" }} /> {c.trust[i]}</span>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.15 }}
            className="relative rounded-2xl p-4 overflow-hidden" style={{ background: `linear-gradient(160deg,${ink2}ee,#080c17ee)`, backdropFilter: "blur(6px)", border: "1px solid rgba(148,163,184,.14)", boxShadow: "0 30px 80px rgba(0,0,0,.5)" }}>

            <motion.div aria-hidden className="absolute -inset-24 pointer-events-none"
              style={{ background: `conic-gradient(from 0deg, ${purple}22, transparent 30%, transparent 70%, ${purple}18)` }}
              animate={{ rotate: 360 }} transition={{ duration: 22, repeat: Infinity, ease: "linear" }} />
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

      <section id="pazaryerleri" className="py-10" style={{ background: "#0c1120", borderTop: "1px solid rgba(148,163,184,.08)", borderBottom: "1px solid rgba(148,163,184,.08)" }}>
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-center text-[11px] font-bold tracking-[2px] mb-5" style={{ color: "#64748b" }}>{c.logosTitle.toUpperCase()}</p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
            {Object.keys(MARKETPLACE_STYLES).map((m) => {
              const st = MARKETPLACE_STYLES[m];
              const isLive = LIVE_MARKETPLACES.includes(m);
              return (
                <motion.div key={m} className="relative flex flex-col items-center gap-1.5" whileHover={{ y: -4, scale: 1.08 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                  <span style={{
                    fontFamily: st.font, color: st.color, fontWeight: st.weight || 700, fontSize: 21,
                    letterSpacing: st.tracking, textTransform: (st.caseStyle as any) || "none",
                    opacity: 0.95, cursor: "default",
                  }}>{m}</span>
                  {isLive && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ color: "#34d399", background: "rgba(52,211,153,.12)" }}>LIVE</span>
                  )}
                </motion.div>
              );
            })}
          </div>
          <div className="flex items-center justify-center gap-1.5 mt-6 text-[11px] text-center" style={{ color: "#64748b", maxWidth: 620, marginInline: "auto" }}>
            <Info className="h-3.5 w-3.5 shrink-0" />
            <span>{c.mpNote}</span>
          </div>
        </div>
      </section>

      <section id="ozellikler" className="py-16" style={{ background: "#f8fafc", color: "#1e293b" }}>
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-center text-xs font-bold tracking-[3px] mb-2" style={{ color: purpleD }}>{c.featEyebrow.toUpperCase()}</p>
          <h2 className="text-center text-3xl font-extrabold mb-2" style={{ color: "#0f172a" }}>{c.featTitle}</h2>
          <p className="text-center mb-10" style={{ color: "#64748b", maxWidth: 560, margin: "0 auto 40px" }}>{c.featSub}</p>
          <div className="grid md:grid-cols-3 gap-5">
            {c.feats.map((f: any, i: number) => {
              const Ic = FEAT_ICONS[i];
              return (
                <motion.div key={f.t} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -5, borderColor: purple + "60", boxShadow: "0 16px 40px rgba(139,92,246,.15)" }}
                  className="rounded-2xl p-6 bg-white cursor-pointer" style={{ border: "1px solid #e2e8f0", boxShadow: "0 4px 16px rgba(15,23,42,.04)" }} onClick={goAnalyzer}>
                  <motion.div whileHover={{ scale: 1.1, rotate: 4 }} style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(139,92,246,.1)", display: "grid", placeItems: "center", marginBottom: 12 }}><Ic className="h-5 w-5" style={{ color: purpleD }} /></motion.div>
                  <h3 className="text-lg font-bold mb-1.5" style={{ color: "#0f172a" }}>{f.t}</h3>
                  <p className="text-sm mb-4" style={{ color: "#64748b" }}>{f.d}</p>
                  <span className="text-sm font-bold inline-flex items-center gap-1" style={{ color: purpleD }}>{c.detail} <ArrowRight className="h-3.5 w-3.5" /></span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-14" style={{ background: ink2 }}>
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-center text-xs font-bold tracking-[3px] mb-2" style={{ color: "#c4b5fd" }}>{c.whyEyebrow.toUpperCase()}</p>
          <h2 className="text-center text-2xl font-extrabold mb-8 text-white">{c.whyTitle}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {c.why.map((w: any, i: number) => {
              const Ic = [ShieldCheck, XCircle, Sparkles, Rocket][i];
              return (
                <motion.div key={w.t} whileHover={{ y: -4, borderColor: purple + "70" }} className="rounded-2xl p-6 text-center" style={{ background: "rgba(139,92,246,.06)", border: "1px solid rgba(139,92,246,.18)" }}>
                  <motion.div whileHover={{ scale: 1.12 }} style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(139,92,246,.14)", display: "grid", placeItems: "center", margin: "0 auto 12px" }}><Ic className="h-5 w-5" style={{ color: "#c4b5fd" }} /></motion.div>
                  <div className="font-bold text-white mb-1">{w.t}</div>
                  <div className="text-xs" style={{ color: "#94a3b8" }}>{w.d}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="rehberler" className="py-16" style={{ background: "#f8fafc", color: "#1e293b" }}>
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-center text-xs font-bold tracking-[3px] mb-2" style={{ color: purpleD }}>{c.guidesEyebrow.toUpperCase()}</p>
          <h2 className="text-center text-3xl font-extrabold mb-2" style={{ color: "#0f172a" }}>{c.guidesTitle}</h2>
          <p className="text-center mb-10" style={{ color: "#64748b", maxWidth: 560, margin: "0 auto 40px" }}>{c.guidesSub}</p>
          <div className="grid md:grid-cols-2 gap-4">
            {GUIDES.map((g, i) => (
              <motion.div key={g.to} whileHover={{ y: -4, borderColor: purple + "50", boxShadow: "0 12px 30px rgba(139,92,246,.12)" }}
                onClick={() => navigate(g.to)} className="group rounded-2xl p-5 bg-white cursor-pointer flex items-center gap-4" style={{ border: "1px solid #e2e8f0" }}>
                <div className="h-11 w-11 rounded-xl shrink-0 grid place-items-center font-black text-white" style={{ background: `linear-gradient(135deg,${purple},${purpleD})` }}>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-bold block" style={{ color: "#0f172a" }}>{g[l]}</span>
                  <span className="text-xs" style={{ color: "#94a3b8" }}>{c.readTime}</span>
                </div>
                <motion.div className="shrink-0" whileHover={{ x: 3 }}><ArrowRight className="h-4 w-4" style={{ color: purpleD }} /></motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="fiyatlar" className="py-16" style={{ background: ink }}>
        <div className="mx-auto max-w-3xl px-6">
          <p className="text-center text-xs font-bold tracking-[3px] mb-2" style={{ color: "#c4b5fd" }}>{c.priceEyebrow.toUpperCase()}</p>
          <h2 className="text-center text-3xl font-extrabold mb-2 text-white">{c.priceTitle}</h2>
          <p className="text-center mb-10" style={{ color: "#94a3b8" }}>{c.priceSub}</p>
          <div className="grid md:grid-cols-2 gap-5">
            <motion.div whileHover={{ y: -4 }} className="rounded-2xl p-7" style={{ background: ink2, border: "1px solid rgba(148,163,184,.14)" }}>
              <h3 className="font-bold" style={{ color: "#94a3b8" }}>{c.free}</h3>
              <div className="text-4xl font-black my-2 text-white">₺0</div>
              <ul className="space-y-2.5 my-5">
                {c.freeList.map((x: string) => <li key={x} className="flex items-start gap-2 text-sm text-white"><Check className="h-4 w-4 mt-0.5" style={{ color: "#34d399" }} />{x}</li>)}
              </ul>
              <button onClick={goAnalyzer} className="w-full rounded-xl py-3 font-bold transition-colors hover:bg-white/5" style={{ border: "1px solid rgba(148,163,184,.2)", color: "#e8eef7" }}>{c.ctaStart}</button>
            </motion.div>
            <motion.div whileHover={{ y: -4 }} className="rounded-2xl p-7 relative" style={{ background: ink2, border: `2px solid ${purple}`, boxShadow: "0 20px 60px rgba(139,92,246,.15)" }}>
              <motion.span animate={{ boxShadow: [`0 0 0px ${purple}00`, `0 0 18px ${purple}80`, `0 0 0px ${purple}00`] }} transition={{ duration: 2.2, repeat: Infinity }}
                className="absolute left-1/2 -translate-x-1/2 -top-3 text-[11px] font-black px-3.5 py-1 rounded-full text-white" style={{ background: `linear-gradient(135deg,${purple},${purpleD})` }}>{c.popular}</motion.span>
              <h3 className="font-bold" style={{ color: "#94a3b8" }}>{c.pro}</h3>
              <div className="text-4xl font-black my-2 text-white">{proPrice}<span className="text-base font-semibold" style={{ color: "#94a3b8" }}>{c.perMonth}</span></div>
              <ul className="space-y-2.5 my-5">
                {c.proList.map((x: string) => <li key={x} className="flex items-start gap-2 text-sm text-white"><Check className="h-4 w-4 mt-0.5" style={{ color: "#34d399" }} />{x}</li>)}
              </ul>
              <a href={shopier} target="_blank" rel="noopener noreferrer" className="block text-center w-full rounded-xl py-3 font-bold text-white transition-transform hover:scale-[1.02]" style={{ background: `linear-gradient(135deg,${purple},${purpleD})` }}>{c.goPro}</a>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="sss" className="py-16" style={{ background: "#f8fafc", color: "#1e293b" }}>
        <div className="mx-auto max-w-3xl px-6">
          <p className="text-center text-xs font-bold tracking-[3px] mb-2" style={{ color: purpleD }}>{c.sssEyebrow.toUpperCase()}</p>
          <h2 className="text-center text-3xl font-extrabold mb-10" style={{ color: "#0f172a" }}>{c.sssTitle}</h2>
          <div className="space-y-3">
            {c.faq.map((f: any, i: number) => (
              <FaqItem key={f.q} q={f.q} a={f.a} isOpen={openFaq === i} onClick={() => setOpenFaq(openFaq === i ? null : i)} purple={purple} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16" style={{ background: ink }}>
        <div className="mx-auto max-w-4xl px-6">
          <motion.div className="relative overflow-hidden rounded-3xl text-center px-6 py-12" style={{ boxShadow: "0 24px 70px rgba(139,92,246,.3)" }}>
            <motion.div aria-hidden className="absolute inset-0" style={{ background: `linear-gradient(135deg,${purpleD},${purple},#c084fc)`, backgroundSize: "200% 200%" }}
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />
            <div className="relative">
              <h2 className="text-3xl font-extrabold text-white mb-2">{c.finalTitle}</h2>
              <p className="text-white/80 mb-6" style={{ maxWidth: 500, margin: "0 auto 24px" }}>{c.finalSub}</p>
              <button onClick={goAnalyzer} className="inline-flex items-center gap-2 bg-white font-bold rounded-xl px-8 py-3.5 transition-transform hover:scale-[1.03]" style={{ color: purpleD }}><Rocket className="h-4 w-4" /> {c.ctaStart}</button>
            </div>
          </motion.div>
        </div>
      </section>

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
                {c.footLinks1.map((x: string, i: number) => (
                  <span key={x} className="cursor-pointer hover:text-white transition-colors" onClick={() => document.getElementById(["ozellikler", "fiyatlar", "pazaryerleri"][i])?.scrollIntoView({ behavior: "smooth" })}>{x}</span>
                ))}
              </div>
            </div>
            <div>
              <div className="text-sm font-bold text-white mb-3">{c.footRes}</div>
              <div className="flex flex-col gap-2 text-sm" style={{ color: "#94a3b8" }}>
                {GUIDES.map((g) => <span key={g.to} className="cursor-pointer hover:text-white transition-colors" onClick={() => navigate(g.to)}>{g[l]}</span>)}
              </div>
            </div>
            <div>
              <div className="text-sm font-bold text-white mb-3">{c.footLegal}</div>
              <div className="flex flex-col gap-2 text-sm" style={{ color: "#94a3b8" }}>
                <span className="cursor-pointer hover:text-white transition-colors" onClick={() => navigate("/privacy")}>{c.footLegalLinks[0]}</span>
                <span className="cursor-pointer hover:text-white transition-colors" onClick={() => navigate("/terms")}>{c.footLegalLinks[1]}</span>
                <span className="cursor-pointer hover:text-white transition-colors" onClick={() => navigate("/refund")}>{c.footLegalLinks[2]}</span>
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
