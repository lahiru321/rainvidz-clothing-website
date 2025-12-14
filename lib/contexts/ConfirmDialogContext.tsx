"use client"

import { createContext, useContext, useState, ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'

interface ConfirmDialogContextType {
    confirm: (message: string, onConfirm: () => void) => void
}

const ConfirmDialogContext = createContext<ConfirmDialogContextType | undefined>(undefined)

export function ConfirmDialogProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false)
    const [message, setMessage] = useState('')
    const [onConfirmCallback, setOnConfirmCallback] = useState<(() => void) | null>(null)

    const confirm = (msg: string, callback: () => void) => {
        setMessage(msg)
        setOnConfirmCallback(() => callback)
        setIsOpen(true)
    }

    const handleConfirm = () => {
        if (onConfirmCallback) {
            onConfirmCallback()
        }
        setIsOpen(false)
        setOnConfirmCallback(null)
    }

    const handleCancel = () => {
        setIsOpen(false)
        setOnConfirmCallback(null)
    }

    return (
        <ConfirmDialogContext.Provider value={{ confirm }}>
            {children}

            {/* Confirm Dialog Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={handleCancel}
                    />

                    {/* Dialog */}
                    <div className="relative bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 p-6 animate-scale-in">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                                    <AlertTriangle className="w-6 h-6 text-orange-600" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    Confirm Action
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    {message}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={handleCancel}
                                className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirm}
                                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx global>{`
        @keyframes scale-in {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
        </ConfirmDialogContext.Provider>
    )
}

export function useConfirm() {
    const context = useContext(ConfirmDialogContext)
    if (!context) {
        throw new Error('useConfirm must be used within ConfirmDialogProvider')
    }
    return context
}
