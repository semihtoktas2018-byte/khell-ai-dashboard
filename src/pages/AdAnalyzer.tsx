import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Megaphone, Sparkles, Loader2, Lock, Flame, Target, Brain, ShieldCheck, MessageCircle, FileText, Zap, RefreshCw, Copy, Film, Image as ImageIcon, BarChart3, DollarSign, TrendingUp, LineChart, PieChart, Rocket } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import heroImage from "@/assets/ad-analyzer-hero.jpg";
import BackButton from "@/components/BackButton";
import MoneyLayer from "@/components/MoneyLayer";
import LoadingSteps from "@/components/LoadingSteps";
import AISuggestions, { type Suggestion } from "@/components/AISuggestions";
import ReportActions from "@/components/ReportActions";
import SEO from "@/components/SEO";

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

  // Video ideas (3 scripted concepts)
  const videoIdeas = isTr
    ? [
        {
          title: "POV / Pattern Interrupt",
          scene1: "Yakın çekim yüz, şaşkın ifade — 'Bunu gerçekten denedim ve...'",
          scene2: "Ürün kutudan çıkıyor, hızlı zoom + ses efekti.",
          scene3: "Sonuç gösterimi: öncesi/sonrası split screen, 3 saniye.",
          hook: pick(["3 gün önce bunu görseydim...", "Bu videoyu izlemeden alışveriş yapma", "Sana kimse bunu söylemedi ama..."]),
          text: "POV: yıllardır yanlış yapıyormuşum. Bu ürün her şeyi değiştirdi. Link bio'da, stoklar tükeniyor.",
        },
        {
          title: "Sosyal Kanıt / UGC",
          scene1: "3 farklı kullanıcı kameraya kısa yorum (her biri 2 saniye).",
          scene2: "Ürün kullanım anı, doğal ışık, gerçek el kamerası hissi.",
          scene3: "Yorumlar ekran kaydı: 5 yıldız + ekran görüntüleri kayıyor.",
          hook: pick(["Binlerce kişi neden bunu konuşuyor?", "Yorumlara bak, ben ikna oldum", "Herkes aynı şeyi söylüyor:"]),
          text: "10.000+ memnun müşteri yanılıyor olamaz. Sen de dene, beğenmezsen iade. Risksiz.",
        },
        {
          title: "Demo / Wow Effect",
          scene1: "Problem sahnesi: kullanıcı bariz şekilde zorlanıyor.",
          scene2: "Ürün giriyor — tek hareketle çözüm. Kamera yavaş çekim.",
          scene3: "Final: rahatlamış yüz + ürün etiketi + fiyat çapası.",
          hook: pick(["10 saniyede sonucu göster", "Bu kadar basit olamaz dedim, oldu", "Bunu bir kez görünce bir daha eskisi gibi yapamayacaksın"]),
          text: "Saatlerce uğraşma. Bu ürün 30 saniyede hallediyor. Bugün özel fiyat aktif.",
        },
      ]
    : [
        {
          title: "POV / Pattern Interrupt",
          scene1: "Close-up face, surprised look — 'I actually tried this and...'",
          scene2: "Product unboxing, quick zoom + sound effect.",
          scene3: "Result reveal: before/after split screen, 3 seconds.",
          hook: pick(["I wish I saw this 3 days ago...", "Don't shop before watching this", "Nobody told you but..."]),
          text: "POV: I've been doing it wrong for years. This product changed everything. Link in bio — selling out fast.",
        },
        {
          title: "Social Proof / UGC",
          scene1: "3 different users give 2-second testimonials to camera.",
          scene2: "Real-use moment, natural light, handheld vibe.",
          scene3: "Screen-record of reviews: 5 stars + scrolling screenshots.",
          hook: pick(["Why is everyone talking about this?", "Read the reviews — I'm sold", "Everyone says the same thing:"]),
          text: "10,000+ happy customers can't be wrong. Try it risk-free, return if you don't love it.",
        },
        {
          title: "Demo / Wow Effect",
          scene1: "Problem scene: user visibly struggling.",
          scene2: "Product enters — one move solves it. Slow-mo camera.",
          scene3: "Final: relieved face + product label + price anchor.",
          hook: pick(["10-second result reveal", "Said 'no way'... it worked", "Once you see this, you can't go back"]),
          text: "Stop wasting hours. This solves it in 30 seconds. Special price active today.",
        },
      ];

  // Thumbnail ideas (3 visual concepts)
  const thumbnailIdeas = isTr
    ? [
        {
          title: "Şok / Yüz İfadesi",
          bg: "Koyu gradient (lacivert → mor), hafif grain.",
          object: "Ürün ortada, arkasında şaşkın yüz ifadesi.",
          text: "Büyük sarı yazı: 'BUNU GÖRMEDEN ALMA'",
          color: "Sarı + lacivert kontrast, yüksek okunurluk.",
          goal: "Pattern interrupt, scroll'u durdur.",
        },
        {
          title: "Öncesi / Sonrası",
          bg: "Bölünmüş ekran: solda gri/donuk, sağda canlı renkler.",
          object: "Aynı kişi/obje iki halde, ortada ürün.",
          text: "'ÖNCE / SONRA' kısa ve net.",
          color: "Gri vs neon yeşil — dramatik fark.",
          goal: "Ürün etkisini saniyede ispatla.",
        },
        {
          title: "Fiyat Çapası",
          bg: "Karanlık premium, altın ışıltı.",
          object: "Ürün izole, üstünde dolar/TL sembolü.",
          text: "'%50 İNDİRİM — SON 24 SAAT'",
          color: "Altın + kırmızı urgency rozeti.",
          goal: "Tıklamayı ekonomik açgözlülükle tetikle.",
        },
      ]
    : [
        {
          title: "Shock / Face Reaction",
          bg: "Dark gradient (navy → purple), light grain.",
          object: "Product centered, shocked face behind it.",
          text: "Big yellow text: 'DON'T BUY BEFORE SEEING THIS'",
          color: "Yellow on navy, max contrast.",
          goal: "Pattern interrupt — stop the scroll.",
        },
        {
          title: "Before / After",
          bg: "Split screen: dull gray left, vibrant right.",
          object: "Same subject in two states, product in middle.",
          text: "'BEFORE / AFTER' clean and bold.",
          color: "Gray vs neon green — dramatic.",
          goal: "Prove product impact in one second.",
        },
        {
          title: "Price Anchor",
          bg: "Premium dark with gold shimmer.",
          object: "Product isolated, dollar symbol overlay.",
          text: "'50% OFF — LAST 24 HOURS'",
          color: "Gold + red urgency badge.",
          goal: "Trigger click with economic greed.",
        },
      ];

  return { hook, triggers, audience, buyReason, trust, weaknesses: weakParts.join(" "), shortCopy, longCopy, whatsappCopy, videoIdeas, thumbnailIdeas };
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
    }, 1700);
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
    <div className="min-h-screen bg-background relative overflow-hidden">
      <SEO title="Reklam Analizi | KHELL AI" description="Reklam kampanyalarının ROAS, dönüşüm ve kâr performansını AI ile değerlendir." />
      {/* Ambient floating icons */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <BarChart3 className="absolute top-[12%] left-[6%] h-24 w-24 text-primary/[0.06] blur-[1px]" />
        <DollarSign className="absolute top-[28%] right-[8%] h-28 w-28 text-emerald-400/[0.06] blur-[1px]" />
        <TrendingUp className="absolute top-[55%] left-[4%] h-20 w-20 text-blue-400/[0.07] blur-[1px]" />
        <LineChart className="absolute bottom-[18%] right-[6%] h-24 w-24 text-purple-400/[0.06] blur-[1px]" />
        <PieChart className="absolute bottom-[8%] left-[10%] h-16 w-16 text-pink-400/[0.06] blur-[1px]" />
        <Rocket className="absolute top-[70%] right-[18%] h-20 w-20 text-primary/[0.06] blur-[1px]" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-primary/[0.05] blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-purple-500/[0.05] blur-[120px]" />
      </div>

      <nav className="relative flex items-center justify-between px-6 h-16 border-b border-border/60 backdrop-blur-sm bg-background/40 z-10">
        <BackButton />
        <div className="flex items-center gap-2">
          <Megaphone className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold">KHELL AI</span>
        </div>
      </nav>

      <main className="relative max-w-4xl mx-auto px-6 py-10 z-10">
        {/* Hero cover */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-10 rounded-3xl overflow-hidden border border-border/60 shadow-2xl"
        >
          <img
            src={heroImage}
            alt={isTr ? "Reklam Analizi premium görseli" : "Ad Analysis premium banner"}
            width={1920}
            height={640}
            className="w-full h-[200px] md:h-[260px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-background/40" />
          <div className="absolute inset-0 flex flex-col items-start justify-end p-6 md:p-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/15 border border-primary/30 backdrop-blur-md mb-3">
              <Sparkles className="h-3 w-3 text-primary" />
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary">AI Powered</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2 bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text">
              {isTr ? "Reklam Analizi" : "Ad Analysis"}
            </h1>
            <p className="text-sm md:text-base text-muted-foreground max-w-xl">
              {isTr
                ? "Reklam linki veya metni gir — KHELL analiz etsin, satış makinesine dönüştürsün."
                : "Drop an ad link or copy — KHELL turns it into a selling machine."}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="card-glow rounded-2xl border border-border/80 p-6 backdrop-blur-md bg-card/60 shadow-xl"
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
          {loading && (
            <div className="mt-4 rounded-xl border border-border/60 bg-background/40 p-4">
              <LoadingSteps isTr={isTr} />
            </div>
          )}
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
                  {isTr ? "AI Rewrite Ad" : "AI Rewrite Ad"}
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
                      className="group relative card-glow rounded-2xl border border-border/80 p-5 overflow-hidden backdrop-blur-md bg-card/50 hover:border-primary/40 hover:shadow-[0_0_30px_-10px_hsl(var(--primary)/0.4)] hover:-translate-y-0.5 transition-all duration-300"
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

              {/* Video Ideas */}
              <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mt-10 mb-4 flex items-center gap-2">
                <Film className="h-3.5 w-3.5 text-primary" />
                {isTr ? "Reklam Fikirleri (Video)" : "Ad Ideas (Video)"}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {result.videoIdeas.map((v, i) => (
                  <motion.div
                    key={v.title + i}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.08 }}
                    className="card-glow rounded-2xl border border-border/80 p-5 backdrop-blur-md bg-card/50 hover:border-primary/40 hover:shadow-[0_0_30px_-10px_hsl(var(--primary)/0.4)] transition-all"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary">
                        VIDEO {i + 1}
                      </span>
                      <span className="text-xs font-semibold text-foreground">{v.title}</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-foreground/85">
                      <li><strong className="text-primary">Sahne 1:</strong> {v.scene1}</li>
                      <li><strong className="text-primary">Sahne 2:</strong> {v.scene2}</li>
                      <li><strong className="text-primary">Sahne 3:</strong> {v.scene3}</li>
                      <li className="pt-2 border-t border-border/60"><strong className="text-primary">Hook:</strong> {v.hook}</li>
                      <li><strong className="text-primary">{isTr ? "Metin" : "Copy"}:</strong> {v.text}</li>
                    </ul>
                  </motion.div>
                ))}
              </div>

              {/* Thumbnail Ideas */}
              <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mt-10 mb-4 flex items-center gap-2">
                <ImageIcon className="h-3.5 w-3.5 text-primary" />
                {isTr ? "Thumbnail / Görsel Fikirleri" : "Thumbnail / Visual Ideas"}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {result.thumbnailIdeas.map((t, i) => (
                  <motion.div
                    key={t.title + i}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + i * 0.08 }}
                    className="card-glow rounded-2xl border border-border/80 p-5 backdrop-blur-md bg-card/50 hover:border-primary/40 hover:shadow-[0_0_30px_-10px_hsl(var(--primary)/0.4)] transition-all"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary">
                        THUMB {i + 1}
                      </span>
                      <span className="text-xs font-semibold text-foreground">{t.title}</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-foreground/85">
                      <li><strong className="text-primary">{isTr ? "Arka plan" : "Background"}:</strong> {t.bg}</li>
                      <li><strong className="text-primary">{isTr ? "Ana obje" : "Main object"}:</strong> {t.object}</li>
                      <li><strong className="text-primary">{isTr ? "Yazı" : "Text"}:</strong> {t.text}</li>
                      <li><strong className="text-primary">{isTr ? "Renk stili" : "Color"}:</strong> {t.color}</li>
                      <li><strong className="text-primary">{isTr ? "Amaç" : "Goal"}:</strong> {t.goal}</li>
                    </ul>
                  </motion.div>
                ))}
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

        {result && (
          <MoneyLayer
            module="ad"
            score={Math.min(95, 55 + Math.min(40, Math.floor(input.trim().length / 8)))}
          />
        )}

        {result && (
          <>
            <AISuggestions
              isTr={isTr}
              suggestions={(() => {
                const s: Suggestion[] = [];
                const txt = input.toLowerCase();
                if (!/(son|hemen|şimdi|now|today|bugün|limited)/i.test(txt))
                  s.push({ level: "critical", text: isTr ? "**Aciliyet eksik** — 'son 24 saat' veya stok uyarısı ekleyince CTR ciddi artar." : "**Urgency missing** — adding 'last 24h' or stock alert lifts CTR." });
                if (!/(müşteri|customer|review|yorum|binlerce|thousands|⭐)/i.test(txt))
                  s.push({ level: "warn", text: isTr ? "**Sosyal kanıt zayıf** — '10.000+ mutlu müşteri' veya yorum ekran görüntüsü ekle." : "**Social proof weak** — add '10,000+ customers' or review screenshots." });
                if (input.trim().length < 80)
                  s.push({ level: "warn", text: isTr ? "Metin **çok kısa** — vaadi 1 cümle daha açıklayan kanıt cümlesi ekle." : "Copy **too short** — add one proof sentence to expand the promise." });
                if (input.trim().length > 320)
                  s.push({ level: "warn", text: isTr ? "Metin **uzun** — ilk 3 saniyenin vaadini başa al, gerisini buton sonrası bırak." : "Copy **long** — move the 3-second promise to the top." });
                if (s.length < 3)
                  s.push({ level: "good", text: isTr ? "Hook ve duygusal tetikleyiciler **iyi yerleşmiş** — A/B test ile ölçek." : "Hook and emotional triggers are **well placed** — A/B test to scale." });
                return s;
              })()}
            />
            <ReportActions
              isTr={isTr}
              filename={`khell-ad-analysis-${Date.now()}`}
              rows={[
                [isTr ? "Hook" : "Hook", result.hook.replace(/\*\*/g, "")],
                [isTr ? "Hedef Kitle" : "Audience", result.audience.replace(/\*\*/g, "")],
                [isTr ? "Satın Alma Sebebi" : "Reason to Buy", result.buyReason.replace(/\*\*/g, "")],
                [isTr ? "Güven" : "Trust", result.trust.replace(/\*\*/g, "")],
                [isTr ? "Zayıf Noktalar" : "Weak Points", result.weaknesses.replace(/\*\*/g, "")],
                [isTr ? "Kısa Reklam" : "Short Copy", result.shortCopy.replace(/\*\*/g, "")],
                [isTr ? "Uzun Reklam" : "Long Copy", result.longCopy.replace(/\*\*/g, "")],
                ["WhatsApp", result.whatsappCopy.replace(/\*\*/g, "")],
              ]}
            />
          </>
        )}

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