"use client"

import { ClientLayout } from "@/components/client/client-layout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { ShoppingCart, Heart } from "lucide-react"
import { useState, useEffect } from "react"
import axios from "axios"
import { useCart, CartItem } from "@/context/cart-context" // ✅ import useCart

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState("featured")
  const [products, setProducts] = useState<any[]>([])
  const { items, addToCart } = useCart()

  // ✅ Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/product")
        setProducts(res.data)
      } catch (error) {
        console.error("Failed to fetch products:", error)
      }
    }
    fetchProducts()
  }, [])

  // ✅ Categories (you can later fetch dynamically if needed)
  const categories = ["All", "Agricultural Products", "Animal & Dairy Products", "Coir & Fiber Products", ]

  // ✅ Filter logic
  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory)

  // ✅ Sort logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price
    if (sortBy === "price-high") return b.price - a.price
    return 0
  })

  return (
    <ClientLayout>
      <div className="min-h-screen bg-background">
        {/* Page Header */}
        <div className="bg-muted/50 py-8 md:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              All Products
            </h1>
            <p className="text-muted-foreground">
              Explore our complete collection
            </p>
          </div>
        </div>

        {/* Filters and Products */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Filters */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-24 space-y-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-3">
                    Categories
                  </h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          selectedCategory === category
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              </Card>
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredProducts.length} products
                </p>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-input rounded-lg bg-background text-foreground text-sm"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>

              {/* 🟢 Product Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedProducts.map((product) => {
                  const alreadyAdded = items.some(
                    (i: CartItem) =>
                      i.id === product._id || i.id === product.id // ✅ supports both
                  )

                  return (
                    <Link key={product._id || product.id} href={`/products/${product._id || product.id}`}>
                      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
                        {/* Product Image */}
                        <div className="relative h-48 bg-muted overflow-hidden group">
  {/* Product Image */}
  <img
    src={
      product.mainImage?.startsWith("http")
        ? product.mainImage
        : product.mainImage
        ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/${product.mainImage}`
        : "/placeholder.svg"
    }
    alt={product.name}
    className="w-full h-full object-cover group-hover/image:scale-110 transition-transform duration-300"
    onError={(e) => (e.currentTarget.src = "/placeholder.svg")}
  />

  {/* Favorite Button */}
  <button className="absolute top-3 right-3 bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition-colors">
    <Heart className="w-5 h-5 text-destructive" />
  </button>

  {/* ✅ Low Stock Badge */}
  {product.quantity <= 5 && (
    <div className="absolute bottom-2 left-2 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded-md shadow-md">
      Only {product.quantity} {product.quantity === 1 ? "item" : "items"} left
    </div>
  )}
</div>


                        {/* Product Info */}
                        <div className="p-4 space-y-3 flex-1 flex flex-col">
                          <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wide">
                              {product.category || "General"}
                            </p>
                            <h3 className="font-semibold text-foreground line-clamp-2 mt-1">
                              {product.name}
                            </h3>
                          </div>

                          {/* Price and Add Button */}
                          <div className="flex items-center justify-between pt-2 border-t border-border mt-auto">
                            <span className="text-lg font-bold text-foreground">
                              ₹{product.price?.toLocaleString("en-IN")}
                            </span>
                            <Button
                              size="sm"
                              className={`bg-primary hover:bg-primary/90 text-primary-foreground gap-2 ${
                                alreadyAdded ? "opacity-50 cursor-not-allowed" : ""
                              }`}
                              onClick={(e) => {
                                e.preventDefault()
                                if (!alreadyAdded) {
                                  addToCart({
                                    id: product._id,
                                    name: product.name,
                                    price: product.price,
                                    image: product.image,
                                  })
                                }
                              }}
                              disabled={alreadyAdded}
                            >
                              <ShoppingCart className="w-4 h-4" />
                              <span className="hidden sm:inline">
                                {alreadyAdded ? "Added" : "Add"}
                              </span>
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ClientLayout>
  )
}
