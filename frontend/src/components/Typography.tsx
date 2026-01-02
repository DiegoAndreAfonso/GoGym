import React from 'react';
import {
  Text as RNText,
  TextProps as RNTextProps,
  StyleProp,
  TextStyle,
  StyleSheet,
} from 'react-native';

import { useTheme } from 'src/context/ThemeContext';
import { Typography as TypographyMap, FontStyles, TextVariant } from 'src/@types/typography';

export interface TypographyProps extends RNTextProps {
  variant?: TextVariant;
  fontStyle?: keyof typeof FontStyles;
  color?: string;
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  children: React.ReactNode;
}

export const Typography: React.FC<TypographyProps> = ({
  variant = 'bodyMedium',
  fontStyle,
  color,
  align,
  style,
  children,
  ...props
}) => {
  const { theme } = useTheme();

  const baseTypography = TypographyMap[variant];

  const textStyle: StyleProp<TextStyle> = [
    styles.base,

    baseTypography,

    fontStyle && FontStyles[fontStyle],

    align && { textAlign: align },

    {
      color:
        color ??
        theme.typography?.[variant] ??
        theme.text.primary,
    },

    style,
  ];

  return (
    <RNText {...props} style={textStyle}>
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  base: {
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});
