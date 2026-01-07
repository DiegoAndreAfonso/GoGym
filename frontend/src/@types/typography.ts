import { TypographyColors } from 'src/@types/colors';

/* ======================================================
 * Font families
 * ====================================================== */
export enum FontFamily {
  REGULAR = 'Montserrat-Regular',
  MEDIUM = 'Montserrat-Medium',
  BOLD = 'Montserrat-Bold',
  EXTRA_BOLD = 'Montserrat-ExtraBold',
  BLACK = 'Montserrat-Black',
  DISPLAY = 'Blast-Dragon',
}

export type TextVariant =
  | 'displayLarge'
  | 'displayMedium'
  | 'displaySmall'
  | 'headlineLarge'
  | 'headlineMedium'
  | 'headlineSmall'
  | 'titleLarge'
  | 'titleMedium'
  | 'titleSmall'
  | 'bodyLarge'
  | 'bodyMedium'
  | 'bodySmall'
  | 'labelLarge'
  | 'labelMedium'
  | 'labelSmall'
  | 'button';

export interface TypographyStyle {
  fontFamily: FontFamily;
  fontSize: number;
  lineHeight: number;
  letterSpacing?: number;
}

export const Typography: Record<TextVariant, TypographyStyle> = {
  displayLarge: {
    fontFamily: FontFamily.DISPLAY,
    fontSize:90,
    lineHeight: 90,
    letterSpacing: -0.25,
  },
  displayMedium: {
    fontFamily: FontFamily.DISPLAY,
    fontSize: 45,
    lineHeight: 52,
  },
  displaySmall: {
    fontFamily: FontFamily.DISPLAY,
    fontSize: 36,
    lineHeight: 44,
  },

  headlineLarge: {
    fontFamily: FontFamily.DISPLAY,
    fontSize: 32,
    lineHeight: 40,
  },
  headlineMedium: {
    fontFamily: FontFamily.DISPLAY,
    fontSize: 28,
    lineHeight: 36,
  },
  headlineSmall: {
    fontFamily: FontFamily.DISPLAY,
    fontSize: 24,
    lineHeight: 32,
  },

  titleLarge: {
    fontFamily: FontFamily.MEDIUM,
    fontSize: 22,
    lineHeight: 28,
  },
  titleMedium: {
    fontFamily: FontFamily.MEDIUM,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.15,
  },
  titleSmall: {
    fontFamily: FontFamily.MEDIUM,
    fontSize: 25,
    lineHeight: 20,
    letterSpacing: 0.1,
  },

  bodyLarge: {
    fontFamily: FontFamily.REGULAR,
    fontSize: 23,
    lineHeight: 24,
    letterSpacing: 0.5,
  },
  bodyMedium: {
    fontFamily: FontFamily.REGULAR,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.25,
  },
  bodySmall: {
    fontFamily: FontFamily.REGULAR,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.4,
  },

  labelLarge: {
    fontFamily: FontFamily.MEDIUM,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  labelMedium: {
    fontFamily: FontFamily.MEDIUM,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.5,
  },
  labelSmall: {
    fontFamily: FontFamily.MEDIUM,
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 0.5,
  },
  button: {
    fontFamily: FontFamily.MEDIUM,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.1,
  },
} as const;

export const FontStyles = {
  regular: { fontFamily: FontFamily.REGULAR },
  medium: { fontFamily: FontFamily.MEDIUM },
  bold: { fontFamily: FontFamily.BOLD },
  extraBold: { fontFamily: FontFamily.EXTRA_BOLD },
  black: { fontFamily: FontFamily.BLACK },
} as const


export type FontStyle = keyof typeof FontStyles;

export const createTypographyColors = (textColors: {
  primary: string;
  secondary: string;
  disabled: string;
}): TypographyColors => ({
  displayLarge: textColors.primary,
  displayMedium: textColors.primary,
  displaySmall: textColors.primary,
  headlineLarge: textColors.primary,
  headlineMedium: textColors.primary,
  headlineSmall: textColors.primary,
  titleLarge: textColors.primary,
  titleMedium: textColors.primary,
  titleSmall: textColors.primary,
  bodyLarge: textColors.primary,
  bodyMedium: textColors.primary,
  bodySmall: textColors.secondary,
  labelLarge: textColors.secondary,
  labelMedium: textColors.secondary,
  labelSmall: textColors.disabled,
  button: textColors.primary,
});
