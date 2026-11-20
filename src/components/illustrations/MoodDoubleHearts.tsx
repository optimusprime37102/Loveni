import Svg, {
  Defs,
  G,
  LinearGradient,
  Path,
  RadialGradient,
  Stop,
  SvgProps,
} from 'react-native-svg';

const LEFT_HEART =
  'M49 63C38 61 28 56 20 49C12 42 10 35 14 29C19 21 29 21 37 28C37 19 43 12 51 12C61 10 69 18 67 28C66 43 56 55 49 63Z';
const RIGHT_HEART =
  'M65.0 65.8C57.3 60.2 53.5 53.1 52.5 44.5 51.4 35.8 54.9 25.9 62.8 22.6 68.8 20.1 73.5 23.8 76.7 29.9 82.4 25.4 89.3 26.6 93.4 32.1 101.2 42.5 92.0 55.7 81.5 60.8 75.6 63.7 69.3 66.7 65.0 65.8Z';

/** From assets/images/mood_double_hearts.svg */
export function MoodDoubleHearts({ width = 118, height = 76, ...props }: SvgProps) {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 118 76"
      fill="none"
      accessibilityLabel="Two overlapping pink hearts"
      {...props}
    >
      <Defs>
        <LinearGradient
          id="moodLargePink"
          x1="38"
          y1="13"
          x2="50"
          y2="64"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0" stopColor="#FFABC4" />
          <Stop offset="0.36" stopColor="#FA8EAD" />
          <Stop offset="0.72" stopColor="#F66F98" />
          <Stop offset="1" stopColor="#F34F82" />
        </LinearGradient>
        <RadialGradient
          id="moodLargeLight"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(35 20) rotate(60) scale(33 35)"
        >
          <Stop stopColor="#FFF0F4" stopOpacity={0.32} />
          <Stop offset="1" stopColor="#FFD0DC" stopOpacity={0} />
        </RadialGradient>
        <LinearGradient
          id="moodSmallPink"
          x1="70"
          y1="22"
          x2="74"
          y2="67"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0" stopColor="#FFD7E2" />
          <Stop offset="0.32" stopColor="#FFC1D3" />
          <Stop offset="0.7" stopColor="#FFA8C0" />
          <Stop offset="1" stopColor="#F78CAC" />
        </LinearGradient>
        <RadialGradient
          id="moodSmallLight"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(63 29) rotate(55) scale(30 31)"
        >
          <Stop stopColor="#FFFFFF" stopOpacity={0.42} />
          <Stop offset="1" stopColor="#FFF1F5" stopOpacity={0} />
        </RadialGradient>
        <LinearGradient
          id="moodSpark"
          x1="99"
          y1="13"
          x2="108"
          y2="31"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#FF6694" />
          <Stop offset="1" stopColor="#F44E83" />
        </LinearGradient>
      </Defs>

      <G>
        <Path d={LEFT_HEART} fill="url(#moodLargePink)" />
        <Path d={LEFT_HEART} fill="url(#moodLargeLight)" />
      </G>

      <G>
        <Path d={RIGHT_HEART} fill="url(#moodSmallPink)" />
        <Path d={RIGHT_HEART} fill="url(#moodSmallLight)" />
      </G>

      <G stroke="url(#moodSpark)" strokeWidth={2.8} strokeLinecap="round">
        <Path d="M94.3 13.6L94.0 20.1" />
        <Path d="M104.4 17.4L99.7 22.3" />
        <Path d="M107.8 29.0L102.3 29.2" />
      </G>
    </Svg>
  );
}
