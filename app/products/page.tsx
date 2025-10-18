"use client"

import { ClientLayout } from "@/components/client/client-layout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { ShoppingCart, Heart } from "lucide-react"
import { useState } from "react"

// Mock products
const allProducts = [
  {
    id: 1,
    name: "Sambarani Stick",
    price: 99.99,
    rating: 4.8,
    reviews: 128,
    image: "/sambrani.webp",
    category: "Devine",
  },
  {
    id: 2,
    name: "Sambarani Cup",
    price: 99.99,
    rating: 4.9,
    reviews: 89,
    image: "/sambranicup.webp",
    category: "Devine",
  },
  {
    id: 3,
    name: "Powder",
    price: 99.99,
    rating: 4.7,
    reviews: 156,
    image: "/powder.webp",
    category: "Devine",
  },
  {
    id: 4,
    name: "Donkey Dung",
    price: 99.99,
    rating: 4.8,
    reviews: 128,
    image: "/dung.webp",
    category: "Devine",
  },
  {
    id: 5,
    name: "KalMuthra",
    price: 99.99,
    rating: 4.9,
    reviews: 89,
    image: "/kalmuthra.webp",
    category: "Devine",
  },
  {
    id: 6,
    name: "Donkey Hair",
    price: 99.99,
    rating: 4.7,
    reviews: 156,
    image: "/hair.webp",
    category: "Devine",
  },
  {
    id: 7,
    name: "Anklet",
    price: 99.99,
    rating: 4.7,
    reviews: 156,
    image: "/anklet.webp",
    category: "Accessories",
  },
  {
    id: 8,
    name: "ring",
    price: 99.99,
    rating: 4.7,
    reviews: 156,
    image: "/ring.webp",
    category: "Accessories",
  },
  {
    id: 9,
    name: "Keychains",
    price: 99.99,
    rating: 4.7,
    reviews: 156,
    image: "/key.webp",
    category: "Accessories",
  },
  {
    id: 10,
    name: "Doller",
    price: 99.99,
    rating: 4.7,
    reviews: 156,
    image: "/doller.webp",
    category: "Accessories",
  },
  {
    id: 11,
    name: "paper weight",
    price: 99.99,
    rating: 4.7,
    reviews: 156,
    image: "/weight.webp",
    category: "Accessories",
  },
  {
    id: 12,
    name: "Tumbler",
    price: 99.99,
    rating: 4.7,
    reviews: 156,
    image: "/tumbler.webp",
    category: "Accessories",
  },
  {
    id: 13,
    name: "Soap,",
    price: 99.99,
    rating: 4.7,
    reviews: 156,
    image: "/soap.webp",
    category: "Cosmatics",
  },
  {
    id: 14,
    name: "Brightning Scerum",
    price: 99.99,
    rating: 4.7,
    reviews: 156,
    image: "/serum.webp",
    category: "Cosmatics",
  },
  
]

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState("featured")

  const categories = ["All", "Devine", "Accessories","Cosmatics" ]

  const filteredProducts =
    selectedCategory === "All" ? allProducts : allProducts.filter((p) => p.category === selectedCategory)

  return (
    <ClientLayout>
      <div className="min-h-screen bg-background">
        {/* Page Header */}
        <div className="bg-muted/50 py-8 md:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">All Products</h1>
            <p className="text-muted-foreground">Explore our complete collection</p>
          </div>
        </div>

        {/* Filters and Products */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Filters */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-24 space-y-6">
                {/* Category Filter */}
                <div>
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
                </div>

                {/* Price Filter */}
                {/* <div className="border-t border-border pt-6">
                  <h3 className="font-semibold text-foreground mb-3">Price Range</h3>
                  <div className="space-y-2">
                    {["Under $100", "$100 - $300", "$300 - $500", "Over $500"].map((range) => (
                      <label key={range} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 rounded border-border" />
                        <span className="text-sm text-muted-foreground">
                          {range
                            .replace(/\$/g, "₹")
                            .replace(/100/g, "8300")
                            .replace(/300/g, "24900")
                            .replace(/500/g, "41500")}
                        </span>
                      </label>
                    ))}
                  </div>
                </div> */}

                {/* Rating Filter */}
                {/* <div className="border-t border-border pt-6">
                  <h3 className="font-semibold text-foreground mb-3">Rating</h3>
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((stars) => (
                      <label key={stars} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 rounded border-border" />
                        <span className="text-sm text-muted-foreground">
                          {stars} ★ & up ({Math.floor(Math.random() * 50)})
                        </span>
                      </label>
                    ))}
                  </div>
                </div> */}

                {/* Clear Filters */}
                {/* <Button variant="outline" className="w-full bg-transparent">
                  Clear Filters
                </Button> */}
              </Card>
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              {/* Sort Options */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-muted-foreground">Showing {filteredProducts.length} products</p>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-input rounded-lg bg-background text-foreground text-sm"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest</option>
                </select>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <Link key={product.id} href={`/products/${product.id}`}>
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
                      {/* Product Image */}
                      <div className="relative h-48 bg-muted overflow-hidden group">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <button className="absolute top-3 right-3 bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition-colors">
                          <Heart className="w-5 h-5 text-destructive" />
                        </button>
                      </div>

                      {/* Product Info */}
                      <div className="p-4 space-y-3 flex-1 flex flex-col">
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wide">{product.category}</p>
                          <h3 className="font-semibold text-foreground line-clamp-2 mt-1">{product.name}</h3>
                        </div>

                        {/* Rating */}
                        {/* <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <span className="text-sm font-semibold text-foreground">{product.rating}</span>
                            <span className="text-yellow-400">★</span>
                          </div>
                          <span className="text-xs text-muted-foreground">({product.reviews})</span>
                        </div> */}

                        {/* Price and Button */}
                        <div className="flex items-center justify-between pt-2 border-t border-border mt-auto">
                          <span className="text-lg font-bold text-foreground">
                            ₹{(product.price ).toLocaleString("en-IN")}
                          </span>
                          <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
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
        </div>
      </div>
    </ClientLayout>
  )
}
