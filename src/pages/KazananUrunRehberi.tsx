import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Target, TrendingUp, ShieldCheck, CheckCircle2, ArrowRight, Zap } from "lucide-react";
import SEO from "@/components/SEO";
import BamirFooter from "@/components/BamirFooter";

// SEO Rehber Sayfası — "kazanan ürün nasıl bulunur" aramasını hedefler.
// Amaç: önce gerçek değer ver, sonra ücretsiz analiz aracına (kayıt kapısına) yönlendir.

const faq = [
  {
    q: "Kazanan ürün nedir?",
    a: "Kazanan ürün; talebi yüksek, kâr marjı sağlıklı (genelde %30 üstü) ve rekabeti aşırı doymamış olan üründür. Yani hem insanların istediği hem de üzerine para koyabileceğin bir ürün. Tek bir kritere değil, talep + marj + rekabet üçlüsüne birden bakarak karar verilir.",
  },
  {
    q: "Dropshipping'de ürün araştırması nasıl yapılır?",
    a: "Sağlıklı bir araştırma dört adımdan oluşur: talep sinyallerini bul (arama trendleri, sosyal medyada dönen içerikler, aktif reklamlar), ürünü kârlılık açısından doğrula (satış fiyatı eksi maliyet + kargo + reklam), rekabeti ölç (kaç satıcı var, ne kadar doymuş) ve son olarak 'bu bir sorunu çözüyor mu, anlık satın aldırıyor mu' diye elden geçir.",
  },
  {
    q: "Kâr marjı ne kadar olmalı?",
    a: "Genel kural: brüt marj %30'un altındaysa risklidir, çünkü reklam maliyeti dalgalandığında zarara geçmesi kolaydır. %30 ve üstü marj sana test edip ölçekleme alanı bırakır. Marjın düşükse önce fiyatı gözden geçir, sonra tedarikçiyle pazarlık et veya kargo/reklam giderini kıs.",
  },
  {
    q: "Ücretsiz ürün araştırma aracı var mı?",
    a: "Evet. KHELL AI'ın ürün analiz aracı; girdiğin fiyat, maliyet, kargo ve reklam giderine göre kâr marjını, risk düzeyini ve 0-100 arası bir karar skorunu saniyeler içinde hesaplar. Kayıt olmadan denemeye başlayabilirsin.",
  },
  {
    q: "Hangi ürünler dropshipping için uygun?",
    a: "İyi bir dropshipping ürünü genelde şu özellikleri taşır: kargosu ucuz/hafif, geniş kitleye hitap eden, anlık satın aldıran, gerçek bir sorunu çözen ve üzerine sağlıklı marj konabilen. Aşırı kırılgan, çok ağır veya yasal/marka riski taşıyan ürünlerden uzak dur.",
  },
];

const steps = [
  {
    icon: Target,
    title: "1. Talebi doğrula",
    body: "Önce insanlar bu ürünü gerçekten istiyor mu ona bak. Arama trendleri, sosyal medyada dönen videolar ve aktif reklamlar en güçlü talep sinyalleridir. Bir ürünün reklamı uzun süredir dönüyorsa, birileri para kazandığı için döndürüyordur.",
  },
  {
    icon: TrendingUp,
    title: "2. Kârı hesapla",
    body: "Satış fiyatından ürün maliyeti, kargo ve reklam giderini çıkar. Geriye kalan gerçek kârın. Marj %30 altındaysa reklam maliyeti biraz oynadığında zarara geçmen işten değil. Bu hesabı gözünde değil, net rakamla yap.",
  },
  {
    icon: Search,
    title: "3. Rekabeti ölç",
    body: "Kaç satıcı aynı ürünü satıyor, pazar ne kadar doymuş? Devasa markalarla değil, yeni yükselen küçük mağazalarla yarışmak daha akıllıca. Böylece doymuş pazara girmeden, satışı kanıtlanmış ürünleri yakalarsın.",
  },
  {
    icon: ShieldCheck,
    title: "4. Elden geçir (validasyon)",
    body: "Tek bir reklam kuruşu harcamadan önce sor: Gerçek bir sorunu çözüyor mu? Anlık satın aldırıyor mu? Farklı bir açıyla pazarlanabilir mi? Bu üç sorudan geçemeyen ürüne para gömme.",
  },
];

export default function KazananUrunRehberi() {
  const navigate = useNavigate();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "Kazanan Ürün Nasıl Bulunur? (2026 Dropshipping Rehberi)",
        description:
          "Dropshipping'de kazanan ürün bulmanın 4 adımlık sistemi: talep, kâr marjı, rekabet ve validasyon. Ücretsiz analiz aracıyla ürünlerini saniyeler içinde puanla.",
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
        title="Kazanan Ürün Nasıl Bulunur? 2026 Dropshipping Rehberi | KHELL AI"
        description="Dropshipping'de kazanan ürün bulmanın 4 adımlık sistemi: talep, kâr marjı, rekabet ve validasyon. Ücretsiz analiz aracıyla ürünlerini saniyeler içinde puanla."
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
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Dropshipping Rehberi · 2026</p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Kazanan Ürün Nasıl Bulunur?
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            Dropshipping'de kâr eden mağaza ile para kaybeden mağaza arasındaki fark neredeyse her zaman ürün seçimine
            dayanır. İyi haber şu: kazanan ürün bulmak şans işi değil, tekrarlanabilir bir sistem. Bu rehberde o sistemi
            dört adımda anlatıyorum — sonunda ürünlerini saniyeler içinde puanlayabileceğin ücretsiz bir araç da var.
          </p>

          {/* Adımlar */}
          <div className="space-y-4 mb-10">
            {steps.map((s) => (
              <div key={s.title} className="rounded-xl border border-border p-5 bg-card/40">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-9 w-9 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
                    <s.icon className="h-4.5 w-4.5 text-primary" />
                  </div>
                  <h2 className="text-lg font-bold tracking-tight">{s.title}</h2>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>

          {/* Ara CTA */}
          <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6 text-center mb-10">
            <h2 className="text-xl font-bold tracking-tight mb-2">Bu 4 adımı senin yerine yapan bir araç</h2>
            <p className="text-sm text-muted-foreground mb-4 max-w-lg mx-auto">
              Fiyat, maliyet, kargo ve reklam giderini gir; KHELL AI sana anında kâr marjını, risk düzeyini ve 0-100
              arası bir karar skorunu versin. Kayıt olmadan denemeye başla.
            </p>
            <button
              onClick={() => navigate("/dashboard/analyzer")}
              className="btn-primary inline-flex items-center gap-2 text-base px-6 py-3"
            >
              Ürünümü Ücretsiz Analiz Et <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Kontrol listesi */}
          <h2 className="text-2xl font-bold tracking-tight mb-4">Ürün seçmeden önce hızlı kontrol listesi</h2>
          <div className="space-y-2.5 mb-10">
            {[
              "Kargosu ucuz ve hafif mi?",
              "Gerçek bir sorunu çözüyor ya da anlık satın aldırıyor mu?",
              "Satış fiyatı eksi tüm maliyetler sonrası marj %30 üstünde mi?",
              "Rakipleri devasa markalar değil, yükselen küçük mağazalar mı?",
              "Farklı bir açıyla, kendi markanla pazarlanabilir mi?",
              "Yasal veya marka (taklit) riski taşımıyor mu?",
            ].map((item) => (
              <div key={item} className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-winning shrink-0 mt-0.5" />
                <span className="text-sm text-foreground">{item}</span>
              </div>
            ))}
          </div>

          {/* Sık yapılan hata */}
          <h2 className="text-2xl font-bold tracking-tight mb-3">En sık yapılan hata</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-10">
            Çoğu yeni satıcı sadece "güzel görünen" ürüne âşık olup marjı ve rekabeti hiç hesaplamadan reklama başlar.
            Ürün satar gibi görünür ama reklam gideri kârı yer, sonunda ciro var kâr yok. Bu yüzden duygu değil, rakam
            karar versin: her ürünü test etmeden önce net kârını ve risk düzeyini gör.
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
            <h2 className="text-2xl font-bold tracking-tight mb-2">Hazırsan ilk ürününü şimdi puanla</h2>
            <p className="text-sm text-muted-foreground mb-5 max-w-lg mx-auto">
              Tahminle değil, rakamla karar ver. KHELL AI ile ürünlerini analiz et, kazananları ölçeklendir,
              kaybedenlere para gömme.
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
