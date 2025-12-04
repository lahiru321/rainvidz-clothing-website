"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { UserPlus, Mail, Lock, User } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { useAuth } from "@/lib/contexts/AuthContext"

export default function RegisterPage() {
    const router = useRouter()
    const { signUp } = useAuth()

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        setError('')
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        // Validation
        if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
            setError('Please fill in all fields')
            return
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters')
            return
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match')
            return
        }

        setLoading(true)
        try {
            const { error } = await signUp(formData.email, formData.password, formData.fullName)

            if (error) {
                setError(error.message || 'Failed to create account')
                setLoading(false)
                return
            }

            // Success - user is automatically logged in
            router.push('/')
        } catch (err: any) {
            setError(err.message || 'An error occurred')
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-secondary p-8 rounded-lg shadow-lg">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                            <UserPlus className="w-8 h-8 text-primary" />
                        </div>
                        <h1 className="text-3xl font-serif font-bold text-primary mb-2">Create Account</h1>
                        <p className="text-foreground/60">Join us for exclusive benefits</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-red-600 text-sm">{error}</p>
                        </div>
                    )}

                    {/* Register Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Full Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-foreground/40" />
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 pr-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-foreground/40" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 pr-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-foreground/40" />
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 pr-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                            <p className="text-xs text-foreground/60 mt-1">Must be at least 6 characters</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-foreground/40" />
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 pr-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>

                    {/* Login Link */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-foreground/60">
                            Already have an account?{' '}
                            <Link
                                href="/login"
                                className="text-primary hover:text-accent font-medium transition-colors"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>

                    {/* Guest Checkout Notice */}
                    <div className="mt-6 pt-6 border-t border-border">
                        <p className="text-sm text-center text-foreground/60">
                            Or continue as a{' '}
                            <Link href="/" className="text-primary hover:text-accent font-medium">
                                guest
                            </Link>
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
