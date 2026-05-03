import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Megaphone, Sparkles, Loader2, Lock } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";

const LIMIT_KEY = "khell_ad_count";
const FREE_LIMIT = 3;
const WHATSAPP_LINK = "https://wa.me/905446452430";

interface AdResult {
  hook: string;
  whySells: string;
  audience: string;
  weaknesses: string;
  salesCopy: string;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function analyzeAd(input: string, isTr: boolean): AdResult {
  const text = input.toLowerCase();
  const hasDiscount = /(indirim|discount|%|sale|kampanya|off|free|ücretsiz)/i.test(text);
  const hasQuestion = text.includes("?");
  const hasUrgency = /(son|hemen|şimdi|now|today|bugün|limited|stok|tükeniyor)/i.test(text);
  const hasSocialProof = /(müşteri|customer|kişi|people|review|yorum|binlerce|thousands)/i.test(text);
  const isShort = input.trim().length < 80;
  const isUrl = /^https?:\/\//i.test(input.trim());

  const hookParts: string[] = [];
  if (hasQuestion) hookParts.push(isTr ? "Soru kalıbı dikkat çekiyor, izleyiciyi düşündürüyor." : "Question format grabs attention and provokes thought.");
  if (hasDiscount) hookParts.push(isTr ? "Fiyat psikolojisi (indirim/ücretsiz) ilk saniyede ilgi yakalıyor." : "Price psychology (discount/free) captures interest in the first second.");
  if (hasUrgency) hookParts.push(isTr ? "Aciliyet tetikleyicisi FOMO oluşturuyor." : "Urgency trigger creates FOMO.");
  if (isShort) hookParts.push(isTr ? "Kısa ve net — scroll'u durduracak güçte." : "Short and sharp — strong enough to stop the scroll.");
  if (isUrl) hookParts.push(isTr ? "Link tabanlı reklam — landing page'in dönüşüme etkisi kritik." : "Link-based ad — landing page conversion impact is critical.");
  if (hookParts.length === 0) hookParts.push(isTr ? "Hook nötr, dikkat çekici bir kanca eksik." : "Hook is neutral, missing an attention grabber.");

  const whySells = isTr
    ? pick([
        "Net bir vaat sunuyor ve duygusal bir tetikleyiciye dokunuyor.",
        "Ürünü 'çözüm' olarak konumluyor, problem-agitate-solve yapısı güçlü.",
        "Görsel + metin uyumu satın alma engelini düşürüyor.",
        "Sosyal kanıt + aciliyet kombinasyonu CTR'ı yukarı çekiyor.",
      ])
    : pick([
        "Delivers a clear promise and hits an emotional trigger.",
        "Positions the product as a solution — strong PAS structure.",
        "Visual + copy harmony lowers purchase friction.",
        "Social proof + urgency combo drives CTR upward.",
      ]);

  const audience = isTr
    ? pick([
        "18-34 yaş, mobil-first, impulse buyer profili. TikTok/Instagram aktif.",
        "25-40 yaş, kalite arayan, premium segment. Karar verirken yorum okuyor.",
        "20-35 yaş, trend takipçisi, FOMO'ya açık, görsele duyarlı segment.",
      ])
    : pick([
        "18-34, mobile-first, impulse buyer profile. Active on TikTok/Instagram.",
        "25-40, quality-seeking premium segment. Reads reviews before deciding.",
        "20-35, trend follower, FOMO-prone, visually driven segment.",
      ]);

  const weakParts: string[] = [];
  if (!hasUrgency) weakParts.push(isTr ? "Aciliyet eksik — 'son 24 saat' tipi tetikleyici eklenmeli." : "Lacks urgency — add 'last 24 hours' type trigger.");
  if (!hasSocialProof) weakParts.push(isTr ? "Sosyal kanıt yok — müşteri sayısı veya yorum eklenmeli." : "No social proof — add customer count or testimonial.");
  if (!hasDiscount) weakParts.push(isTr ? "Fiyat avantajı vurgulanmamış." : "Price advantage not emphasized.");
  if (input.length > 280) weakParts.push(isTr ? "Metin çok uzun, ilk 3 saniyede vaat netleşmiyor." : "Copy too long, promise unclear in first 3 seconds.");
  if (weakParts.length === 0) weakParts.push(isTr ? "Genel olarak güçlü — A/B test ile farklı CTA'lar denenmeli." : "Generally strong — A/B test different CTAs.");

  const salesCopy = isTr
    ? `🚨 ${hasDiscount ? "Bu fırsat bitmek üzere." : "Yeni ürünümüzle tanış."}\n\nİstediğin sonucu hızlıca al — binlerce kişinin tercih ettiği sistem artık senin için de hazır.\n\n✅ Hızlı sonuç\n✅ Risk yok, garanti var\n✅ ${hasUrgency ? "Sınırlı stok" : "Bugün özel fiyat"}\n\n👉 Şimdi dene, farkı kendin gör.`
    : `🚨 ${hasDiscount ? "This deal ends soon." : "Meet our new product."}\n\nGet the result you want — fast. The system thousands trust is now ready for you.\n\n✅ Quick results\n✅ Risk-free, guaranteed\n✅ ${hasUrgency ? "Limited stock" : "Special price today"}\n\n👉 Try it now and see the difference.`;

  return {
    hook: hookParts.join(" "),
    whySells,
    audience,
    weaknesses: weakParts.join(" "),
    salesCopy,
  };
}

export default function AdAnalyzer() {
  const navigate = useNavigate();
  const { locale } = useLocale();
  const isTr = locale === "tr";

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AdResult | null>(null);
  const [count, setCount] = useState<number>(() => {
    const v = localStorage.getItem(LIMIT_KEY);
    return v ? parseInt(v, 10) || 0 : 0;
  });
  const [paywall, setPaywall] = useState(false);

  const remaining = Math.max(0, FREE_LIMIT - count);

  const handleAnalyze = () => {
    if (!input.trim()) return;
    if (count >= FREE_LIMIT) {
      setPaywall(true);
      return;
    }
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      setResult(analyzeAd(input, isTr));
      const next = count + 1;
      setCount(next);
      localStorage.setItem(LIMIT_KEY, String(next));
      setLoading(false);
    }, 1400);
  };

  const sections = result
    ? [
        { title: isTr ? "Hook Analizi" : "Hook Analysis", body: result.hook },
        { title: isTr ? "Neden Satıyor" : "Why It Sells", body: result.whySells },
        { title: isTr ? "Hedef Kitle" : "Target Audience", body: result.audience },
        { title: isTr ? "Zayıf Noktalar" : "Weak Points", body: result.weaknesses },
        { title: isTr ? "Satış Metni" : "Sales Copy", body: result.salesCopy },
      ]
    : [];

  return (
    <div className="min-h-screen bg-background">
      <nav className="flex items-center justify-between px-6 h-16 border-b border-border">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {isTr ? "Ana Sayfa" : "Home"}
        </button>
        <div className="flex items-center gap-2">
          <Megaphone className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold">KHELL AI</span>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-4">
            <Megaphone className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            {isTr ? "Reklam Analizi" : "Ad Analysis"}
          </h1>
          <p className="text-muted-foreground">
            {isTr
              ? "Reklam linki veya metni gir, KHELL analiz etsin"
              : "Enter an ad link or copy — let KHELL analyze it"}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="card-glow rounded-2xl border border-border p-6"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isTr ? "Reklam linki veya metni gir..." : "Enter ad link or copy..."}
            rows={5}
            className="w-full rounded-xl bg-background border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
          />
          <div className="flex items-center justify-between mt-4">
            <span className="text-xs text-muted-foreground">
              {isTr ? `Kalan ücretsiz analiz: ${remaining}/${FREE_LIMIT}` : `Free analyses left: ${remaining}/${FREE_LIMIT}`}
            </span>
            <button
              onClick={handleAnalyze}
              disabled={loading || !input.trim()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {isTr ? "Analiz ediliyor..." : "Analyzing..."}
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  {isTr ? "Analiz Et" : "Analyze"}
                </>
              )}
            </button>
          </div>
        </motion.div>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-6 space-y-4"
            >
              {sections.map((s, i) => (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="card-glow rounded-2xl border border-border p-5"
                >
                  <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-primary mb-2">
                    {s.title}
                  </h3>
                  <p className="text-sm text-foreground/90 whitespace-pre-line leading-relaxed">
                    {s.body}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-center text-[11px] text-muted-foreground mt-8">
          {isTr ? "Bu analiz anlık veriye göre üretilir" : "This analysis is generated from live input"}
        </p>
      </main>

      <AnimatePresence>
        {paywall && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setPaywall(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="card-glow rounded-2xl border border-border max-w-sm w-full p-8 text-center"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-4">
                <Lock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">
                {isTr ? "Ücretsiz hakkın doldu" : "Free quota reached"}
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                {isTr ? "Sınırsız analiz için PRO'ya geç." : "Upgrade to PRO for unlimited analyses."}
              </p>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center w-full px-5 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                {isTr ? "PRO'ya Geç (WhatsApp)" : "Upgrade to PRO (WhatsApp)"}
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}