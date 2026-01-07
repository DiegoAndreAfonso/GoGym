import React, { createContext, useContext, useCallback } from 'react'
import { ToastType } from '@/components/Toast'
import { useToast } from '@/hooks/useToast'
import { ToastProvider } from '@/providers/ToastProvider'

interface ToastContextData {
  showToast: (config: {
    message: string
    type?: ToastType
    duration?: number
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center'
  }) => void
  toast: (message: string, type?: ToastType) => void
  success: (message: string) => void
  error: (message: string) => void
  info: (message: string) => void
  warning: (message: string) => void
}

const ToastContext = createContext<ToastContextData>({} as ToastContextData)

export const useToastContext = () => useContext(ToastContext)

export const ToastContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const toastHook = useToast()

  const contextValue: ToastContextData = {
    showToast: toastHook.show,
    toast: toastHook.toast,
    success: toastHook.success,
    error: toastHook.error,
    info: toastHook.info,
    warning: toastHook.warning,
  }

  return (
    <ToastContext.Provider value={contextValue}>
      <ToastProvider>{children}</ToastProvider>
    </ToastContext.Provider>
  )
}

