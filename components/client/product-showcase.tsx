"use client";

import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Heart,
  Plus,
  Minus,
  Building,
} from "lucide-react";
import axios from "axios";

export function ProductShowcase() {
  const scrollContainerRefs = {
    massexports: useRef<HTMLDivElement>(null),
    dhanalakshmi: useRef<HTMLDivElement>(null),
  };

  const [scrollStates, setScrollStates] = useState({
    massexports: { canScrollLeft: false, canScrollRight: true },
    dhanalakshmi: { canScrollLeft: false, canScrollRight: true },
  });

  const [products, setProducts] = useState<any[]>([]);
  const { items, addToCart, updateQuantity, removeFromCart } = useCart();
  const [localQuantities, setLocalQuantities] = useState<
    Record<string, number>
  >({});

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/product`
        );
        setProducts(res.data);

        const initialQuantities: Record<string, number> = {};
        res.data.forEach((p: any) => {
          initialQuantities[p._id] = p.unitType === "weight" ? 0.25 : 1;
        });
        setLocalQuantities(initialQuantities);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Filter products by industry
  const massExportsProducts = products.filter(
    (product) => product.industry === "massexports"
  );
  const dhanalakshmiProducts = products.filter(
    (product) => product.industry === "dhanalakshmi"
  );

  const scroll = (
    industry: "massexports" | "dhanalakshmi",
    direction: "left" | "right"
  ) => {
    const ref = scrollContainerRefs[industry];
    if (ref.current) {
      const scrollAmount = 400;
      ref.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleScroll = (industry: "massexports" | "dhanalakshmi") => {
    const ref = scrollContainerRefs[industry];
    if (ref.current) {
      const { scrollLeft, scrollWidth, clientWidth } = ref.current;
      setScrollStates((prev) => ({
        ...prev,
        [industry]: {
          canScrollLeft: scrollLeft > 0,
          canScrollRight: scrollLeft < scrollWidth - clientWidth - 10,
        },
      }));
    }
  };

  const incrementQty = (product: any) => {
    const step = product.unitType === "weight" ? 0.25 : 1;
    const cartItem = items.find((i) => i.id === product._id);

    if (cartItem) {
      updateQuantity(product._id, cartItem.quantity + step);
    } else {
      setLocalQuantities((prev) => ({
        ...prev,
        [product._id]: (prev[product._id] || step) + step,
      }));
    }
  };

  const decrementQty = (product: any) => {
    const step = product.unitType === "weight" ? 0.25 : 1;
    const cartItem = items.find((i) => i.id === product._id);

    if (cartItem) {
      const newQty = cartItem.quantity - step;
      if (newQty <= 0) {
        removeFromCart(product._id);
      } else {
        updateQuantity(product._id, newQty);
      }
    } else {
      setLocalQuantities((prev) => {
        const current = prev[product._id] || step;
        const newQty = current - step;
        return { ...prev, [product._id]: newQty > 0 ? newQty : step };
      });
    }
  };

  const handleAddToCart = (product: any) => {
    const initialQty =
      localQuantities[product._id] ||
      (product.unitType === "weight" ? 0.25 : 1);
    addToCart(
      {
        id: product._id,
        name: product.name,
        price: product.price,
        image: product.mainImage,
        unitType: product.unitType || "unit",
      },
      initialQty
    );
  };

  // Industry Header Component
  const IndustryHeader = ({
    industry,
    description,
  }: {
    industry: "massexports" | "dhanalakshmi";
    description: string;
  }) => {
    const title = industry === "massexports" ? "Mass Exports" : "Dhanalakshmi";
    const styles =
      industry === "massexports"
        ? "from-blue-500 to-blue-700"
        : "from-green-500 to-green-700";

    return (
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          {/* <div className={`p-3 rounded-xl bg-gradient-to-r ${styles}`}>
            <Building className="w-6 h-6 text-white" />
          </div> */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground bg-gradient-to-r bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
              {title}
            </h2>
            <p className="text-muted-foreground mt-2">{description}</p>
          </div>
        </div>
        <Link href={`/products?industry=${industry}`}>
          <Button
            variant="outline"
            className="bg-transparent hidden sm:inline-flex transition-all duration-200 hover:scale-105"
          >
            View All
          </Button>
        </Link>
      </div>
    );
  };

  // Product Row Component
  const ProductRow = ({
    industry,
    products,
  }: {
    industry: "massexports" | "dhanalakshmi";
    products: any[];
  }) => {
    const { canScrollLeft, canScrollRight } = scrollStates[industry];

    return (
      <div className="mb-16 last:mb-0">
        <IndustryHeader
          industry={industry}
          description={
            industry === "massexports"
              ? "Discover our finest quality products"
              : "Explore our range of high-quality local products"
          }
        />

        <div className="relative group">
          {canScrollLeft && (
            <button
              onClick={() => scroll(industry, "left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-primary hover:bg-primary/90 text-primary-foreground p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}
          {canScrollRight && (
            <button
              onClick={() => scroll(industry, "right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-primary hover:bg-primary/90 text-primary-foreground p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          <div
            ref={scrollContainerRefs[industry]}
            onScroll={() => handleScroll(industry)}
            className="flex gap-6 overflow-x-auto scroll-smooth pb-6 snap-x snap-mandatory scrollbar-hide"
          >
            {products.length === 0 ? (
              <div className="w-full text-center py-12">
                <div className="bg-muted rounded-lg p-8 max-w-md mx-auto">
                  <Building className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    No products found for{" "}
                    {industry === "massexports"
                      ? "Mass Exports"
                      : "Dhanalakshmi"}
                  </p>
                </div>
              </div>
            ) : (
              products.map((product) => {
                const cartItem = items.find((i) => i.id === product._id);
                const qty =
                  cartItem?.quantity ||
                  localQuantities[product._id] ||
                  (product.unitType === "weight" ? 0.25 : 1);

                return (
                  <Card
                    key={product._id}
                    className="flex-shrink-0 w-72 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer snap-start border-0 shadow-lg hover:scale-105"
                  >
                    <Link href={`/products/${product._id}`}>
                      <div className="relative h-48 bg-muted overflow-hidden group">
  {(() => {
    const imageUrl = product.mainImage
      ? product.mainImage.startsWith("http")
        ? product.mainImage
        : `${process.env.NEXT_PUBLIC_API_URL}/uploads/${product.mainImage}`
      : null;

    const videoUrl = product.video || null;

    if (videoUrl) {
      return (
        <video
          src={videoUrl}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
      );
    }

    return (
      <img
        src={imageUrl || "/placeholder.svg"}
        alt={product.name}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        onError={(e) => (e.currentTarget.src = "/placeholder.svg")}
      />
    );
  })()}

  <button className="absolute top-3 right-3 bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition-all duration-200 hover:scale-110">
    <Heart className="w-5 h-5 text-destructive" />
  </button>

  <div className="absolute top-3 left-3">
   
  </div>

  {/* Optional: small 🎥 badge overlay for videos */}
  {product.video && (
    <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
      🎥 Video
    </div>
  )}
</div>

                    </Link>

                    <div className="p-5 space-y-3">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                          {product.category}
                        </p>
                        <h3 className="font-semibold text-foreground line-clamp-2 mt-1 text-lg">
                          {product.name}
                        </h3>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-border">
                        <span className="text-xl font-bold text-foreground">
                          ₹{product.price.toLocaleString("en-IN")}
                        </span>

                        {cartItem ? (
                          <div className="flex items-center gap-2 border-2 rounded-xl px-3 py-2 bg-muted/50">
                            <button
                              onClick={() => decrementQty(product)}
                              className="p-1 rounded-lg hover:bg-background transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="px-2 text-sm font-medium min-w-12 text-center">
                              {qty}{" "}
                              {product.unitType === "weight" ? "kg" : "nos"}
                            </span>
                            <button
                              onClick={() => incrementQty(product)}
                              className="p-1 rounded-lg hover:bg-background transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 px-4 py-2 text-sm transition-all duration-200 hover:scale-105"
                            onClick={(e) => {
                              e.preventDefault();
                              handleAddToCart(product);
                            }}
                          >
                            <ShoppingCart className="w-4 h-4" />
                            <span>Add</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Our Stores
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore products from our trusted partners - Mass Exports and
            Dhanalakshmi
          </p>
        </div>

        {/* Mass Exports Products Row */}
        {massExportsProducts.length > 0 && (
          <ProductRow industry="massexports" products={massExportsProducts} />
        )}

        {/* Dhanalakshmi Products Row */}
        {dhanalakshmiProducts.length > 0 && (
          <ProductRow industry="dhanalakshmi" products={dhanalakshmiProducts} />
        )}

        {/* Empty State if no products */}
        {products.length === 0 && (
          <div className="text-center py-16">
            <Building className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-foreground mb-2">
              No Products Available
            </h3>
            <p className="text-muted-foreground">
              Check back later for our latest products
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
