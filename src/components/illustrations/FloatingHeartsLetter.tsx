import Svg, {
  Defs,
  Ellipse,
  G,
  LinearGradient,
  Path,
  Stop,
  SvgProps,
} from 'react-native-svg';

/** From assets/images/floating_hearts_letter.svg */
export function FloatingHeartsLetter({ width = 88, height = 88, ...props }: SvgProps) {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="120 80 980 1040"
      fill="none"
      accessibilityLabel="Pink envelope with floating hearts"
      {...props}
    >
      <Defs>
        <LinearGradient id="fhlShell" x1="155" y1="455" x2="1015" y2="1090" gradientUnits="userSpaceOnUse">
          <Stop stopColor="#FFE0E6" />
          <Stop offset="0.34" stopColor="#FFB6C8" />
          <Stop offset="0.72" stopColor="#FEB2C6" />
          <Stop offset="1" stopColor="#F7A4BD" />
        </LinearGradient>
        <LinearGradient id="fhlFlap" x1="395" y1="430" x2="640" y2="876" gradientUnits="userSpaceOnUse">
          <Stop stopColor="#FFF0F2" />
          <Stop offset="0.25" stopColor="#FFE5EA" />
          <Stop offset="0.72" stopColor="#FFD3DF" />
          <Stop offset="1" stopColor="#FFBDCE" />
        </LinearGradient>
        <LinearGradient id="fhlLeft" x1="215" y1="555" x2="515" y2="1000" gradientUnits="userSpaceOnUse">
          <Stop stopColor="#FFCAD4" />
          <Stop offset="0.55" stopColor="#F9B0C4" />
          <Stop offset="1" stopColor="#F9BED0" />
        </LinearGradient>
        <LinearGradient id="fhlRight" x1="1006" y1="556" x2="628" y2="1021" gradientUnits="userSpaceOnUse">
          <Stop stopColor="#FFA9BF" />
          <Stop offset="0.57" stopColor="#FFCDDA" />
          <Stop offset="1" stopColor="#FFBACD" />
        </LinearGradient>
        <LinearGradient id="fhlFront" x1="565" y1="800" x2="578" y2="1117" gradientUnits="userSpaceOnUse">
          <Stop stopColor="#FFD5E0" />
          <Stop offset="0.58" stopColor="#FFC2D2" />
          <Stop offset="1" stopColor="#F9A5BD" />
        </LinearGradient>
        <LinearGradient id="fhlSeal" x1="22" y1="-8" x2="155" y2="185" gradientUnits="userSpaceOnUse">
          <Stop stopColor="#FF9FB6" />
          <Stop offset="0.28" stopColor="#FF6991" />
          <Stop offset="0.65" stopColor="#F74B7D" />
          <Stop offset="1" stopColor="#DF2861" />
        </LinearGradient>
        <LinearGradient id="fhlStrong" x1="20" y1="0" x2="176" y2="189" gradientUnits="userSpaceOnUse">
          <Stop stopColor="#FF9CB3" />
          <Stop offset="0.33" stopColor="#FF6B92" />
          <Stop offset="0.72" stopColor="#FA467A" />
          <Stop offset="1" stopColor="#E92D67" />
        </LinearGradient>
        <LinearGradient id="fhlSmall" x1="38" y1="12" x2="157" y2="177" gradientUnits="userSpaceOnUse">
          <Stop stopColor="#FF9BB3" />
          <Stop offset="0.38" stopColor="#FF668D" />
          <Stop offset="1" stopColor="#EF3F75" />
        </LinearGradient>
        <LinearGradient id="fhlPale" x1="38" y1="9" x2="152" y2="174" gradientUnits="userSpaceOnUse">
          <Stop stopColor="#FFDDE5" />
          <Stop offset="0.45" stopColor="#FFC5D4" />
          <Stop offset="1" stopColor="#FFA4BF" />
        </LinearGradient>
      </Defs>

      <Ellipse cx="603" cy="1115" rx="420" ry="55" fill="#CE5476" opacity={0.16} />

      <Path
        d="M268 451 C211 446 175 469 163 525 L122 990 C117 1037 151 1064 201 1069 L962 1097 C1007 1099 1043 1069 1049 1019 L1080 586 C1086 529 1057 490 1006 486 Z"
        fill="url(#fhlShell)"
      />
      <Path d="M158 526 L611 817 L124 1067 L118 976Z" fill="url(#fhlLeft)" />
      <Path d="M1083 558 L607 813 L1055 1108 L1107 1020Z" fill="url(#fhlRight)" />
      <Path
        d="M112 1070 C232 983 456 831 589 742 C607 733 621 742 636 755 L1065 1099 Z"
        fill="url(#fhlFront)"
      />
      <Path
        d="M265 447 C213 444 178 466 173 508 C167 534 183 550 210 576 L558 824 C581 844 609 852 632 834 L1044 599 C1082 577 1104 544 1072 511 C1058 497 1035 491 1004 488 Z"
        fill="url(#fhlFlap)"
      />

      <G transform="translate(449 645) scale(1.53 1.5)">
        <Path
          d="M100 181 C76 163 18 122 7 76 C-6 24 47 -10 85 28 C92 35 98 42 100 46 C104 39 109 32 116 27 C153 -10 205 23 193 76 C183 120 124 165 100 181 Z"
          fill="url(#fhlSeal)"
        />
      </G>

      <G transform="translate(699 100) scale(1.14 1.13)">
        <Path
          d="M100 181 C76 163 18 122 7 76 C-6 24 47 -10 85 28 C92 35 98 42 100 46 C104 39 109 32 116 27 C153 -10 205 23 193 76 C183 120 124 165 100 181 Z"
          fill="url(#fhlStrong)"
        />
      </G>
      <G transform="translate(552 265) scale(0.82 0.82)">
        <Path
          d="M100 181 C76 163 18 122 7 76 C-6 24 47 -10 85 28 C92 35 98 42 100 46 C104 39 109 32 116 27 C153 -10 205 23 193 76 C183 120 124 165 100 181 Z"
          fill="url(#fhlSmall)"
        />
      </G>
      <G transform="translate(832 294) scale(0.82 0.78)" opacity={0.97}>
        <Path
          d="M100 181 C76 163 18 122 7 76 C-6 24 47 -10 85 28 C92 35 98 42 100 46 C104 39 109 32 116 27 C153 -10 205 23 193 76 C183 120 124 165 100 181 Z"
          fill="url(#fhlPale)"
        />
      </G>
    </Svg>
  );
}
