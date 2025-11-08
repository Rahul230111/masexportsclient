"use client";

import Link from "next/link";
import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Menu, X, Building } from "lucide-react";
import { useState } from "react";

export function ClientHeader() {
  const { totalItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMenu = () => setMobileMenuOpen((prev) => !prev);

  const navigationItems = [
    { name: "Home", href: "/" },
    { name: "Mass Exports Products", href: "/products?industry=massexports" },
    { name: "Dhanalakshmi Products", href: "/products?industry=dhanalakshmi" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border shadow-sm backdrop-blur-sm bg-background/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* 🔹 Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
              <Building className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg text-foreground hidden sm:inline bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              MasExports
            </span>
          </Link>

          {/* 🔹 Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-foreground hover:text-primary transition-all duration-200 hover:scale-105 font-medium"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* 🔹 Right Section */}
          <div className="flex items-center gap-3">
            {/* Cart Button */}
            <Link href="/cart" className="relative group">
              <Button
                variant="ghost"
                size="icon"
                className="transition-all duration-200 hover:scale-110"
              >
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-semibold animate-pulse">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>

            {/* 🔹 Mobile Menu Toggle */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 hover:bg-muted rounded-lg transition-all duration-200 hover:scale-110"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* 🔹 Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <nav className="space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 text-foreground hover:bg-muted rounded-lg transition-all duration-200 hover:translate-x-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name.includes("Products") && (
                    <Building className="w-4 h-4 text-muted-foreground" />
                  )}
                  <span className="font-medium">{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
