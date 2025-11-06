"use client";

import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ShoppingCart, Heart, Plus, Minus } from "lucide-react";
import axios from "axios";

export function ProductShowcase() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const { items, addToCart, updateQuantity, removeFromCart } = useCart();

  const [localQuantities, setLocalQuantities] = useState<Record<string, number>>({});

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/product");
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

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

 const incrementQty = (product: any) => {
  const step = product.unitType === "weight" ? 0.25 : 1;
  const cartItem = items.find((i) => i.id === product._id);

  if (cartItem) {
    // If already in cart, update quantity in cart
    updateQuantity(product._id, cartItem.quantity + step);
  } else {
    // Just update local quantity before adding to cart
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
      removeFromCart(product._id); // ✅ Only called in event handler
    } else {
      updateQuantity(product._id, newQty);
    }
  } else {
    // Local quantity for not yet added products
    setLocalQuantities((prev) => {
      const current = prev[product._id] || step;
      const newQty = current - step;
      return { ...prev, [product._id]: newQty > 0 ? newQty : step };
    });
  }
};

const handleAddToCart = (product: any) => {
  const initialQty = localQuantities[product._id] || (product.unitType === "weight" ? 0.25 : 1);
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

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Products</h2>
            <p className="text-muted-foreground mt-2">Scroll left to right to explore our collection</p>
          </div>
          <Link href="/products">
            <Button variant="outline" className="bg-transparent hidden sm:inline-flex">View All</Button>
          </Link>
        </div>

        <div className="relative group">
          {canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-primary hover:bg-primary/90 text-primary-foreground p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="w-6 h-6 " />
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

          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex gap-6 overflow-x-auto scroll-smooth pb-4 snap-x snap-mandatory"
          >
            {products.length === 0 ? (
              <p className="text-muted-foreground text-center w-full">No products found.</p>
            ) : (
              products.map((product) => {
                const cartItem = items.find((i) => i.id === product._id);
                const qty = cartItem?.quantity || localQuantities[product._id] || (product.unitType === "weight" ? 0.25 : 1);

                return (
                  <Card key={product._id} className="flex-shrink-0 w-72 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer snap-start">
                    <Link href={`/products/${product._id}`}>
                      <div className="relative h-64 bg-muted overflow-hidden group/image">
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

                    <div className="p-4 space-y-3">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">{product.category}</p>
                        <h3 className="font-semibold text-foreground line-clamp-2 mt-1">{product.name}</h3>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-border">
                        <span className="text-lg font-bold text-foreground">₹{product.price.toLocaleString("en-IN")}</span>

                        {cartItem ? (
                          <div className="flex items-center gap-2 border rounded-lg px-2 py-1">
                            <button onClick={() => decrementQty(product)}><Minus className="w-4 h-4" /></button>
                            <span className="px-2 text-sm">{qty} {product.unitType === "weight" ? "kg" : "nos"}</span>
                            <button onClick={() => incrementQty(product)}><Plus className="w-4 h-4" /></button>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            className="bg-primary hover:bg-primary/90 text-primary-foreground gap-3 px-4 py-2 text-sm"
                            onClick={(e) => {
                              e.preventDefault();
                              addToCart(
                                {
                                  id: product._id,
                                  name: product.name,
                                  price: product.price,
                                  image: product.mainImage,
                                  unitType: product.unitType || "unit",
                                },
                                qty
                              );
                            }}
                          >
                            <ShoppingCart className="w-5 h-5" />
                            <span className="hidden sm:inline">Add</span>
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
    </section>
  );
}
