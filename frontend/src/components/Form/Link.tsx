// src/components/Form/Link.tsx
import React from 'react'
import { 
  Pressable, 
  StyleSheet, 
  StyleProp, 
  TextStyle,
  GestureResponderEvent 
} from 'react-native'
import { AppTheme } from 'src/@types/colors'
import { Typography } from 'src/components/Typography'
import { TextVariant, FontStyles } from 'src/@types/typography'

export type LinkProps = {
  titulo: string
  theme: AppTheme
  onPress?: (event?: GestureResponderEvent) => void // Aceita evento opcional
  typography?: {
    variant?: TextVariant
    fontStyle?: keyof typeof FontStyles
    color?: string
    style?: StyleProp<TextStyle>
  }
  disabled?: boolean
  testID?: string
}

export default function Link({
  titulo,
  theme,
  onPress,
  typography,
  disabled = false,
  testID,
}: LinkProps) {
  const getTextColor = () => {
    if (disabled) return theme.text.disabled
    return typography?.color ?? theme.text.link
  }

  return (
    <Pressable
      onPress={onPress} 
      disabled={disabled}
      style={({ pressed }) => [
        styles.container,
        pressed && !disabled && styles.pressed,
      ]}
      testID={testID}
    >
      <Typography
        variant={typography?.variant || 'bodyMedium'}
        fontStyle={typography?.fontStyle}
        color={getTextColor()}
        style={[styles.text, typography?.style]}
      >
        {titulo}
      </Typography>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  pressed: {
    opacity: 0.7,
  },
  text: {
    textDecorationLine: 'underline',
  },
})