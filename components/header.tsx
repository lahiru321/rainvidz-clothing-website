"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, ShoppingBag, Search } from "lucide-react"
import { collections } from "@/lib/data"

export default function Header({ cartCount }: { cartCount: number }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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
            <div className="relative group">
              <button className="text-sm font-medium text-foreground hover:text-accent transition-colors duration-300 flex items-center gap-1">
                Collections
              </button>
              <div className="absolute top-full left-0 w-56 bg-background border border-border shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                <div className="py-2">
                  {collections.map((collection) => (
                    <Link
                      key={collection.slug}
                      href={`/collections/${collection.slug}`}
                      className="block px-4 py-3 text-sm text-foreground hover:bg-secondary hover:text-accent transition-colors"
                    >
                      {collection.name}
                    </Link>
                  ))}
                </div>
              </div>
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
            <button className="relative p-2 hover:bg-secondary transition-colors duration-300">
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-accent text-accent-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

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
            <Link
              href="#"
              className="block py-2 text-sm font-medium text-foreground hover:text-accent transition-colors"
            >
              Collections
            </Link>
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
          </nav>
        )}
      </div>
    </header>
  )
}
