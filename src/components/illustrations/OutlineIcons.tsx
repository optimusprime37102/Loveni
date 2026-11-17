import Svg, { G, Path, SvgProps } from 'react-native-svg';

/** From assets/images/heart-icon.svg */
export function HeartOutlineIcon({
  size = 26,
  color = '#F25F82',
  ...props
}: SvgProps & { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** From assets/images/letter_icon.svg */
export function EnvelopeOutlineIcon({
  size = 26,
  color = '#F25F82',
  ...props
}: SvgProps & { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
      <Path d="M0 0h48v48H0z" fill="none" />
      <G>
        <Path
          d="M8,40h32c2.2,0,4-1.8,4-4V12c0-2.2-1.8-4-4-4H8c-2.2,0-4,1.8-4,4v24C4,38.2,5.8,40,8,40z M39.172,12L24,27.172L8.828,12 H39.172z M8,16.828l16,16l16-16V36H8V16.828z"
          fill={color}
        />
      </G>
    </Svg>
  );
}
