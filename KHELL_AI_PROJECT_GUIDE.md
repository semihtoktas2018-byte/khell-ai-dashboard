# KHELL AI — PROJE REHBERİ

> Bu doküman KHELL AI projesinin resmi geliştirici rehberidir.
> Yeni bir geliştirici veya yapay zekâ asistanı çalışmaya başlamadan önce bu dosyayı okumalıdır.

# 1. Proje

## Amaç

KHELL AI, dropshipping ve e-ticaret ürün araştırması için geliştirilen profesyonel bir SaaS platformudur.

Marka:
- KHELL AI
- khellai.com

Üretici:
A BAMIR ONLINE STORE'S PRODUCTION

# 2. Teknik Altyapı

Frontend
- React
- TypeScript
- Tailwind CSS

Backend
- Supabase
- PostgreSQL
- RLS
- Auth
- Edge Functions

Hosting
- GitHub Pages
- GitHub Actions
- Namecheap DNS

# 3. Geliştirme Felsefesi

Öncelik sırası:

1. Stabilite
2. Geriye uyumluluk
3. Güvenilirlik
4. Performans
5. Yeni özellik

Kurallar:

- Gereksiz refactor yapılmaz.
- Çalışan sistem bozulmaz.
- Küçük patch tercih edilir.
- Sadece istenen dosya değiştirilir.

# 4. AI Çalışma Kuralları

Her AI:

- Önce kodu okur.
- Sonra analiz yapar.
- Risk raporu hazırlar.
- Onay almadan kod yazmaz.
- Build almadan görev tamamlandı demez.
- Tahmin ederek kod üretmez.

# 5. Git Çalışma Şekli

Semih GitHub Web Editor kullanır.

Bu nedenle:

- Her zaman tam dosya teslim edilir.
- Diff verilmez.
- Eksik kod bırakılmaz.
- Ctrl+A → Yapıştır → Commit yöntemi esas alınır.

# 6. Currency Contract

- API'ler varsayılan olarak ham USD döndürür.
- Frontend locale'e göre çevirir.
- ProductAnalyzer dönüşüm kararını verir.
- currencySource=local yalnızca önceden çevrilmiş veriler için kullanılır.
- Manuel girişler çevrilmez.
- Preset senaryolar çevrilmez.
- Double conversion kesinlikle yasaktır.

# 7. Protected Contracts

Aşağıdaki davranışlar korunacaktır:

- API ham USD döndürür.
- RiskAnalysis locale değişince seçili adayı yeniden hesaplar.
- ProductAnalyzer currencySource sözleşmesine uyar.
- Manuel girişler korunur.

# 8. Aktif Modüller

- Product Analyzer
- Risk Analysis
- Winning Products
- Trending Products
- Best Sellers
- Marketplace Calculator
- Store Spy
- eBay Research
- Content Engine
- Decision Engine
- Sales Ledger
- Saved Products
- Price Tracking

# 9. Bekleyen İşler

- Facebook API doğrulaması
- Long-lived Meta Token
- Trendyol desteği
- Sidebar rozetleri
- Footer standardı
- Cloudflare Bot Fight Mode
- Repo private'a alınacak

# 10. Sprint Geçmişi

## Sprint 0

Production Audit tamamlandı.

## Sprint 1

RiskAnalysis locale senkronizasyon hatası giderildi.

## Sprint 2

Currency Source Contract uygulandı.

Güncellenen dosyalar:

- ProductAnalyzer
- StoreSpy
- EbayResearch

Double conversion problemi giderildi.

# 11. Regression Checklist

Her para sistemi değişikliğinden sonra:

- Trending Products
- Best Sellers
- Winning Products
- Daily Winner
- Viral Products
- CJ Product Search
- StoreSpy
- Ebay Research
- Risk Analysis
- Product Analyzer

TR / EN / FR dillerinde test edilir.

# 12. Build Kuralları

Bir görev ancak:

- npm install
- npm run build

başarılı olursa tamamlanmış kabul edilir.

# 13. Definition of Done

Bir sprint tamamlandı sayılmaz:

- Kod analiz edilmeden
- Risk raporu hazırlanmadan
- Onay alınmadan
- Build başarılı olmadan
- Regression testi yapılmadan
- Son rapor teslim edilmeden

# 14. Bug Öncelikleri

Critical
- Yanlış hesaplama
- Yanlış para birimi
- Veri kaybı
- Giriş sistemi

High
- Çalışmayan özellik

Medium
- UI hataları

Low
- Yazım
- Hizalama

# 15. Bilinen Teknik Kararlar

- Currency dönüşümü frontend tarafında yapılır.
- API locale bilmez.
- ProductAnalyzer currencySource sözleşmesini uygular.
- RiskAnalysis locale değişince yeniden hesaplar.

# 16. Roadmap

- Currency Engine v2
- AI Recommendation Engine
- AI Pricing Engine
- Marketplace Engine
- Analytics Dashboard
- Subscription Dashboard
- Admin Dashboard
- Affiliate System

# 17. Sürüm Geçmişi

v0.9
- Production Audit

v0.9.1
- RiskAnalysis locale düzeltmesi

v0.9.2
- Currency Source Contract

v0.9.3
- ProductAnalyzer Currency Flow

---
Son Güncelleme: Temmuz 2026
