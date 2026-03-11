const styleImageMap: Record<string, string> = {
  "페플럼 탑": "/images/style-peplum-top.png",
  "랩 탑": "/images/style-vneck-top.png",
  "랩 원피스": "/images/style-wrap-dress.png",
  "V넥 블라우스": "/images/style-vneck-top.png",
  "V넥 탑": "/images/style-vneck-top.png",
  "V넥/U넥 탑": "/images/style-vneck-top.png",
  "크롭 재킷": "/images/style-crop-jacket.png",
  "러플 블라우스": "/images/style-ruffle-blouse.png",
  "퍼프 소매 블라우스": "/images/style-ruffle-blouse.png",
  "보트넥 탑": "/images/style-boatneck-top.png",
  "A라인 스커트": "/images/style-aline-skirt.png",
  "A라인 원피스": "/images/style-aline-skirt.png",
  "부츠컷 팬츠": "/images/style-bootcut-pants.png",
  "부츠컷/와이드 팬츠": "/images/style-bootcut-pants.png",
  "와이드 팬츠": "/images/style-wide-pants.png",
  "하이웨이스트 팬츠": "/images/style-wide-pants.png",
  "플레어 스커트": "/images/style-aline-skirt.png",
  "플리츠 스커트": "/images/style-pleated-skirt.png",
  "엠파이어 라인 원피스": "/images/style-empire-dress.png",
  "엠파이어 웨이스트 원피스": "/images/style-empire-dress.png",
  "엠파이어 라인 탑": "/images/style-empire-dress.png",
  "벨트 원피스": "/images/style-wrap-dress.png",
  "벨트 있는 원피스": "/images/style-wrap-dress.png",
  "피트 앤 플레어": "/images/style-wrap-dress.png",
  "어깨 패드 재킷": "/images/style-blazer.png",
  "코랄 핑크 립스틱": "/images/style-coral-lipstick.png",
  "로즈 핑크 립스틱": "/images/style-coral-lipstick.png",
  "체리 레드 립스틱": "/images/style-coral-lipstick.png",
  "레드 립스틱": "/images/style-coral-lipstick.png",
  "버건디 립스틱": "/images/style-coral-lipstick.png",
  "테라코타 립스틱": "/images/style-coral-lipstick.png",
  "모브 핑크 립스틱": "/images/style-coral-lipstick.png",
  "핑크 립글로스": "/images/style-coral-lipstick.png",
  "골드 주얼리": "/images/style-gold-jewelry.png",
  "앤틱 골드 주얼리": "/images/style-gold-jewelry.png",
  "로즈골드 주얼리": "/images/style-gold-jewelry.png",
  "스테이트먼트 주얼리": "/images/style-gold-jewelry.png",
  "실버 주얼리": "/images/style-silver-jewelry.png",
  "앤틱 실버 주얼리": "/images/style-silver-jewelry.png",
  "스트레이트 팬츠": "/images/style-wide-pants.png",
  "카고 팬츠": "/images/style-wide-pants.png",
  "카고/조거 팬츠": "/images/style-wide-pants.png",
  "네이비 수트": "/images/style-blazer.png",
  "블랙 코트": "/images/style-blazer.png",
  "카멜 코트": "/images/style-blazer.png",
  "그레이 코트": "/images/style-blazer.png",
  "버건디 코트": "/images/style-blazer.png",
  "그레이 베이지 코트": "/images/style-blazer.png",
  "브라운 레더 재킷": "/images/style-blazer.png",
  "올리브 재킷": "/images/style-blazer.png",
  "펜슬 스커트": "/images/style-aline-skirt.png",
  "미디 스커트": "/images/style-pleated-skirt.png",
  "코르셋 디테일 원피스": "/images/style-wrap-dress.png",
  "티어드 원피스": "/images/style-empire-dress.png",
  "핀턱 원피스": "/images/style-wrap-dress.png",
  "셔츠 원피스": "/images/style-wrap-dress.png",
  "바디콘 원피스": "/images/style-wrap-dress.png",
  "라벤더 원피스": "/images/style-wrap-dress.png",
  "코랄 원피스": "/images/style-wrap-dress.png",
  "레드 코트": "/images/style-blazer.png",
};

export function getStyleImage(itemName: string): string | null {
  if (styleImageMap[itemName]) return styleImageMap[itemName];

  for (const [key, value] of Object.entries(styleImageMap)) {
    if (itemName.includes(key) || key.includes(itemName)) {
      return value;
    }
  }

  return null;
}
