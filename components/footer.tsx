"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Phone, Mail, Instagram, Facebook, MapPin } from "lucide-react"
import { getCollections, type Collection } from "@/lib/api/collections"
import { getCategories, type Category } from "@/lib/api/categories"

export default function Footer() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [collectionsRes, categoriesRes] = await Promise.all([
        getCollections(),
        getCategories()
      ])
      setCollections(collectionsRes.data || [])
      setCategories(categoriesRes.data || [])
    } catch (error) {
      console.error('Error fetching footer data:', error)
    }
  }

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">

          {/* Brand & Description */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <h3 className="font-serif text-3xl font-bold">Rainvidz</h3>
            </Link>
            <p className="text-primary-foreground/70 text-sm leading-relaxed mb-6">
              Born from a love for the free-spirited and the unconventional. We believe in fashion that flows with you, embracing natural fabrics, earthy tones, and timeless silhouettes.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <a
                href="tel:+94771234567"
                className="flex items-center gap-3 text-sm text-primary-foreground/80 hover:text-accent transition-colors group"
              >
                <Phone className="w-4 h-4 text-accent" />
                <span>+94 77 123 4567</span>
              </a>
              <a
                href="mailto:hello@rainvidz.com"
                className="flex items-center gap-3 text-sm text-primary-foreground/80 hover:text-accent transition-colors group"
              >
                <Mail className="w-4 h-4 text-accent" />
                <span>hello@rainvidz.com</span>
              </a>
              <div className="flex items-center gap-3 text-sm text-primary-foreground/80">
                <MapPin className="w-4 h-4 text-accent" />
                <span>Colombo, Sri Lanka</span>
              </div>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Shop</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li>
                <Link href="/shop" className="hover:text-accent transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/new-arrivals" className="hover:text-accent transition-colors">
                  New Arrivals
                </Link>
              </li>
              {categories.slice(0, 3).map((category) => (
                <li key={category._id}>
                  <Link
                    href={`/shop?category=${category._id}`}
                    className="hover:text-accent transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Collections */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Collections</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              {collections.length > 0 ? (
                collections.slice(0, 5).map((collection) => (
                  <li key={collection._id}>
                    <Link
                      href={`/collections/${collection.slug}`}
                      className="hover:text-accent transition-colors"
                    >
                      {collection.name}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-primary-foreground/50">No collections yet</li>
              )}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Company</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li>
                <Link href="/#about" className="hover:text-accent transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-accent transition-colors">
                  My Account
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-accent transition-colors">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <a href="mailto:hello@rainvidz.com" className="hover:text-accent transition-colors">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media & Bottom Bar */}
        <div className="border-t border-primary-foreground/20 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-primary-foreground/60">Follow Us:</span>
              <div className="flex gap-3">
                <a
                  href="https://instagram.com/rainvidz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center text-white hover:scale-110 transition-transform duration-300"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="https://facebook.com/rainvidz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-[#1877F2] flex items-center justify-center text-white hover:scale-110 transition-transform duration-300"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Copyright */}
            <div className="text-sm text-primary-foreground/60 text-center md:text-right">
              <p>&copy; {new Date().getFullYear()} Rainvidz. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
