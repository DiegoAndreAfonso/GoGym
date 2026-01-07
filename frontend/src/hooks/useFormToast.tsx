import { useState, useCallback } from 'react'
import { ToastType } from '@/components/Form/FormToast'

interface FormToastConfig {
  message: string
  type?: ToastType
  duration?: number
  position?: 'above-form' | 'below-form' | 'inline'
}

export const useFormToast = () => {
  const [toastConfig, setToastConfig] = useState<FormToastConfig | null>(null)
  const [visible, setVisible] = useState(false)

  const showFormToast = useCallback((config: FormToastConfig) => {
    setToastConfig(config)
    setVisible(true)
  }, [])

  const hideFormToast = useCallback(() => {
    setVisible(false)
    setTimeout(() => {
      setToastConfig(null)
    }, 300)
  }, [])

  const formToast = useCallback((message: string, type?: ToastType) => {
    showFormToast({ 
      message, 
      type, 
      duration: 3000,
      position: 'below-form'
    })
  }, [showFormToast])

  const success = useCallback((message: string) => {
    showFormToast({ 
      message, 
      type: 'success', 
      duration: 3000,
      position: 'below-form'
    })
  }, [showFormToast])

  const error = useCallback((message: string) => {
    showFormToast({ 
      message, 
      type: 'error', 
      duration: 4000,
      position: 'below-form'
    })
  }, [showFormToast])

  const info = useCallback((message: string) => {
    showFormToast({ 
      message, 
      type: 'info', 
      duration: 3000,
      position: 'below-form'
    })
  }, [showFormToast])

  const warning = useCallback((message: string) => {
    showFormToast({ 
      message, 
      type: 'warning', 
      duration: 3500,
      position: 'below-form'
    })
  }, [showFormToast])

  return {
    toastConfig,
    visible,
    hideFormToast,
    show: showFormToast,
    toast: formToast,
    success,
    error,
    info,
    warning,
  }
}