import Svg, { Defs, G, LinearGradient, Path, Stop, SvgProps } from 'react-native-svg';

/** From assets/images/loveni_layered_hearts.svg */
export function LayeredHearts({ width = 140, height = 110, ...props }: SvgProps) {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="56 14 355 280"
      fill="none"
      accessibilityLabel="Layered pastel pink hearts"
      {...props}
    >
      <Defs>
        <LinearGradient id="rearPink" x1="92" y1="37" x2="296" y2="332" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#FF97B9" />
          <Stop offset="0.42" stopColor="#FFA9C4" />
          <Stop offset="0.77" stopColor="#FFD0DF" />
          <Stop offset="1" stopColor="#FDE7EF" />
        </LinearGradient>
        <LinearGradient id="frontPink" x1="300" y1="67" x2="251" y2="318" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#FFB0C9" />
          <Stop offset="0.34" stopColor="#FFB9D0" />
          <Stop offset="0.72" stopColor="#FFD1E0" />
          <Stop offset="1" stopColor="#FFE2EC" />
        </LinearGradient>
        <LinearGradient id="middleShine" x1="204" y1="111" x2="354" y2="267" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#FFC4D9" stopOpacity="0.66" />
          <Stop offset="0.72" stopColor="#FFC5D8" stopOpacity="0.18" />
          <Stop offset="1" stopColor="#FFD5E3" stopOpacity="0" />
        </LinearGradient>
        <LinearGradient id="innerBlush" x1="231" y1="135" x2="305" y2="262" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#FFF1F6" />
          <Stop offset="0.56" stopColor="#FFE9F1" />
          <Stop offset="1" stopColor="#FFE4EF" />
        </LinearGradient>
        <LinearGradient id="bottomFade" x1="230" y1="226" x2="230" y2="332" gradientUnits="userSpaceOnUse">
          <Stop stopColor="#FFF1F6" stopOpacity="0" />
          <Stop offset="1" stopColor="#FFF1F6" stopOpacity="0.16" />
        </LinearGradient>
      </Defs>

      <G transform="scale(1 0.86)">
        <Path
          d="M266 124 C243 80 215 28 153 27 C98 24 66 70 71 128 C76 189 128 241 191 290 C217 311 242 332 259 335 C268 336 276 330 289 321 C360 270 402 212 401 153 C401 106 379 75 348 68 C309 58 284 83 266 124 Z"
          fill="url(#rearPink)"
        />
        <Path
          d="M268 138 C245 102 215 92 190 94 C155 98 139 124 144 160 C150 204 197 255 249 306 C260 317 266 326 276 324 C288 320 311 299 339 270 C373 236 397 198 395 154 C393 112 368 80 332 78 C305 76 285 96 268 138 Z"
          fill="url(#frontPink)"
        />
        <Path
          d="M267 139 C246 104 216 95 190 98 C157 102 147 129 151 159 C158 201 204 253 255 305 C266 315 269 320 275 320 C243 284 194 231 177 192 C157 145 185 104 224 111 C241 115 257 128 267 139 Z"
          fill="url(#middleShine)"
        />
        <Path
          d="M268 175 C255 152 234 140 216 142 C196 144 183 162 188 184 C195 212 229 242 260 265 C266 270 272 270 279 265 C313 239 345 207 348 181 C350 156 332 140 313 140 C294 140 279 156 268 175 Z"
          fill="url(#innerBlush)"
        />
        <Path
          d="M266 124 C243 80 215 28 153 27 C98 24 66 70 71 128 C76 189 128 241 191 290 C217 311 242 332 259 335 C268 336 276 330 289 321 C360 270 402 212 401 153 C401 106 379 75 348 68 C309 58 284 83 266 124 Z"
          fill="url(#bottomFade)"
        />
      </G>
    </Svg>
  );
}
