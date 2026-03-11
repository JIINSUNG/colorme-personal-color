# ColorMe - AI 퍼스널컬러 분석

## Overview
On-device AI personal color and body type analysis web application. Users upload a photo and get their personal color season (8 types) and body type (5 types) analyzed directly in the browser using pure JavaScript pixel analysis.

## Architecture
- **Frontend**: React + Vite + Tailwind CSS + shadcn/ui + Framer Motion
- **AI**: Pure JavaScript skin/silhouette analysis using RGB, HSL, YCbCr color space rules (no external models)
- **Backend**: Express.js (minimal - only serves static files, no API needed)
- **Processing**: 100% on-device, no server-side AI processing, photos never leave the browser

## Key Files
- `client/src/pages/home.tsx` - Main page with upload and analysis flow
- `client/src/components/AnalysisResult.tsx` - Color analysis result display with StyleItemCard (image thumbnails)
- `client/src/components/BodyAnalysisResult.tsx` - Body type analysis result display with BodyStyleItem (image thumbnails)
- `client/src/lib/colorAnalysis.ts` - Pure JS skin tone analysis (no external dependencies)
- `client/src/lib/bodyAnalysis.ts` - Pure JS body type analysis via silhouette detection
- `client/src/lib/styleImages.ts` - Mapping of styling item names to example images
- `client/public/images/style-*.png` - Generated example images for fashion items

## How Analysis Works
### Personal Color
1. User uploads photo
2. Skin pixels detected using RGB, HSL, and YCbCr color space rules
3. Largest skin region found with center bias (face area)
4. Average skin tone calculated with outlier trimming
5. Warmth, clarity, and depth metrics computed
6. Season determined: Spring (Warm/Light), Summer (Cool/Mute), Autumn (Warm/Deep), Winter (Cool/Vivid)

### Body Type
1. Person silhouette detected by comparing pixels against background color
2. Body width measured at each row with median smoothing
3. Shoulder, waist, hip zones identified by position ratios
4. Proportions compared to classify: Hourglass, Pear, Apple, Rectangle, Inverted Triangle
5. Styling tips provided per body type

## Dependencies
- `framer-motion` - Animations
- Standard shadcn/ui component library
- No external AI model downloads needed - 100% pure JavaScript analysis

## Languages
- UI language: Korean (한국어)
