import { useLocale } from "@/contexts/LocaleContext";
import BackButton from "@/components/BackButton";
import SEO from "@/components/SEO";

export default function TermsOfService() {
  const { locale } = useLocale();
  const isTr = locale === "tr";

  return (
    <div className="min-h-screen bg-background px-6 py-10">
      <SEO title={isTr ? "Kullanım Şartları | KHELL AI" : "Terms of Service | KHELL AI"} description={isTr ? "KHELL AI kullanım şartları" : "KHELL AI terms of service"} />
      <div className="max-w-3xl mx-auto">
        <BackButton />
        <h1 className="text-2xl font-bold text-foreground mt-4 mb-6">
          {isTr ? "Kullanım Şartları" : "Terms of Service"}
        </h1>
        <p className="text-xs text-muted-foreground mb-8">
          {isTr ? "Son güncelleme: Temmuz 2026" : "Last updated: July 2026"}
        </p>

        <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
          <p>
            {isTr
              ? "KHELL AI'ı (Bamir Global) kullanarak aşağıdaki şartları kabul etmiş olursunuz. Lütfen dikkatlice okuyun."
              : "By using KHELL AI (Bamir Global), you agree to the following terms. Please read them carefully."}
          </p>

          <div>
            <h2 className="text-base font-semibold text-foreground mb-2">
              {isTr ? "Hizmetin Kapsamı" : "Scope of Service"}
            </h2>
            <p>
              {isTr
                ? "KHELL AI, dropshipping ürün araştırması, kâr ve risk analizi, rakip analizi ve içerik üretimi gibi araçlar sunan bir SaaS platformudur. Sunulan analizler ve skorlar bilgilendirme amaçlıdır ve yatırım veya ticari garanti niteliği taşımaz."
                : "KHELL AI is a SaaS platform offering tools like dropshipping product research, profit and risk analysis, competitor analysis, and content generation. The analyses and scores provided are for informational purposes and do not constitute investment or commercial guarantees."}
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-foreground mb-2">
              {isTr ? "Hesap Sorumluluğu" : "Account Responsibility"}
            </h2>
            <p>
              {isTr
                ? "Hesabınızın güvenliğinden siz sorumlusunuz. Hesabınız üzerinden yapılan işlemlerden siz sorumlu tutulursunuz."
                : "You are responsible for the security of your account. You are responsible for actions taken through your account."}
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-foreground mb-2">
              {isTr ? "Kabul Edilebilir Kullanım" : "Acceptable Use"}
            </h2>
            <p>
              {isTr
                ? "Platformu yasa dışı amaçlarla, verilerimizi kopyalamak veya sistemimize zarar vermek için kullanamazsınız. Kötüye kullanım durumunda hesabınız askıya alınabilir."
                : "You may not use the platform for illegal purposes, to scrape our data, or to harm our systems. Your account may be suspended in case of misuse."}
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-foreground mb-2">
              {isTr ? "Abonelik ve Ödeme" : "Subscription & Payment"}
            </h2>
            <p>
              {isTr
                ? "Pro abonelik Shopier üzerinden ödenir. Ücretsiz plan sınırlı kullanım sunar. Fiyatlar önceden bildirilerek değiştirilebilir; erken erişim döneminde başlayan kullanıcılar avantajlı fiyattan yararlanabilir."
                : "Pro subscription is paid via Shopier. The free plan offers limited usage. Prices may change with prior notice; users who join during the early access period may benefit from early pricing."}
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-foreground mb-2">
              {isTr ? "Sorumluluk Reddi" : "Disclaimer"}
            </h2>
            <p>
              {isTr
                ? "Platform 'olduğu gibi' sunulur. Ürün seçimi ve ticari kararlarınızın sonuçlarından KHELL AI sorumlu değildir. Verdiğimiz veriler üçüncü taraf kaynaklardan gelir ve doğruluğu garanti edilmez."
                : "The platform is provided 'as is'. KHELL AI is not responsible for the outcomes of your product selection and commercial decisions. Our data comes from third-party sources and accuracy is not guaranteed."}
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-foreground mb-2">
              {isTr ? "İletişim" : "Contact"}
            </h2>
            <p>
              {isTr ? "Sorularınız için: " : "For questions: "}
              <a href="mailto:bamir.global@gmail.com" className="text-primary hover:underline">bamir.global@gmail.com</a>
            </p>
          </div>
        </div>

        <p className="text-center text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 mt-12">
          A BAMIR ONLINE STORE'S PRODUCTION
        </p>
      </div>
    </div>
  );
}
