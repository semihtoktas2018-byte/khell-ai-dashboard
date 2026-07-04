import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

// Bir sayfa içinde beklenmeyen bir hata (undefined veri, bozuk prop vs.) oluşursa
// tüm uygulamanın kararmasını engeller — sadece o bölümde dostane bir uyarı gösterir.
export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, errorMessage: "" };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error.message || "Bilinmeyen hata" };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary yakaladı:", error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, errorMessage: "" });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center gap-4 py-20 px-6 text-center">
          <div className="p-3 rounded-full bg-destructive/10 border border-destructive/30">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Bu bölümde beklenmedik bir hata oluştu.</p>
            <p className="text-xs text-muted-foreground mt-1">Diğer sayfalar etkilenmedi. Aşağıdaki butonla tekrar deneyebilir veya sayfayı yenileyebilirsin.</p>
            <p className="text-[10px] text-muted-foreground/70 mt-2 font-mono">{this.state.errorMessage}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={this.handleReset}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Tekrar Dene
            </button>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-1.5 text-xs font-medium px-4 py-2 rounded-lg border border-border bg-card hover:bg-accent text-muted-foreground transition-colors"
            >
              Sayfayı Yenile
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
