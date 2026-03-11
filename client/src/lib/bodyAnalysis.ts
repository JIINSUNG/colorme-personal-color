export type BodyType =
  | "hourglass"
  | "pear"
  | "apple"
  | "rectangle"
  | "inverted-triangle";

export interface BodyAnalysisResult {
  bodyType: BodyType;
  label: string;
  emoji: string;
  description: string;
  proportions: {
    shoulderWidth: number;
    waistWidth: number;
    hipWidth: number;
  };
  ratios: {
    shoulderToHip: number;
    waistToHip: number;
    shoulderToWaist: number;
  };
  strengths: string[];
  stylingTips: {
    tops: string[];
    bottoms: string[];
    dresses: string[];
    avoid: string[];
  };
}

const bodyTypeData: Record<BodyType, {
  label: string;
  emoji: string;
  description: string;
  strengths: string[];
  stylingTips: BodyAnalysisResult["stylingTips"];
}> = {
  hourglass: {
    label: "모래시계형",
    emoji: "⏳",
    description: "어깨와 엉덩이 너비가 비슷하고 허리가 잘록한 균형 잡힌 체형입니다. 여성스러운 곡선미가 돋보이며, 핏이 좋은 옷이 잘 어울립니다.",
    strengths: ["균형 잡힌 상·하체 비율", "잘록한 허리 라인", "자연스러운 곡선미"],
    stylingTips: {
      tops: ["허리를 강조하는 랩 탑", "V넥 블라우스", "크롭 재킷", "피트된 니트"],
      bottoms: ["하이웨이스트 팬츠", "A라인 스커트", "부츠컷 팬츠", "펜슬 스커트"],
      dresses: ["랩 원피스", "벨트 있는 원피스", "피트 앤 플레어", "바디콘 원피스"],
      avoid: ["박시한 오버사이즈 상의", "허리를 가리는 루즈한 옷", "너무 타이트한 미니 스커트"],
    },
  },
  pear: {
    label: "삼각형(배형)",
    emoji: "🍐",
    description: "엉덩이가 어깨보다 넓은 체형입니다. 하체에 볼륨감이 있어 상체를 강조하는 스타일링으로 균형을 맞추면 더욱 멋스러워집니다.",
    strengths: ["안정감 있는 하체 라인", "가녀린 상체", "여성스러운 힙 라인"],
    stylingTips: {
      tops: ["보트넥 탑", "퍼프 소매 블라우스", "밝은 색상 상의", "어깨 패드 재킷"],
      bottoms: ["A라인 스커트", "부츠컷/와이드 팬츠", "어두운 톤 하의", "하이웨이스트 팬츠"],
      dresses: ["엠파이어 라인 원피스", "A라인 원피스", "오프숄더 원피스", "상체 디테일 원피스"],
      avoid: ["스키니진 단독 착용", "힙에 주머니가 많은 팬츠", "타이트한 펜슬 스커트"],
    },
  },
  apple: {
    label: "사과형(원형)",
    emoji: "🍎",
    description: "상체와 복부에 볼륨이 있고 다리가 날씬한 체형입니다. 하체의 장점을 살리고 상체를 길어 보이게 하는 스타일링이 효과적입니다.",
    strengths: ["날씬한 다리 라인", "풍성한 상체감", "당당한 인상"],
    stylingTips: {
      tops: ["V넥 탑", "세로 스트라이프 셔츠", "엠파이어 라인 탑", "긴 카디건"],
      bottoms: ["스트레이트 팬츠", "부츠컷 팬츠", "미디 스커트", "다리를 드러내는 반바지"],
      dresses: ["엠파이어 웨이스트 원피스", "A라인 원피스", "랩 원피스", "셔츠 원피스"],
      avoid: ["크롭 탑", "허리에 벨트 강조", "타이트한 터틀넥", "배를 강조하는 의류"],
    },
  },
  rectangle: {
    label: "직사각형(일자형)",
    emoji: "📏",
    description: "어깨, 허리, 엉덩이 너비가 비슷한 직선적인 체형입니다. 허리 라인을 만들어주는 스타일링이나 볼륨감을 더하는 디테일이 잘 어울립니다.",
    strengths: ["균일한 체형 라인", "옷을 잘 소화하는 체형", "모던한 인상"],
    stylingTips: {
      tops: ["페플럼 탑", "크롭 재킷", "러플 블라우스", "벨트로 허리 강조"],
      bottoms: ["플리츠 스커트", "카고 팬츠", "플레어 스커트", "주머니 디테일 팬츠"],
      dresses: ["벨트 원피스", "핀턱 원피스", "티어드 원피스", "코르셋 디테일 원피스"],
      avoid: ["일자 실루엣의 시프트 원피스", "박시한 옷만 단독 착용", "허리 라인이 없는 코트"],
    },
  },
  "inverted-triangle": {
    label: "역삼각형",
    emoji: "🔻",
    description: "어깨가 넓고 엉덩이가 좁은 체형입니다. 스포티하고 당당한 인상을 주며, 하체에 볼륨감을 더하는 스타일링으로 균형을 맞출 수 있습니다.",
    strengths: ["넓고 당당한 어깨 라인", "스포티한 인상", "날씬한 하체"],
    stylingTips: {
      tops: ["V넥/U넥 탑", "래글런 소매", "심플한 어두운 상의", "여유있는 실루엣 탑"],
      bottoms: ["와이드 팬츠", "플레어 스커트", "밝은 색상 하의", "카고/조거 팬츠"],
      dresses: ["A라인 원피스", "스커트가 퍼지는 원피스", "하체 디테일 원피스", "오프숄더 회피"],
      avoid: ["어깨 패드 재킷", "보트넥/스퀘어넥", "밝은 색 상의 + 어두운 하의", "퍼프 소매"],
    },
  },
};

function detectPersonSilhouette(
  imageData: ImageData,
  width: number,
  height: number
): { row: number; leftEdge: number; rightEdge: number; bodyWidth: number }[] {
  const grayData: number[] = new Array(width * height);
  for (let i = 0; i < width * height; i++) {
    const idx = i * 4;
    grayData[i] = 0.299 * imageData.data[idx] + 0.587 * imageData.data[idx + 1] + 0.114 * imageData.data[idx + 2];
  }

  const bgSamples: number[] = [];
  const sampleSize = Math.min(20, Math.floor(width * 0.1));
  for (let y = 0; y < height; y += Math.floor(height / 20)) {
    for (let x = 0; x < sampleSize; x++) {
      bgSamples.push(grayData[y * width + x]);
      bgSamples.push(grayData[y * width + (width - 1 - x)]);
    }
  }
  bgSamples.sort((a, b) => a - b);
  const bgMedian = bgSamples[Math.floor(bgSamples.length / 2)];

  const bgColorSamples: { r: number; g: number; b: number }[] = [];
  for (let y = 0; y < height; y += Math.floor(height / 10)) {
    for (let x = 0; x < sampleSize; x++) {
      const idx1 = (y * width + x) * 4;
      bgColorSamples.push({ r: imageData.data[idx1], g: imageData.data[idx1 + 1], b: imageData.data[idx1 + 2] });
      const idx2 = (y * width + (width - 1 - x)) * 4;
      bgColorSamples.push({ r: imageData.data[idx2], g: imageData.data[idx2 + 1], b: imageData.data[idx2 + 2] });
    }
  }
  const avgBg = {
    r: bgColorSamples.reduce((s, c) => s + c.r, 0) / bgColorSamples.length,
    g: bgColorSamples.reduce((s, c) => s + c.g, 0) / bgColorSamples.length,
    b: bgColorSamples.reduce((s, c) => s + c.b, 0) / bgColorSamples.length,
  };

  const threshold = 30;
  const rows: { row: number; leftEdge: number; rightEdge: number; bodyWidth: number }[] = [];

  for (let y = Math.floor(height * 0.05); y < Math.floor(height * 0.95); y += 2) {
    let leftEdge = -1;
    let rightEdge = -1;

    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const dr = Math.abs(imageData.data[idx] - avgBg.r);
      const dg = Math.abs(imageData.data[idx + 1] - avgBg.g);
      const db = Math.abs(imageData.data[idx + 2] - avgBg.b);
      const diff = (dr + dg + db) / 3;
      const grayDiff = Math.abs(grayData[y * width + x] - bgMedian);

      if (diff > threshold || grayDiff > threshold * 1.2) {
        if (leftEdge === -1) leftEdge = x;
        rightEdge = x;
      }
    }

    if (leftEdge !== -1 && rightEdge !== -1 && (rightEdge - leftEdge) > width * 0.05) {
      rows.push({
        row: y,
        leftEdge,
        rightEdge,
        bodyWidth: rightEdge - leftEdge,
      });
    }
  }

  return rows;
}

function smoothWidths(rows: { row: number; bodyWidth: number }[]): number[] {
  const widths = rows.map((r) => r.bodyWidth);
  const smoothed: number[] = [];
  const windowSize = 5;

  for (let i = 0; i < widths.length; i++) {
    const start = Math.max(0, i - windowSize);
    const end = Math.min(widths.length, i + windowSize + 1);
    const slice = widths.slice(start, end).sort((a, b) => a - b);
    smoothed.push(slice[Math.floor(slice.length / 2)]);
  }

  return smoothed;
}

function determineBodyType(
  shoulderWidth: number,
  waistWidth: number,
  hipWidth: number
): BodyType {
  const sToH = shoulderWidth / hipWidth;
  const wToH = waistWidth / hipWidth;
  const sToW = shoulderWidth / waistWidth;

  if (wToH < 0.78 && Math.abs(sToH - 1.0) < 0.15) {
    return "hourglass";
  }
  if (sToH < 0.88) {
    return "pear";
  }
  if (sToH > 1.15) {
    return "inverted-triangle";
  }
  if (wToH > 0.88 && sToW < 1.12) {
    return "rectangle";
  }
  if (wToH > 0.85 && sToH > 1.0) {
    return "apple";
  }
  if (sToH >= 0.88 && sToH <= 1.15 && wToH >= 0.78 && wToH <= 0.88) {
    return "hourglass";
  }

  return "rectangle";
}

export function analyzeBodyType(imageElement: HTMLImageElement): BodyAnalysisResult {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  const maxSize = 480;
  let width = imageElement.naturalWidth || imageElement.width;
  let height = imageElement.naturalHeight || imageElement.height;

  if (width > maxSize || height > maxSize) {
    const scale = maxSize / Math.max(width, height);
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }

  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(imageElement, 0, 0, width, height);

  const imageData = ctx.getImageData(0, 0, width, height);
  const silhouetteRows = detectPersonSilhouette(imageData, width, height);

  if (silhouetteRows.length < 10) {
    return createFallbackResult();
  }

  const smoothed = smoothWidths(silhouetteRows);

  const shoulderZoneStart = Math.floor(silhouetteRows.length * 0.1);
  const shoulderZoneEnd = Math.floor(silhouetteRows.length * 0.3);
  const waistZoneStart = Math.floor(silhouetteRows.length * 0.4);
  const waistZoneEnd = Math.floor(silhouetteRows.length * 0.55);
  const hipZoneStart = Math.floor(silhouetteRows.length * 0.55);
  const hipZoneEnd = Math.floor(silhouetteRows.length * 0.75);

  const shoulderWidths = smoothed.slice(shoulderZoneStart, shoulderZoneEnd);
  const waistWidths = smoothed.slice(waistZoneStart, waistZoneEnd);
  const hipWidths = smoothed.slice(hipZoneStart, hipZoneEnd);

  if (shoulderWidths.length === 0 || waistWidths.length === 0 || hipWidths.length === 0) {
    return createFallbackResult();
  }

  const shoulderWidth = Math.max(...shoulderWidths);
  const waistWidth = Math.min(...waistWidths);
  const hipWidth = Math.max(...hipWidths);

  const bodyType = determineBodyType(shoulderWidth, waistWidth, hipWidth);
  const data = bodyTypeData[bodyType];

  return {
    bodyType,
    label: data.label,
    emoji: data.emoji,
    description: data.description,
    proportions: {
      shoulderWidth: Math.round(shoulderWidth),
      waistWidth: Math.round(waistWidth),
      hipWidth: Math.round(hipWidth),
    },
    ratios: {
      shoulderToHip: Math.round((shoulderWidth / hipWidth) * 100) / 100,
      waistToHip: Math.round((waistWidth / hipWidth) * 100) / 100,
      shoulderToWaist: Math.round((shoulderWidth / waistWidth) * 100) / 100,
    },
    strengths: data.strengths,
    stylingTips: data.stylingTips,
  };
}

function createFallbackResult(): BodyAnalysisResult {
  const data = bodyTypeData["rectangle"];
  return {
    bodyType: "rectangle",
    label: data.label,
    emoji: data.emoji,
    description: data.description + " (전신 사진을 업로드하시면 더 정확한 분석이 가능합니다.)",
    proportions: { shoulderWidth: 0, waistWidth: 0, hipWidth: 0 },
    ratios: { shoulderToHip: 1, waistToHip: 0.9, shoulderToWaist: 1.1 },
    strengths: data.strengths,
    stylingTips: data.stylingTips,
  };
}
