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
    massexports: { canScrollLeft: false, canScrollRight: false },
    dhanalakshmi: { canScrollLeft: false, canScrollRight: false },
  });

  const [products, setProducts] = useState<any[]>([]);
  const { items, addToCart, updateQuantity, removeFromCart } = useCart();
  const [localQuantities, setLocalQuantities] = useState<Record<string, number>>(
    {}
  );

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/product`);
        setProducts(res.data || []);

        const initialQuantities: Record<string, number> = {};
        (res.data || []).forEach((p: any) => {
          initialQuantities[p._id] = p.unitType === "weight" ? 0.25 : 1;
        });
        setLocalQuantities(initialQuantities);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, []);

  // filters
  const massExportsProducts = products.filter((p) => p.industry === "massexports");
  const dhanalakshmiProducts = products.filter((p) => p.industry === "dhanalakshmi");

  // compute scroll state (left/right availability)
  const updateScrollState = (industry: "massexports" | "dhanalakshmi") => {
    const ref = scrollContainerRefs[industry].current;
    if (!ref) return;
    const { scrollLeft, scrollWidth, clientWidth } = ref;
    setScrollStates((prev) => ({
      ...prev,
      [industry]: {
        canScrollLeft: scrollLeft > 0,
        canScrollRight: scrollLeft < scrollWidth - clientWidth - 1,
      },
    }));
  };

  // init and on resize
  useEffect(() => {
    const handleResize = () => {
      updateScrollState("massexports");
      updateScrollState("dhanalakshmi");
    };

    // give DOM a tick for widths to settle then compute
    const t = setTimeout(() => handleResize(), 150);
    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", handleResize);
    };
  }, [products]);

  // attach scroll listeners to keep arrows in sync
  useEffect(() => {
    const mRef = scrollContainerRefs.massexports.current;
    const dRef = scrollContainerRefs.dhanalakshmi.current;
    if (mRef) {
      const onScroll = () => updateScrollState("massexports");
      mRef.addEventListener("scroll", onScroll, { passive: true });
      // initial state
      updateScrollState("massexports");
      return () => mRef.removeEventListener("scroll", onScroll);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products]);

  useEffect(() => {
    const ref = scrollContainerRefs.dhanalakshmi.current;
    if (ref) {
      const onScroll = () => updateScrollState("dhanalakshmi");
      ref.addEventListener("scroll", onScroll, { passive: true });
      updateScrollState("dhanalakshmi");
      return () => ref.removeEventListener("scroll", onScroll);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products]);

  const scroll = (
    industry: "massexports" | "dhanalakshmi",
    direction: "left" | "right"
  ) => {
    const ref = scrollContainerRefs[industry].current;
    if (!ref) return;
    // amount based on viewport of container (good UX)
    const amount = Math.min(600, ref.clientWidth * 0.9);
    ref.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" });
    // update after a short delay (browser will animate)
    setTimeout(() => updateScrollState(industry), 350);
  };

  const incrementQty = (product: any) => {
    const step = product.unitType === "weight" ? 0.25 : 1;
    const cartItem = items.find((i) => i.id === product._id);
    if (cartItem) updateQuantity(product._id, cartItem.quantity + step);
    else
      setLocalQuantities((prev) => ({
        ...prev,
        [product._id]: (prev[product._id] || step) + step,
      }));
  };

  const decrementQty = (product: any) => {
    const step = product.unitType === "weight" ? 0.25 : 1;
    const cartItem = items.find((i) => i.id === product._id);
    if (cartItem) {
      const newQty = cartItem.quantity - step;
      if (newQty <= 0) removeFromCart(product._id);
      else updateQuantity(product._id, newQty);
    } else {
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
    // update arrows in case adding changes layout
    setTimeout(() => {
      updateScrollState("massexports");
      updateScrollState("dhanalakshmi");
    }, 200);
  };

  // Header
  const IndustryHeader = ({ industry, description }: { industry: "massexports" | "dhanalakshmi"; description: string; }) => {
    const title = industry === "massexports" ? "Mass Exports" : "Dhanalakshmi";
    return (
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
        <Link href={`/products?industry=${industry}`}>
          <Button variant="outline" className="hidden sm:inline-flex">View All</Button>
        </Link>
      </div>
    );
  };

  // Product row
  const ProductRow = ({ industry, products }: { industry: "massexports" | "dhanalakshmi"; products: any[]; }) => {
    const { canScrollLeft, canScrollRight } = scrollStates[industry];

    return (
      <div className="mb-12">
        <IndustryHeader
          industry={industry}
          description={industry === "massexports" ? "Discover our finest quality products" : "Explore our range of high-quality local products"}
        />

        <div className="relative">
          {/* always-visible arrows to make debugging easier */}
          <button
            onClick={() => scroll(industry, "left")}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full shadow-md ${canScrollLeft ? "bg-white" : "bg-gray-100/60 cursor-not-allowed"}`}
            style={{ transform: "translateY(-50%)", opacity: 0.95 }}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={() => scroll(industry, "right")}
            disabled={!canScrollRight}
            aria-label="Scroll right"
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full shadow-md ${canScrollRight ? "bg-white" : "bg-gray-100/60 cursor-not-allowed"}`}
            style={{ transform: "translateY(-50%)", opacity: 0.95 }}
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* SCROLL CONTAINER */}
          <div
            ref={scrollContainerRefs[industry]}
            // key inline styles to ensure touch swiping and visible scrollbar
            style={{
              overflowX: "auto",
              overflowY: "hidden",
              WebkitOverflowScrolling: "touch",
              touchAction: "pan-x",
              scrollBehavior: "smooth",
              paddingBottom: 12,
            }}
            className="flex gap-5 items-start"
          >
            {products.length === 0 ? (
              <div className="py-8 w-full">
                <div className="bg-muted rounded-lg p-6">
                  <Building className="w-10 h-10 mb-3" />
                  <p className="text-sm text-muted-foreground">No products</p>
                </div>
              </div>
            ) : (
              products.map((product) => {
                const cartItem = items.find((i) => i.id === product._id);
                const qty = cartItem?.quantity ?? localQuantities[product._id] ?? (product.unitType === "weight" ? 0.25 : 1);

                // ensure each card does not shrink and keeps width
                return (
                  <Card key={product._id} className="flex-shrink-0 w-72 min-w-[18rem]">
                    <Link href={`/products/${product._id}`}>
                      <div className="relative h-44 bg-muted overflow-hidden">
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
                                className="w-full h-full object-cover"
                                autoPlay
                                muted
                                loop
                                playsInline
                                preload="auto"
                                // prevent dragging behavior
                                draggable={false}
                              />
                            );
                          }
                          return (
                            <img
                              src={imageUrl || "/placeholder.svg"}
                              alt={product.name}
                              className="w-full h-full object-cover"
                              onError={(e) => (e.currentTarget.src = "/placeholder.svg")}
                              draggable={false}
                            />
                          );
                        })()}
                        <button className="absolute top-3 right-3 bg-white/90 p-2 rounded-full shadow">
                          <Heart className="w-4 h-4 text-destructive" />
                        </button>
                      </div>
                    </Link>

                    <div className="p-4">
                      <p className="text-xs text-muted-foreground uppercase">{product.category}</p>
                      <h4 className="font-medium mt-1 line-clamp-2">{product.name}</h4>

                      <div className="flex items-center justify-between mt-3">
                        <div className="text-lg font-bold">₹{product.price?.toLocaleString?.("en-IN") ?? product.price}</div>

                        {cartItem ? (
                          <div className="flex items-center gap-2 border rounded px-2 py-1">
                            <button onClick={() => decrementQty(product)} className="p-1">
                              <Minus className="w-4 h-4" />
                            </button>
                            <div className="px-2 text-sm">{qty} {product.unitType === "weight" ? "kg" : "nos"}</div>
                            <button onClick={() => incrementQty(product)} className="p-1">
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <Button size="sm" onClick={(e) => { e.preventDefault(); handleAddToCart(product); }}>
                            <ShoppingCart className="w-4 h-4" /> Add
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
    <section className="py-12 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold">Our Stores</h2>
          <p className="text-sm text-muted-foreground mt-2">Explore products from our trusted partners</p>
        </div>

        {massExportsProducts.length > 0 && <ProductRow industry="massexports" products={massExportsProducts} />}
        {dhanalakshmiProducts.length > 0 && <ProductRow industry="dhanalakshmi" products={dhanalakshmiProducts} />}

        {products.length === 0 && (
          <div className="text-center py-8">
            <Building className="w-14 h-14 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No products available</p>
          </div>
        )}
      </div>
    </section>
  );
}
