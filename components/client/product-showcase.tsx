"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, ShoppingCart, Heart } from "lucide-react"
import Link from "next/link"
import { useCart } from "@/context/cart-context"

const mockProducts = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 24999,
    rating: 4.8,
    reviews: 128,
    image: "/wireless-headphones.png",
    category: "Electronics",
  },
  {
    id: 2,
    name: "Luxury Watch",
    price: 49999,
    rating: 4.9,
    reviews: 89,
    image: "/luxury-watch.jpg",
    category: "Accessories",
  },
  {
    id: 3,
    name: "Designer Sunglasses",
    price: 16999,
    rating: 4.7,
    reviews: 156,
    image: "/designer-sunglasses.png",
    category: "Accessories",
  },
  {
    id: 4,
    name: "Premium Wireless Headphones",
    price: 24999,
    rating: 4.8,
    reviews: 128,
    image: "/wireless-headphones.png",
    category: "Electronics",
  },
  {
    id: 5,
    name: "Luxury Watch",
    price: 49999,
    rating: 4.9,
    reviews: 89,
    image: "/luxury-watch.jpg",
    category: "Accessories",
  },
  {
    id: 6,
    name: "Designer Sunglasses",
    price: 16999,
    rating: 4.7,
    reviews: 156,
    image: "/designer-sunglasses.png",
    category: "Accessories",
  },
]

export function ProductShowcase() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const { addToCart } = useCart()

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  const handleAddToCart = (e: React.MouseEvent, product: (typeof mockProducts)[0]) => {
    e.preventDefault()
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    })
  }

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Featured Products</h2>
            <p className="text-muted-foreground mt-2">Scroll left to right to explore our collection</p>
          </div>
          <Link href="/products">
            <Button variant="outline" className="bg-transparent hidden sm:inline-flex">
              View All
            </Button>
          </Link>
        </div>

        {/* Horizontal Scroll Container */}
        <div className="relative group">
          {/* Scroll Buttons */}
          {canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-primary hover:bg-primary/90 text-primary-foreground p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {canScrollRight && (
            <button
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-primary hover:bg-primary/90 text-primary-foreground p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Products Container */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex gap-6 overflow-x-auto scroll-smooth pb-4 snap-x snap-mandatory"
            style={{ scrollBehavior: "smooth" }}
          >
            {mockProducts.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`}>
                <Card className="flex-shrink-0 w-72 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer snap-start">
                  {/* Product Image */}
                  <div className="relative h-64 bg-muted overflow-hidden group/image">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover/image:scale-110 transition-transform duration-300"
                    />
                    <button className="absolute top-3 right-3 bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition-colors">
                      <Heart className="w-5 h-5 text-destructive" />
                    </button>
                  </div>

                  {/* Product Info */}
                  <div className="p-4 space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">{product.category}</p>
                      <h3 className="font-semibold text-foreground line-clamp-2 mt-1">{product.name}</h3>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-semibold text-foreground">{product.rating}</span>
                        <span className="text-yellow-400">★</span>
                      </div>
                      <span className="text-xs text-muted-foreground">({product.reviews})</span>
                    </div>

                    {/* Price and Button */}
                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <span className="text-lg font-bold text-foreground">
                        ₹{product.price.toLocaleString("en-IN")}
                      </span>
                      <Button
                        size="sm"
                        className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
                        onClick={(e) => handleAddToCart(e, product)}
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span className="hidden sm:inline">Add</span>
                      </Button>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
