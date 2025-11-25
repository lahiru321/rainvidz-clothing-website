"use client"

import type React from "react"

import { useState } from "react"
import { Mail, Check } from "lucide-react"

export default function NewsletterSection() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)
    setEmail("")
    setTimeout(() => setIsSubmitted(false), 3000)
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-secondary">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-4">Stay Updated</h2>
        <p className="text-foreground/70 mb-8 text-lg">
          Subscribe to our newsletter for exclusive offers and new collection announcements.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-foreground/40" />
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-12 pr-4 py-3 bg-background text-foreground placeholder-foreground/40 border border-border focus:outline-none focus:border-accent transition-colors duration-300"
            />
          </div>
          <button
            type="submit"
            className="px-8 py-3 bg-primary text-primary-foreground font-semibold hover:bg-foreground transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap"
          >
            {isSubmitted ? (
              <>
                <Check className="w-5 h-5" />
                Subscribed!
              </>
            ) : (
              "Subscribe"
            )}
          </button>
        </form>

        <p className="text-xs text-foreground/50 mt-4">We respect your privacy. Unsubscribe at any time.</p>
      </div>
    </section>
  )
}
