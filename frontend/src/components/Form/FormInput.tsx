import React, { useState, useEffect, useRef } from 'react'
import {
  View,
  StyleSheet,
  Pressable,
  StyleProp,
  ViewStyle,
} from 'react-native'
import { TextInput } from 'react-native-paper'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { darkTheme, AppTheme } from 'src/@types/colors'
import { Typography } from 'src/components/Typography'
import { TextVariant, FontStyles } from 'src/@types/typography'

type FormInputVariant = 'contained' | 'outlined' | 'transparent'

type FormInputProps = {
  label: string
  placeholder?: string
  secureTextEntry?: boolean
  theme?: AppTheme
  labelTypography?: {
    variant?: TextVariant
    fontStyle?: keyof typeof FontStyles
    color?: string
    style?: StyleProp<ViewStyle>
  }
  inputTypography?: {
    variant?: TextVariant
    fontStyle?: keyof typeof FontStyles
    color?: string
    style?: StyleProp<ViewStyle>
  }
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
  value?: string
  onChangeText?: (text: string) => void
  onBlur?: () => void
  onFocus?: () => void
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters'
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'number-pad' | 'decimal-pad'
  returnKeyType?: 'done' | 'go' | 'next' | 'search' | 'send'
  onSubmitEditing?: () => void
  blurOnSubmit?: boolean
  maxLength?: number
  multiline?: boolean
  numberOfLines?: number
  autoFocus?: boolean 
}

export default function FormInput({
  label,
  placeholder,
  secureTextEntry = false,
  theme = darkTheme,
  labelTypography,
  inputTypography,
  variant = 'outlined',
  error = false,
  errorMessage,
  disabled = false,
  leftIcon,
  rightIcon,
  onRightIconPress,
  onLeftIconPress,
  style,
  testID,
  value = '',
  onChangeText,
  onBlur,
  onFocus,
  autoCapitalize = 'none',
  keyboardType = 'default',
  returnKeyType = 'done',
  onSubmitEditing,
  blurOnSubmit,
  maxLength,
  multiline = false,
  numberOfLines = 1,
  autoFocus = false, // Valor padrão
}: FormInputProps) {
  const [hidePassword, setHidePassword] = useState(secureTextEntry)
  const [isFocused, setIsFocused] = useState(false)
  
  // Referência para o TextInput
  const inputRef = useRef<any>(null)

  // Efeito para auto-focus
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      // Pequeno delay para garantir que o componente esteja renderizado
      const timer = setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
      
      return () => clearTimeout(timer)
    }
  }, [autoFocus])

  // Efeito para re-focar quando o campo recebe foco novamente
  useEffect(() => {
    const handleFocus = () => {
      if (isFocused && inputRef.current) {
        inputRef.current?.focus()
      }
    }

    // Verifica periodicamente se o campo ainda está focado
    const interval = setInterval(handleFocus, 500)
    
    return () => clearInterval(interval)
  }, [isFocused])

  const labelVariant: TextVariant = labelTypography?.variant || 'labelLarge'
  const errorVariant: TextVariant = 'bodySmall'
  const inputTextVariant: TextVariant = inputTypography?.variant || 'bodyMedium'

  const getTextColor = (): string => {
    if (disabled) return theme.text.disabled
    if (error) return theme.text.primary
    return inputTypography?.color ?? theme.input.text ?? theme.text.primary
  }

  const getPlaceholderColor = (): string => {
    if (disabled) return theme.text.disabled
    return theme.input.placeholder ?? theme.text.placeholder
  }

  const getIconColor = (): string => {
    if (disabled) return theme.text.disabled
    if (error) return theme.text.primary
    return theme.input.icon ?? theme.text.primary
  }

  const getBorderColor = (): string => {
    if (error) return theme.text.primary
    if (isFocused) return theme.text.link
    return theme.input.border ?? `${theme.text.primary}55`
  }

  const getLabelColor = (): string => {
    if (error) return theme.text.primary
    if (disabled) return theme.text.disabled
    return labelTypography?.color ?? theme.text.primary
  }

  const getVariantStyles = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: 12,
      height: multiline ? undefined : 52,
      minHeight: multiline ? 52 : undefined,
      opacity: disabled ? 0.6 : 1,
    }

    const borderColor = getBorderColor()

    switch (variant) {
      case 'contained':
        const containedBg = theme.background === '#260635ff' || theme.background === '#1b1b3a'
          ? `${theme.text.primary}10`
          : `${theme.text.primary}05`

        return {
          ...baseStyle,
          backgroundColor: containedBg,
          borderWidth: error ? 2 : isFocused ? 1 : 0,
          borderColor: borderColor,
          elevation: isFocused ? 4 : 2,
          shadowColor: theme.text.primary,
          shadowOffset: { width: 0, height: isFocused ? 3 : 2 },
          shadowOpacity: isFocused ? 0.15 : 0.08,
          shadowRadius: isFocused ? 5 : 3,
        }

      case 'transparent':
        const transparentBg = theme.background === '#260635ff' || theme.background === '#1b1b3a'
          ? 'rgba(255, 255, 255, 0.05)'
          : 'rgba(0, 0, 0, 0.05)'

        return {
          ...baseStyle,
          backgroundColor: transparentBg,
          borderWidth: 0,
          borderBottomWidth: isFocused || error ? 2 : 1,
          borderBottomColor: borderColor,
        }

      case 'outlined':
      default:
        return {
          ...baseStyle,
          borderWidth: isFocused || error ? 2 : 1,
          borderColor: borderColor,
          backgroundColor: 'transparent',
        }
    }
  }

  const getBackgroundColor = (): string => {
    switch (variant) {
      case 'contained':
        return theme.background === '#260635ff' || theme.background === '#1b1b3a'
          ? `${theme.text.primary}10`
          : `${theme.text.primary}05`
      case 'transparent':
        return theme.background === '#260635ff' || theme.background === '#1b1b3a'
          ? 'rgba(255, 255, 255, 0.05)'
          : 'rgba(0, 0, 0, 0.05)'
      default:
        return 'transparent'
    }
  }

  const renderLeftIcon = () => {
    if (!leftIcon) return null

    return (
      <Pressable
        onPress={onLeftIconPress}
        disabled={!onLeftIconPress || disabled}
        style={[styles.icon, styles.leftIcon]}
      >
        <MaterialCommunityIcons
          name={leftIcon}
          size={20}
          color={getIconColor()}
        />
      </Pressable>
    )
  }

  const renderRightIcon = () => {
    if (secureTextEntry) {
      return (
        <Pressable
          onPress={() => !disabled && setHidePassword(!hidePassword)}
          style={[styles.icon, styles.rightIcon]}
          disabled={disabled}
        >
          <MaterialCommunityIcons
            name={hidePassword ? 'eye-off-outline' : 'eye-outline'}
            size={22}
            color={getIconColor()}
          />
        </Pressable>
      )
    }

    if (rightIcon) {
      return (
        <Pressable
          onPress={onRightIconPress}
          disabled={disabled || !onRightIconPress}
          style={[styles.icon, styles.rightIcon]}
        >
          <MaterialCommunityIcons
            name={rightIcon}
            size={20}
            color={getIconColor()}
          />
        </Pressable>
      )
    }

    return null
  }

  const handleFocus = () => {
    setIsFocused(true)
    onFocus?.()
  }

  const handleBlur = () => {
    setIsFocused(false)
    onBlur?.()
  }

  // Função para selecionar todo o texto quando o campo recebe foco
  const handleFocusWithSelection = () => {
    handleFocus()
    // Seleciona todo o texto quando o campo recebe foco
    setTimeout(() => {
      if (inputRef.current && value) {
        inputRef.current.setNativeProps({
          selection: { start: 0, end: value.length }
        })
      }
    }, 100)
  }

  return (
    <View style={[styles.container, style]} testID={testID}>
      {label && (
        <Typography
          variant={labelVariant}
          fontStyle={labelTypography?.fontStyle}
          color={getLabelColor()}
          style={[styles.label, labelTypography?.style]}
        >
          {label}
        </Typography>
      )}

      <View style={styles.inputWrapper}>
        {renderLeftIcon()}

        <TextInput
          ref={inputRef}
          placeholder={placeholder}
          secureTextEntry={hidePassword}
          style={[
            styles.input,
            getVariantStyles(),
            leftIcon && styles.inputWithLeftIcon,
            (rightIcon || secureTextEntry) && styles.inputWithRightIcon,
            variant === 'transparent' && styles.transparentInput,
            multiline && styles.multilineInput,
          ]}
          textColor={getTextColor()}
          placeholderTextColor={getPlaceholderColor()}
          theme={{
            colors: {
              background: getBackgroundColor(),
              primary: theme.text.link,
              error: theme.text.primary,
              text: getTextColor(),
              placeholder: getPlaceholderColor(),
            },
          }}
          underlineColor="transparent"
          onFocus={handleFocusWithSelection}
          onBlur={handleBlur}
          editable={!disabled}
          error={error}
          mode="flat"
          value={value}
          onChangeText={onChangeText}
          autoCapitalize={autoCapitalize}
          keyboardType={keyboardType}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          blurOnSubmit={blurOnSubmit}
          maxLength={maxLength}
          multiline={multiline}
          numberOfLines={numberOfLines}
          autoFocus={autoFocus} // Propriedade nativa do TextInput
        />

        {renderRightIcon()}
      </View>

      {error && errorMessage && (
        <Typography
          variant={errorVariant}
          color={theme.text.primary}
          style={styles.errorMessage}
        >
          {errorMessage}
        </Typography>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 8,
  },
  label: {
    marginLeft: 4,
  },
  inputWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  input: {
    backgroundColor: 'transparent',
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 0,
    margin: 0,
  },
  multilineInput: {
    paddingTop: 12,
    paddingBottom: 12,
    textAlignVertical: 'top',
  },
  transparentInput: {
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderRadius: 0,
  },
  inputWithLeftIcon: {
    paddingLeft: 48,
  },
  inputWithRightIcon: {
    paddingRight: 48,
  },
  icon: {
    position: 'absolute',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  leftIcon: {
    left: 16,
    width: 32,
  },
  rightIcon: {
    right: 16,
    width: 32,
  },
  errorMessage: {
    marginTop: 4,
    marginLeft: 4,
  },
})

export function FormInputContained(props: Omit<FormInputProps, 'variant'>) {
  return <FormInput {...props} variant="contained" />
}

export function FormInputOutlined(props: Omit<FormInputProps, 'variant'>) {
  return <FormInput {...props} variant="outlined" />
}

export function FormInputTransparent(props: Omit<FormInputProps, 'variant'>) {
  return <FormInput {...props} variant="transparent" />
}