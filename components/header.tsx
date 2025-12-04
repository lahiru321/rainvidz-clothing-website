"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, ShoppingBag, Search, User, LogOut, Package, ChevronDown } from "lucide-react"
import { useCartStore } from "@/lib/store/cartStore"
import { useAuth } from "@/lib/contexts/AuthContext"
import { getCollections, type Collection } from "@/lib/api/collections"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isCollectionsOpen, setIsCollectionsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [collections, setCollections] = useState<Collection[]>([])
  const cartItemCount = useCartStore((state) => state.getItemCount())
  const { user, signOut } = useAuth()

  useEffect(() => {
    setIsMounted(true)
    fetchCollections()
  }, [])

  const fetchCollections = async () => {
    try {
      const response = await getCollections()
      setCollections(response.data)
    } catch (error) {
      console.error('Error fetching collections:', error)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    setIsUserMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <div className="text-2xl md:text-3xl font-serif font-bold text-primary tracking-widest">Rainvidz</div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/new-arrivals"
              className="text-sm font-medium text-foreground hover:text-accent transition-colors duration-300"
            >
              New Arrivals
            </Link>

            {/* Collections Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsCollectionsOpen(!isCollectionsOpen)}
                onMouseEnter={() => setIsCollectionsOpen(true)}
                className="flex items-center gap-1 text-sm font-medium text-foreground hover:text-accent transition-colors duration-300"
              >
                Collections
                <ChevronDown className="w-4 h-4" />
              </button>

              {/* Dropdown Menu */}
              {isCollectionsOpen && (
                <div
                  onMouseLeave={() => setIsCollectionsOpen(false)}
                  className="absolute left-0 mt-2 w-56 bg-background border border-border rounded-md shadow-lg py-2"
                >
                  {collections.map((collection) => (
                    <Link
                      key={collection._id}
                      href={`/collections/${collection.slug}`}
                      onClick={() => setIsCollectionsOpen(false)}
                      className="block px-4 py-2 text-sm hover:bg-secondary transition-colors"
                    >
                      {collection.name}
                    </Link>
                  ))}
                  {collections.length === 0 && (
                    <div className="px-4 py-2 text-sm text-foreground/60">
                      No collections available
                    </div>
                  )}
                </div>
              )}
            </div>

            <Link
              href="/shop"
              className="text-sm font-medium text-foreground hover:text-accent transition-colors duration-300"
            >
              Shop
            </Link>
            <Link
              href="#about"
              className="text-sm font-medium text-foreground hover:text-accent transition-colors duration-300"
            >
              About
            </Link>
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-secondary transition-colors duration-300">
              <Search className="w-5 h-5" />
            </button>

            <Link href="/cart" className="relative p-2 hover:bg-secondary transition-colors duration-300">
              <ShoppingBag className="w-5 h-5" />
              {isMounted && cartItemCount > 0 && (
                <span className="absolute top-1 right-1 bg-accent text-accent-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-2 hover:bg-secondary transition-colors duration-300 rounded-md"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden md:block text-sm font-medium">
                    {user.user_metadata?.full_name || 'Account'}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-background border border-border rounded-md shadow-lg py-2">
                    <Link
                      href="/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-secondary transition-colors"
                    >
                      <Package className="w-4 h-4" />
                      My Orders
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-secondary transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground hover:text-accent transition-colors"
              >
                <User className="w-5 h-5" />
                Login
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden pb-4 animate-fade-in-up">
            <Link
              href="/new-arrivals"
              className="block py-2 text-sm font-medium text-foreground hover:text-accent transition-colors"
            >
              New Arrivals
            </Link>

            {/* Collections in Mobile */}
            <div className="py-2">
              <div className="text-sm font-medium text-foreground mb-2">Collections</div>
              <div className="pl-4 space-y-2">
                {collections.map((collection) => (
                  <Link
                    key={collection._id}
                    href={`/collections/${collection.slug}`}
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-1 text-sm text-foreground/80 hover:text-accent transition-colors"
                  >
                    {collection.name}
                  </Link>
                ))}
              </div>
            </div>

            <Link
              href="/shop"
              className="block py-2 text-sm font-medium text-foreground hover:text-accent transition-colors"
            >
              Shop
            </Link>
            <Link
              href="#about"
              className="block py-2 text-sm font-medium text-foreground hover:text-accent transition-colors"
            >
              About
            </Link>

            {/* Mobile User Links */}
            {user ? (
              <>
                <Link
                  href="/profile"
                  className="block py-2 text-sm font-medium text-foreground hover:text-accent transition-colors"
                >
                  My Orders
                </Link>
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left py-2 text-sm font-medium text-foreground hover:text-accent transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="block py-2 text-sm font-medium text-foreground hover:text-accent transition-colors"
              >
                Login
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  )
}
