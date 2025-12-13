"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { LogIn } from "lucide-react"
import { useAuth } from "@/lib/contexts/AuthContext"
import { supabase } from "@/lib/supabase/client"

export default function AdminLoginPage() {
    const router = useRouter()
    const { signIn, signOut } = useAuth()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setLoading(true)

        try {
            // Sign in with Supabase
            const { error: signInError } = await signIn(email, password)

            if (signInError) {
                throw new Error(signInError.message || 'Invalid email or password')
            }

            // Get the session to get the access token
            const { data: { session } } = await supabase.auth.getSession()

            if (!session) {
                throw new Error('No session found')
            }

            // Check if user is admin by trying to access admin endpoint
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/dashboard/stats`, {
                headers: {
                    'Authorization': `Bearer ${session.access_token}`
                }
            })

            if (!response.ok) {
                // Sign out if not admin
                await signOut()
                throw new Error('You do not have admin access')
            }

            // Redirect to admin dashboard
            router.push('/admin')
        } catch (err: any) {
            console.error('Login error:', err)
            setError(err.message || 'Invalid email or password')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo/Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-serif font-bold text-primary mb-2">Admin Login</h1>
                    <p className="text-foreground/60">Sign in to access the admin dashboard</p>
                </div>

                {/* Login Form */}
                <div className="bg-secondary p-8 rounded-lg border border-border">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium mb-2">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent bg-background"
                                placeholder="admin@example.com"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent bg-background"
                                placeholder="••••••••"
                            />
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="p-3 bg-red-100 border border-red-300 text-red-800 rounded-md text-sm">
                                {error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                'Signing in...'
                            ) : (
                                <>
                                    <LogIn className="w-5 h-5" />
                                    Sign In
                                </>
                            )}
                        </button>
                    </form>

                    {/* Back to Home */}
                    <div className="mt-6 text-center">
                        <Link
                            href="/"
                            className="text-sm text-accent hover:underline"
                        >
                            ← Back to Home
                        </Link>
                    </div>
                </div>

                {/* Info */}
                <div className="mt-6 text-center text-sm text-foreground/60">
                    <p>Only authorized administrators can access this area</p>
                </div>
            </div>
        </div>
    )
}
