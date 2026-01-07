// src/components/LoginFooter/LoginFooter.tsx
import React from 'react'
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native'
import { AppTheme } from 'src/@types/colors'
import RememberMe from '@/components/Form/RememberMe'
import Link, { LinkProps } from '@/components/Form/Link'

type LoginFooterProps = {
  theme: AppTheme
  showRememberMe?: boolean
  rememberMeChecked?: boolean
  onRememberMeToggle?: (checked: boolean) => void
  rememberMeLabel?: string
  rememberMeDisabled?: boolean
  linkProps?: LinkProps
  showForgotPassword?: boolean
  forgotPasswordText?: string
  onForgotPasswordPress?: () => void
  style?: StyleProp<ViewStyle>
  testID?: string
}

export default function LoginFooter({
  theme,
  showRememberMe = true,
  rememberMeChecked = false,
  onRememberMeToggle,
  rememberMeLabel = 'Lembre de mim',
  rememberMeDisabled = false,
  linkProps,
  showForgotPassword = true,
  forgotPasswordText = 'Esqueceu a senha?',
  onForgotPasswordPress,
  style,
  testID,
}: LoginFooterProps) {
  return (
    <View style={[styles.container, style]} testID={testID}>
      {showRememberMe && (
        <RememberMe
          theme={theme}
          checked={rememberMeChecked}
          onToggle={onRememberMeToggle}
          label={rememberMeLabel}
          disabled={rememberMeDisabled}
        />
      )}
      
      {showForgotPassword && (
        <Link
          titulo={forgotPasswordText}
          theme={theme}
          onPress={onForgotPasswordPress}
          {...linkProps}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 4,
  },
})

// Versão simplificada
export function LoginFooterSimple({
  theme,
  onForgotPasswordPress,
}: {
  theme: AppTheme
  onForgotPasswordPress?: () => void
}) {
  return (
    <View style={styles.container}>
      <RememberMe
        theme={theme}
        label="Lembre de mim"
      />
      
      <Link
        titulo="Esqueceu a senha?"
        theme={theme}
        onPress={onForgotPasswordPress}
      />
    </View>
  )
}