"use client"

import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { useCart } from "@/context/cart-context"
import { Button } from "@/components/ui/button"
import { ShoppingCart, User, Menu, X } from "lucide-react"
import { useState } from "react"

export function ClientHeader() {
  const { user, logout } = useAuth()
  const { totalItems } = useCart()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">P</span>
            </div>
            <span className="font-bold text-lg text-foreground hidden sm:inline">PimPom Store</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/products" className="text-foreground hover:text-primary transition-colors">
              Products
            </Link>
            <Link href="/about" className="text-foreground hover:text-primary transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-foreground hover:text-primary transition-colors">
              Contact
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-semibold">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>

            {user && user.role === "admin" ? (
              <Link href="/admin/dashboard">
                <Button variant="outline" size="sm" className="bg-transparent">
                  Admin
                </Button>
              </Link>
            ) : null}

            {user ? (
              <Button onClick={logout} variant="outline" size="sm" className="bg-transparent hidden sm:inline-flex">
                Logout
              </Button>
            ) : (
              <Link href="/account/login">
                <Button variant="outline" size="sm" className="bg-transparent hidden sm:inline-flex">
                  <User className="w-4 h-4 mr-2" />
                  Login
                </Button>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden pb-4 space-y-2">
            <Link href="/" className="block px-4 py-2 text-foreground hover:bg-muted rounded-lg">
              Home
            </Link>
            <Link href="/products" className="block px-4 py-2 text-foreground hover:bg-muted rounded-lg">
              Products
            </Link>
            <Link href="/about" className="block px-4 py-2 text-foreground hover:bg-muted rounded-lg">
              About
            </Link>
            <Link href="/contact" className="block px-4 py-2 text-foreground hover:bg-muted rounded-lg">
              Contact
            </Link>
            {user ? (
              <Button onClick={logout} variant="outline" className="w-full bg-transparent">
                Logout
              </Button>
            ) : (
              <Link href="/account/login" className="block">
                <Button variant="outline" className="w-full bg-transparent">
                  Login
                </Button>
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  )
}
