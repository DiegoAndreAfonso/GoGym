import { TextStyle, StyleProp, ViewStyle } from 'react-native'
import { TextVariant, FontStyles } from 'src/@types/typography'
import { AppTheme } from 'src/@types/colors'

export type TypographyProps = {
  variant?: TextVariant
  fontStyle?: keyof typeof FontStyles
  color?: string
  style?: StyleProp<TextStyle>
}
export type FormInputVariant = 'contained' | 'outlined'

export type FormInputProps = {
  label: string
  placeholder?: string
  secureTextEntry?: boolean
  theme?: AppTheme
  labelTypography?: TypographyProps
  inputTypography?: TypographyProps
  variant?: FormInputVariant
  error?: boolean
  errorMessage?: string
  disabled?: boolean
  leftIcon?: string
  rightIcon?: string
  onRightIconPress?: () => void
  onLeftIconPress?: () => void
  style?: StyleProp<ViewStyle>
  testID?: string
}


export type ButtonVariant = 'contained' | 'outlined' | 'transparent' | 'text'

export type FormButtonProps = {
  title: string
  onPress: () => void
  theme?: AppTheme
  variant?: ButtonVariant
  typography?: TypographyProps
  loading?: boolean
  disabled?: boolean
  leftIcon?: string
  rightIcon?: string
  fullWidth?: boolean
  size?: 'small' | 'medium' | 'large'
  style?: StyleProp<ViewStyle>
  testID?: string
}