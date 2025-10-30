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
  

  const toggleMenu = () => setMobileMenuOpen((prev) => !prev)

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* 🔹 Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">E</span>
            </div>
            <span className="font-bold text-lg text-foreground hidden sm:inline">E-com</span>
          </Link>

          {/* 🔹 Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {["Home", "Products", "About", "Contact"].map((item) => (
              <Link
                key={item}
                href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                className="text-foreground hover:text-primary transition-colors"
              >
                {item}
              </Link>
            ))}
          </nav>

          {/* 🔹 Right Section */}
          <div className="flex items-center gap-3">
            {/* Cart Button */}
            <Link href="/cart" className="relative">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-semibold">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>

            {/* 🔹 Admin or User Button */}
            {user ? (
              user.role === "admin" ? (
                <Link href="/admin/dashboard">
                  <Button variant="outline" size="sm" className="hidden sm:inline-flex">
                    Admin Dashboard
                  </Button>
                </Link>
              ) : (
                  <Link href="/profile">
                    <Button variant="outline" size="sm" className="hidden sm:inline-flex">
                      {user.name}
                    </Button>
                  </Link>
              )
            ) : null}

            {/* 🔹 Auth Buttons */}
            {user ? (
              <Button
                onClick={logout}
                variant="outline"
                size="sm"
                className="hidden sm:inline-flex"
              >
                Logout
              </Button>
            ) : (
              <Link href="/account/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden sm:inline-flex"
                >
                  <User className="w-4 h-4 mr-2" />
                  Login
                </Button>
              </Link>
            )}

            {/* 🔹 Mobile Menu Toggle */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* 🔹 Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden pb-4 space-y-2 animate-in fade-in slide-in-from-top-2">
            {["Home", "Products", "About", "Contact"].map((item) => (
              <Link
                key={item}
                href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                className="block px-4 py-2 text-foreground hover:bg-muted rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item}
              </Link>
            ))}

            {/* 🔹 Mobile user/admin button */}
            {user ? (
              user.role === "admin" ? (
                <Link href="/admin/dashboard" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Admin Dashboard
                  </Button>
                </Link>
              ) : (
                <Link href="/profile" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full">
                      {user.name}
                    </Button>
                  </Link>
              )
            ) : null}

            {user ? (
              <Button
                onClick={() => {
                  logout()
                  setMobileMenuOpen(false)
                }}
                variant="outline"
                className="w-full"
              >
                Logout
              </Button>
            ) : (
              <Link href="/account/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full">
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
