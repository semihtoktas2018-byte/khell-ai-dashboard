import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { TrendingUp, Calculator, Megaphone, Repeat, ArrowRight, Zap, CheckCircle2, XCircle } from "lucide-react";
import SEO from "@/components/SEO";
import BamirFooter from "@/components/BamirFooter";

// SEO Rehber Sayfası — "dropshipping kârlı mı" aramasını hedefler.

const faq = [
  {
    q: "Dropshipping gerçekten kârlı mı?",
    a: "Kârlı olabilir, ama garanti değil. Aynı işe başlayan iki kişiden biri kâr ederken diğeri zarar edebilir — fark şans değil, yöntemdir. Doğru ürün, sağlıklı marj ve etkili pazarlama bir araya gelince kâr eder; bunlardan biri eksikse ciro olur ama kâr olmaz.",
  },
  {
    q: "Ne kadar kâr marjı gerekir?",
    a: "Genel kural olarak brüt marjın %30'un altındaysa risklidir. Çünkü reklam maliyeti biraz oynadığında ya da iade geldiğinde zarara geçmen kolaydır. %30 ve üstü marj sana test etme ve ölçekleme alanı bırakır. Marjı hesaplarken ürün maliyeti + kargo + reklam giderini birlikte düş.",
  },
  {
    q: "Kârı en çok ne düşürür?",
    a: "En büyük kâr yiyen kalem reklam maliyetidir. Yanlış ürüne ya da yanlış kitleye reklam verirsen, satış olsa bile kâr reklamda erir. İkinci sırada iadeler ve yavaş kargodan doğan memnuniyetsizlik gelir. Bu yüzden ürünü test etmeden büyük reklam bütçesi ayırmak en pahalı hatadır.",
  },
  {
    q: "Ne zaman kâr etmeye başlanır?",
    a: "Bu tamamen ürününe, marjına ve pazarlama becerine bağlı; net bir süre vermek yanıltıcı olur. Sağlıklı yaklaşım: küçük bütçeyle birden fazla ürün test etmek, tutmayanları hızlı bırakmak, tutan üründe bütçeyi kademeli artırmaktır. Sabır ve disiplin, hızdan daha önemlidir.",
  },
];

const factors = [
  { icon: TrendingUp, title: "Ürün seçimi", body: "Kârın en belirleyici faktörü. Talebi yüksek, rekabeti doymamış ve üzerine marj konabilen ürün seçmek işin yarısıdır." },
  { icon: Calculator, title: "Kâr marjı", body: "Fiyat eksi tüm maliyetler. %30 altı riskli, üstü güvenli oyun alanı. Bu hesabı gözle değil rakamla yap." },
  { icon: Megaphone, title: "Pazarlama", body: "Doğru kitleye, doğru mesajla ulaşmak. En iyi ürün bile kötü pazarlamayla zarar ettirir." },
  { icon: Repeat, title: "Tekrar eden müşteri", body: "Çoğu satıcı sadece yeni müşteri peşinde koşar; oysa mevcut müşteriye tekrar satmak çok daha kârlıdır." },
];

export default function DropshippingKarliMi() {
  const navigate = useNavigate();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "Dropshipping Kârlı mı? (2026 Gerçekçi Analiz)",
        description:
          "Dropshipping kârlı mı, kârı belirleyen faktörler neler? Kâr marjı, ürün seçimi ve pazarlamanın rolü. Ürünlerini ücretsiz analiz et.",
        author: { "@type": "Organization", name: "KHELL AI" },
        publisher: { "@type": "Organization", name: "KHELL AI" },
      },
      {
        "@type": "FAQPage",
        mainEntity: faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Dropshipping Kârlı mı? 2026 Gerçekçi Analiz | KHELL AI"
        description="Dropshipping kârlı mı, kârı belirleyen faktörler neler? Kâr marjı, ürün seçimi ve pazarlamanın rolü. Ürünlerini ücretsiz analiz et."
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <header className="border-b border-border">
        <div className="container mx-auto max-w-3xl flex h-16 items-center justify-between px-4">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold tracking-tight">KHELL AI</span>
          </button>
          <button onClick={() => navigate("/dashboard/analyzer")} className="btn-primary text-sm py-2 px-4">
            Ücretsiz Dene
          </button>
        </div>
      </header>

      <main className="container mx-auto max-w-3xl px-4 py-10">
        <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Gerçekçi Analiz · 2026</p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Dropshipping Kârlı mı?
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            Kısa cevap: evet, kârlı olabilir — ama otomatik değil. Aynı işe başlayan iki kişiden biri kâr ederken diğeri
            zarar edebilir. Aradaki fark şans değil, yöntemdir. Bu yazıda kârı gerçekten neyin belirlediğini ve nerede
            zarar edildiğini dürüstçe anlatıyorum.
          </p>

          {/* Kârı belirleyen faktörler */}
          <h2 className="text-2xl font-bold tracking-tight mb-4">Kârı belirleyen 4 faktör</h2>
          <div className="grid sm:grid-cols-2 gap-4 mb-10">
            {factors.map((f) => (
              <div key={f.title} className="rounded-xl border border-border p-5 bg-card/40">
                <div className="h-9 w-9 rounded-lg bg-primary/15 flex items-center justify-center mb-3">
                  <f.icon className="h-4.5 w-4.5 text-primary" />
                </div>
                <h3 className="font-bold tracking-tight mb-1.5">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>

          {/* Kâr eden vs zarar eden */}
          <h2 className="text-2xl font-bold tracking-tight mb-4">Kâr eden ile zarar eden arasındaki fark</h2>
          <div className="grid sm:grid-cols-2 gap-4 mb-10">
            <div className="rounded-xl border border-winning/30 p-5 bg-card/40">
              <h3 className="font-bold text-winning mb-3">Kâr eden satıcı</h3>
              <div className="space-y-2">
                {["Ürünü rakamla seçer, marjını hesaplar", "Küçük bütçeyle test eder", "Tutmayanı hızlı bırakır", "Tutan üründe kademeli ölçekler"].map((x) => (
                  <div key={x} className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-winning shrink-0 mt-0.5" /><span className="text-sm text-foreground">{x}</span></div>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-destructive/30 p-5 bg-card/40">
              <h3 className="font-bold text-destructive mb-3">Zarar eden satıcı</h3>
              <div className="space-y-2">
                {["'Güzel görünüyor' deyip ürün seçer", "Marj hesaplamadan reklama başlar", "Tek ürüne büyük bütçe gömer", "Sonuç alamayınca vazgeçer"].map((x) => (
                  <div key={x} className="flex items-start gap-2"><XCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" /><span className="text-sm text-foreground">{x}</span></div>
                ))}
              </div>
            </div>
          </div>

          {/* Ara CTA */}
          <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6 text-center mb-10">
            <h2 className="text-xl font-bold tracking-tight mb-2">Kâr edip etmeyeceğini önceden gör</h2>
            <p className="text-sm text-muted-foreground mb-4 max-w-lg mx-auto">
              Reklama para gömmeden önce ürünün gerçek kârını, marjını ve riskini hesapla. KHELL AI sana 0-100 karar
              skoruyla net bir cevap verir. Kayıt olmadan dene.
            </p>
            <button
              onClick={() => navigate("/dashboard/analyzer")}
              className="btn-primary inline-flex items-center gap-2 text-base px-6 py-3"
            >
              Ürünümü Ücretsiz Analiz Et <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* SSS */}
          <h2 className="text-2xl font-bold tracking-tight mb-4">Sık Sorulan Sorular</h2>
          <div className="space-y-4 mb-12">
            {faq.map((f) => (
              <div key={f.q} className="rounded-xl border border-border p-5">
                <h3 className="font-semibold text-foreground mb-2">{f.q}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>

          {/* Alt CTA */}
          <div className="rounded-2xl border border-border bg-card/40 p-8 text-center">
            <h2 className="text-2xl font-bold tracking-tight mb-2">Kârlı ürünü bulmak senin elinde</h2>
            <p className="text-sm text-muted-foreground mb-5 max-w-lg mx-auto">
              Dropshipping'i kârlı yapan tek şey doğru kararlar. İlk ürününü şimdi analiz et, rakamla başla.
            </p>
            <button
              onClick={() => navigate("/dashboard/analyzer")}
              className="btn-primary inline-flex items-center gap-2 text-base px-8 py-3"
            >
              Ücretsiz Başla <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </motion.article>
      </main>

      <BamirFooter />
    </div>
  );
}
