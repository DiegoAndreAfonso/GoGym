import { TextVariant } from 'src/@types/typography'
import { AppTheme } from 'src/@types/colors'
import { TextStyle } from 'react-native'

type TypographyVariantConfig = {
  props: { variant: TextVariant }
  style: (args: { theme: AppTheme }) => TextStyle
}

type TypographyConfig = {
  baseStyle?: (args: { theme: AppTheme }) => TextStyle
  variants: TypographyVariantConfig[]
}

export const typographyConfig: TypographyConfig = {
  baseStyle: ({ theme }) => ({
    color: theme.text.primary,
  }),

  variants: [
    {
      props: { variant: 'displayLarge' },
      style: ({ theme }) => ({
        color: theme.text.primary,
      }),
    },
    {
      props: { variant: 'bodyMedium' },
      style: ({ theme }) => ({
        color: theme.text.secondary,
      }),
    },
    {
      props: { variant: 'labelSmall' },
      style: ({ theme }) => ({
        color: theme.text.disabled,
      }),
    },
    {
      props: { variant: 'button' },
      style: ({ theme }) => ({
        textTransform: 'uppercase',
      }),
    },
  ],
}
