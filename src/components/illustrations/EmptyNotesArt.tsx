import Svg, {
  Defs,
  Ellipse,
  G,
  LinearGradient,
  Path,
  RadialGradient,
  Rect,
  Stop,
  SvgProps,
} from 'react-native-svg';

const HEART =
  'M0 8 C0 1.5 5.2 -2 10.3 -2 C15 -2 18.6 0.7 21 4.8 C23.4 0.7 27 -2 31.7 -2 C36.8 -2 42 1.5 42 8 C42 16 35 22.3 21 32 C7 22.3 0 16 0 8 Z';
const STAR =
  'M0 -9.6 C1.4 -3.0 2.8 -1.5 9.6 0 C2.8 1.5 1.4 3 0 9.6 C-1.4 3 -2.8 1.5 -9.6 0 C-2.8 -1.5 -1.4 -3 0 -9.6Z';

/** From assets/images/loveni_empty_notes.svg */
export function EmptyNotesArt({ width = 320, height = 94, ...props }: SvgProps) {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 480 140"
      fill="none"
      accessibilityLabel="Empty love notes envelope artwork"
      {...props}
    >
      <Defs>
        <LinearGradient id="enaWaveL" x1="20" y1="90" x2="104" y2="148" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#F6CAD9" stopOpacity={0.85} />
          <Stop offset="0.55" stopColor="#FBDCE6" stopOpacity={0.75} />
          <Stop offset="1" stopColor="#FFE8EF" stopOpacity={0.1} />
        </LinearGradient>
        <LinearGradient id="enaWaveR" x1="460" y1="89" x2="361" y2="150" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#F6C6D8" stopOpacity={0.78} />
          <Stop offset="0.7" stopColor="#FBDCE6" stopOpacity={0.65} />
          <Stop offset="1" stopColor="#FFF1F5" stopOpacity={0.09} />
        </LinearGradient>
        <LinearGradient id="enaBottom" x1="240" y1="104" x2="240" y2="153" gradientUnits="userSpaceOnUse">
          <Stop stopColor="#FFF1F5" stopOpacity={0.15} />
          <Stop offset="1" stopColor="#F9D5E1" stopOpacity={0.4} />
        </LinearGradient>
        <LinearGradient id="enaLeaf" x1="0" y1="0" x2="20" y2="36" gradientUnits="userSpaceOnUse">
          <Stop stopColor="#FFA9C4" />
          <Stop offset="1" stopColor="#F18DB0" />
        </LinearGradient>
        <LinearGradient id="enaBack" x1="188" y1="38" x2="299" y2="122" gradientUnits="userSpaceOnUse">
          <Stop stopColor="#FFE8EF" />
          <Stop offset="0.48" stopColor="#FFD6E3" />
          <Stop offset="1" stopColor="#F7BBCF" />
        </LinearGradient>
        <LinearGradient id="enaLeft" x1="184" y1="67" x2="245" y2="119" gradientUnits="userSpaceOnUse">
          <Stop stopColor="#F9BFD2" />
          <Stop offset="1" stopColor="#FFE3E9" />
        </LinearGradient>
        <LinearGradient id="enaRight" x1="290" y1="56" x2="239" y2="117" gradientUnits="userSpaceOnUse">
          <Stop stopColor="#F6BFD2" />
          <Stop offset="1" stopColor="#FFE5EB" />
        </LinearGradient>
        <LinearGradient id="enaFront" x1="243" y1="82" x2="243" y2="126" gradientUnits="userSpaceOnUse">
          <Stop stopColor="#FFDDE7" />
          <Stop offset="1" stopColor="#F9CBD9" />
        </LinearGradient>
        <LinearGradient id="enaTop" x1="245" y1="35" x2="245" y2="92" gradientUnits="userSpaceOnUse">
          <Stop stopColor="#FFE9EF" />
          <Stop offset="1" stopColor="#F8CCDA" />
        </LinearGradient>
        <LinearGradient id="enaHeart" x1="0" y1="0" x2="0" y2="33" gradientUnits="userSpaceOnUse">
          <Stop stopColor="#FF78A3" />
          <Stop offset="0.5" stopColor="#FA5488" />
          <Stop offset="1" stopColor="#F43174" />
        </LinearGradient>
        <LinearGradient id="enaSeal" x1="0" y1="0" x2="0" y2="32" gradientUnits="userSpaceOnUse">
          <Stop stopColor="#FF6896" />
          <Stop offset="1" stopColor="#F03275" />
        </LinearGradient>
        <RadialGradient
          id="enaUnder"
          cx="0"
          cy="0"
          r="1"
          gradientTransform="translate(243 120) rotate(90) scale(24 95)"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#F2A8C1" stopOpacity={0.35} />
          <Stop offset="1" stopColor="#F2A8C1" stopOpacity={0} />
        </RadialGradient>
      </Defs>

      <Path
        d="M10 140 C19 129 24 116 40 107 C55 97 65 96 83 104 C103 113 121 133 160 141 C197 147 224 144 240 144 C271 145 304 143 338 132 C366 123 393 106 410 101 C435 92 450 105 463 126 C468 133 472 137 478 140 Z"
        fill="url(#enaBottom)"
        opacity={0.26}
      />
      <Path
        d="M4 140 C25 130 28 109 49 103 C64 97 78 98 96 111 C112 124 121 136 151 141 C172 144 187 143 200 145 C148 149 64 151 4 140Z"
        fill="url(#enaWaveL)"
        opacity={0.76}
      />
      <Path
        d="M479 140 C455 125 456 108 436 101 C425 97 414 98 400 107 C385 118 373 129 342 138 C322 143 308 144 292 145 C350 148 425 151 479 140Z"
        fill="url(#enaWaveR)"
        opacity={0.75}
      />

      <G opacity={0.86} fill="url(#enaLeaf)">
        <Path d="M69 125 C68 114 73 100 79 89 C83 81 88 73 92 67" stroke="#ED97B6" strokeWidth={1.6} fill="none" />
        <Path d="M68 124 C59 115 53 108 50 97" stroke="#ED97B6" strokeWidth={1.55} fill="none" />
        <Path d="M71 108 C61 104 56 97 54 87 C63 88 69 97 71 108Z" />
        <Path d="M78 93 C73 82 75 73 81 66 C87 75 83 86 78 93Z" />
        <Path d="M82 82 C81 72 85 62 93 57 C98 66 91 77 82 82Z" />
        <Path d="M75 100 C83 90 93 86 103 88 C99 99 88 104 75 100Z" />
        <Path d="M70 120 C58 117 51 113 48 106 C59 106 65 111 70 120Z" />
      </G>
      <G opacity={0.86} fill="url(#enaLeaf)">
        <Path d="M405 125 C407 114 406 98 399 86 C394 76 392 67 390 63" stroke="#ED97B6" strokeWidth={1.7} fill="none" />
        <Path d="M404 124 C413 111 416 99 424 88" stroke="#ED97B6" strokeWidth={1.5} fill="none" />
        <Path d="M397 88 C391 80 388 73 388 65 C398 68 401 79 397 88Z" />
        <Path d="M404 101 C402 89 405 79 411 75 C419 84 413 96 404 101Z" />
        <Path d="M414 108 C419 98 429 91 436 90 C435 101 427 109 414 108Z" />
        <Path d="M400 95 C392 88 384 85 376 85 C380 94 389 99 400 95Z" />
        <Path d="M407 119 C416 113 428 111 437 113 C433 124 417 126 407 119Z" />
      </G>

      <G fill="#F7A8C4" opacity={0.83}>
        <Path d={STAR} transform="translate(144 51) scale(0.95)" />
        <Path d={STAR} transform="translate(161 76) scale(0.56)" />
        <Path d={STAR} transform="translate(326 51) scale(1.12)" />
        <Path d={STAR} transform="translate(342 76) scale(0.46)" opacity={0.66} />
        <Path d={STAR} transform="translate(313 79) scale(0.34)" opacity={0.64} />
      </G>

      <Ellipse cx="239" cy="117" rx="69" ry="16" fill="url(#enaUnder)" />

      <G transform="rotate(5 242 78)">
        <Rect x="185" y="39" width="112" height="81" rx="11" fill="url(#enaBack)" />
        <Path d="M185 57 C188 64 197 68 210 78 L240 99 L185 120Z" fill="url(#enaLeft)" opacity={0.91} />
        <Path d="M297 57 C293 66 281 74 271 81 L242 99 L297 120Z" fill="url(#enaRight)" opacity={0.93} />
        <Path
          d="M185 50 C185 43 190 39 197 39 H285 C293 39 298 45 297 52 C295 63 279 70 269 77 L247 89 Q241 93 236 89 L210 73 C197 65 185 58 185 50Z"
          fill="url(#enaTop)"
        />
        <Path
          d="M187 118 Q188 116 193 113 L236 86 Q241 83 246 86 L290 115 Q295 119 291 120 Q287 121 280 121 L200 121 Q192 121 187 118Z"
          fill="url(#enaFront)"
          opacity={0.91}
        />
        <G transform="translate(226.5 65.5) scale(0.72)">
          <Path d={HEART} fill="url(#enaSeal)" />
        </G>
      </G>

      <G transform="translate(244 18) scale(0.46)" fill="url(#enaHeart)">
        <Path d={HEART} />
      </G>
      <G transform="translate(266 1) scale(0.47)" fill="url(#enaHeart)">
        <Path d={HEART} />
      </G>
    </Svg>
  );
}
