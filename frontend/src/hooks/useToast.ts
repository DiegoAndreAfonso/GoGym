import { useState, useCallback } from 'react'
import { ToastType } from '@/components/Toast'

interface ToastConfig {
  message: string
  type?: ToastType
  duration?: number
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center'
}

export const useToast = () => {
  const [toastConfig, setToastConfig] = useState<ToastConfig | null>(null)
  const [visible, setVisible] = useState(false)

  const showToast = useCallback((config: ToastConfig) => {
    setToastConfig(config)
    setVisible(true)
  }, [])

  const hideToast = useCallback(() => {
    setVisible(false)
    // Limpa o config após a animação
    setTimeout(() => {
      setToastConfig(null)
    }, 300)
  }, [])

  const toast = useCallback((message: string, type?: ToastType) => {
    showToast({ 
      message, 
      type, 
      duration: 4000,
      position: 'top-right'
    })
  }, [showToast])

  const success = useCallback((message: string) => {
    showToast({ 
      message, 
      type: 'success', 
      duration: 3000,
      position: 'top-right'
    })
  }, [showToast])

  const error = useCallback((message: string) => {
    showToast({ 
      message, 
      type: 'error', 
      duration: 5000,
      position: 'top-right'
    })
  }, [showToast])

  const info = useCallback((message: string) => {
    showToast({ 
      message, 
      type: 'info', 
      duration: 4000,
      position: 'top-right'
    })
  }, [showToast])

  const warning = useCallback((message: string) => {
    showToast({ 
      message, 
      type: 'warning', 
      duration: 4500,
      position: 'top-right'
    })
  }, [showToast])

  return {
    toastConfig,
    visible,
    hideToast,
    show: showToast,
    toast,
    success,
    error,
    info,
    warning,
  }
}