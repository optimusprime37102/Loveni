import Svg, { Defs, G, LinearGradient, Path, Stop, SvgProps } from 'react-native-svg';

export function LoveLetter({ width = 96, height = 68, ...props }: SvgProps) {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 660 460"
      accessibilityLabel="Pink love letter with heart seal"
      {...props}
    >
      <Defs>
        <LinearGradient id="paper" x1="0.15" y1="0" x2="0.85" y2="1">
          <Stop stopColor="#fff3f6" />
          <Stop offset="0.52" stopColor="#ffe5ed" />
          <Stop offset="1" stopColor="#ffd6e4" />
        </LinearGradient>
        <LinearGradient id="envelopeBack" x1="0" y1="0" x2="0.9" y2="1">
          <Stop stopColor="#ffb6cb" />
          <Stop offset="0.6" stopColor="#ff9fbb" />
          <Stop offset="1" stopColor="#f888a8" />
        </LinearGradient>
        <LinearGradient id="leftFold" x1="0" y1="0" x2="1" y2="0.7">
          <Stop stopColor="#ffc1d2" />
          <Stop offset="1" stopColor="#ffa1bb" />
        </LinearGradient>
        <LinearGradient id="rightFold" x1="0.1" y1="0" x2="1" y2="1">
          <Stop stopColor="#ffbad0" />
          <Stop offset="1" stopColor="#ff8dab" />
        </LinearGradient>
        <LinearGradient id="frontFold" x1="0.38" y1="0" x2="0.5" y2="1">
          <Stop stopColor="#ffc1d4" />
          <Stop offset="1" stopColor="#ff9db8" />
        </LinearGradient>
        <LinearGradient id="heart" x1="0.2" y1="0.05" x2="0.85" y2="1">
          <Stop stopColor="#ff779c" />
          <Stop offset="0.5" stopColor="#fa507f" />
          <Stop offset="1" stopColor="#e12e67" />
        </LinearGradient>
        <LinearGradient id="sparkle" x1="0" y1="0" x2="1" y2="1">
          <Stop stopColor="#ff97b2" />
          <Stop offset="1" stopColor="#f34e7e" />
        </LinearGradient>
      </Defs>

      <G stroke="url(#sparkle)" strokeWidth={12} strokeLinecap="round" fill="none">
        <Path d="M465 63 L466 27" />
        <Path d="M503 80 L526 55" />
        <Path d="M522 117 L555 107" />
      </G>

      <Path
        d="M111 139 Q118 132 129 134 L475 163 Q489 165 487 179 L457 359 Q456 371 444 370 L78 340 Q66 339 69 326 L99 152 Q101 144 111 139Z"
        fill="url(#envelopeBack)"
      />
      <Path
        d="M111 146 L288 266 L482 173 Q486 168 475 163 L129 134 Q117 133 111 146Z"
        fill="#ef7f9f"
        opacity={0.48}
      />

      <Path
        d="M174 75 Q175 63 188 64 L439 87 Q450 88 448 101 L427 255 L151 232Z"
        fill="url(#paper)"
      />
      <Path
        d="M188 70 L439 92"
        stroke="#ffffff"
        strokeOpacity={0.5}
        strokeWidth={3}
        strokeLinecap="round"
      />
      <G stroke="#f5b1c6" strokeOpacity={0.65} strokeLinecap="round" fill="none">
        <Path d="M225 134 L388 148" strokeWidth={12} />
        <Path d="M218 174 L365 187" strokeWidth={11} />
      </G>

      <Path
        d="M105 151 Q102 143 97 151 L69 325 Q67 339 78 340 L260 257Z"
        fill="url(#leftFold)"
      />
      <Path
        d="M482 173 Q487 170 486 181 L456 361 Q454 373 444 371 L286 264Z"
        fill="url(#rightFold)"
      />
      <Path
        d="M69 325 L247 235 Q268 225 288 244 L457 358 Q458 370 446 371 L79 341 Q69 339 69 325Z"
        fill="url(#frontFold)"
      />
      <Path
        d="M75 334 L242 247"
        stroke="#ffd6e0"
        strokeWidth={2.6}
        opacity={0.32}
        strokeLinecap="round"
      />
      <Path
        d="M291 253 L451 364"
        stroke="#f77e9d"
        strokeWidth={2.4}
        opacity={0.18}
        strokeLinecap="round"
      />

      <Path
        d="M267 285 C257 275 231 253 225 238 C216 215 234 199 252 205 C260 207 266 211 274 223 C283 213 291 210 302 212 C324 215 331 239 316 256 C303 272 282 288 274 292 Q271 294 267 285Z"
        fill="url(#heart)"
      />
      <Path
        d="M244 214 Q253 209 261 219"
        stroke="#ffb5cb"
        opacity={0.57}
        strokeWidth={6}
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
}
