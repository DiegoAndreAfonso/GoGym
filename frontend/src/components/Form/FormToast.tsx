import React, { useEffect } from 'react'
import { View, StyleSheet, Animated, TouchableOpacity } from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { Typography } from '@/components/Typography'
import { useTheme } from '@/context/ThemeContext'


export type ToastType = 'success' | 'error' | 'info' | 'warning'

interface FormToastProps {
  message: string
  type?: ToastType
  visible: boolean
  duration?: number
  onHide?: () => void
  position?: 'above-form' | 'below-form' | 'inline'
}

export const FormToast: React.FC<FormToastProps> = ({
  message,
  type = 'info',
  visible,
  duration = 4000,
  onHide,
  position = 'below-form'
}) => {
  const { theme } = useTheme()
  const opacity = new Animated.Value(0)
  const translateY = new Animated.Value(-20)
  const scale = new Animated.Value(0.95)

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return theme.success
      case 'error':
        return theme.error
      case 'warning':
        return theme.warning
      case 'info':
      default:
        return theme.info
    }
  }

  const getBorderColor = () => {
    switch (type) {
      case 'success':
        return `${theme.success}80`
      case 'error':
        return `${theme.error}80`
      case 'warning':
        return `${theme.warning}80`
      case 'info':
      default:
        return `${theme.info}80`
    }
  }

  const getIcon = () => {
    switch (type) {
      case 'success':
        return 'check-circle'
      case 'error':
        return 'close-circle'
      case 'warning':
        return 'alert-circle'
      case 'info':
      default:
        return 'information'
    }
  }

  const getIconColor = () => {
    return theme.onPrimary || '#FFFFFF'
  }

  const getPositionStyles = () => {
    switch (position) {
      case 'above-form':
        return {
          marginTop: 10,
          marginBottom: 20,
        }
      case 'inline':
        return {
          marginVertical: 10,
        }
      case 'below-form':
      default:
        return {
          marginTop: 20,
          marginBottom: 10,
        }
    }
  }

  useEffect(() => {
    if (visible) {
      // Reseta animações
      opacity.setValue(0)
      translateY.setValue(-20)
      scale.setValue(0.95)

      // Animação de entrada
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start()

      // Auto ocultar após a duração
      const timer = setTimeout(() => {
        hideToast()
      }, duration)

      return () => clearTimeout(timer)
    } else {
      hideToast()
    }
  }, [visible, duration])

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -20,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 0.95,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide?.()
    })
  }

  const handleClose = () => {
    hideToast()
  }

  if (!visible) return null

  const positionStyles = getPositionStyles()

  return (
    <Animated.View
      style={[
        styles.container,
        positionStyles,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          opacity,
          transform: [{ translateY }, { scale }],
        },
      ]}
    >
      <View style={styles.content}>
        {/* Ícone */}
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons
            name={getIcon()}
            size={20}
            color={getIconColor()}
          />
        </View>

        {/* Mensagem */}
        <View style={styles.messageContainer}>
          <Typography
            variant="bodySmall"
            style={[styles.message, { color: theme.onPrimary || '#FFFFFF' }]}
            numberOfLines={3}
          >
            {message}
          </Typography>
        </View>

        {/* Botão de fechar */}
        <TouchableOpacity
          style={styles.closeButton}
          onPress={handleClose}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="close"
            size={16}
            color={getIconColor()}
          />
        </TouchableOpacity>
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    zIndex: 9999,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 12,
  },
  messageContainer: {
    flex: 1,
    marginRight: 12,
  },
  message: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  },
  closeButton: {
    padding: 4,
  },
})