import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  type SharedValue,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, {
  ClipPath,
  Defs,
  G,
  LinearGradient as SvgGradient,
  Path,
  Stop,
} from 'react-native-svg';
import { palette } from '@/src/theme/colors';
import { fonts } from '@/src/theme/typography';
import { spacing } from '@/src/theme/spacing';

const AnimatedPath = Animated.createAnimatedComponent(Path);

/**
 * Interior cavity of splash-logo.png (viewBox 0–100), wall-tracked from alpha.
 * Real tip is ~47.6, 88.4 (left of center) — old path stopped short and caused the gap.
 */
const LOGO_CAVITY =
  'M21.6 54.5 L21.7 55.7 L21.9 57.0 L22.3 58.3 L22.8 59.6 L23.4 60.8 L24.1 62.1 L25.0 63.4 L25.9 64.7 L26.9 65.9 L28.0 67.2 L29.2 68.5 L30.3 69.8 L31.5 71.1 L32.8 72.3 L34.0 73.6 L35.4 74.9 L36.6 76.2 L37.9 77.4 L39.3 78.7 L40.6 80.0 L41.8 81.3 L43.0 82.5 L44.2 83.8 L45.2 85.1 L46.1 86.4 L47.0 87.6 L47.5 88.4 L47.6 89.5 L47.6 88.4 L48.0 87.6 L48.7 86.4 L49.6 85.1 L50.4 83.8 L51.5 82.5 L52.5 81.3 L53.7 80.0 L55.0 78.7 L56.3 77.4 L57.5 76.2 L58.9 74.9 L60.2 73.6 L61.6 72.3 L63.0 71.1 L64.3 69.8 L65.6 68.5 L66.8 67.2 L68.0 65.9 L69.1 64.7 L70.1 63.4 L70.9 62.1 L71.7 60.8 L72.4 59.6 L72.8 58.3 L73.2 57.0 L73.5 55.7 L73.6 54.5 Z';

/** Always-on tip plug so the V never shows background through anti-alias gaps */
const LOGO_TIP_PLUG = 'M44.2 83.8 L47.6 89.8 L50.4 83.8 Z';

function buildLiquidPath(levelY: number, phase: number, amp: number) {
  'worklet';
  // Overflow past the heart tip so clipped fill is flush with the bottom
  const left = 10;
  const right = 90;
  const bottom = 100;
  const steps = 18;
  let d = `M ${left} ${bottom}`;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = left + (right - left) * t;
    const y = levelY + Math.sin(phase + t * Math.PI * 2.4) * amp;
    d += ` L ${x} ${y}`;
  }
  d += ` L ${right} ${bottom} Z`;
  return d;
}

function buildLiquidCrest(levelY: number, phase: number, amp: number) {
  'worklet';
  const left = 10;
  const right = 90;
  const steps = 18;
  let d = '';
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = left + (right - left) * t;
    const y = levelY + Math.sin(phase + t * Math.PI * 2.4) * amp;
    d += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
  }
  return d;
}

const WAVE_BACK =
  'M 0,600 L 0,300 C 94.29665071770336,321.17703349282294 188.59330143540672,342.35406698564594 280,305 C 371.4066985645933,267.64593301435406 459.92344497607655,171.7607655502392 548,159 C 636.0765550239234,146.2392344497608 723.7129186602871,216.60287081339715 828,213 C 932.2870813397129,209.39712918660285 1053.2248803827752,131.82775119617224 1158,84 C 1262.7751196172248,36.172248803827756 1351.3875598086124,18.086124401913878 1440,0 L 1440,600 L 0,600 Z';

const WAVE_FRONT =
  'M 0,600 L 0,500 C 100.99521531100478,511.3205741626794 201.99043062200957,522.6411483253588 289,530 C 376.00956937799043,537.3588516746412 449.03349282296654,540.7559808612441 531,484 C 612.9665071770335,427.2440191387559 703.8755980861245,310.334928229665 825,290 C 946.1244019138755,269.665071770335 1097.4641148325359,345.90430622009575 1205,347 C 1312.5358851674641,348.09569377990425 1376.267942583732,274.0478468899521 1440,200 L 1440,600 L 0,600 Z';

/** Crest-only strokes for the soft-light rim on each wave layer */
const WAVE_BACK_CREST =
  'M 0,300 C 94.3,321.2 188.6,342.4 280,305 C 371.4,267.6 459.9,171.8 548,159 C 636.1,146.2 723.7,216.6 828,213 C 932.3,209.4 1053.2,131.8 1158,84 C 1262.8,36.2 1351.4,18.1 1440,0';

const WAVE_FRONT_CREST =
  'M 0,500 C 101,511.3 202,522.6 289,530 C 376,537.4 449,540.8 531,484 C 613,427.2 703.9,310.3 825,290 C 946.1,269.7 1097.5,345.9 1205,347 C 1312.5,348.1 1376.3,274 1440,200';

/**
 * Soft organic corner layers.
 * Paths are flush to the top + left edges (no rotate), so no edge gap.
 */
const TOP_WAVE_OUTER =
  'M0,0 L280,0 C248,28 214,62 180,100 C148,136 116,172 84,200 C54,226 28,246 0,260 L0,0 Z';

const TOP_WAVE_MID =
  'M0,0 L210,0 C186,24 160,54 134,88 C108,122 80,152 54,174 C30,194 14,208 0,218 L0,0 Z';

const TOP_WAVE_INNER =
  'M0,0 L150,0 C132,20 114,46 94,74 C74,102 52,126 34,142 C18,154 8,162 0,168 L0,0 Z';

export const SPLASH_MS = 4200;

const logoSource = require('../../assets/images/splash-logo.png');
const flourishSource = require('../../assets/images/splash-footer.png');

const FLOATING_HEARTS = [
  { left: '8%', delay: 0, size: 18, duration: 5600, drift: 12, outline: false },
  { left: '18%', delay: 420, size: 12, duration: 6400, drift: -10, outline: true },
  { left: '28%', delay: 900, size: 15, duration: 5000, drift: 16, outline: false },
  { left: '40%', delay: 180, size: 10, duration: 7200, drift: -8, outline: true },
  { left: '52%', delay: 1100, size: 17, duration: 5800, drift: 10, outline: false },
  { left: '63%', delay: 650, size: 11, duration: 6600, drift: -14, outline: true },
  { left: '74%', delay: 1400, size: 14, duration: 5200, drift: 12, outline: false },
  { left: '84%', delay: 300, size: 16, duration: 7000, drift: -10, outline: false },
  { left: '12%', delay: 1800, size: 13, duration: 6000, drift: -12, outline: true },
  { left: '70%', delay: 2200, size: 10, duration: 4800, drift: 8, outline: false },
  { left: '46%', delay: 2500, size: 19, duration: 7400, drift: -6, outline: false },
  { left: '90%', delay: 1000, size: 12, duration: 5500, drift: 14, outline: true },
] as const;

function FloatingHeart({
  left,
  delay,
  size,
  duration,
  drift,
  travel,
  outline,
}: {
  left: `${number}%`;
  delay: number;
  size: number;
  duration: number;
  drift: number;
  travel: number;
  outline: boolean;
}) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withRepeat(withTiming(1, { duration, easing: Easing.linear }), -1, false)
    );
  }, [delay, duration, progress]);

  const style = useAnimatedStyle(() => ({
    opacity: interpolate(
      progress.value,
      [0, 0.1, 0.7, 1],
      [0, outline ? 0.35 : 0.5, outline ? 0.28 : 0.38, 0],
      Extrapolation.CLAMP
    ),
    transform: [
      {
        translateY: interpolate(progress.value, [0, 1], [0, -travel], Extrapolation.CLAMP),
      },
      {
        translateX: interpolate(
          progress.value,
          [0, 0.5, 1],
          [0, drift, drift * 0.3],
          Extrapolation.CLAMP
        ),
      },
      {
        scale: interpolate(progress.value, [0, 0.4, 1], [0.7, 1, 0.9], Extrapolation.CLAMP),
      },
    ],
  }));

  return (
    <Animated.Text
      style={[
        styles.floatHeart,
        {
          left,
          fontSize: size,
          color: outline ? 'rgba(244, 91, 140, 0.45)' : palette.softRose,
        },
        style,
      ]}
    >
      {outline ? '♡' : '♥'}
    </Animated.Text>
  );
}

function LoadingHeart({
  index,
  progress,
}: {
  index: number;
  progress: SharedValue<number>;
}) {
  const style = useAnimatedStyle(() => {
    const start = index / 5;
    const end = (index + 0.85) / 5;
    const lit = interpolate(progress.value, [start, end], [0, 1], Extrapolation.CLAMP);
    return {
      opacity: interpolate(lit, [0, 1], [0.22, 1], Extrapolation.CLAMP),
      transform: [
        {
          scale: interpolate(lit, [0, 1], [0.82, 1.12], Extrapolation.CLAMP),
        },
      ],
      color: lit > 0.5 ? palette.rose : 'rgba(244, 91, 140, 0.35)',
    };
  });

  return <Animated.Text style={[styles.loadHeart, style]}>♥</Animated.Text>;
}

function HeartsLoader({ durationMs }: { durationMs: number }) {
  const progress = useSharedValue(0);
  const bounce = useSharedValue(1);

  useEffect(() => {
    progress.value = withTiming(1, {
      duration: durationMs,
      easing: Easing.inOut(Easing.quad),
    });
    bounce.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 650, easing: Easing.inOut(Easing.sin) }),
        withTiming(1, { duration: 650, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );
  }, [bounce, durationMs, progress]);

  const rowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: bounce.value }],
  }));

  return (
    <Animated.View style={[styles.loaderRow, rowStyle]}>
      {Array.from({ length: 5 }).map((_, index) => (
        <LoadingHeart key={index} index={index} progress={progress} />
      ))}
    </Animated.View>
  );
}

function TopCornerWaves() {
  return (
    <View pointerEvents="none" style={styles.topWaveStage}>
      <Svg width="100%" height="100%" viewBox="0 0 280 260" preserveAspectRatio="none">
        <Defs>
          <SvgGradient id="topOuterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#F7B0C8" stopOpacity="0.42" />
            <Stop offset="55%" stopColor="#E878A0" stopOpacity="0.28" />
            <Stop offset="100%" stopColor="#D45A88" stopOpacity="0.12" />
          </SvgGradient>
          <SvgGradient id="topMidGrad" x1="0%" y1="0%" x2="90%" y2="100%">
            <Stop offset="0%" stopColor="#FFD0DE" stopOpacity="0.55" />
            <Stop offset="100%" stopColor="#F59AB8" stopOpacity="0.22" />
          </SvgGradient>
          <SvgGradient id="topInnerGrad" x1="0%" y1="0%" x2="80%" y2="100%">
            <Stop offset="0%" stopColor="#FFF0F5" stopOpacity="0.72" />
            <Stop offset="100%" stopColor="#FFD6E4" stopOpacity="0.28" />
          </SvgGradient>
        </Defs>
        <Path d={TOP_WAVE_OUTER} fill="url(#topOuterGrad)" />
        <Path d={TOP_WAVE_MID} fill="url(#topMidGrad)" />
        <Path d={TOP_WAVE_INNER} fill="url(#topInnerGrad)" />
      </Svg>
    </View>
  );
}

function AnimatedLogo({ size }: { size: number }) {
  const fill = useSharedValue(0);
  const wave = useSharedValue(0);

  useEffect(() => {
    fill.value = withDelay(
      380,
      withTiming(1, { duration: 2100, easing: Easing.out(Easing.cubic) })
    );
    wave.value = withDelay(
      380,
      withRepeat(withTiming(1, { duration: 2200, easing: Easing.linear }), -1, false)
    );
  }, [fill, wave]);

  const tipPlugProps = useAnimatedProps(() => ({
    opacity: interpolate(fill.value, [0, 0.02, 1], [0, 1, 1], Extrapolation.CLAMP),
  }));

  const backWaveProps = useAnimatedProps(() => {
    // Rise from the real tip (~88.5) — liquid body always extends to y=100 under the clip
    const levelY = interpolate(fill.value, [0, 1], [88.5, 58.5], Extrapolation.CLAMP);
    const phase = wave.value * Math.PI * 2;
    return {
      d: buildLiquidPath(levelY + 1.2, phase + 0.9, 2.4),
    };
  });

  const frontWaveProps = useAnimatedProps(() => {
    const levelY = interpolate(fill.value, [0, 1], [88.5, 59.5], Extrapolation.CLAMP);
    const phase = wave.value * Math.PI * 2;
    return {
      d: buildLiquidPath(levelY, phase, 2.1),
    };
  });

  const crestProps = useAnimatedProps(() => {
    const levelY = interpolate(fill.value, [0, 1], [88.5, 59.5], Extrapolation.CLAMP);
    const phase = wave.value * Math.PI * 2;
    return {
      d: buildLiquidCrest(levelY, phase, 2.1),
      opacity: interpolate(fill.value, [0, 0.08, 1], [0, 0.55, 0.85], Extrapolation.CLAMP),
    };
  });

  return (
    <View style={{ width: size, height: size }}>
      <Svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        style={StyleSheet.absoluteFill}
      >
        <Defs>
          <ClipPath id="logoCavity">
            <Path d={LOGO_CAVITY} />
          </ClipPath>
          <SvgGradient id="liquidBack" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#FF8FB0" stopOpacity="0.85" />
            <Stop offset="55%" stopColor="#F25F82" stopOpacity="0.95" />
            <Stop offset="100%" stopColor="#C2185B" stopOpacity="1" />
          </SvgGradient>
          <SvgGradient id="liquidFront" x1="10%" y1="0%" x2="90%" y2="100%">
            <Stop offset="0%" stopColor="#FFD0E0" stopOpacity="0.75" />
            <Stop offset="35%" stopColor="#FF8D9D" stopOpacity="0.92" />
            <Stop offset="100%" stopColor="#E83570" stopOpacity="1" />
          </SvgGradient>
        </Defs>
        <G clipPath="url(#logoCavity)">
          <AnimatedPath
            animatedProps={tipPlugProps}
            d={LOGO_TIP_PLUG}
            fill="#E83570"
          />
          <AnimatedPath
            animatedProps={backWaveProps}
            d={buildLiquidPath(88.5, 0, 2.4)}
            fill="url(#liquidBack)"
          />
          <AnimatedPath
            animatedProps={frontWaveProps}
            d={buildLiquidPath(88.5, 0, 2.1)}
            fill="url(#liquidFront)"
          />
          <AnimatedPath
            animatedProps={crestProps}
            d={buildLiquidCrest(88.5, 0, 2.1)}
            fill="none"
            stroke="rgba(255, 255, 255, 0.7)"
            strokeWidth={0.7}
            strokeLinecap="round"
          />
        </G>
      </Svg>
      <Image
        source={logoSource}
        style={{ width: size, height: size }}
        resizeMode="contain"
      />
    </View>
  );
}

function BottomWaves({ width }: { width: number }) {
  const waveIn = useSharedValue(0);

  useEffect(() => {
    waveIn.value = withDelay(
      200,
      withTiming(1, { duration: 900, easing: Easing.out(Easing.cubic) })
    );
  }, [waveIn]);

  const waveStyle = useAnimatedStyle(() => ({
    opacity: waveIn.value,
    transform: [
      {
        translateY: interpolate(waveIn.value, [0, 1], [36, 0], Extrapolation.CLAMP),
      },
    ],
  }));

  const waveHeight = Math.min(width * 0.44, 220);

  return (
    <Animated.View pointerEvents="none" style={[styles.waveStage, { height: waveHeight }, waveStyle]}>
      <Svg
        width={width}
        height={waveHeight}
        viewBox="0 0 1440 590"
        preserveAspectRatio="none"
        style={StyleSheet.absoluteFill}
      >
        <Defs>
          {/* Soft-light magenta stack — translucent layers like the brand splash */}
          <SvgGradient id="bottomBackGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#E878A8" stopOpacity="0.35" />
            <Stop offset="45%" stopColor="#C84A7A" stopOpacity="0.55" />
            <Stop offset="100%" stopColor="#9B2A58" stopOpacity="0.72" />
          </SvgGradient>
          <SvgGradient id="bottomMidGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#F5A0BE" stopOpacity="0.45" />
            <Stop offset="50%" stopColor="#E86A98" stopOpacity="0.58" />
            <Stop offset="100%" stopColor="#D45082" stopOpacity="0.5" />
          </SvgGradient>
          <SvgGradient id="bottomFrontGrad" x1="0%" y1="0%" x2="100%" y2="80%">
            <Stop offset="0%" stopColor="#FFD0E0" stopOpacity="0.55" />
            <Stop offset="40%" stopColor="#F8A8C4" stopOpacity="0.62" />
            <Stop offset="100%" stopColor="#EF7AA4" stopOpacity="0.48" />
          </SvgGradient>
        </Defs>

        <Path d={WAVE_BACK} fill="url(#bottomBackGrad)" />
        <Path
          d={WAVE_BACK_CREST}
          fill="none"
          stroke="rgba(255, 240, 248, 0.55)"
          strokeWidth={2.5}
          strokeLinecap="round"
        />
        <Path d={WAVE_FRONT} fill="url(#bottomMidGrad)" />
        <Path
          d={WAVE_FRONT_CREST}
          fill="none"
          stroke="rgba(255, 248, 252, 0.6)"
          strokeWidth={2}
          strokeLinecap="round"
        />
        <G transform="translate(0, 48)">
          <Path d={WAVE_FRONT} fill="url(#bottomFrontGrad)" />
          <Path
            d={WAVE_FRONT_CREST}
            fill="none"
            stroke="rgba(255, 255, 255, 0.65)"
            strokeWidth={1.8}
            strokeLinecap="round"
          />
        </G>
      </Svg>
    </Animated.View>
  );
}

export function SplashView() {
  const { width, height } = useWindowDimensions();
  const travel = height + 100;

  const logoProgress = useSharedValue(0);
  const logoPulse = useSharedValue(1);
  const titleProgress = useSharedValue(0);
  const flourishProgress = useSharedValue(0);
  const glow = useSharedValue(0.3);

  useEffect(() => {
    logoProgress.value = withTiming(1, {
      duration: 850,
      easing: Easing.out(Easing.cubic),
    });
    titleProgress.value = withDelay(
      280,
      withTiming(1, { duration: 700, easing: Easing.out(Easing.cubic) })
    );
    flourishProgress.value = withDelay(
      450,
      withTiming(1, { duration: 750, easing: Easing.out(Easing.cubic) })
    );
    logoPulse.value = withDelay(
      850,
      withRepeat(
        withSequence(
          withTiming(1.035, { duration: 900, easing: Easing.inOut(Easing.sin) }),
          withTiming(1, { duration: 900, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        false
      )
    );
    glow.value = withRepeat(
      withSequence(
        withTiming(0.5, { duration: 1100, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.28, { duration: 1100, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );
  }, [flourishProgress, glow, logoProgress, logoPulse, titleProgress]);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoProgress.value,
    transform: [
      {
        scale:
          interpolate(logoProgress.value, [0, 1], [0.78, 1], Extrapolation.CLAMP) *
          logoPulse.value,
      },
      {
        translateY: interpolate(logoProgress.value, [0, 1], [14, 0], Extrapolation.CLAMP),
      },
    ],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glow.value,
    transform: [{ scale: interpolate(glow.value, [0.28, 0.5], [0.94, 1.08]) }],
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleProgress.value,
    transform: [
      {
        translateY: interpolate(titleProgress.value, [0, 1], [12, 0], Extrapolation.CLAMP),
      },
    ],
  }));

  const flourishStyle = useAnimatedStyle(() => ({
    opacity: flourishProgress.value,
    transform: [
      {
        scaleX: interpolate(flourishProgress.value, [0, 1], [0.6, 1], Extrapolation.CLAMP),
      },
      {
        translateY: interpolate(flourishProgress.value, [0, 1], [8, 0], Extrapolation.CLAMP),
      },
    ],
  }));

  const logoSize = Math.min(width * 0.44, 188);
  const flourishWidth = Math.min(width * 0.58, 220);

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['#FFE2EA', '#FFF0F4', '#FDEEF1', '#FFF8FA']}
        locations={[0, 0.28, 0.62, 1]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={['rgba(244, 91, 140, 0.08)', 'transparent', 'rgba(237, 229, 255, 0.12)']}
        locations={[0, 0.45, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0.6 }}
        style={StyleSheet.absoluteFill}
      />

      <TopCornerWaves />
      <View style={styles.mistTopRight} />

      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        {FLOATING_HEARTS.map((heart) => (
          <FloatingHeart
            key={`${heart.left}-${heart.delay}`}
            left={heart.left}
            delay={heart.delay}
            size={heart.size}
            duration={heart.duration}
            drift={heart.drift}
            travel={travel}
            outline={heart.outline}
          />
        ))}
      </View>

      <View style={styles.center}>
        <View style={styles.logoStage}>
          <Animated.View style={[styles.logoGlow, glowStyle]} />
          <Animated.View style={logoStyle}>
            <AnimatedLogo size={logoSize} />
          </Animated.View>
        </View>

        <Animated.View style={[styles.copy, titleStyle]}>
          <View style={styles.brandRow}>
            <Text style={styles.brand}>Loven</Text>
            <View style={styles.iWrap}>
              {/* Dotless i so the heart can replace the tittle */}
              <Text style={styles.brand}>ı</Text>
              <Text style={styles.iHeart}>♥</Text>
            </View>
          </View>
          <Text style={styles.tagline}>Your Little World Together.</Text>
        </Animated.View>

        <Animated.View style={[styles.flourishWrap, flourishStyle]}>
          <Image
            source={flourishSource}
            style={{ width: flourishWidth, height: flourishWidth * 0.34 }}
            resizeMode="contain"
          />
        </Animated.View>

        <View style={styles.loaderWrap}>
          <HeartsLoader durationMs={SPLASH_MS - 500} />
        </View>
      </View>

      <BottomWaves width={width} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: palette.blushWhite,
    overflow: 'hidden',
  },
  topWaveStage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 270,
    height: 250,
  },
  mistTopRight: {
    position: 'absolute',
    top: 100,
    right: -60,
    width: 160,
    height: 160,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 214, 226, 0.35)',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingBottom: 120,
  },
  logoStage: {
    width: 220,
    height: 210,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoGlow: {
    position: 'absolute',
    width: 168,
    height: 168,
    borderRadius: 999,
    backgroundColor: 'rgba(244, 91, 140, 0.16)',
  },
  copy: {
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  brand: {
    fontFamily: fonts.displayBold,
    fontSize: 44,
    lineHeight: 50,
    letterSpacing: -0.8,
    color: palette.berry,
  },
  iWrap: {
    position: 'relative',
  },
  iHeart: {
    position: 'absolute',
    top: -2,
    left: 2,
    fontSize: 12,
    color: palette.rose,
  },
  tagline: {
    marginTop: spacing.sm,
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.2,
    color: palette.mauve,
    textAlign: 'center',
  },
  flourishWrap: {
    marginTop: spacing.xs,
    alignItems: 'center',
  },
  loaderWrap: {
    marginTop: spacing.xxl,
    alignItems: 'center',
  },
  loaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  loadHeart: {
    fontSize: 20,
  },
  floatHeart: {
    position: 'absolute',
    bottom: -28,
  },
  waveStage: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
});
