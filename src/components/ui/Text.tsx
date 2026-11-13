import React from 'react';
import { Text as RNText, TextProps, TextStyle } from 'react-native';
import { useTheme } from '@/src/contexts/ThemeContext';
import { typography } from '@/src/theme/typography';

type Variant = keyof typeof typography;

interface Props extends TextProps {
  variant?: Variant;
  color?: string;
  center?: boolean;
  muted?: boolean;
}

export function Text({
  variant = 'body',
  color,
  center,
  muted,
  style,
  ...rest
}: Props) {
  const { colors } = useTheme();
  const base = typography[variant] as TextStyle;

  return (
    <RNText
      {...rest}
      style={[
        base,
        {
          color: color || (muted ? colors.textSecondary : colors.text),
          textAlign: center ? 'center' : undefined,
        },
        style,
      ]}
    />
  );
}
