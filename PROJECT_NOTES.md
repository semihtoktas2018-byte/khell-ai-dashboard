# KHELL AI — Proje Notları (Claude için)

> Bu dosya, gelecekteki sohbetlerde projeye hızlı adapte olmak için var.
> Her önemli değişiklikten sonra güncellenmeli.

## Proje nedir

KHELL AI (khellai.com) — dropshipping/e-ticaret araştırma SaaS'ı.
"Bamir Global / Bamir Online Store's Production" şemsiyesi altında,
Semih Toktaş tarafından tek başına geliştiriliyor (GitHub web editörü +
Supabase + Claude ile, yerel dev ortamı yok).

Kardeş projeler: KELTOŞ (kripto sinyal platformu), BIMOR (mobilya ihracat),
Bulak Trans (lojistik müşteri sitesi).

## Teknik yapı

* Frontend: React + TypeScript + Tailwind, repo: `khell-ai-dashboard` (GitHub, şu an bilerek public)
* Hosting: GitHub Pages (khellai.com), Namecheap DNS, GitHub Actions ile otomatik deploy
* Backend: Supabase (Auth, Postgres + RLS, Edge Functions)
* Edge Functions: `anthropic-proxy`, `cj-proxy`, `ebay-proxy`, `fb-ad-proxy`, `check-prices`, `shopier-webhook`, `store-spy`
* Ödeme: Shopier (TR 249₺ / global $29-€29)
* Analytics: GA4 (G-89C6E0SPJJ) + Microsoft Clarity (xjpsyi06e6)

## Sabit kurallar (her zaman uygulanır)

* Her sayfada/projede footer imzası: "A BAMIR ONLINE STORE'S PRODUCTION"
  (mevcut stil: camgöbeği/cyan kutu, `hsl(222 47% 6%)` arka plan, `hsl(217 32% 17%)` border)
* Hosting tercihi: GitHub Pages > Netlify (Netlify kredi sorunu yaşanmıştı)
* Yeni özellik öncesi: roadmap ver (riskler, maliyet, alternatif) — sonra kodla
* Semih dosyaları GitHub web arayüzünden Ctrl+A → yapıştır → commit ile ekliyor,
  bu yüzden HER ZAMAN tam dosya (diff değil) veriyoruz
* Client-facing metinlerde "AI/GPT destekli" ifadesi kullanılmaz
* AI API çağrılarında model string: `claude-sonnet-5`

## Sidebar / tasarım tercihleri (Temmuz 2026 itibariyle)

* Sidebar ikonları: emoji stiline geçildi (📊 🧮 📈 🔥 🏆 🚚 vs.) — DashboardLayout.tsx `navKeys` dizisinde `emoji` alanı var
* Nav label'larında emoji + soldaki emoji ikon çakışmasın diye LocaleContext'teki
  etiket sonu emojileri (nav.trending, nav.bestsellers, nav.storeSpy) temizlendi
* CJ Dropshipping (📦) ve eBay (🛒) sidebar'da "Tedarikçiler" altında harici link
  olarak duruyor (yeni sekmede cjdropshipping.com / ebay.com açıyor)
* Genel tema: koyu lacivert/siyah zemin + mavi/camgöbeği neon glow.
  `index.css`'te `.panel-glow`, `.pill-glow`, `.stat-glow` reusable class'ları var
* Renkli rozet + sağ etiket (LIVE/HOT/TREND/BEST gibi) stili konuşuldu, henüz
  koda uygulanmadı — bir sonraki sohbette bu noktadan devam edilebilir

## Aktif özellikler (kısa liste)

* Ürün Analizi, Kazanan Ürünler, Trend Ürünler, En Çok Satanlar, Tedarikçiler,
  Risk Analizi, Ürün Sayfası Oluşturucu, Satış Karar Motoru, İçerik Motoru,
  Kaydedilenler, Satış Defteri, Mağaza Spy (Shopify), eBay Araştırma (gerçek Browse API),
  Reklam Casusu (Meta Ad Library EU/UK — FB_ACCESS_TOKEN gerekiyor, kimlik doğrulama
  süreci Temmuz 2026'da başlatıldı), Fiyat Takibi
* Kullanıcı giriş takibi: `profiles.last_login` / `login_count`, admin paneli `/dashboard/users`
  (admin kontrolü `is_admin` + recursion-safe `public.is_admin()` fonksiyonu ile)
* Landing page: splash ekranı → PromoIntro (tanıtım görseli) → gerçek anasayfa

## Bekleyen işler

* Facebook Ad Library API: kimlik doğrulama (facebook.com/ID) tamamlanmadı,
  o olmadan `fb-ad-proxy` "permission" hatası veriyor
* Access token kısa ömürlü (birkaç saatte düşüyor) — 60 günlük long-lived token'a geçirilmeli
* Sidebar'a renkli rozet + etiket tasarımı (LIVE/HOT/TREND vs.) uygulanabilir
* Diğer sayfalara (Trend Ürünler, Risk Analizi, Satış Karar Motoru vs.) footer imzası eklenmedi
* StoreSpy'a Trendyol desteği (şu an sadece Shopify)
* KELTOŞ: Telegram webhook (feedback → VIP erişim) Edge Function'ı yazılmadı
* khell-ai-dashboard repo'su geliştirme bitince private yapılmalı

## Bot trafiği / analytics notu

GA4'te ciddi bot şüphesi var (800x600 çözünürlük, düşük etkileşim oranı, tuhaf
küçük şehirler). `BotSignal.tsx` ile GA4'e `traffic_quality_check` event'i eklendi.
Kalıcı çözüm için Cloudflare (Bot Fight Mode) önerildi, henüz uygulanmadı.

## Currency Contract

Tüm yeni veri kaynakları aşağıdaki sözleşmeye uymalıdır:

* Ham USD gönderen kaynaklar varsayılan davranışı kullanır.
* Yerel para biriminde veri gönderen kaynaklar URL'de `currencySource=local` parametresini ekler.
* ProductAnalyzer bu sözleşmeye göre karar verir.
* Yeni sayfalar eklenirken bu kurala uyulmalıdır.

  ## Currency Contract

  KHELL AI'da para sistemi aşağıdaki kurallara göre çalışır.

  * API kaynakları varsayılan olarak ham USD gönderir.
  * Kullanıcının manuel girdiği değerler asla otomatik çevrilmez.
  * Preset senaryolar örnek veridir; locale değişiminde yeniden hesaplanmaz.
  * Yerel para biriminde veri gönderen sayfalar URL'de:
    currencySource=local
    parametresini eklemelidir.
  * ProductAnalyzer bu parametreye göre karar verir.
  * currencySource yoksa veri ham USD kabul edilir.
  * Double conversion kesinlikle yasaktır.

    ## Sprint History

    ### Sprint 0

    Production Audit tamamlandı.

    ### Sprint 1

    RiskAnalysis locale bug düzeltildi.

    ### Sprint 2

    Currency Source Contract oluşturuldu.

    StoreSpy
    EbayResearch
    ProductAnalyzer

    currencySource mantığına geçirildi.

    ## Regression Checklist

    Her para sistemi değişikliğinden sonra:

    ☐ Trending Products

    ☐ Best Sellers

    ☐ Winning Products

    ☐ Daily Winner

    ☐ Viral Products

    ☐ StoreSpy

    ☐ Ebay Research

    ☐ Risk Analysis

    ☐ Product Analyzer

    TR

    EN

    FR

    senaryoları test edilir.

    ## Protected Contracts

    Aşağıdaki davranışlar korunmalıdır.

    * API varsayılan olarak USD döndürür.

    * ProductAnalyzer locale dönüşümünden sorumludur.

    * RiskAnalysis kendi locale senkronizasyonunu yönetir.

    * Preset senaryolar locale değişiminde yeniden hesaplanmaz.

    * Manuel girişler otomatik çevrilmez.

      ## Build Rules

      Hiçbir görev

      npm run build

      başarılı olmadan tamamlanmış sayılmaz.

      Build sonucu rapora eklenmelidir.

      ## Git Workflow

      Semih GitHub Web Editor kullanır.

      Bu nedenle:

      Her zaman tam dosya teslim edilir.

      Diff verilmez.

      Eksik kod bırakılmaz.

      Commit öncesi build alınır.

      ## Known Technical Decisions

      2026

      Currency sistemi

      API tarafında çevrilmez.

      Frontend locale'e göre çevirir.

      ---

      RiskAnalysis

      Locale değişiminde seçili aday yeniden apply edilir.

      ---

      ProductAnalyzer

      currencySource=local

      parametresiyle double conversion engellenir.

      ## Future Roadmap

      Currency Engine v2

      Marketplace Engine

      AI Recommendation Engine

      AI Pricing Engine

      Analytics Dashboard

      Subscription Dashboard

      Admin Dashboard

      Affiliate System

      ## AI Working Rules

      Her AI:

      Önce kodu okur.

      Sonra analiz yapar.

      Onay almadan kod yazmaz.

      Build almadan görev tamamlandı demez.

      Tahmin ederek kod üretmez.

      Mevcut çalışan sistemi korur.

      # Definition of Done (DoD)

      Bir görev aşağıdaki şartlar sağlanmadan tamamlanmış sayılmaz.

      * Kod analiz edildi.
      * Risk raporu hazırlandı.
      * Onay alındı.
      * Sadece gerekli dosyalar değiştirildi.
      * Build başarılı.
      * Regression testi yapıldı.
      * Yeni kritik bug oluşmadı.
      * Rapor teslim edildi.

        # Bug Severity

        Critical

        * Yanlış hesaplama
        * Yanlış para birimi
        * Veri kaybı
        * Login problemi
          High
        * Özellik çalışmıyor
          Medium
        * Görsel hata
          Low
        * Yazım
        * UI hizalama
