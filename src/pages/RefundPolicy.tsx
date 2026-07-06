import { useLocale } from "@/contexts/LocaleContext";
import BackButton from "@/components/BackButton";
import SEO from "@/components/SEO";

export default function RefundPolicy() {
  const { locale } = useLocale();
  const isTr = locale === "tr";

  return (
    <div className="min-h-screen bg-background px-6 py-10">
      <SEO title={isTr ? "İade ve Teslimat | KHELL AI" : "Refund & Delivery | KHELL AI"} description={isTr ? "KHELL AI iade ve teslimat politikası" : "KHELL AI refund and delivery policy"} />
      <div className="max-w-3xl mx-auto">
        <BackButton />
        <h1 className="text-2xl font-bold text-foreground mt-4 mb-6">
          {isTr ? "İade, İptal ve Teslimat Politikası" : "Refund, Cancellation & Delivery Policy"}
        </h1>
        <p className="text-xs text-muted-foreground mb-8">
          {isTr ? "Son güncelleme: Temmuz 2026" : "Last updated: July 2026"}
        </p>

        <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
          <div>
            <h2 className="text-base font-semibold text-foreground mb-2">
              {isTr ? "Dijital Hizmet Teslimatı" : "Digital Service Delivery"}
            </h2>
            <p>
              {isTr
                ? "KHELL AI dijital bir abonelik hizmetidir. Ödemeniz onaylandıktan sonra Pro özellikleriniz anında hesabınıza tanımlanır. Fiziksel bir ürün gönderimi yoktur."
                : "KHELL AI is a digital subscription service. Once your payment is confirmed, your Pro features are activated on your account instantly. There is no physical product shipment."}
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-foreground mb-2">
              {isTr ? "Abonelik İptali" : "Subscription Cancellation"}
            </h2>
            <p>
              {isTr
                ? "Aboneliğinizi istediğiniz zaman iptal edebilirsiniz. İptal sonrası mevcut ödeme döneminizin sonuna kadar Pro özelliklerinden yararlanmaya devam edersiniz."
                : "You can cancel your subscription at any time. After cancellation, you continue to enjoy Pro features until the end of your current billing period."}
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-foreground mb-2">
              {isTr ? "İade Koşulları" : "Refund Conditions"}
            </h2>
            <p>
              {isTr
                ? "Dijital hizmet olması nedeniyle, satın alma sonrası hizmet kullanılmaya başlandıysa iade genel olarak yapılmaz. Ancak teknik bir sorun nedeniyle hizmete erişemediyseniz, satın alma tarihinden itibaren 14 gün içinde bizimle iletişime geçerek iade talep edebilirsiniz. Talepler tek tek değerlendirilir."
                : "As a digital service, refunds are generally not provided once the service has been used after purchase. However, if you could not access the service due to a technical issue, you may request a refund by contacting us within 14 days of purchase. Requests are evaluated case by case."}
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-foreground mb-2">
              {isTr ? "İade Talebi" : "Refund Requests"}
            </h2>
            <p>
              {isTr ? "İade veya iptal talepleriniz için: " : "For refund or cancellation requests: "}
              <a href="mailto:bamir.global@gmail.com" className="text-primary hover:underline">bamir.global@gmail.com</a>
              {isTr ? " adresine yazın ya da " : " or "}
              <a href="https://wa.me/905446452430" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">WhatsApp</a>
              {isTr ? " üzerinden ulaşın." : " us."}
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-foreground mb-2">
              {isTr ? "Satıcı Bilgileri" : "Seller Information"}
            </h2>
            <p>
              Bamir Global — KHELL AI<br />
              {isTr ? "E-posta: " : "Email: "}
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
