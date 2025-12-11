"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    FolderOpen,
    Grid,
    LogOut,
    Menu,
    X
} from "lucide-react"
import { useAuth } from "@/lib/contexts/AuthContext"
import { supabase } from "@/lib/supabase/client"

interface AdminLayoutProps {
    children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const router = useRouter()
    const { user, signOut, loading } = useAuth()
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)
    const [checkingAdmin, setCheckingAdmin] = useState(true)

    useEffect(() => {
        checkAdminStatus()
    }, [user, loading])

    const checkAdminStatus = async () => {
        if (loading) return

        if (!user) {
            router.push('/admin/login')
            return
        }

        try {
            // Get session to get access token
            const { data: { session } } = await supabase.auth.getSession()

            if (!session) {
                router.push('/admin/login')
                return
            }

            // Try to access admin endpoint to verify admin status
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/dashboard/stats`, {
                headers: {
                    'Authorization': `Bearer ${session.access_token}`
                }
            })

            if (response.ok) {
                setIsAdmin(true)
            } else {
                // Not an admin, redirect to home
                console.log('Not an admin, redirecting to home')
                router.push('/')
            }
        } catch (error) {
            console.error('Admin check error:', error)
            router.push('/')
        } finally {
            setCheckingAdmin(false)
        }
    }

    const handleSignOut = async () => {
        await signOut()
        router.push('/admin/login')
    }

    if (loading || checkingAdmin) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <p className="text-foreground/60">Loading...</p>
            </div>
        )
    }

    if (!isAdmin) {
        return null // Will redirect
    }

    const navigation = [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { name: 'Products', href: '/admin/products', icon: Package },
        { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
        { name: 'Categories', href: '/admin/categories', icon: FolderOpen },
        { name: 'Collections', href: '/admin/collections', icon: Grid },
    ]

    return (
        <div className="min-h-screen bg-background">
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
                <div className="flex items-center justify-between p-4">
                    <h1 className="text-xl font-serif font-bold text-primary">Admin Panel</h1>
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-2 hover:bg-secondary rounded-md"
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Sidebar */}
            <aside className={`
                fixed top-0 left-0 z-40 h-screen transition-transform
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0
                ${isSidebarOpen ? 'w-64' : 'w-20'}
                bg-black border-r border-gray-800
            `}>
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="p-6 border-b border-gray-800">
                        <h1 className={`font-serif font-bold text-white ${isSidebarOpen ? 'text-2xl' : 'text-xl text-center'}`}>
                            {isSidebarOpen ? 'Admin Panel' : 'AP'}
                        </h1>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-2">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="flex items-center gap-3 px-4 py-3 rounded-md text-gray-200 hover:bg-gray-900 hover:text-white transition-colors"
                            >
                                <item.icon className="w-5 h-5" />
                                {isSidebarOpen && <span className="font-medium">{item.name}</span>}
                            </Link>
                        ))}
                    </nav>

                    {/* User Info & Logout */}
                    <div className="p-4 border-t border-gray-800">
                        <div className="flex items-center gap-3 px-4 py-3 mb-2">
                            {isSidebarOpen && (
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate text-white">
                                        {user?.user_metadata?.full_name || 'Admin'}
                                    </p>
                                    <p className="text-xs text-gray-400 truncate">
                                        {user?.email}
                                    </p>
                                </div>
                            )}
                        </div>
                        <button
                            onClick={handleSignOut}
                            className="flex items-center gap-3 w-full px-4 py-3 rounded-md text-red-400 hover:bg-gray-900 hover:text-red-300 transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            {isSidebarOpen && <span className="font-medium">Logout</span>}
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className={`
                transition-all duration-300
                ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}
                pt-16 lg:pt-0
            `}>
                <div className="p-6 lg:p-8">
                    {children}
                </div>
            </main>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}
        </div>
    )
}
