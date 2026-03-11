import { motion } from "framer-motion";
import { ArrowLeft, Palette, Shirt, Gem, Scissors, Heart, Ban, Droplets, Sun, Moon, Eye, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import type { ColorAnalysisResult } from "@/lib/colorAnalysis";
import type { BodyAnalysisResult } from "@/lib/bodyAnalysis";
import { BodyAnalysisResultCard } from "./BodyAnalysisResult";
import { getStyleImage } from "@/lib/styleImages";
import { useState } from "react";

const seasonGradients: Record<string, string> = {
  spring: "from-amber-400 via-orange-300 to-yellow-300",
  summer: "from-blue-300 via-purple-300 to-pink-300",
  autumn: "from-orange-600 via-red-500 to-amber-500",
  winter: "from-blue-600 via-indigo-500 to-purple-600",
};

const seasonBgColors: Record<string, string> = {
  spring: "bg-amber-50 dark:bg-amber-950/30",
  summer: "bg-blue-50 dark:bg-blue-950/30",
  autumn: "bg-orange-50 dark:bg-orange-950/30",
  winter: "bg-indigo-50 dark:bg-indigo-950/30",
};

const seasonEmojis: Record<string, string> = {
  spring: "🌸",
  summer: "🌊",
  autumn: "🍂",
  winter: "❄️",
};

interface Props {
  colorResult: ColorAnalysisResult;
  bodyResult: BodyAnalysisResult;
  previewUrl: string | null;
  onReset: () => void;
}

function ColorSwatch({ color, size = "md" }: { color: string; size?: "sm" | "md" | "lg" }) {
  const sizeClass = size === "sm" ? "w-8 h-8" : size === "lg" ? "w-14 h-14" : "w-10 h-10";
  return (
    <div
      className={`${sizeClass} rounded-xl border border-black/5 dark:border-white/10 shadow-sm transition-transform hover:scale-110`}
      style={{ backgroundColor: color }}
      title={color}
      data-testid={`color-swatch-${color}`}
    />
  );
}

function MetricBar({ label, value, icon, color }: { label: string; value: number; icon: React.ReactNode; color: string }) {
  const normalizedValue = ((value + 100) / 200) * 100;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          {icon}
          <span>{label}</span>
        </div>
        <span className="font-medium">{value > 0 ? "+" : ""}{Math.round(value)}</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${normalizedValue}%` }}
          transition={{ duration: 0.8, delay: 0.3 }}
        />
      </div>
    </div>
  );
}

function StyleItemCard({ item, image, testId }: { item: string; image: string | null; testId: string }) {
  const [expanded, setExpanded] = useState(false);

  if (!image) {
    return (
      <div
        className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
        data-testid={testId}
      >
        <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
        <span className="text-sm">{item}</span>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl bg-muted/50 hover:bg-muted transition-all cursor-pointer overflow-hidden"
      data-testid={testId}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-center gap-3 p-3">
        <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 border border-border/50">
          <img src={image} alt={item} className="w-full h-full object-cover" loading="lazy" />
        </div>
        <span className="text-sm flex-1">{item}</span>
        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-muted-foreground"
        >
          <Eye className="w-3.5 h-3.5" />
        </motion.div>
      </div>
      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="px-3 pb-3"
        >
          <div className="rounded-lg overflow-hidden border border-border/30">
            <img src={image} alt={item} className="w-full h-auto object-contain" />
          </div>
        </motion.div>
      )}
    </div>
  );
}

export function AnalysisResult({ colorResult, bodyResult, previewUrl, onReset }: Props) {
  const gradient = seasonGradients[colorResult.seasonGroup];
  const bgColor = seasonBgColors[colorResult.seasonGroup];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <section className={`relative overflow-hidden ${bgColor}`}>
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5`} />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-12">
          <Button
            variant="ghost"
            size="sm"
            className="mb-6 gap-2 text-muted-foreground hover:text-foreground"
            onClick={onReset}
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4" />
            다시 분석하기
          </Button>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex-shrink-0"
            >
              {previewUrl && (
                <div className="relative">
                  <div className={`absolute -inset-1 rounded-2xl bg-gradient-to-br ${gradient} opacity-50 blur-sm`} />
                  <img
                    src={previewUrl}
                    alt="분석된 사진"
                    className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-2xl object-cover shadow-lg"
                    data-testid="img-analyzed"
                  />
                  <div className="absolute -bottom-3 -right-3 w-12 h-12 rounded-xl bg-background shadow-lg flex items-center justify-center text-2xl">
                    {seasonEmojis[colorResult.seasonGroup]}
                  </div>
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex-1 space-y-4"
            >
              <div className="flex flex-wrap gap-2 mb-1">
                <Badge variant="secondary" className="text-xs" data-testid="badge-season-sub">
                  {colorResult.seasonSubLabel}
                </Badge>
                <Badge variant="outline" className="text-xs" data-testid="badge-body-type">
                  {bodyResult.emoji} {bodyResult.label}
                </Badge>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight" data-testid="text-season-label">
                {colorResult.seasonLabel}
              </h2>
              <p className="text-muted-foreground leading-relaxed max-w-lg" data-testid="text-season-description">
                {colorResult.description}
              </p>
              <div className="flex items-center gap-3 pt-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Droplets className="w-4 h-4" />
                  <span>피부톤:</span>
                </div>
                <div
                  className="w-8 h-8 rounded-lg border border-black/10 dark:border-white/10 shadow-sm"
                  style={{
                    backgroundColor: `rgb(${colorResult.skinTone.r}, ${colorResult.skinTone.g}, ${colorResult.skinTone.b})`,
                  }}
                  data-testid="skin-tone-swatch"
                />
                <span className="text-sm font-mono text-muted-foreground">
                  RGB({colorResult.skinTone.r}, {colorResult.skinTone.g}, {colorResult.skinTone.b})
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-5 flex items-center gap-2" data-testid="heading-analysis-metrics">
              <Eye className="w-5 h-5 text-primary" />
              피부톤 분석 지표
            </h3>
            <div className="grid gap-5 sm:grid-cols-3">
              <MetricBar
                label="웜/쿨"
                value={colorResult.warmth}
                icon={colorResult.warmth > 0 ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                color={colorResult.warmth > 0 ? "bg-gradient-to-r from-orange-400 to-amber-400" : "bg-gradient-to-r from-blue-400 to-indigo-400"}
              />
              <MetricBar
                label="선명도"
                value={colorResult.clarity}
                icon={<Palette className="w-4 h-4" />}
                color="bg-gradient-to-r from-pink-400 to-rose-400"
              />
              <MetricBar
                label="깊이감"
                value={colorResult.depth}
                icon={<Droplets className="w-4 h-4" />}
                color="bg-gradient-to-r from-purple-400 to-violet-400"
              />
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid md:grid-cols-2 gap-6"
        >
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2" data-testid="heading-best-colors">
              <Heart className="w-5 h-5 text-primary" />
              베스트 컬러
            </h3>
            <p className="text-sm text-muted-foreground mb-5">
              이 색상들은 당신의 피부톤을 가장 밝고 건강하게 보이게 해줍니다.
            </p>
            <div className="flex flex-wrap gap-3" data-testid="best-colors-grid">
              {colorResult.bestColors.map((color, i) => (
                <motion.div
                  key={color}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + i * 0.05 }}
                >
                  <ColorSwatch color={color} size="lg" />
                </motion.div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2" data-testid="heading-avoid-colors">
              <Ban className="w-5 h-5 text-muted-foreground" />
              피해야 할 컬러
            </h3>
            <p className="text-sm text-muted-foreground mb-5">
              이 색상들은 피부톤과 맞지 않아 칙칙해 보일 수 있습니다.
            </p>
            <div className="flex flex-wrap gap-3" data-testid="avoid-colors-grid">
              {colorResult.avoidColors.map((color, i) => (
                <motion.div
                  key={color}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + i * 0.05 }}
                >
                  <div className="relative">
                    <ColorSwatch color={color} size="lg" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-[2px] h-[70%] bg-white/70 dark:bg-white/50 rotate-45 rounded-full shadow" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-5 flex items-center gap-2" data-testid="heading-recommendations">
              <Sparkles className="w-5 h-5 text-primary" />
              컬러 맞춤 스타일 추천
            </h3>

            <Tabs defaultValue="makeup" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6" data-testid="tabs-recommendations">
                <TabsTrigger value="makeup" className="gap-1.5 text-xs sm:text-sm" data-testid="tab-makeup">
                  <Palette className="w-3.5 h-3.5 hidden sm:block" />
                  메이크업
                </TabsTrigger>
                <TabsTrigger value="fashion" className="gap-1.5 text-xs sm:text-sm" data-testid="tab-fashion">
                  <Shirt className="w-3.5 h-3.5 hidden sm:block" />
                  패션
                </TabsTrigger>
                <TabsTrigger value="accessories" className="gap-1.5 text-xs sm:text-sm" data-testid="tab-accessories">
                  <Gem className="w-3.5 h-3.5 hidden sm:block" />
                  액세서리
                </TabsTrigger>
                <TabsTrigger value="hair" className="gap-1.5 text-xs sm:text-sm" data-testid="tab-hair">
                  <Scissors className="w-3.5 h-3.5 hidden sm:block" />
                  헤어
                </TabsTrigger>
              </TabsList>

              {(["makeup", "fashion", "accessories", "hair"] as const).map((category) => (
                <TabsContent key={category} value={category}>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {colorResult.recommendations[category].map((item, i) => {
                      const image = getStyleImage(item);
                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          <StyleItemCard item={item} image={image} testId={`recommendation-${category}-${i}`} />
                        </motion.div>
                      );
                    })}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </Card>
        </motion.div>

        <div className="py-2">
          <Separator />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
          className="text-center"
        >
          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight mb-2" data-testid="heading-body-section">
            체형 분석 결과
          </h2>
          <p className="text-muted-foreground text-sm mb-8">
            이미지 실루엣을 기반으로 분석한 체형 타입과 스타일링 팁입니다.
          </p>
        </motion.div>

        <BodyAnalysisResultCard result={bodyResult} />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="flex justify-center pt-4"
        >
          <Button
            onClick={onReset}
            size="lg"
            className="gap-2 px-8"
            data-testid="button-analyze-again"
          >
            <ArrowLeft className="w-4 h-4" />
            다른 사진으로 분석하기
          </Button>
        </motion.div>
      </section>
    </motion.div>
  );
}
