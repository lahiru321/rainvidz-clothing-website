"use client"

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'

type ToastType = 'success' | 'error' | 'info' | 'warning'

interface Toast {
    id: string
    message: string
    type: ToastType
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void
    success: (message: string) => void
    error: (message: string) => void
    info: (message: string) => void
    warning: (message: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([])

    const showToast = useCallback((message: string, type: ToastType = 'info') => {
        const id = Math.random().toString(36).substr(2, 9)
        setToasts((prev) => [...prev, { id, message, type }])

        // Auto remove after 5 seconds
        setTimeout(() => {
            setToasts((prev) => prev.filter((toast) => toast.id !== id))
        }, 5000)
    }, [])

    const success = useCallback((message: string) => showToast(message, 'success'), [showToast])
    const error = useCallback((message: string) => showToast(message, 'error'), [showToast])
    const info = useCallback((message: string) => showToast(message, 'info'), [showToast])
    const warning = useCallback((message: string) => showToast(message, 'warning'), [showToast])

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }

    const getToastStyles = (type: ToastType) => {
        switch (type) {
            case 'success':
                return {
                    bg: 'bg-green-50 border-green-200',
                    text: 'text-green-800',
                    icon: <CheckCircle className="w-5 h-5 text-green-600" />
                }
            case 'error':
                return {
                    bg: 'bg-red-50 border-red-200',
                    text: 'text-red-800',
                    icon: <AlertCircle className="w-5 h-5 text-red-600" />
                }
            case 'warning':
                return {
                    bg: 'bg-orange-50 border-orange-200',
                    text: 'text-orange-800',
                    icon: <AlertTriangle className="w-5 h-5 text-orange-600" />
                }
            case 'info':
            default:
                return {
                    bg: 'bg-blue-50 border-blue-200',
                    text: 'text-blue-800',
                    icon: <Info className="w-5 h-5 text-blue-600" />
                }
        }
    }

    return (
        <ToastContext.Provider value={{ showToast, success, error, info, warning }}>
            {children}

            {/* Toast Container */}
            <div className="fixed top-4 right-4 z-[9999] space-y-3 max-w-md">
                {toasts.map((toast) => {
                    const styles = getToastStyles(toast.type)
                    return (
                        <div
                            key={toast.id}
                            className={`${styles.bg} border ${styles.text} rounded-lg shadow-lg p-4 flex items-start gap-3 animate-slide-in-right`}
                        >
                            {styles.icon}
                            <p className="flex-1 text-sm font-medium">{toast.message}</p>
                            <button
                                onClick={() => removeToast(toast.id)}
                                className="text-current opacity-60 hover:opacity-100 transition-opacity"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )
                })}
            </div>

            <style jsx global>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
        </ToastContext.Provider>
    )
}

export function useToast() {
    const context = useContext(ToastContext)
    if (!context) {
        throw new Error('useToast must be used within ToastProvider')
    }
    return context
}
