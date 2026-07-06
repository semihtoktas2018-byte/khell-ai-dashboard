import { useLocale } from "@/contexts/LocaleContext";
import BackButton from "@/components/BackButton";
import SEO from "@/components/SEO";

export default function PrivacyPolicy() {
  const { locale } = useLocale();
  const isTr = locale === "tr";

  return (
    <div className="min-h-screen bg-background px-6 py-10">
      <SEO title={isTr ? "Gizlilik Politikası | KHELL AI" : "Privacy Policy | KHELL AI"} description={isTr ? "KHELL AI gizlilik politikası" : "KHELL AI privacy policy"} />
      <div className="max-w-3xl mx-auto">
        <BackButton />
        <h1 className="text-2xl font-bold text-foreground mt-4 mb-6">
          {isTr ? "Gizlilik Politikası" : "Privacy Policy"}
        </h1>
        <p className="text-xs text-muted-foreground mb-8">
          {isTr ? "Son güncelleme: Temmuz 2026" : "Last updated: July 2026"}
        </p>

        <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
          <p>
            {isTr
              ? "KHELL AI (Bamir Global) olarak gizliliğinize önem veriyoruz. Bu politika, hangi verileri topladığımızı, nasıl kullandığımızı ve nasıl koruduğumuzu açıklar."
              : "At KHELL AI (Bamir Global), we care about your privacy. This policy explains what data we collect, how we use it, and how we protect it."}
          </p>

          <div>
            <h2 className="text-base font-semibold text-foreground mb-2">
              {isTr ? "Topladığımız Veriler" : "Data We Collect"}
            </h2>
            <p>
              {isTr
                ? "Hesap oluşturduğunuzda e-posta adresinizi ve Google ile giriş yapıyorsanız temel profil bilgilerinizi toplarız. Platformu kullanırken yaptığınız analizler ve tercihleriniz hesabınızla ilişkilendirilir. Ayrıca site kullanımını anlamak için anonim analiz verileri (Google Analytics) toplarız."
                : "When you create an account, we collect your email address and, if you sign in with Google, basic profile information. Analyses and preferences you make while using the platform are linked to your account. We also collect anonymous usage data (Google Analytics) to understand site usage."}
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-foreground mb-2">
              {isTr ? "Verileri Nasıl Kullanıyoruz" : "How We Use Data"}
            </h2>
            <p>
              {isTr
                ? "Verilerinizi hizmeti sağlamak, hesabınızı yönetmek, deneyimi iyileştirmek ve size destek olmak için kullanırız. Verilerinizi üçüncü taraflara satmayız."
                : "We use your data to provide the service, manage your account, improve the experience, and support you. We do not sell your data to third parties."}
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-foreground mb-2">
              {isTr ? "Üçüncü Taraf Hizmetler" : "Third-Party Services"}
            </h2>
            <p>
              {isTr
                ? "Ürün verileri için CJ Dropshipping ve eBay API'lerini, kimlik doğrulama ve veri saklama için Supabase'i, ödeme için Shopier'i, analiz için Google Analytics'i kullanırız. Bu hizmetlerin kendi gizlilik politikaları geçerlidir."
                : "We use CJ Dropshipping and eBay APIs for product data, Supabase for authentication and storage, Shopier for payments, and Google Analytics for analytics. These services have their own privacy policies."}
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-foreground mb-2">
              {isTr ? "Haklarınız" : "Your Rights"}
            </h2>
            <p>
              {isTr
                ? "Verilerinize erişme, düzeltme veya silinmesini talep etme hakkınız vardır. Bunun için bizimle iletişime geçebilirsiniz."
                : "You have the right to access, correct, or request deletion of your data. Contact us to exercise these rights."}
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
