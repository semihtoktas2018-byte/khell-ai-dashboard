import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Package, Users, Truck, ListChecks, ArrowRight, Zap, CheckCircle2, AlertTriangle } from "lucide-react";
import SEO from "@/components/SEO";
import BamirFooter from "@/components/BamirFooter";

// SEO Rehber Sayfası — "dropshipping nedir / nasıl yapılır" aramasını hedefler.
// Yeni başlayanları çeker, sonunda ücretsiz analiz aracına (kayıt kapısına) yönlendirir.

const faq = [
  {
    q: "Dropshipping nedir?",
    a: "Dropshipping (stoksuz satış), ürünleri kendi deponda tutmadan sattığın bir e-ticaret modelidir. Müşteri senin mağazandan sipariş verir, sen siparişi tedarikçiye iletirsin, tedarikçi ürünü doğrudan müşteriye gönderir. Sen aradaki fiyat farkından kazanırsın; envanter, depo veya kargo derdiyle uğraşmazsın.",
  },
  {
    q: "Dropshipping'e sıfır sermayeyle başlanır mı?",
    a: "Tamamen sıfırla zor ama çok düşük bütçeyle mümkün. Stok satın almadığın için büyük ön maliyet yok; ama bir mağaza (ücretsiz veya düşük maliyetli platformlar var), ürün araştırması ve en önemlisi reklam/pazarlama için küçük bir bütçe gerekir. Asıl masraf ürün değil, müşteri çekmektir.",
  },
  {
    q: "Dropshipping Türkiye'de yasal mı, vergi gerekir mi?",
    a: "Evet yasaldır, ama düzenli gelir elde etmeye başlayınca şirket kurup vergi mükellefi olman gerekir (gelir vergisi, KDV gibi). E-ihracat yapıyorsan bazı teşvik ve muafiyetler olabilir. Kesin durumun için bir mali müşavire danışmanı öneririm; bu bir hukuki/mali tavsiye değildir.",
  },
  {
    q: "En zor kısmı nedir?",
    a: "Çoğu kişinin sandığının aksine en zor kısım mağaza kurmak değil, doğru ürünü seçmek ve o ürünü kârlı şekilde pazarlamaktır. Yanlış ürünle ne kadar reklam verirsen ver zarar edersin; doğru üründe ise reklam maliyetini kâr karşılar. Bu yüzden işin kalbi ürün araştırmasıdır.",
  },
  {
    q: "Dropshipping kârlı mı?",
    a: "Olabilir — ama otomatik değil. Kârı belirleyen üç şey var: doğru ürün seçimi, sağlıklı kâr marjı (genelde %30 üstü) ve etkili pazarlama. Ürünü duyguyla değil rakamla seçen, marjını hesaplayan ve test ederek ilerleyen kişiler kâr eder; 'güzel görünüyor' deyip körlemesine reklam verenler genelde zarar eder.",
  },
];

const parties = [
  { icon: Users, title: "Satıcı (sen)", body: "Mağazayı kurar, ürünü seçer, fiyatı belirler ve pazarlamayı yaparsın. Müşteriyle muhatap olan taraf sensin." },
  { icon: Package, title: "Tedarikçi", body: "Ürünü elinde tutan, paketleyen ve müşteriye gönderen taraf. AliExpress, CJ Dropshipping gibi platformlar en yaygın olanları." },
  { icon: Truck, title: "Müşteri", body: "Senin mağazandan alışveriş yapan kişi. Ürünü tedarikçiden alır ama muhatabı sensin — memnuniyeti senin işin." },
];

const steps = [
  { n: "1", title: "Niş ve ürün seç", body: "Hangi alanda satacağına karar ver, sonra o alanda talebi yüksek, marjı sağlıklı ürünleri araştır. Bu adım işin en kritik parçası — burada verdiğin karar kâr edip etmeyeceğini belirler." },
  { n: "2", title: "Güvenilir tedarikçi bul", body: "Ürün kalitesi, teslim süresi ve iletişimi iyi bir tedarikçiyle çalış. Yavaş kargo ve kötü ürün, mağazanın itibarını en hızlı bitiren şeydir." },
  { n: "3", title: "Mağazanı kur", body: "Bir e-ticaret platformu seç ve ürünlerini listele. Temiz ürün sayfaları, net fotoğraflar ve güven veren bir tasarım dönüşümü doğrudan etkiler." },
  { n: "4", title: "Pazarla ve test et", body: "Küçük bütçeyle reklam vererek ürünü test et. Tutan ürünü ölçekle, tutmayanı bırak. Duyguyla değil, verdiği sonuçla karar ver." },
];

export default function DropshippingNedir() {
  const navigate = useNavigate();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "Dropshipping Nedir, Nasıl Yapılır? (2026 Başlangıç Rehberi)",
        description:
          "Dropshipping (stoksuz satış) nedir, nasıl çalışır ve nasıl başlanır? Adım adım başlangıç rehberi ve ürünlerini ücretsiz analiz edebileceğin araç.",
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
        title="Dropshipping Nedir, Nasıl Yapılır? 2026 Başlangıç Rehberi | KHELL AI"
        description="Dropshipping (stoksuz satış) nedir, nasıl çalışır ve nasıl başlanır? Adım adım başlangıç rehberi ve ürünlerini ücretsiz analiz edebileceğin araç."
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      {/* Üst bar */}
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
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Başlangıç Rehberi · 2026</p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Dropshipping Nedir, Nasıl Yapılır?
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            Dropshipping, yani stoksuz satış; ürünleri kendi deponda tutmadan, düşük sermayeyle başlayabileceğin bir
            e-ticaret modelidir. Depo yok, stok riski yok, kargo derdi yok. Bu rehberde modelin nasıl çalıştığını,
            nasıl başlanacağını ve kâr etmenin işin hangi adımına bağlı olduğunu sade bir dille anlatıyorum.
          </p>

          {/* Nasıl çalışır */}
          <h2 className="text-2xl font-bold tracking-tight mb-4">Dropshipping nasıl çalışır?</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-5">
            Modelin temelinde üç taraf var. İşleyiş basit: müşteri senden sipariş verir, sen siparişi tedarikçiye
            iletirsin, tedarikçi ürünü doğrudan müşteriye gönderir. Sen aradaki fiyat farkını kazanırsın.
          </p>
          <div className="grid sm:grid-cols-3 gap-4 mb-10">
            {parties.map((p) => (
              <div key={p.title} className="rounded-xl border border-border p-5 bg-card/40">
                <div className="h-9 w-9 rounded-lg bg-primary/15 flex items-center justify-center mb-3">
                  <p.icon className="h-4.5 w-4.5 text-primary" />
                </div>
                <h3 className="font-bold tracking-tight mb-1.5">{p.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>

          {/* Nasıl başlanır */}
          <h2 className="text-2xl font-bold tracking-tight mb-4">Adım adım nasıl başlanır?</h2>
          <div className="space-y-4 mb-10">
            {steps.map((s) => (
              <div key={s.n} className="flex gap-4 rounded-xl border border-border p-5 bg-card/40">
                <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground font-bold flex items-center justify-center shrink-0">
                  {s.n}
                </div>
                <div>
                  <h3 className="text-lg font-bold tracking-tight mb-1">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.body}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Ara CTA */}
          <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6 text-center mb-10">
            <div className="flex justify-center mb-3">
              <ListChecks className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-xl font-bold tracking-tight mb-2">İşin kalbi: doğru ürünü seçmek</h2>
            <p className="text-sm text-muted-foreground mb-4 max-w-lg mx-auto">
              Yukarıdaki adımların içinde kâr edip etmeyeceğini belirleyen tek şey ürün seçimidir. KHELL AI'a fiyat,
              maliyet, kargo ve reklam giderini gir; kâr marjını, riskini ve 0-100 karar skorunu saniyede gör. Kayıt
              olmadan dene.
            </p>
            <button
              onClick={() => navigate("/dashboard/analyzer")}
              className="btn-primary inline-flex items-center gap-2 text-base px-6 py-3"
            >
              Ürünümü Ücretsiz Analiz Et <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Avantaj / dezavantaj */}
          <h2 className="text-2xl font-bold tracking-tight mb-4">Avantajları ve dezavantajları</h2>
          <div className="grid sm:grid-cols-2 gap-4 mb-10">
            <div className="rounded-xl border border-winning/30 p-5 bg-card/40">
              <h3 className="font-bold text-winning mb-3">Avantajlar</h3>
              <div className="space-y-2">
                {["Düşük başlangıç sermayesi", "Stok ve depo riski yok", "Her yerden yönetilebilir", "Ürün çeşidini kolay değiştirirsin"].map((x) => (
                  <div key={x} className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-winning shrink-0 mt-0.5" /><span className="text-sm text-foreground">{x}</span></div>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-risky/30 p-5 bg-card/40">
              <h3 className="font-bold text-risky mb-3">Dezavantajlar</h3>
              <div className="space-y-2">
                {["Rekabet yüksek", "Kâr marjları görece düşük olabilir", "Kargo ve kaliteyi kontrol edemezsin", "Pazarlama becerisi şart"].map((x) => (
                  <div key={x} className="flex items-start gap-2"><AlertTriangle className="h-4 w-4 text-risky shrink-0 mt-0.5" /><span className="text-sm text-foreground">{x}</span></div>
                ))}
              </div>
            </div>
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
            <h2 className="text-2xl font-bold tracking-tight mb-2">Başlamadan önce ilk ürününü test et</h2>
            <p className="text-sm text-muted-foreground mb-5 max-w-lg mx-auto">
              Mağaza kurmaya başlamadan önce aklındaki ürünün gerçekten kâr edip etmeyeceğini gör. Tahminle değil,
              rakamla başla.
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
