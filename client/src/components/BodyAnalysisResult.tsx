import { motion } from "framer-motion";
import { useState } from "react";
import { Ruler, Shirt, CircleDot, Ban, TrendingUp, ArrowRightLeft, Eye } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { BodyAnalysisResult } from "@/lib/bodyAnalysis";
import { getStyleImage } from "@/lib/styleImages";

interface Props {
  result: BodyAnalysisResult;
}

function ProportionBar({ label, value, maxValue, color }: { label: string; value: number; maxValue: number; color: string }) {
  const percent = maxValue > 0 ? (value / maxValue) * 100 : 50;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium text-xs text-muted-foreground">
          {value > 0 ? `${value}px` : "-"}
        </span>
      </div>
      <div className="h-3 rounded-full bg-muted overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.max(percent, 15)}%` }}
          transition={{ duration: 0.8, delay: 0.3 }}
        />
      </div>
    </div>
  );
}

function BodyStyleItem({ item, testId }: { item: string; testId: string }) {
  const [expanded, setExpanded] = useState(false);
  const image = getStyleImage(item);

  if (!image) {
    return (
      <div
        className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
        data-testid={testId}
      >
        <CircleDot className="w-3.5 h-3.5 text-primary flex-shrink-0" />
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

export function BodyAnalysisResultCard({ result }: Props) {
  const maxWidth = Math.max(
    result.proportions.shoulderWidth,
    result.proportions.waistWidth,
    result.proportions.hipWidth,
    1
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className="space-y-6"
    >
      <Card className="p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-900/40 dark:to-indigo-900/40 flex items-center justify-center text-2xl flex-shrink-0">
            {result.emoji}
          </div>
          <div className="flex-1">
            <h3 className="font-serif font-bold text-2xl tracking-tight mb-1" data-testid="text-body-type-label">
              체형: {result.label}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed" data-testid="text-body-type-description">
              {result.description}
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2" data-testid="heading-proportions">
              <Ruler className="w-4 h-4 text-primary" />
              체형 비율
            </h4>
            <div className="space-y-3">
              <ProportionBar
                label="어깨"
                value={result.proportions.shoulderWidth}
                maxValue={maxWidth}
                color="bg-gradient-to-r from-blue-400 to-cyan-400"
              />
              <ProportionBar
                label="허리"
                value={result.proportions.waistWidth}
                maxValue={maxWidth}
                color="bg-gradient-to-r from-emerald-400 to-teal-400"
              />
              <ProportionBar
                label="엉덩이"
                value={result.proportions.hipWidth}
                maxValue={maxWidth}
                color="bg-gradient-to-r from-purple-400 to-pink-400"
              />
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2" data-testid="heading-ratios">
              <ArrowRightLeft className="w-4 h-4 text-primary" />
              비율 지표
            </h4>
            <div className="space-y-3">
              {[
                { label: "어깨 : 엉덩이", value: result.ratios.shoulderToHip },
                { label: "허리 : 엉덩이", value: result.ratios.waistToHip },
                { label: "어깨 : 허리", value: result.ratios.shoulderToWaist },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-muted/50" data-testid={`ratio-${i}`}>
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  <span className="text-sm font-semibold font-mono">{item.value.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2" data-testid="heading-strengths">
          <TrendingUp className="w-4 h-4 text-primary" />
          체형 장점
        </h4>
        <div className="flex flex-wrap gap-2 mb-6">
          {result.strengths.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9 + i * 0.1 }}
            >
              <div
                className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium"
                data-testid={`strength-${i}`}
              >
                {s}
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h4 className="font-semibold text-lg mb-5 flex items-center gap-2" data-testid="heading-body-styling">
          <Shirt className="w-5 h-5 text-primary" />
          체형별 스타일링 추천
        </h4>

        <Tabs defaultValue="tops" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6" data-testid="tabs-body-styling">
            <TabsTrigger value="tops" className="text-xs sm:text-sm" data-testid="tab-tops">상의</TabsTrigger>
            <TabsTrigger value="bottoms" className="text-xs sm:text-sm" data-testid="tab-bottoms">하의</TabsTrigger>
            <TabsTrigger value="dresses" className="text-xs sm:text-sm" data-testid="tab-dresses">원피스</TabsTrigger>
            <TabsTrigger value="avoid" className="text-xs sm:text-sm" data-testid="tab-body-avoid">피하기</TabsTrigger>
          </TabsList>

          {(["tops", "bottoms", "dresses"] as const).map((category) => (
            <TabsContent key={category} value={category}>
              <div className="grid sm:grid-cols-2 gap-3">
                {result.stylingTips[category].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <BodyStyleItem item={item} testId={`body-tip-${category}-${i}`} />
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          ))}

          <TabsContent value="avoid">
            <div className="grid sm:grid-cols-2 gap-3">
              {result.stylingTips.avoid.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <div
                    className="flex items-center gap-3 p-3 rounded-xl bg-destructive/5 hover:bg-destructive/10 transition-colors"
                    data-testid={`body-avoid-${i}`}
                  >
                    <Ban className="w-3.5 h-3.5 text-destructive flex-shrink-0" />
                    <span className="text-sm">{item}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </motion.div>
  );
}
