import Svg, { Defs, LinearGradient, Path, Rect, Stop, SvgProps } from 'react-native-svg';

export function DaysTogetherIcon({ width = 40, height = 40, ...props }: SvgProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 64 64" fill="none" {...props}>
      <Defs>
        <LinearGradient id="cal" x1="12" y1="10" x2="52" y2="54" gradientUnits="userSpaceOnUse">
          <Stop stopColor="#FFB0C8" />
          <Stop offset="1" stopColor="#F25F82" />
        </LinearGradient>
        <LinearGradient id="calHeart" x1="26" y1="28" x2="38" y2="44" gradientUnits="userSpaceOnUse">
          <Stop stopColor="#FF8AAD" />
          <Stop offset="1" stopColor="#CE2457" />
        </LinearGradient>
      </Defs>
      <Rect x="12" y="14" width="40" height="38" rx="10" fill="url(#cal)" />
      <Rect x="18" y="10" width="6" height="10" rx="3" fill="#DD3C6A" />
      <Rect x="40" y="10" width="6" height="10" rx="3" fill="#DD3C6A" />
      <Rect x="12" y="22" width="40" height="8" fill="#FFE2EA" opacity={0.55} />
      <Path
        d="M32 44c-1.4-1.2-5.2-4-5.6-6.6-.4-2.4 1.2-4.2 3.2-4 1.2.1 2.1.9 2.4 2 .4-1.2 1.4-2 2.8-2 2.2 0 3.6 1.8 3.2 4-.5 2.6-4.6 5.4-6 6.6z"
        fill="url(#calHeart)"
      />
    </Svg>
  );
}

export function LoveNotesIcon({ width = 40, height = 40, ...props }: SvgProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 64 64" fill="none" {...props}>
      <Defs>
        <LinearGradient id="env" x1="10" y1="18" x2="54" y2="50" gradientUnits="userSpaceOnUse">
          <Stop stopColor="#FFC0D4" />
          <Stop offset="1" stopColor="#F25F82" />
        </LinearGradient>
        <LinearGradient id="seal" x1="28" y1="30" x2="36" y2="42" gradientUnits="userSpaceOnUse">
          <Stop stopColor="#FF7AA0" />
          <Stop offset="1" stopColor="#CE2457" />
        </LinearGradient>
      </Defs>
      <Path
        d="M12 22c0-3.3 2.7-6 6-6h28c3.3 0 6 2.7 6 6v24c0 3.3-2.7 6-6 6H18c-3.3 0-6-2.7-6-6V22z"
        fill="url(#env)"
      />
      <Path d="M14 22l18 14 18-14" stroke="#FFF8FA" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
      <Path
        d="M32 42c-1-0.9-3.6-3-3.9-4.8-.3-1.7.8-3 2.2-2.8.9.1 1.5.7 1.7 1.5.3-.9 1-1.5 2-1.5 1.6 0 2.6 1.3 2.3 2.9-.4 1.9-3.3 3.9-4.3 4.7z"
        fill="url(#seal)"
      />
    </Svg>
  );
}

export function MoodSharingIcon({ width = 40, height = 40, ...props }: SvgProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 64 64" fill="none" {...props}>
      <Defs>
        <LinearGradient id="moodHeart" x1="18" y1="14" x2="46" y2="52" gradientUnits="userSpaceOnUse">
          <Stop stopColor="#FFB4CC" />
          <Stop offset="1" stopColor="#F25F82" />
        </LinearGradient>
      </Defs>
      <Path
        d="M32 54C28 50 14 40 12 30c-1.8-9 5.2-15 12-14 4 .4 7 3 8 7 1.2-4.2 4.4-7 8.6-6.8 8 .4 12 8.2 9.4 16.4C47.4 42 36 50 32 54z"
        fill="url(#moodHeart)"
      />
      <Path d="M24 30c0-1.4 1-2.4 2.2-2.4S28.4 28.6 28.4 30 27.4 32.4 26.2 32.4 24 31.4 24 30z" fill="#650C34" />
      <Path d="M35.6 30c0-1.4 1-2.4 2.2-2.4S40 28.6 40 30s-1 2.4-2.2 2.4S35.6 31.4 35.6 30z" fill="#650C34" />
      <Path
        d="M26 37c1.4 2.2 3.4 3.4 6 3.4s4.6-1.2 6-3.4"
        stroke="#650C34"
        strokeWidth={2.4}
        strokeLinecap="round"
      />
    </Svg>
  );
}
