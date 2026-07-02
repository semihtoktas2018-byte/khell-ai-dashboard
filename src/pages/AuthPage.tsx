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
  const navigate = useNavigate();
  const { login, signup } = useAuth();
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
        {/* Logo */}
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

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="İsim" required className="input-dark w-full pl-10" />
            </div>
          )}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-posta" required className="input-dark w-full pl-10" />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Şifre" required minLength={6} className="input-dark w-full pl-10" />
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
