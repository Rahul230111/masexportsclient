// app/products/page.tsx
"use client";

import { Suspense } from "react";
import { ClientLayout } from "@/components/client/client-layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import {
  ShoppingCart,
  Heart,
  Plus,
  Minus,
  Building,
  Filter,
} from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useCart } from "@/context/cart-context";
import { useSearchParams } from "next/navigation";

function ProductsContent() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [products, setProducts] = useState<any[]>([]);
  const [localQuantities, setLocalQuantities] = useState<
    Record<string, number>
  >({});
  const [industryFilter, setIndustryFilter] = useState<string>("all");

  const { items, addToCart, updateQuantity, removeFromCart } = useCart();
  const searchParams = useSearchParams();
  const urlIndustry = searchParams.get("industry");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/product`
        );
        setProducts(res.data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Set industry filter from URL parameter
  useEffect(() => {
    if (urlIndustry) {
      setIndustryFilter(urlIndustry);
    }
  }, [urlIndustry]);

  const categories = [
    "All",
    "Agricultural Products",
    "Animal & Dairy Products",
    "Coir & Fiber Products",
  ];
  const industries = [
    { value: "all", label: "All Industries" },
    { value: "massexports", label: "Mass Exports" },
    { value: "dhanalakshmi", label: "Dhanalakshmi" },
  ];

  // Filter products based on category and industry
  const filteredProducts = products.filter((product) => {
    const categoryMatch =
      selectedCategory === "All" || product.category === selectedCategory;
    const industryMatch =
      industryFilter === "all" || product.industry === industryFilter;
    return categoryMatch && industryMatch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    return 0;
  });

  // Industry Badge Component
  const IndustryBadge = ({ industry }: { industry: string }) => {
    const getIndustryStyles = () => {
      switch (industry) {
        case "massexports":
          return "bg-blue-100 text-blue-800 border-blue-200";
        case "dhanalakshmi":
          return "bg-green-100 text-green-800 border-green-200";
        default:
          return "bg-gray-100 text-gray-800 border-gray-200";
      }
    };

    const getIndustryLabel = () => {
      switch (industry) {
        case "massexports":
          return "Mass Exports";
        case "dhanalakshmi":
          return "Dhanalakshmi";
        default:
          return industry;
      }
    };

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getIndustryStyles()}`}
      >
        <Building className="w-3 h-3" />
        {getIndustryLabel()}
      </span>
    );
  };

  const handleAddClick = (product: any) => {
    const step = product.unitType === "weight" ? 0.25 : 1;
    addToCart(
      {
        id: product._id,
        name: product.name,
        price: product.price,
        image: product.mainImage,
        unitType: product.unitType || "unit",
      },
      step
    );
    setLocalQuantities((prev) => ({ ...prev, [product._id]: step }));
  };

  const handleIncrement = (product: any) => {
    const step = product.unitType === "weight" ? 0.25 : 1;
    setLocalQuantities((prev) => {
      const newQty = (prev[product._id] || step) + step;
      updateQuantity(product._id, newQty);
      return { ...prev, [product._id]: newQty };
    });
  };

  const handleDecrement = (product: any) => {
    const step = product.unitType === "weight" ? 0.25 : 1;
    setLocalQuantities((prev) => {
      const currentQty = prev[product._id] || step;
      const newQty = currentQty - step;

      if (newQty <= 0) {
        removeFromCart(product._id);
        const copy = { ...prev };
        delete copy[product._id];
        return copy;
      }

      updateQuantity(product._id, newQty);
      return { ...prev, [product._id]: newQty };
    });
  };

  // Get page title based on filters
  const getPageTitle = () => {
    if (industryFilter !== "all") {
      const industryName =
        industryFilter === "massexports" ? "Mass Exports" : "Dhanalakshmi";
      return `${industryName} Products`;
    }
    return "All Products";
  };

  const getPageDescription = () => {
    if (industryFilter !== "all") {
      const industryName =
        industryFilter === "massexports" ? "Mass Exports" : "Dhanalakshmi";
      return `Explore ${industryName}'s complete collection`;
    }
    return "Explore our complete collection from all industries";
  };

  const MiniCarousel = ({ media }: { media: any[] }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!media || media.length === 0) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % media.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [media]);

  if (!media || media.length === 0) {
    return (
      <img
        src="/placeholder.svg"
        className="w-full h-full object-cover"
        alt="placeholder"
      />
    );
  }

  const item = media[index];
  const url = (item?.url || "").startsWith("http")
    ? item.url
    : `${process.env.NEXT_PUBLIC_API_URL}/uploads/${item?.url || ""}`;

  return (
    <div className="relative h-full w-full flex items-center justify-center bg-black/5 overflow-hidden">
      {item.type === "image" && (
        <img
          src={url}
          alt="media"
          className="w-full h-full object-cover transition-all duration-500"
          onError={(e) => (e.currentTarget.src = "/placeholder.svg")}
        />
      )}

      {item.type === "video" && (
        <video
          src={url}
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        />
      )}
    </div>
  );
};

  return (
    <ClientLayout>
      <div className="min-h-screen bg-background">
        <div className="bg-muted/50 py-8 md:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              {getPageTitle()}
            </h1>
            <p className="text-muted-foreground">{getPageDescription()}</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Filters */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-24 space-y-6">
                {/* Industry Filter */}
                <div>
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Industry
                  </h3>
                  <div className="space-y-2">
                    {industries.map((industry) => (
                      <button
                        key={industry.value}
                        onClick={() => setIndustryFilter(industry.value)}
                        className={`flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg transition-all duration-200 ${
                          industryFilter === industry.value
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-muted hover:scale-105"
                        }`}
                      >
                        <Building className="w-4 h-4" />
                        {industry.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Categories Filter */}
                <div>
                  <h3 className="font-semibold text-foreground mb-3">
                    Categories
                  </h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`block w-full text-left px-3 py-2 rounded-lg transition-all duration-200 ${
                          selectedCategory === category
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-muted hover:scale-105"
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              </Card>
            </div>

            {/* Products */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredProducts.length} products
                  {industryFilter !== "all" && (
                    <span className="ml-2">
                      from <IndustryBadge industry={industryFilter} />
                    </span>
                  )}
                </p>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-input rounded-lg bg-background text-foreground text-sm transition-all duration-200 hover:scale-105"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedProducts.map((product) => {
                  const cartItem = items.find((i) => i.id === product._id);
                  const qty =
                    localQuantities[product._id] ?? cartItem?.quantity ?? 0;
                  const showQtyControls = qty > 0 && cartItem;

                  return (
                    <Card
                      key={product._id}
                      className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col border-0 shadow-lg hover:scale-105"
                    >
                      <Link href={`/products/${product._id}`}>
                      <div className="relative h-48 bg-muted overflow-hidden group">
  <MiniCarousel media={product.media || []} />

  <button className="absolute top-3 right-3 bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition-all duration-200 hover:scale-110">
    <Heart className="w-5 h-5 text-destructive" />
  </button>

  <div className="absolute top-3 left-3">
    <IndustryBadge industry={product.industry} />
  </div>
</div>



                      </Link>

                      <div className="p-4 space-y-3 flex-1 flex flex-col">
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                            {product.category || "General"}
                          </p>
                          <h3 className="font-semibold text-foreground line-clamp-2 mt-1 text-lg">
                            {product.name}
                          </h3>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-border mt-auto">
                          <span className="text-xl font-bold text-foreground">
                            ₹{product.price?.toLocaleString("en-IN")}
                          </span>

                          {showQtyControls ? (
                            <div className="flex items-center gap-2 border-2 rounded-xl px-3 py-2 bg-muted/50">
                              <Button
                                size="sm"
                                variant="outline"
                                className="px-2 hover:bg-background transition-all duration-200 hover:scale-110"
                                onClick={() => handleDecrement(product)}
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                              <span className="px-2 text-sm font-medium min-w-12 text-center">
                                {qty}{" "}
                                {product.unitType === "weight" ? "kg" : "nos"}
                              </span>
                              <Button
                                size="sm"
                                variant="outline"
                                className="px-2 hover:bg-background transition-all duration-200 hover:scale-110"
                                onClick={() => handleIncrement(product)}
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 transition-all duration-200 hover:scale-105"
                              onClick={() => handleAddClick(product)}
                            >
                              <ShoppingCart className="w-4 h-4" />
                              Add
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>

              {/* Empty State */}
              {sortedProducts.length === 0 && (
                <div className="text-center py-16">
                  <Building className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-2xl font-semibold text-foreground mb-2">
                    No Products Found
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {industryFilter !== "all"
                      ? `No products found for ${
                          industryFilter === "massexports"
                            ? "Mass Exports"
                            : "Dhanalakshmi"
                        } in the selected category.`
                      : "No products found in the selected category."}
                  </p>
                  <Button
                    onClick={() => {
                      setSelectedCategory("All");
                      setIndustryFilter("all");
                    }}
                    className="transition-all duration-200 hover:scale-105"
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <ClientLayout>
          <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading products...</p>
            </div>
          </div>
        </ClientLayout>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
