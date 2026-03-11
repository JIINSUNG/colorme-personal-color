export type PersonalColorSeason =
  | "spring-warm"
  | "spring-light"
  | "summer-cool"
  | "summer-mute"
  | "autumn-warm"
  | "autumn-deep"
  | "winter-cool"
  | "winter-vivid";

export interface ColorAnalysisResult {
  season: PersonalColorSeason;
  seasonGroup: "spring" | "summer" | "autumn" | "winter";
  seasonLabel: string;
  seasonSubLabel: string;
  description: string;
  skinTone: { r: number; g: number; b: number };
  skinHSL: { h: number; s: number; l: number };
  warmth: number;
  clarity: number;
  depth: number;
  bestColors: string[];
  avoidColors: string[];
  recommendations: {
    makeup: string[];
    fashion: string[];
    accessories: string[];
    hair: string[];
  };
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

function isSkinPixel(r: number, g: number, b: number): boolean {
  const hsl = rgbToHsl(r, g, b);

  if (r <= 40 || hsl.l < 15 || hsl.l > 92) return false;

  const rgRule = r > 80 && g > 30 && b > 15 &&
    r > g && r > b &&
    Math.abs(r - g) > 10 &&
    (r - b) > 15;

  const hslRule = ((hsl.h >= 0 && hsl.h <= 55) || hsl.h >= 340) &&
    hsl.s > 8 &&
    hsl.s < 75 &&
    hsl.l > 20 &&
    hsl.l < 85;

  const ycbcrY = 0.299 * r + 0.587 * g + 0.114 * b;
  const cb = 128 - 0.169 * r - 0.331 * g + 0.500 * b;
  const cr = 128 + 0.500 * r - 0.419 * g - 0.081 * b;
  const ycbcrRule = ycbcrY > 60 && cb > 77 && cb < 127 && cr > 133 && cr < 173;

  return (rgRule && hslRule) || ycbcrRule;
}

interface SkinRegion {
  pixels: { r: number; g: number; b: number }[];
  centerX: number;
  centerY: number;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

function findLargestSkinRegion(
  imageData: ImageData,
  width: number,
  height: number
): SkinRegion | null {
  const step = 3;
  const skinPoints: { x: number; y: number; r: number; g: number; b: number }[] = [];
  let totalSampled = 0;

  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      totalSampled++;
      const idx = (y * width + x) * 4;
      const r = imageData.data[idx];
      const g = imageData.data[idx + 1];
      const b = imageData.data[idx + 2];

      if (isSkinPixel(r, g, b)) {
        skinPoints.push({ x, y, r, g, b });
      }
    }
  }

  const skinRatio = skinPoints.length / totalSampled;
  if (skinPoints.length < 50 || skinRatio < 0.03) {
    return null;
  }

  const centerBiasX = width / 2;
  const centerBiasY = height * 0.35;

  skinPoints.sort((a, b) => {
    const distA = Math.sqrt((a.x - centerBiasX) ** 2 + (a.y - centerBiasY) ** 2);
    const distB = Math.sqrt((b.x - centerBiasX) ** 2 + (b.y - centerBiasY) ** 2);
    return distA - distB;
  });

  const topN = Math.min(skinPoints.length, Math.max(100, Math.floor(skinPoints.length * 0.4)));
  const selectedPoints = skinPoints.slice(0, topN);

  const clusterRadius = Math.max(width, height) * 0.5;
  const clusteredPoints = selectedPoints.filter((p) => {
    const dist = Math.sqrt((p.x - centerBiasX) ** 2 + (p.y - centerBiasY) ** 2);
    return dist < clusterRadius;
  });

  if (clusteredPoints.length < 30) {
    return null;
  }

  let sumX = 0, sumY = 0;
  let minX = width, maxX = 0, minY = height, maxY = 0;
  const pixels: { r: number; g: number; b: number }[] = [];

  for (const p of clusteredPoints) {
    sumX += p.x;
    sumY += p.y;
    minX = Math.min(minX, p.x);
    maxX = Math.max(maxX, p.x);
    minY = Math.min(minY, p.y);
    maxY = Math.max(maxY, p.y);
    pixels.push({ r: p.r, g: p.g, b: p.b });
  }

  return {
    pixels,
    centerX: sumX / clusteredPoints.length,
    centerY: sumY / clusteredPoints.length,
    minX, maxX, minY, maxY,
  };
}

function averageColor(pixels: { r: number; g: number; b: number }[]): { r: number; g: number; b: number } {
  if (pixels.length === 0) return { r: 200, g: 170, b: 150 };

  const sorted = [...pixels].sort((a, b) => {
    const la = 0.299 * a.r + 0.587 * a.g + 0.114 * a.b;
    const lb = 0.299 * b.r + 0.587 * b.g + 0.114 * b.b;
    return la - lb;
  });

  const trim = Math.floor(sorted.length * 0.15);
  const trimmed = sorted.slice(trim, sorted.length - trim);

  if (trimmed.length === 0) return { r: 200, g: 170, b: 150 };

  const sum = trimmed.reduce(
    (acc, p) => ({ r: acc.r + p.r, g: acc.g + p.g, b: acc.b + p.b }),
    { r: 0, g: 0, b: 0 }
  );

  return {
    r: Math.round(sum.r / trimmed.length),
    g: Math.round(sum.g / trimmed.length),
    b: Math.round(sum.b / trimmed.length),
  };
}

function analyzeSkinTone(skinColor: { r: number; g: number; b: number }): {
  warmth: number;
  clarity: number;
  depth: number;
} {
  const hsl = rgbToHsl(skinColor.r, skinColor.g, skinColor.b);

  const warmth = (() => {
    const rRatio = skinColor.r / (skinColor.r + skinColor.g + skinColor.b);
    const bRatio = skinColor.b / (skinColor.r + skinColor.g + skinColor.b);
    const yellowUndertone = (skinColor.r + skinColor.g) / 2 - skinColor.b;
    let w = (rRatio - bRatio) * 300 + yellowUndertone * 0.5;
    if (hsl.h < 25) w += 10;
    if (hsl.h > 15 && hsl.h < 40) w += 5;
    return Math.max(-100, Math.min(100, w));
  })();

  const clarity = (() => {
    const satFactor = hsl.s * 0.8;
    const contrastFactor = (Math.max(skinColor.r, skinColor.g, skinColor.b) - Math.min(skinColor.r, skinColor.g, skinColor.b)) * 0.3;
    return Math.max(-100, Math.min(100, satFactor + contrastFactor - 30));
  })();

  const depth = (() => {
    return Math.max(-100, Math.min(100, 100 - hsl.l * 2));
  })();

  return { warmth, clarity, depth };
}

function determineSeason(
  warmth: number,
  clarity: number,
  depth: number
): { season: PersonalColorSeason; group: "spring" | "summer" | "autumn" | "winter" } {
  if (warmth > 15) {
    if (depth > 10) {
      if (clarity > 10) return { season: "autumn-deep", group: "autumn" };
      return { season: "autumn-warm", group: "autumn" };
    } else {
      if (clarity > 10) return { season: "spring-warm", group: "spring" };
      return { season: "spring-light", group: "spring" };
    }
  } else {
    if (depth > 10) {
      if (clarity > 15) return { season: "winter-vivid", group: "winter" };
      return { season: "winter-cool", group: "winter" };
    } else {
      if (clarity < 5) return { season: "summer-mute", group: "summer" };
      return { season: "summer-cool", group: "summer" };
    }
  }
}

const seasonData: Record<PersonalColorSeason, {
  label: string;
  subLabel: string;
  description: string;
  bestColors: string[];
  avoidColors: string[];
  recommendations: ColorAnalysisResult["recommendations"];
}> = {
  "spring-warm": {
    label: "봄 웜톤",
    subLabel: "Warm Spring",
    description: "밝고 따뜻한 에너지가 느껴지는 타입입니다. 생기 있고 화사한 컬러가 잘 어울리며, 골드 계열의 액세서리가 얼굴을 환하게 밝혀줍니다.",
    bestColors: ["#FF6B35", "#FFA07A", "#FFD700", "#98D8C8", "#F7DC6F", "#E8A87C", "#FF9A76", "#FCE38A"],
    avoidColors: ["#000000", "#1A1A2E", "#4A0E4E", "#2C3E50"],
    recommendations: {
      makeup: ["코랄 핑크 립스틱", "피치 톤 블러셔", "골드 쉬머 아이섀도우", "웜 브라운 아이라이너"],
      fashion: ["아이보리 니트", "코랄 원피스", "카멜 코트", "라이트 데님"],
      accessories: ["골드 주얼리", "베이지 가방", "카멜 벨트", "코랄 스카프"],
      hair: ["밀크 브라운", "카라멜 브라운", "애쉬 골드", "허니 블론드"],
    },
  },
  "spring-light": {
    label: "봄 라이트톤",
    subLabel: "Light Spring",
    description: "맑고 투명한 느낌의 타입입니다. 부드럽고 밝은 파스텔 컬러가 자연스럽게 어울리며, 가벼운 느낌의 스타일링이 잘 맞습니다.",
    bestColors: ["#FFB3BA", "#BAFFC9", "#BAE1FF", "#FFFFBA", "#FFE4E1", "#E0BBE4", "#957DAD", "#FEC8D8"],
    avoidColors: ["#000000", "#8B0000", "#191970", "#2F4F4F"],
    recommendations: {
      makeup: ["핑크 립글로스", "라벤더 블러셔", "샴페인 하이라이터", "소프트 브라운 마스카라"],
      fashion: ["라벤더 블라우스", "소프트 핑크 스커트", "크림 재킷", "라이트 블루 셔츠"],
      accessories: ["로즈골드 주얼리", "파스텔 백", "진주 귀걸이", "실크 스카프"],
      hair: ["라이트 브라운", "로즈 브라운", "밀크티 컬러", "베이지 블론드"],
    },
  },
  "summer-cool": {
    label: "여름 쿨톤",
    subLabel: "Cool Summer",
    description: "우아하고 세련된 분위기의 타입입니다. 시원하고 차분한 블루 베이스 컬러가 피부를 맑고 깨끗하게 보이게 해줍니다.",
    bestColors: ["#B0C4DE", "#DDA0DD", "#87CEEB", "#C8A2C8", "#E6E6FA", "#98D8C8", "#F0E6FF", "#A8D8EA"],
    avoidColors: ["#FF4500", "#FF8C00", "#FFD700", "#8B4513"],
    recommendations: {
      makeup: ["로즈 핑크 립스틱", "쿨 핑크 블러셔", "실버 쉬머 아이섀도우", "그레이 아이라이너"],
      fashion: ["라벤더 원피스", "스카이 블루 셔츠", "그레이 코트", "네이비 팬츠"],
      accessories: ["실버 주얼리", "라벤더 백", "블루 스카프", "화이트골드 시계"],
      hair: ["애쉬 브라운", "다크 애쉬", "라벤더 브라운", "쿨 그레이"],
    },
  },
  "summer-mute": {
    label: "여름 뮤트톤",
    subLabel: "Muted Summer",
    description: "부드럽고 차분한 분위기를 가진 타입입니다. 채도가 낮고 그레이시한 컬러가 자연스러운 우아함을 연출해줍니다.",
    bestColors: ["#C4B7A6", "#A9B4C2", "#D4C5A9", "#B5B8B1", "#C9C0BB", "#D6CDBE", "#AAADB0", "#BEB5A7"],
    avoidColors: ["#FF0000", "#00FF00", "#FF00FF", "#FFD700"],
    recommendations: {
      makeup: ["모브 핑크 립스틱", "더스티 로즈 블러셔", "토프 아이섀도우", "소프트 브라운 아이라이너"],
      fashion: ["더스티 핑크 니트", "카키 팬츠", "그레이 베이지 코트", "올리브 재킷"],
      accessories: ["앤틱 실버 주얼리", "토프 가방", "그레이 스카프", "매트 로즈골드 시계"],
      hair: ["올리브 브라운", "그레이 브라운", "모카 브라운", "애쉬 베이지"],
    },
  },
  "autumn-warm": {
    label: "가을 웜톤",
    subLabel: "Warm Autumn",
    description: "깊고 풍성한 따뜻함이 느껴지는 타입입니다. 자연에서 영감을 받은 풍부한 어스톤 컬러가 매력을 극대화해줍니다.",
    bestColors: ["#D2691E", "#CD853F", "#8B4513", "#DEB887", "#A0522D", "#BC8F8F", "#F4A460", "#D2B48C"],
    avoidColors: ["#FF69B4", "#00BFFF", "#7FFFD4", "#E6E6FA"],
    recommendations: {
      makeup: ["테라코타 립스틱", "브릭 레드 블러셔", "브론즈 아이섀도우", "다크 브라운 아이라이너"],
      fashion: ["카멜 코트", "머스타드 니트", "올리브 팬츠", "브라운 레더 재킷"],
      accessories: ["앤틱 골드 주얼리", "브라운 레더 백", "테라코타 스카프", "터틀 프레임 선글라스"],
      hair: ["다크 브라운", "초콜릿 브라운", "오번", "카퍼 브라운"],
    },
  },
  "autumn-deep": {
    label: "가을 딥톤",
    subLabel: "Deep Autumn",
    description: "깊이감 있고 강렬한 존재감의 타입입니다. 진하고 농밀한 컬러가 고급스러운 분위기를 만들어줍니다.",
    bestColors: ["#8B0000", "#556B2F", "#8B4513", "#2F4F4F", "#800020", "#4A0E0E", "#704214", "#3D0C11"],
    avoidColors: ["#FFB6C1", "#E0FFFF", "#FFFACD", "#F5F5DC"],
    recommendations: {
      makeup: ["버건디 립스틱", "딥 로즈 블러셔", "다크 브론즈 아이섀도우", "블랙 아이라이너"],
      fashion: ["버건디 코트", "다크 그린 니트", "초콜릿 팬츠", "네이비 수트"],
      accessories: ["앤틱 골드 주얼리", "다크 브라운 백", "보르도 스카프", "가죽 벨트"],
      hair: ["에스프레소", "다크 초콜릿", "딥 와인", "다크 오번"],
    },
  },
  "winter-cool": {
    label: "겨울 쿨톤",
    subLabel: "Cool Winter",
    description: "시크하고 도시적인 분위기의 타입입니다. 선명하고 차가운 컬러가 세련된 인상을 강조해줍니다.",
    bestColors: ["#000080", "#800080", "#008080", "#C0C0C0", "#4169E1", "#9370DB", "#20B2AA", "#708090"],
    avoidColors: ["#FFD700", "#FF8C00", "#F4A460", "#DEB887"],
    recommendations: {
      makeup: ["체리 레드 립스틱", "쿨 핑크 블러셔", "실버 아이섀도우", "블랙 아이라이너"],
      fashion: ["블랙 코트", "네이비 수트", "화이트 셔츠", "차콜 팬츠"],
      accessories: ["실버 주얼리", "블랙 레더 백", "네이비 스카프", "플래티넘 시계"],
      hair: ["블루블랙", "다크 애쉬", "플래티넘 블론드", "쿨 브라운"],
    },
  },
  "winter-vivid": {
    label: "겨울 비비드톤",
    subLabel: "Vivid Winter",
    description: "강렬하고 드라마틱한 존재감의 타입입니다. 높은 채도의 선명한 컬러가 화려한 매력을 극대화해줍니다.",
    bestColors: ["#FF0000", "#0000FF", "#FF00FF", "#00FF00", "#FFD700", "#FF1493", "#00CED1", "#8A2BE2"],
    avoidColors: ["#F5DEB3", "#D2B48C", "#C4B7A6", "#808080"],
    recommendations: {
      makeup: ["레드 립스틱", "핫 핑크 블러셔", "비비드 블루 아이섀도우", "블랙 아이라이너"],
      fashion: ["레드 코트", "로열 블루 원피스", "블랙&화이트 스트라이프", "에메랄드 블라우스"],
      accessories: ["스테이트먼트 주얼리", "레드 백", "에메랄드 스카프", "크리스탈 이어링"],
      hair: ["제트 블랙", "와인 레드", "비비드 레드", "블루 블랙"],
    },
  },
};

export async function analyzePersonalColor(imageElement: HTMLImageElement): Promise<ColorAnalysisResult> {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  const maxSize = 640;
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
  const skinRegion = findLargestSkinRegion(imageData, width, height);

  if (!skinRegion || skinRegion.pixels.length < 30) {
    throw new Error("사람의 피부를 감지할 수 없습니다. 얼굴이나 피부가 잘 보이는 인물 사진을 올려주세요.");
  }

  const avgSkin = averageColor(skinRegion.pixels);
  const skinHSL = rgbToHsl(avgSkin.r, avgSkin.g, avgSkin.b);
  const { warmth, clarity, depth } = analyzeSkinTone(avgSkin);
  const { season, group } = determineSeason(warmth, clarity, depth);
  const data = seasonData[season];

  return {
    season,
    seasonGroup: group,
    seasonLabel: data.label,
    seasonSubLabel: data.subLabel,
    description: data.description,
    skinTone: avgSkin,
    skinHSL,
    warmth,
    clarity,
    depth,
    bestColors: data.bestColors,
    avoidColors: data.avoidColors,
    recommendations: data.recommendations,
  };
}
