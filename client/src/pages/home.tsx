import { useState, useCallback, useRef } from "react";
import { Upload, Camera, Sparkles, Shield, Zap, ChevronDown, User, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { analyzePersonalColor, type ColorAnalysisResult } from "@/lib/colorAnalysis";
import { analyzeBodyType, type BodyAnalysisResult } from "@/lib/bodyAnalysis";
import { AnalysisResult } from "@/components/AnalysisResult";

type AppState = "idle" | "analyzing" | "result" | "error";

export default function Home() {
  const [state, setState] = useState<AppState>("idle");
  const [colorResult, setColorResult] = useState<ColorAnalysisResult | null>(null);
  const [bodyResult, setBodyResult] = useState<BodyAnalysisResult | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("이미지 파일만 업로드할 수 있습니다.");
      setState("error");
      return;
    }

    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      setError("파일 크기가 10MB를 초과합니다. 더 작은 이미지를 사용해주세요.");
      setState("error");
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setProgress(0);
    setError("");
    setProgressLabel("이미지 로딩 중...");

    let progressInterval: ReturnType<typeof setInterval> | null = null;

    try {
      setState("analyzing");

      progressInterval = setInterval(() => {
        setProgress((p) => Math.min(p + Math.random() * 10, 40));
      }, 200);

      const img = new Image();
      img.crossOrigin = "anonymous";
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("이미지를 불러올 수 없습니다."));
        img.src = url;
      });

      if (progressInterval) clearInterval(progressInterval);
      progressInterval = null;

      setProgress(30);
      setProgressLabel("피부톤 분석 중...");

      progressInterval = setInterval(() => {
        setProgress((p) => Math.min(p + Math.random() * 8, 60));
      }, 150);

      const colorAnalysis = await analyzePersonalColor(img);

      if (progressInterval) clearInterval(progressInterval);
      progressInterval = null;

      setProgress(65);
      setProgressLabel("체형 분석 중...");

      progressInterval = setInterval(() => {
        setProgress((p) => Math.min(p + Math.random() * 10, 90));
      }, 150);

      const bodyAnalysis = analyzeBodyType(img);

      if (progressInterval) clearInterval(progressInterval);
      progressInterval = null;
      setProgress(100);

      await new Promise((r) => setTimeout(r, 400));
      setColorResult(colorAnalysis);
      setBodyResult(bodyAnalysis);
      setState("result");

      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
    } catch (err: any) {
      setError(err.message || "분석 중 오류가 발생했습니다.");
      setState("error");
    } finally {
      if (progressInterval) clearInterval(progressInterval);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleReset = useCallback(() => {
    setState("idle");
    setColorResult(null);
    setBodyResult(null);
    setPreviewUrl(null);
    setError("");
    setProgress(0);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const isProcessing = state === "analyzing";

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-pink-400 flex items-center justify-center" data-testid="logo-icon">
              <Sparkles className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="font-serif font-bold text-xl tracking-tight" data-testid="logo-text">ColorMe</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">100% 온디바이스 처리</span>
          </div>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {state !== "result" && (
          <motion.section
            key="hero"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-pink-50/30 to-background dark:from-primary/10 dark:via-pink-950/20 dark:to-background" />
            <div className="absolute top-20 left-1/4 w-72 h-72 rounded-full bg-primary/5 blur-3xl" />
            <div className="absolute top-40 right-1/4 w-96 h-96 rounded-full bg-pink-200/20 blur-3xl" />

            <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-12">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="text-center max-w-2xl mx-auto"
              >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6" data-testid="badge-ai">
                  <Zap className="w-3.5 h-3.5" />
                  AI 퍼스널컬러 & 체형 분석
                </div>

                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.15] mb-5" data-testid="heading-title">
                  나에게 어울리는
                  <br />
                  <span className="bg-gradient-to-r from-primary via-pink-500 to-orange-400 bg-clip-text text-transparent">
                    스타일
                  </span>
                  을 찾아보세요
                </h1>

                <p className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-lg mx-auto" data-testid="text-description">
                  사진 한 장으로 AI가 퍼스널컬러와 체형을 함께 분석합니다.
                  <br className="hidden sm:block" />
                  모든 분석은 브라우저에서 직접 처리되어 안전합니다.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                className="max-w-lg mx-auto"
              >
                <Card
                  className={`relative overflow-hidden transition-all duration-300 ${
                    dragOver
                      ? "border-primary border-2 bg-primary/5 scale-[1.02]"
                      : "border-dashed border-2 border-border hover:border-primary/50 hover:bg-card/80"
                  } ${isProcessing ? "pointer-events-none" : "cursor-pointer"}`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => !isProcessing && fileInputRef.current?.click()}
                  data-testid="upload-area"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFile(file);
                    }}
                    data-testid="input-file"
                  />

                  <AnimatePresence mode="wait">
                    {isProcessing && previewUrl ? (
                      <motion.div
                        key="processing"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="p-8 sm:p-10"
                      >
                        <div className="flex flex-col items-center gap-6">
                          <div className="relative w-32 h-32 rounded-2xl overflow-hidden ring-4 ring-primary/20">
                            <img
                              src={previewUrl}
                              alt="업로드된 사진"
                              className="w-full h-full object-cover"
                              data-testid="img-preview"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                          </div>

                          <div className="w-full max-w-xs space-y-3">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground" data-testid="text-progress-label">
                                {progressLabel}
                              </span>
                              <span className="font-medium text-primary" data-testid="text-progress-value">
                                {Math.round(progress)}%
                              </span>
                            </div>
                            <div className="h-2 rounded-full bg-muted overflow-hidden">
                              <motion.div
                                className="h-full rounded-full bg-gradient-to-r from-primary to-pink-400"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.3 }}
                                data-testid="progress-bar"
                              />
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            >
                              <Sparkles className="w-4 h-4 text-primary" />
                            </motion.div>
                            <span className="text-sm text-muted-foreground">
                              사진이 서버로 전송되지 않습니다
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="upload"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="p-8 sm:p-12"
                      >
                        <div className="flex flex-col items-center gap-5">
                          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-pink-100 dark:to-pink-900/30 flex items-center justify-center">
                            <Upload className="w-7 h-7 text-primary" />
                          </div>
                          <div className="text-center space-y-2">
                            <p className="font-semibold text-lg" data-testid="text-upload-title">사진을 업로드하세요</p>
                            <p className="text-sm text-muted-foreground">
                              드래그 앤 드롭 또는 클릭하여 선택
                            </p>
                          </div>
                          <div className="flex gap-3">
                            <Button
                              variant="default"
                              size="sm"
                              className="gap-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                fileInputRef.current?.click();
                              }}
                              data-testid="button-upload"
                            >
                              <Camera className="w-4 h-4" />
                              사진 선택
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            JPG, PNG, WebP (최대 10MB)
                          </p>
                          <p className="text-xs text-muted-foreground/70 text-center">
                            전신 사진을 올리면 체형 분석이 더 정확합니다
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>

                {state === "error" && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-center"
                    data-testid="error-message"
                  >
                    <p className="text-sm text-destructive font-medium">{error}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2 text-destructive hover:text-destructive"
                      onClick={handleReset}
                      data-testid="button-retry"
                    >
                      다시 시도
                    </Button>
                  </motion.div>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-16 grid grid-cols-1 sm:grid-cols-4 gap-4 max-w-3xl mx-auto"
              >
                {[
                  {
                    icon: <Palette className="w-5 h-5" />,
                    title: "퍼스널컬러",
                    desc: "피부톤 기반 컬러 분석",
                  },
                  {
                    icon: <User className="w-5 h-5" />,
                    title: "체형 분석",
                    desc: "실루엣 기반 체형 판별",
                  },
                  {
                    icon: <Shield className="w-5 h-5" />,
                    title: "개인정보 보호",
                    desc: "사진이 서버에 저장되지 않음",
                  },
                  {
                    icon: <Zap className="w-5 h-5" />,
                    title: "빠른 분석",
                    desc: "몇 초 안에 결과 확인",
                  },
                ].map((feature, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                  >
                    <Card className="p-5 text-center hover:bg-card/80 transition-colors" data-testid={`card-feature-${i}`}>
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3 text-primary">
                        {feature.icon}
                      </div>
                      <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
                      <p className="text-xs text-muted-foreground">{feature.desc}</p>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>

              {state === "idle" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                  className="flex justify-center mt-12"
                >
                  <ChevronDown className="w-5 h-5 text-muted-foreground/40 animate-bounce" />
                </motion.div>
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {state === "result" && colorResult && bodyResult && (
        <div ref={resultRef}>
          <AnalysisResult
            colorResult={colorResult}
            bodyResult={bodyResult}
            previewUrl={previewUrl}
            onReset={handleReset}
          />
        </div>
      )}

      <footer className="border-t border-border/50 py-8 mt-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs text-muted-foreground" data-testid="text-footer">
            ColorMe - AI 퍼스널컬러 & 체형 분석 서비스 | 모든 분석은 브라우저에서 처리됩니다
          </p>
        </div>
      </footer>
    </div>
  );
}
