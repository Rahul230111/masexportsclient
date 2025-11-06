"use client"

import { ClientLayout } from "@/components/client/client-layout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { ShoppingCart, Heart, Plus, Minus } from "lucide-react"
import { useState, useEffect } from "react"
import axios from "axios"
import { useCart } from "@/context/cart-context"

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState("featured")
  const [products, setProducts] = useState<any[]>([])
  const [localQuantities, setLocalQuantities] = useState<Record<string, number>>({}) // track only products added via Add

  const { items, addToCart, updateQuantity, removeFromCart } = useCart()

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

  const categories = ["All", "Agricultural Products", "Animal & Dairy Products", "Coir & Fiber Products"]

  const filteredProducts = selectedCategory === "All" ? products : products.filter((p) => p.category === selectedCategory)
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price
    if (sortBy === "price-high") return b.price - a.price
    return 0
  })

  const handleAddClick = (product: any) => {
    const step = product.unitType === "weight" ? 0.25 : 1
    addToCart(
      {
        id: product._id,
        name: product.name,
        price: product.price,
        image: product.mainImage,
        unitType: product.unitType || "unit",
      },
      step
    )
    setLocalQuantities((prev) => ({ ...prev, [product._id]: step })) // now show qty buttons
  }

  const handleIncrement = (product: any) => {
    const step = product.unitType === "weight" ? 0.25 : 1
    setLocalQuantities((prev) => {
      const newQty = (prev[product._id] || step) + step
      updateQuantity(product._id, newQty)
      return { ...prev, [product._id]: newQty }
    })
  }

  const handleDecrement = (product: any) => {
    const step = product.unitType === "weight" ? 0.25 : 1
    setLocalQuantities((prev) => {
      const currentQty = prev[product._id] || step
      const newQty = currentQty - step

      if (newQty <= 0) {
        removeFromCart(product._id)
        const copy = { ...prev }
        delete copy[product._id] // hide quantity buttons
        return copy
      }

      updateQuantity(product._id, newQty)
      return { ...prev, [product._id]: newQty }
    })
  }

  return (
    <ClientLayout>
      <div className="min-h-screen bg-background">
        <div className="bg-muted/50 py-8 md:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">All Products</h1>
            <p className="text-muted-foreground">Explore our complete collection</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Categories */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-24 space-y-6">
                <h3 className="font-semibold text-foreground mb-3">Categories</h3>
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
              </Card>
            </div>

            {/* Products */}
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

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedProducts.map((product) => {
                  const cartItem = items.find((i) => i.id === product._id)
                  const qty = localQuantities[product._id] ?? cartItem?.quantity ?? 0
                  const showQtyControls = qty > 0 && cartItem // only if added to cart

                  return (
                    <Card key={product._id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
                      <Link href={`/products/${product._id}`}>
                        <div className="relative h-48 bg-muted overflow-hidden group">
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
                          <button className="absolute top-3 right-3 bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition-colors">
                            <Heart className="w-5 h-5 text-destructive" />
                          </button>
                        </div>
                      </Link>

                      <div className="p-4 space-y-3 flex-1 flex flex-col">
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wide">
                            {product.category || "General"}
                          </p>
                          <h3 className="font-semibold text-foreground line-clamp-2 mt-1">{product.name}</h3>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-border mt-auto">
                          <span className="text-lg font-bold text-foreground">
                            ₹{product.price?.toLocaleString("en-IN")}
                          </span>

                          {showQtyControls ? (
                            <div className="flex items-center gap-2 border rounded-md overflow-hidden">
                              <Button size="sm" variant="outline" className="px-2" onClick={() => handleDecrement(product)}>
                                <Minus className="w-4 h-4" />
                              </Button>
                              <span className="px-2 text-sm">{product.unitType === "weight" ? qty + " kg" : qty + " nos"}</span>
                              <Button size="sm" variant="outline" className="px-2" onClick={() => handleIncrement(product)}>
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>
                          ) : (
                            <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2" onClick={() => handleAddClick(product)}>
                              <ShoppingCart className="w-4 h-4" />
                              Add
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
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
