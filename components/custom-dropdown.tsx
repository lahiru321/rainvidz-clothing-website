"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown } from "lucide-react"

interface DropdownOption {
    value: string
    label: string
}

interface CustomDropdownProps {
    options: DropdownOption[]
    value: string
    onChange: (value: string) => void
    placeholder?: string
    className?: string
}

export default function CustomDropdown({ options, value, onChange, placeholder = "Select...", className = "" }: CustomDropdownProps) {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    const selectedOption = options.find(opt => opt.value === value)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div ref={dropdownRef} className={`relative ${className}`}>
            {/* Trigger Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-4 py-2.5 bg-white border border-border rounded-lg text-sm font-medium text-left flex items-center justify-between hover:border-sage focus:outline-none focus:ring-2 focus:ring-sage/20 focus:border-sage transition-all"
            >
                <span className={selectedOption ? "text-foreground" : "text-foreground/50"}>
                    {selectedOption?.label || placeholder}
                </span>
                <ChevronDown
                    className={`w-4 h-4 text-foreground/60 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white border border-border rounded-lg shadow-xl overflow-hidden animate-dropdown-open">
                    <div className="max-h-60 overflow-y-auto">
                        {options.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                    onChange(option.value)
                                    setIsOpen(false)
                                }}
                                className={`w-full px-4 py-3 text-sm text-left hover:bg-sage/10 transition-colors ${option.value === value
                                        ? 'bg-sage/5 text-sage font-semibold'
                                        : 'text-foreground'
                                    }`}
                            >
                                {option.label}
                                {option.value === value && (
                                    <span className="ml-2 text-sage">✓</span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <style jsx>{`
        @keyframes dropdown-open {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-dropdown-open {
          animation: dropdown-open 0.2s ease-out;
        }
      `}</style>
        </div>
    )
}
