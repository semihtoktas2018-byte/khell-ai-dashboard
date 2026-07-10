import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Smartphone, Sparkles, PawPrint, Home, Palette, Leaf, ArrowRight, Zap } from "lucide-react";
import SEO from "@/components/SEO";
import BamirFooter from "@/components/BamirFooter";

// SEO Rehber Sayfası — "2026 trend dropshipping ürünleri" aramasını hedefler.
// Kategoriler evergreen ve dürüst; kesin satış rakamı iddiası YOK.

const faq = [
  {
    q: "2026'da hangi kategoriler trend?",
    a: "Öne çıkan kategoriler: teknoloji aksesuarları, kozmetik ve kişisel bakım, evcil hayvan ürünleri, ev & mutfak pratik ürünleri, kişiselleştirilebilir ürünler ve sürdürülebilir/çevre dostu ürünler. Bunlar geniş kitleye hitap eder ve genelde kargosu uygun, marjı sağlıklı ürünler barındırır.",
  },
  {
    q: "Trend ürün seçmek yeterli mi?",
    a: "Hayır. Bir kategorinin trend olması o üründen kâr edeceğin anlamına gelmez. Trend, sadece talep sinyalidir. Kâr için o trendin içinden marjı sağlıklı, rekabeti doymamış ve pazarlanabilir bir ürünü seçip rakamla doğrulaman gerekir.",
  },
  {
    q: "Trend ürünün riski nedir?",
    a: "Trend ürünlerin en büyük riski doygunluktur — bir ürün viral olduğunda herkes aynı anda satmaya başlar, fiyatlar düşer, reklam maliyeti artar. Bu yüzden trendi erken yakalamak ve farklı bir açıyla pazarlamak, geç kalıp kalabalığa katılmaktan çok daha kârlıdır.",
  },
  {
    q: "Hangi ürünlerden uzak durmalı?",
    a: "Aşırı ağır veya kırılgan (kargo maliyeti ve iade riski yüksek), yasal/marka riski taşıyan taklit ürünler ve tamamen doymuş, herkesin sattığı ürünlerden uzak dur. Ayrıca çok ucuz ama marjı düşük ürünler, ciro yaratsa da kâr bırakmaz.",
  },
];

const categories = [
  { icon: Smartphone, title: "Teknoloji aksesuarları", body: "Kablosuz şarj stantları, telefon tutucular, ergonomik masa ürünleri. Sürekli talep, düşük maliyet, geniş kitle." },
  { icon: Sparkles, title: "Kozmetik & kişisel bakım", body: "Cilt bakımı, doğal/organik ürünler, makyaj aksesuarları. Tekrar eden satın alma potansiyeli yüksek." },
  { icon: PawPrint, title: "Evcil hayvan ürünleri", body: "Bakım ürünleri, oyuncaklar, aksesuarlar. Sahiplerin harcamaktan çekinmediği, büyüyen bir pazar." },
  { icon: Home, title: "Ev & mutfak", body: "Pratik düzenleyiciler, yer kazandıran çözümler, küçük mutfak yardımcıları. Bir sorunu çözen ürünler öne çıkar." },
  { icon: Palette, title: "Kişiselleştirilebilir ürünler", body: "İsme/tasarıma özel ürünler. Seri üretime göre çok daha yüksek marj imkânı verir." },
  { icon: Leaf, title: "Sürdürülebilir ürünler", body: "Çevre dostu, tekrar kullanılabilir ürünler. Bilinçli tüketicinin ilgi gösterdiği yükselen bir alan." },
];

export default function TrendUrunler2026() {
  const navigate = useNavigate();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "2026 Trend Dropshipping Ürünleri ve Kategorileri",
        description:
          "2026'da öne çıkan dropshipping kategorileri: teknoloji, kozmetik, evcil hayvan, ev & mutfak, kişiselleştirilebilir ve sürdürülebilir ürünler. Ürünlerini ücretsiz analiz et.",
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
        title="2026 Trend Dropshipping Ürünleri ve Kategorileri | KHELL AI"
        description="2026'da öne çıkan dropshipping kategorileri: teknoloji, kozmetik, evcil hayvan, ev & mutfak, kişiselleştirilebilir ve sürdürülebilir ürünler. Ürünlerini ücretsiz analiz et."
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
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Trend Rehberi · 2026</p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            2026 Trend Dropshipping Ürünleri
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            2026'da hangi kategoriler öne çıkıyor? Aşağıda güçlü talep gören ana kategorileri topladım. Ama önemli bir
            uyarıyla: trend olmak tek başına kâr getirmez — trend sadece talep sinyalidir. Asıl iş, o trendin içinden
            marjı sağlıklı, rekabeti doymamış ürünü seçmektir.
          </p>

          {/* Kategoriler */}
          <div className="grid sm:grid-cols-2 gap-4 mb-10">
            {categories.map((c) => (
              <div key={c.title} className="rounded-xl border border-border p-5 bg-card/40">
                <div className="h-9 w-9 rounded-lg bg-primary/15 flex items-center justify-center mb-3">
                  <c.icon className="h-4.5 w-4.5 text-primary" />
                </div>
                <h2 className="font-bold tracking-tight mb-1.5">{c.title}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{c.body}</p>
              </div>
            ))}
          </div>

          {/* Ara CTA */}
          <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6 text-center mb-10">
            <h2 className="text-xl font-bold tracking-tight mb-2">Trendi kâra çevir</h2>
            <p className="text-sm text-muted-foreground mb-4 max-w-lg mx-auto">
              Beğendiğin trend üründen kâr edip edemeyeceğini önceden gör. Fiyat ve maliyeti gir, KHELL AI marjını,
              riskini ve karar skorunu hesaplasın. Kayıt olmadan dene.
            </p>
            <button
              onClick={() => navigate("/dashboard/analyzer")}
              className="btn-primary inline-flex items-center gap-2 text-base px-6 py-3"
            >
              Ürünümü Ücretsiz Analiz Et <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Trendi doğru okuma */}
          <h2 className="text-2xl font-bold tracking-tight mb-3">Trendi doğru okumak</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-10">
            Bir ürün viral olduğunda herkes aynı anda satmaya başlar; fiyatlar düşer, reklam pahalanır ve pazar hızla
            doyar. Bu yüzden kazanan strateji, trendi erken yakalayıp farklı bir açıyla pazarlamaktır. Geç kalıp
            kalabalığa katılmak yerine, yükselen ama henüz doymamış ürünleri rakamla doğrulayarak seç.
          </p>

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
            <h2 className="text-2xl font-bold tracking-tight mb-2">Trend ürününü şimdi test et</h2>
            <p className="text-sm text-muted-foreground mb-5 max-w-lg mx-auto">
              Kategoriyi seçtin, sıra ürünü doğrulamada. İlk analizini ücretsiz yap, kazananı bul.
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
