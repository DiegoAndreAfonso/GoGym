import React from 'react'
import { 
  View, 
  StyleSheet, 
  Pressable, 
  StyleProp, 
  ViewStyle,
  TextStyle,
  ActivityIndicator
} from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { darkTheme, AppTheme } from 'src/@types/colors'
import { Typography } from 'src/components/Typography'
import { TextVariant, FontStyles } from 'src/@types/typography'

type ButtonVariant = 'contained' | 'outlined' | 'transparent' | 'text'

type FormButtonProps = {
  title: string
  onPress: () => void
  theme?: AppTheme
  variant?: ButtonVariant
  typography?: {
    variant?: TextVariant
    fontStyle?: keyof typeof FontStyles
    color?: string
    style?: StyleProp<TextStyle>
  }
  loading?: boolean
  disabled?: boolean
  leftIcon?: string
  rightIcon?: string
  fullWidth?: boolean
  size?: 'small' | 'medium' | 'large'
  style?: StyleProp<ViewStyle>
  testID?: string
}

export default function FormButton({
  title,
  onPress,
  theme = darkTheme,
  variant = 'contained',
  typography,
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  fullWidth = true,
  size = 'medium',
  style,
  testID,
}: FormButtonProps) {
  const getSizeStyles = (): ViewStyle => {
    switch (size) {
      case 'small':
        return { height: 36, paddingHorizontal: 16 }
      case 'large':
        return { height: 56, paddingHorizontal: 24 }
      case 'medium':
      default:
        return { height: 48, paddingHorizontal: 20 }
    }
  }

  const getTextVariant = (): TextVariant => {
    switch (size) {
      case 'small':
        return 'labelMedium'
      case 'large':
        return 'labelLarge'
      case 'medium':
      default:
        return 'button'
    }
  }

  // CORREÇÃO DAS CORES - usando as propriedades corretas do tema
  const getVariantStyles = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      ...getSizeStyles(),
      borderRadius: 12,
      opacity: disabled ? 0.6 : 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    }

    const isDisabled = disabled || loading

    switch (variant) {
      case 'contained':
        // CORREÇÃO: Para contained, usamos text.link como background
        return {
          ...baseStyle,
          backgroundColor: isDisabled 
            ? `${theme.text.link}80` // 80 = 50% opacity
            : theme.text.link,
          borderWidth: 0,
          elevation: isDisabled ? 0 : 2,
          shadowColor: theme.text.link,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isDisabled ? 0 : 0.2,
          shadowRadius: 4,
        }
      
      case 'outlined':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: isDisabled 
            ? `${theme.text.link}80` 
            : theme.text.link,
        }
      
      case 'transparent':
        // CORREÇÃO: Para transparent, usamos cor baseada no tema
        const transparentBg = theme.background === '#260635ff' || theme.background === '#1b1b3a'
          ? 'rgba(255, 255, 255, 0.1)'
          : 'rgba(42, 15, 60, 0.1)'
        
        return {
          ...baseStyle,
          backgroundColor: transparentBg,
          borderWidth: 0,
          borderBottomWidth: 2,
          borderBottomColor: isDisabled 
            ? 'transparent' 
            : theme.text.link,
        }
      
      case 'text':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 0,
          height: 'auto',
        }
      
      default:
        return baseStyle
    }
  }

  // CORREÇÃO: Cores do texto baseadas no tema e variante
  const getTextColor = (): string => {
    const isDisabled = disabled || loading
    
    switch (variant) {
      case 'contained':
        // Para botão contained, texto deve contrastar com o background
        // Se o background for claro, texto escuro, e vice-versa
        const isDarkTheme = theme.background === '#260635ff' || theme.background === '#1b1b3a'
        return isDisabled 
          ? isDarkTheme ? '#ffffff80' : '#2a0f3c80'
          : isDarkTheme ? '#ffffff' : '#2a0f3c'
      
      case 'outlined':
      case 'transparent':
      case 'text':
        return isDisabled 
          ? `${theme.text.link}80` 
          : theme.text.link
      
      default:
        return theme.text.primary
    }
  }

  const getIconColor = (): string => {
    return getTextColor()
  }

  const renderIcon = (iconName: string | undefined, position: 'left' | 'right') => {
    if (!iconName) return null

    if (loading && position === 'left') {
      return (
        <ActivityIndicator 
          size="small" 
          color={getIconColor()}
          style={position === 'left' ? styles.leftIcon : styles.rightIcon}
        />
      )
    }

    const iconSize = size === 'small' ? 16 : size === 'large' ? 24 : 20
    
    return (
      <MaterialCommunityIcons
        name={iconName}
        size={iconSize}
        color={getIconColor()}
        style={position === 'left' ? styles.leftIcon : styles.rightIcon}
      />
    )
  }

  const leftIconToRender = loading && !leftIcon ? undefined : leftIcon
  const rightIconToRender = loading ? undefined : rightIcon

  return (
    <View style={[
      styles.container, 
      fullWidth && styles.fullWidth,
      style
    ]}>
      <Pressable
        onPress={onPress}
        disabled={disabled || loading}
        style={({ pressed }) => [
          getVariantStyles(),
          styles.button,
          pressed && !disabled && !loading && styles.pressed,
          variant === 'text' && styles.textButton,
        ]}
        testID={testID}
      >
        {renderIcon(leftIconToRender, 'left')}
        
        <Typography
          variant={typography?.variant || getTextVariant()}
          fontStyle={typography?.fontStyle}
          color={typography?.color || getTextColor()}
          style={[
            styles.title,
            typography?.style,
            (leftIcon || (loading && !leftIcon)) && styles.titleWithLeftIcon,
            rightIcon && styles.titleWithRightIcon,
          ]}
          align="center"
        >
          {loading && !leftIcon ? 'Carregando...' : title}
        </Typography>

        {renderIcon(rightIconToRender, 'right')}
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    minWidth: 120,
  },
  fullWidth: {
    width: '100%',
  },
  button: {
    borderRadius: 12,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  textButton: {
    paddingVertical: 8,
  },
  title: {
    textAlign: 'center',
  },
  titleWithLeftIcon: {
    marginLeft: 4,
  },
  titleWithRightIcon: {
    marginRight: 4,
  },
  leftIcon: {
    marginRight: 4,
  },
  rightIcon: {
    marginLeft: 4,
  },
})