import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Megaphone, Sparkles, Loader2, Lock, Flame, Target, Brain, ShieldCheck, MessageCircle, FileText, Zap, RefreshCw, Copy, Film, Image as ImageIcon, BarChart3, DollarSign, TrendingUp, LineChart, PieChart, Rocket } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import heroImage from "@/assets/ad-analyzer-hero.jpg";

const LIMIT_KEY = "khell_ad_count";
const FREE_LIMIT = 3;
const WHATSAPP_LINK = "https://wa.me/905446452430";

interface AdResult {
  hook: string;
  triggers: string[];
  audience: string;
  buyReason: string;
  trust: string;
  weaknesses: string;
  shortCopy: string;
  longCopy: string;
  whatsappCopy: string;
  videoIdeas: { title: string; scene1: string; scene2: string; scene3: string; hook: string; text: string }[];
  thumbnailIdeas: { title: string; bg: string; object: string; text: string; color: string; goal: string }[];
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function analyzeAd(input: string, isTr: boolean, seed = 0): AdResult {
  const text = input.toLowerCase();
  const hasDiscount = /(indirim|discount|%|sale|kampanya|off|free|ücretsiz)/i.test(text);
  const hasQuestion = text.includes("?");
  const hasUrgency = /(son|hemen|şimdi|now|today|bugün|limited|stok|tükeniyor)/i.test(text);
  const hasSocialProof = /(müşteri|customer|kişi|people|review|yorum|binlerce|thousands)/i.test(text);
  const isShort = input.trim().length < 80;
  const isUrl = /^https?:\/\//i.test(input.trim());

  // Hook (first 3 seconds)
  const hookPool = isTr
    ? [
        "İlk 3 saniyede **scroll'u durduran** bir kanca var: izleyici 'dur, bu ne?' diyor. Pattern interrupt çalışıyor.",
        "Hook **merak boşluğu** yaratıyor — beyin 'devamı ne?' diye bağlanıyor. Curiosity gap tam yerinde.",
        "Açılış **'ben de bunu yaşıyorum'** dedirten bir tanımlama. Hedef kitle 1. saniyede kendini buluyor.",
        "İlk kare **görsel şok + net vaat** kombinasyonu. Mobilde başparmağı durduracak güçte.",
      ]
    : [
        "The first 3 seconds **stop the scroll** — viewers think 'wait, what?'. Pattern interrupt works.",
        "Hook builds a **curiosity gap** — the brain locks in for the payoff.",
        "Opens with **'that's literally me'** identification. The audience feels seen in second one.",
        "Opening combines **visual shock + clear promise**. Strong enough to stop a thumb on mobile.",
      ];
  let hook = pick(hookPool);
  if (hasQuestion) hook += isTr ? " **Soru kalıbı** zihinsel cevap arayışı tetikliyor." : " The **question format** triggers a mental search for an answer.";
  if (hasDiscount) hook += isTr ? " **Fiyat çapası** (indirim/ücretsiz) algıyı anında kilitliyor." : " The **price anchor** (discount/free) locks perception instantly.";
  if (isShort) hook += isTr ? " Kısa ve **kesin** — kelime israfı yok." : " Short and **decisive** — no wasted words.";
  if (isUrl) hook += isTr ? " Link odaklı yapı — **landing sayfası** dönüşümün %70'ini belirliyor." : " Link-driven structure — the **landing page** drives 70% of conversion.";

  // Emotional triggers
  const triggers: string[] = [];
  if (hasUrgency) triggers.push(isTr ? "**Korku (FOMO)** — kaçırma kaygısı" : "**Fear (FOMO)** — fear of missing out");
  if (hasQuestion || isShort) triggers.push(isTr ? "**Merak** — beyni cevaba kilitliyor" : "**Curiosity** — locks the brain on the answer");
  if (hasDiscount) triggers.push(isTr ? "**Açgözlülük** — fırsatı kazanma hissi" : "**Greed** — the thrill of grabbing a deal");
  if (hasSocialProof) triggers.push(isTr ? "**Aidiyet** — herkes alıyor, ben de almalıyım" : "**Belonging** — everyone's buying, so should I");
  if (triggers.length < 2) triggers.push(isTr ? "**Statü** — sahip olmanın kimlik değeri" : "**Status** — identity value of owning it");
  if (triggers.length < 3) triggers.push(isTr ? "**Rahatlık** — problemden kurtulma vaadi" : "**Relief** — promise of escaping a pain point");

  const audience = isTr
    ? pick([
        "**18-34 yaş**, mobil-first, impulse buyer. TikTok/Instagram'da günde 2+ saat. Karar süresi: **<60 saniye**.",
        "**25-40 yaş**, kalite + estetik arayışı olan premium segment. Yorum okur, satın almadan önce karşılaştırır.",
        "**20-35 yaş**, trend takipçisi, sosyal kanıta duyarlı, viral ürünleri arkadaşına göstererek satın alır.",
        "**Kadın 22-38 yaş**, kendine yatırım yapan, görsel + duygu tetikleyicisine açık, sepet terk oranı düşük.",
      ])
    : pick([
        "**18-34**, mobile-first impulse buyer. 2+ hours daily on TikTok/Instagram. Decision time: **<60 seconds**.",
        "**25-40**, premium segment seeking quality + aesthetics. Reads reviews, compares before buying.",
        "**20-35**, trend follower, sensitive to social proof, buys after sharing the product with a friend.",
        "**Women 22-38**, self-investors, responsive to visual + emotional triggers, low cart abandonment.",
      ]);

  const buyReason = isTr
    ? pick([
        "Çünkü reklam **'bunu almazsam kaybederim'** hissi veriyor. Mantık değil, **duygu** karar verdiriyor.",
        "Çünkü ürün, kullanıcının zaten **kafasında olan bir problemi** isimlendiriyor ve anında çözüm sunuyor.",
        "Çünkü vaadin **görsel kanıtı** var — beyin 'işe yarıyor' diyor ve riski düşük algılıyor.",
        "Çünkü fiyat / değer dengesi **'aptal olmamak için almalıyım'** hissi yaratıyor.",
      ])
    : pick([
        "Because the ad triggers a **'I'll lose if I don't buy this'** feeling. Emotion, not logic, decides.",
        "Because the product **names a problem** the viewer already had and offers an instant fix.",
        "Because the promise has **visual proof** — the brain says 'this works' and lowers perceived risk.",
        "Because the price/value ratio creates a **'I'd be dumb not to buy'** feeling.",
      ]);

  const trustParts: string[] = [];
  if (hasSocialProof) trustParts.push(isTr ? "**Sosyal kanıt** mevcut (müşteri/yorum vurgusu)." : "**Social proof** present (customer/review emphasis).");
  else trustParts.push(isTr ? "Sosyal kanıt zayıf — **'10.000+ mutlu müşteri'** veya **gerçek yorum** eklenmeli." : "Social proof is weak — add **'10,000+ happy customers'** or **real testimonials**.");
  trustParts.push(isTr ? "**Para iade garantisi** veya **30 gün deneme** vurgusu dönüşümü %20-40 artırır." : "A **money-back guarantee** or **30-day trial** can lift conversion 20-40%.");
  trustParts.push(isTr ? "**Öncesi/sonrası** görsel veya **kullanıcı videosu** güveni katlıyor." : "**Before/after** visuals or **UGC video** multiplies trust.");
  const trust = trustParts.join(" ");

  const weakParts: string[] = [];
  if (!hasUrgency) weakParts.push(isTr ? "**Aciliyet eksik** — 'son 24 saat' tipi tetikleyici şart." : "**No urgency** — add a 'last 24 hours' trigger.");
  if (!hasSocialProof) weakParts.push(isTr ? "**Sosyal kanıt yok** — sayı veya yorum şart." : "**No social proof** — add count or testimonial.");
  if (!hasDiscount) weakParts.push(isTr ? "**Fiyat avantajı vurgulanmamış**." : "**Price advantage missing**.");
  if (input.length > 280) weakParts.push(isTr ? "**Metin uzun** — ilk 3 saniyede vaat netleşmiyor." : "**Copy too long** — promise unclear in first 3s.");
  if (weakParts.length === 0) weakParts.push(isTr ? "Yapı sağlam — **A/B test** ile farklı CTA'lar dene." : "Structure is solid — **A/B test** different CTAs.");

  const angle = pick(
    isTr
      ? ["bunu görmeden alışveriş yapma", "bu ürünü neden herkes saklıyor", "3 günde fark hissedeceksin", "rakipler bunu istemiyor"]
      : ["don't shop before seeing this", "why everyone hides this product", "feel the difference in 3 days", "your competitors don't want this"]
  );

  const shortCopy = isTr
    ? `POV: ${angle} 🤯\n\n${hasDiscount ? "Bu fiyat sadece bugün." : "Bunu denemeden geçme."}\nLink bio'da 👇`
    : `POV: ${angle} 🤯\n\n${hasDiscount ? "This price — today only." : "Don't scroll past this."}\nLink in bio 👇`;

  const longCopy = isTr
    ? `**Bu sayfayı tesadüfen açmadın.**\n\nEğer hâlâ ${hasDiscount ? "tam fiyat" : "ortalama bir çözüm"} ile uğraşıyorsan, sebebi tek: **doğru ürünü görmemişsin.**\n\nBinlerce kişi şu an aynı problemden kurtuldu. Sen de kurtulabilirsin — ve hem de **${hasUrgency ? "bugün" : "bu hafta"}** içinde.\n\n✔ Hızlı sonuç (gerçek müşterilerden kanıt)\n✔ %100 risksiz — beğenmezsen iade\n✔ ${hasUrgency ? "Stoklarla sınırlı" : "Sadece şuan özel fiyat"}\n\n👉 **Aşağıdaki butona bas, kararı 60 saniyede ver.**\nSonra kendine teşekkür edeceksin.`
    : `**You didn't open this page by accident.**\n\nIf you're still stuck with ${hasDiscount ? "full price" : "an average solution"}, the reason is simple: **you haven't seen the right product yet.**\n\nThousands of people just escaped the same problem. You can too — and **${hasUrgency ? "today" : "this week"}**.\n\n✔ Fast results (proof from real customers)\n✔ 100% risk-free — return if you don't love it\n✔ ${hasUrgency ? "Limited stock" : "Special price right now"}\n\n👉 **Hit the button below. Decide in 60 seconds.**\nYou'll thank yourself later.`;

  const whatsappCopy = isTr
    ? `Selam 👋\nBaktığın ürün hâlâ stokta ama **çok az kaldı**.\n${hasDiscount ? "Bugün özel fiyatımız geçerli." : "Sana özel bir fiyat çıkarabilirim."}\n\nİstersen sipariş bilgini buradan al — **2 dakikada** halledelim. 🚀`
    : `Hey 👋\nThe product you checked is still in stock — but **very limited**.\n${hasDiscount ? "Today's special price is still active." : "I can pull a special price for you."}\n\nWant me to take your order here? **2 minutes** and you're done. 🚀`;

  // seed lightly varies output via pick randomness; not strict but enough
  void seed;

  return { hook, triggers, audience, buyReason, trust, weaknesses: weakParts.join(" "), shortCopy, longCopy, whatsappCopy };
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

  const handleRegenerate = () => {
    if (!input.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setResult(analyzeAd(input, isTr, Math.random()));
      setLoading(false);
    }, 800);
  };

  const copyText = (t: string) => {
    navigator.clipboard?.writeText(t).catch(() => {});
  };

  const renderRich = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((p, i) =>
      p.startsWith("**") && p.endsWith("**") ? (
        <strong key={i} className="text-foreground font-semibold">{p.slice(2, -2)}</strong>
      ) : (
        <span key={i}>{p}</span>
      )
    );
  };

  const analysisCards = result
    ? [
        { icon: Flame, title: isTr ? "Hook Analizi" : "Hook Analysis", body: result.hook, accent: "from-orange-500/20 to-red-500/10" },
        { icon: Brain, title: isTr ? "Duygusal Tetikleyiciler" : "Emotional Triggers", body: result.triggers.join(" • "), accent: "from-purple-500/20 to-pink-500/10" },
        { icon: Target, title: isTr ? "Hedef Kitle" : "Target Audience", body: result.audience, accent: "from-blue-500/20 to-cyan-500/10" },
        { icon: Zap, title: isTr ? "Satın Alma Sebebi" : "Reason to Buy", body: result.buyReason, accent: "from-yellow-500/20 to-orange-500/10" },
        { icon: ShieldCheck, title: isTr ? "Güven Artırıcılar" : "Trust Builders", body: result.trust, accent: "from-emerald-500/20 to-teal-500/10" },
        { icon: Sparkles, title: isTr ? "Zayıf Noktalar" : "Weak Points", body: result.weaknesses, accent: "from-rose-500/20 to-red-500/10" },
      ]
    : [];

  const copyCards = result
    ? [
        { icon: Flame, title: isTr ? "TikTok Reklam Metni" : "TikTok Ad Copy", body: result.shortCopy, badge: "TIKTOK" },
        { icon: FileText, title: isTr ? "Landing Sayfa Satış Metni" : "Landing Page Copy", body: result.longCopy, badge: "LANDING" },
        { icon: MessageCircle, title: isTr ? "WhatsApp Satış Mesajı" : "WhatsApp Sales Message", body: result.whatsappCopy, badge: "WHATSAPP" },
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
              className="mt-8"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  {isTr ? "Reklam Röntgeni" : "Ad X-Ray"}
                </h2>
                <button
                  onClick={handleRegenerate}
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-accent text-xs font-medium text-foreground transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
                  {isTr ? "Benzer Reklam Üret" : "Generate Similar"}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysisCards.map((c, i) => {
                  const Icon = c.icon;
                  return (
                    <motion.div
                      key={c.title}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="relative card-glow rounded-2xl border border-border p-5 overflow-hidden"
                    >
                      <div className={`absolute -top-12 -right-12 h-32 w-32 rounded-full bg-gradient-to-br ${c.accent} blur-2xl pointer-events-none`} />
                      <div className="relative">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Icon className="h-3.5 w-3.5 text-primary" />
                          </div>
                          <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                            {c.title}
                          </h3>
                        </div>
                        <p className="text-sm text-foreground/90 whitespace-pre-line leading-relaxed">
                          {renderRich(c.body)}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mt-8 mb-4">
                {isTr ? "Hazır Satış Metinleri" : "Ready-to-Use Sales Copy"}
              </h2>
              <div className="space-y-4">
                {copyCards.map((c, i) => {
                  const Icon = c.icon;
                  return (
                    <motion.div
                      key={c.title}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + i * 0.08 }}
                      className="card-glow rounded-2xl border border-border p-5"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Icon className="h-3.5 w-3.5 text-primary" />
                          </div>
                          <h3 className="text-sm font-semibold text-foreground">{c.title}</h3>
                          <span className="text-[9px] font-bold tracking-wider px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                            {c.badge}
                          </span>
                        </div>
                        <button
                          onClick={() => copyText(c.body.replace(/\*\*/g, ""))}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                        >
                          <Copy className="h-3 w-3" />
                          {isTr ? "Kopyala" : "Copy"}
                        </button>
                      </div>
                      <div className="rounded-xl bg-background/50 border border-border/60 p-4 text-sm text-foreground/90 whitespace-pre-line leading-relaxed">
                        {renderRich(c.body)}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
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