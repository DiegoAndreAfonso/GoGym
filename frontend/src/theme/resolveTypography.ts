import { TextStyle } from 'react-native'
import { AppTheme } from 'src/@types/colors'
import { TextVariant, Typography } from 'src/@types/typography'
import { typographyConfig } from 'src/theme/typography.config'

export const resolveTypographyStyle = (
  theme: AppTheme,
  variant: TextVariant,
  colorOverride?: string
): TextStyle => {
  const baseVariant = Typography[variant]

let style: TextStyle = {
  fontFamily: baseVariant.fontFamily, 
  fontSize: baseVariant.fontSize,
  lineHeight: baseVariant.lineHeight,
  letterSpacing: baseVariant.letterSpacing,
  color:
    colorOverride ||
    theme.typography?.[variant] ||
    theme.text.primary,
}


  if (typographyConfig.baseStyle) {
    style = {
      ...style,
      ...typographyConfig.baseStyle({ theme }),
    }
  }

  typographyConfig.variants.forEach(v => {
    if (v.props.variant === variant) {
      style = {
        ...style,
        ...v.style({ theme }),
      }
    }
  })

  return style
}
