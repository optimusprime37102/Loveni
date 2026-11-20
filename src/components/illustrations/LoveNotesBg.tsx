import Svg, {
  Defs,
  G,
  LinearGradient,
  Path,
  RadialGradient,
  Rect,
  Stop,
  SvgProps,
} from 'react-native-svg';

const HEART =
  'M0 13 C0 4 7 -1 15 -1 C22 -1 27 4 31 9 C35 4 41 -1 48 -1 C57 -1 63 5 63 14 C63 27 51 37 31 52 C12 37 0 27 0 13Z';

function BotanicalSprig() {
  return (
    <G>
      <Path
        d="M2 65 C2 42 12 26 21 11 M6 51 C11 40 22 36 32 33 M7 51 C5 42 1 37 -3 33"
        stroke="#F889B0"
        strokeWidth={1.7}
        strokeLinecap="round"
        fill="none"
      />
      <Path d="M15 26 C15 15 20 7 26 1 C34 13 27 22 19 27Z" fill="url(#lnbLeaf)" />
      <Path d="M9 43 C14 33 23 31 31 29 C30 39 21 45 9 43Z" fill="#FA94B7" />
      <Path d="M6 50 C3 43 -1 42 -5 39 C-7 48 -2 54 6 55Z" fill="#FFA4C4" />
      <Path d="M16 39 C20 30 26 25 34 23 C36 33 27 38 16 39Z" fill="#FFABC9" />
      <Path d="M3 61 C6 54 12 50 22 49 C21 58 12 63 3 61Z" fill="#F789B0" />
      <Path d="M3 62 C0 56 -5 53 -9 53 C-7 62 -2 65 3 66Z" fill="#F67BA8" />
    </G>
  );
}

/** From assets/images/love_notes_bg.svg — full-screen notes backdrop */
export function LoveNotesBg({ width, height, ...props }: SvgProps & { width: number; height: number }) {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 222 430"
      preserveAspectRatio="none"
      fill="none"
      accessibilityLabel="Love notes soft pink background"
      {...props}
    >
      <Defs>
        <LinearGradient id="lnbScreen" x1="24" y1="0" x2="198" y2="430" gradientUnits="userSpaceOnUse">
          <Stop stopColor="#FFF9FA" />
          <Stop offset={0.21} stopColor="#FFF1F5" />
          <Stop offset={0.52} stopColor="#FDEEF3" />
          <Stop offset={0.79} stopColor="#FFF3F6" />
          <Stop offset={1} stopColor="#FBE0EA" />
        </LinearGradient>
        <RadialGradient
          id="lnbTopGlow"
          cx="0"
          cy="0"
          r="1"
          gradientTransform="translate(140 65) rotate(90) scale(110 123)"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#FFFDFE" stopOpacity={0.9} />
          <Stop offset={1} stopColor="#FFFDFE" stopOpacity={0} />
        </RadialGradient>
        <RadialGradient
          id="lnbCenterGlow"
          cx="0"
          cy="0"
          r="1"
          gradientTransform="translate(107 260) rotate(90) scale(230 137)"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#FFFFFF" stopOpacity={0.5} />
          <Stop offset={1} stopColor="#FFFFFF" stopOpacity={0} />
        </RadialGradient>
        <LinearGradient id="lnbTopBlush" x1="167" y1="0" x2="222" y2="82" gradientUnits="userSpaceOnUse">
          <Stop stopColor="#FFD8E6" />
          <Stop offset={1} stopColor="#FDCBDF" />
        </LinearGradient>
        <LinearGradient id="lnbHeroHeart" x1="120" y1="65" x2="155" y2="98" gradientUnits="userSpaceOnUse">
          <Stop stopColor="#FFAFCC" />
          <Stop offset={0.55} stopColor="#FFC2D7" />
          <Stop offset={1} stopColor="#FFD3E2" />
        </LinearGradient>
        <LinearGradient id="lnbSecondHeart" x1="146" y1="72" x2="178" y2="104" gradientUnits="userSpaceOnUse">
          <Stop stopColor="#FFAACC" />
          <Stop offset={1} stopColor="#FCD1E1" />
        </LinearGradient>
        <LinearGradient id="lnbBackWave" x1="111" y1="400" x2="111" y2="430" gradientUnits="userSpaceOnUse">
          <Stop stopColor="#FFE8F0" />
          <Stop offset={1} stopColor="#FFD4E2" />
        </LinearGradient>
        <LinearGradient id="lnbFrontWave" x1="111" y1="412" x2="111" y2="430" gradientUnits="userSpaceOnUse">
          <Stop stopColor="#FCB7D0" stopOpacity={0.75} />
          <Stop offset={1} stopColor="#F88CB4" stopOpacity={0.9} />
        </LinearGradient>
        <LinearGradient id="lnbLeaf" x1="0" y1="0" x2="29" y2="65" gradientUnits="userSpaceOnUse">
          <Stop stopColor="#FFB1CE" />
          <Stop offset={1} stopColor="#F577A6" />
        </LinearGradient>
      </Defs>

      <Rect width="222" height="430" fill="url(#lnbScreen)" />
      <Rect width="222" height="430" fill="url(#lnbCenterGlow)" />
      <Rect width="222" height="200" fill="url(#lnbTopGlow)" />

      <Path
        d="M151 -1 C170 18 190 29 205 39 C214 47 219 55 222 66 L222 -1 Z"
        fill="url(#lnbTopBlush)"
        opacity={0.55}
      />
      <Path d="M180 -1 C195 11 210 19 222 27 L222 -1 Z" fill="#FFC5DB" opacity={0.34} />

      <Path d="M0 75 C22 76 43 84 62 96 C37 91 19 92 0 105 Z" fill="#F9C6DA" opacity={0.62} />
      <Path d="M0 85 C21 85 39 91 57 100 C29 102 18 109 0 114 Z" fill="#FFB6D1" opacity={0.34} />

      <G opacity={0.76}>
        <G transform="translate(117 65) scale(0.52)">
          <Path d={HEART} fill="url(#lnbHeroHeart)" />
        </G>
        <G transform="translate(146 73) scale(0.4)">
          <Path d={HEART} fill="url(#lnbSecondHeart)" />
        </G>
        <G transform="translate(142 83) scale(0.28)">
          <Path d={HEART} fill="#FFF0F6" />
        </G>
        <Path
          d="M113 88 C118 77 126 75 134 83"
          stroke="#FFD3E4"
          strokeWidth={5}
          strokeLinecap="round"
          opacity={0.55}
          fill="none"
        />
        <Path
          d="M165 92 C175 82 191 91 204 104"
          stroke="#FCD9E7"
          strokeWidth={11}
          strokeLinecap="round"
          opacity={0.32}
          fill="none"
        />
      </G>

      <Path
        d="M0 412 C22 396 42 396 64 406 C92 420 108 424 130 422 C160 418 184 400 206 404 C212 405 218 408 222 412 L222 430 L0 430Z"
        fill="url(#lnbBackWave)"
        opacity={0.9}
      />
      <Path
        d="M0 420 C28 408 44 414 68 422 C96 432 122 432 148 422 C174 412 198 406 222 412 L222 430 L0 430Z"
        fill="url(#lnbFrontWave)"
        opacity={0.78}
      />

      <G transform="translate(10 382) scale(0.55)">
        <BotanicalSprig />
      </G>
      <G transform="translate(212 382) scale(-0.55 0.55)">
        <BotanicalSprig />
      </G>
    </Svg>
  );
}
