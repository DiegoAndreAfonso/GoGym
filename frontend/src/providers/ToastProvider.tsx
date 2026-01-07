import React from 'react'
import { Toast } from '@/components/Toast'
import { useToast } from '@/hooks/useToast'

interface ToastProviderProps {
  children: React.ReactNode
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const { toastConfig, visible, hideToast } = useToast()

  return (
    <>
      {children}
      {toastConfig && (
        <Toast
          message={toastConfig.message}
          type={toastConfig.type}
          visible={visible}
          duration={toastConfig.duration}
          position={toastConfig.position}
          onHide={hideToast}
        />
      )}
    </>
  )
}