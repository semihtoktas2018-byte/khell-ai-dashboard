import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, Mail, Lock, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import SEO from "@/components/SEO";

const transition = { type: "spring" as const, stiffness: 300, damping: 30 };

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();
  const { login, signup, loginWithGoogle } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
        toast({ title: "Giriş başarılı", description: "Dashboard'a yönlendiriliyorsunuz..." });
        navigate("/dashboard");
      } else {
        await signup(name, email, password);
        toast({
          title: "Kayıt başarılı",
          description: "E-posta adresinize gönderilen doğrulama bağlantısına tıklayın.",
        });
      }
    } catch (err: any) {
      toast({
        title: "Hata",
        description: err?.message || "Bir şeyler yanlış gitti",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      toast({
        title: "Hata",
        description: err?.message || "Google ile giriş yapılamadı",
        variant: "destructive",
      });
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <SEO
        title="Giriş Yap veya Kayıt Ol — KHELL AI"
        description="KHELL AI hesabınıza giriş yapın veya ücretsiz kayıt olun. AI destekli e-ticaret kârlılık ve viral ürün analizine erişin."
      />
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={transition}
        className="relative card-glow rounded-2xl p-8 w-full max-w-md"
      >
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
            <Zap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground tracking-tight">KHELL AI</span>
        </div>

        <h1 className="text-xl font-semibold text-foreground text-center mb-1">
          {isLogin ? "Giriş Yap" : "Hesap Oluştur"}
        </h1>
        <p className="text-sm text-muted-foreground text-center mb-6">
          {isLogin ? "Hesabınıza giriş yapın" : "Ücretsiz hesap oluşturun"}
        </p>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={googleLoading}
          className="w-full flex items-center justify-center gap-2 border border-border rounded-lg py-2.5 mb-4 bg-white text-gray-800 font-medium hover:bg-gray-50 transition disabled:opacity-50"
        >
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.8 32.4 29.4 35 24 35c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 5.3 29.5 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.5 0 20-7.6 20-21 0-1.2-.1-2.3-.4-3.5z"/>
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 7.3 29.5 5 24 5c-7.7 0-14.3 4.4-17.7 10.7z"/>
            <path fill="#4CAF50" d="M24 43c5.3 0 10.1-2 13.6-5.4l-6.3-5.3C29.3 34 26.8 35 24 35c-5.3 0-9.8-3.4-11.4-8.1l-6.5 5C9.6 38.6 16.2 43 24 43z"/>
            <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1 3-3.1 5.5-5.9 7.2l6.3 5.3C39.9 37.5 44 31.5 44 24c0-1.2-.1-2.3-.4-3.5z"/>
          </svg>
          {googleLoading ? "Yönlendiriliyor..." : "Google ile devam et"}
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground">veya</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="İsim" required className="input-dark w-full pl-10" />
            </div>
          )}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input type="email" name="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-posta" required className="input-dark w-full pl-10" />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input type="password" name="password" autoComplete={isLogin ? "current-password" : "new-password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Şifre" required minLength={6} className="input-dark w-full pl-10" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
            {loading ? "İşleniyor..." : isLogin ? "Giriş Yap" : "Kayıt Ol"}
          </button>
        </form>

        <p className="text-xs text-muted-foreground text-center mt-6">
          {isLogin ? "Hesabınız yok mu?" : "Zaten hesabınız var mı?"}{" "}
          <button onClick={() => setIsLogin(!isLogin)} className="text-primary hover:underline font-medium">
            {isLogin ? "Kayıt Ol" : "Giriş Yap"}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
