import React, { useEffect } from 'react'
import { View, StyleSheet, Animated, Dimensions, TouchableOpacity } from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { Typography } from '@/components/Typography'
import { useTheme } from '@/context/ThemeContext'

const { width } = Dimensions.get('window')

export type ToastType = 'success' | 'error' | 'info' | 'warning'

interface ToastProps {
  message: string
  type?: ToastType
  visible: boolean
  duration?: number
  onHide?: () => void
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center'
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  visible,
  duration = 4000,
  onHide,
  position = 'top-right'
}) => {
  const { theme } = useTheme()
  const opacity = new Animated.Value(0)
  const translateX = new Animated.Value(100)
  const progress = new Animated.Value(0)

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

  // Função para obter estilos de posição
  const getPositionStyles = (): any => {
    switch (position) {
      case 'top-left':
        return {
          top: 50,
          left: 20,
          right: undefined,
        }
      case 'bottom-right':
        return {
          bottom: 50,
          right: 20,
          left: undefined,
        }
      case 'bottom-left':
        return {
          bottom: 50,
          left: 20,
          right: undefined,
        }
      case 'center':
        return {
          top: '50%',
          left: 20,
          right: 20,
          transform: [{ translateY: -50 }] as const,
        }
      case 'top-right':
      default:
        return {
          top: 50,
          right: 20,
          left: undefined,
        }
    }
  }

  useEffect(() => {
    if (visible) {
      // Reseta animações
      opacity.setValue(0)
      translateX.setValue(position.includes('right') ? 100 : -100)
      progress.setValue(0)

      // Animação de entrada
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(progress, {
          toValue: 100,
          duration: duration,
          useNativeDriver: false,
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
  }, [visible, duration, position])

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: position.includes('right') ? 100 : -100,
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
  const isCenter = position === 'center'

  return (
    <Animated.View
      style={[
        styles.container,
        positionStyles,
        {
          backgroundColor: getBackgroundColor(),
          opacity,
          transform: isCenter 
            ? [...(positionStyles.transform || []), { translateX }]
            : [{ translateX }],
        },
      ]}
    >
      <Animated.View 
        style={[
          styles.progressBar,
          { 
            backgroundColor: theme.onPrimary || '#FFFFFF',
            width: progress.interpolate({
              inputRange: [0, 100],
              outputRange: ['0%', '100%']
            })
          }
        ]}
      />

      <View style={styles.content}>
        {/* Ícone */}
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons
            name={getIcon()}
            size={22}
            color={getIconColor()}
          />
        </View>

        {/* Mensagem */}
        <View style={styles.messageContainer}>
          <Typography
            variant="bodyMedium"
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
            size={18}
            color={getIconColor()}
          />
        </TouchableOpacity>
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: width - 40,
    maxWidth: 400,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 14,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    zIndex: 9999,
  },
  progressBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: 3,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    opacity: 0.3,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  messageContainer: {
    flex: 1,
    marginRight: 12,
  },
  message: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  closeButton: {
    padding: 4,
    marginTop: -2,
  },
})