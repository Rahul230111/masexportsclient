"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Truck, ShieldCheck, Headphones } from "lucide-react";
import { ClientLayout } from "@/components/client/client-layout";
import { useCart } from "@/context/cart-context";

interface Product {
  _id: string;
  name: string;
  price: number;
  description?: string;
  mainImage?: string;
  features?: string;
  unitType?: "unit" | "weight";
}

interface ProductDetailsProps {
  product: Product;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const router = useRouter();
  const [localQty, setLocalQty] = useState(0);
  const { items, addToCart, updateQuantity, removeFromCart } = useCart();

  const cartItem = items.find((item) => item.id === product._id);
  const qty = cartItem?.quantity ?? localQty;
  const isInCart = qty > 0;
  const initialQty = product.unitType === "weight" ? 0.25 : 1;
  const step = product.unitType === "weight" ? 0.25 : 1;

  const handleAddToCart = () => {
    if (!isInCart) {
      addToCart(
        {
          id: product._id,
          name: product.name,
          price: product.price,
          image: product.mainImage || "",
          unitType: product.unitType,
        },
        initialQty
      );
      setLocalQty(initialQty);
    }
  };

  const handleIncrement = () => {
    const newQty = qty + step;
    if (cartItem) updateQuantity(product._id, newQty);
    else setLocalQty(newQty);
  };

  const handleDecrement = () => {
    const newQty = qty - step;
    if (newQty <= 0) {
      if (cartItem) removeFromCart(product._id);
      setLocalQty(0);
    } else {
      if (cartItem) updateQuantity(product._id, newQty);
      else setLocalQty(newQty);
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/cart");
  };

  return (
    <ClientLayout>
      <div className="max-w-6xl mx-auto p-6">
        <Button
          onClick={() => router.back()}
          variant="outline"
          className="mb-6"
        >
          ← Back
        </Button>

        <div className="grid md:grid-cols-2 gap-10">
          {/* LEFT: Image & Description */}
          <div>
            {product.mainImage && (
              <div className="border rounded-2xl overflow-hidden shadow-sm mb-6">
                <img
                  src={product.mainImage}
                  alt={product.name}
                  className="w-full h-[450px] object-cover"
                />
              </div>
            )}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground border-b pb-2">
                Description
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {product.description || "High-quality product for your needs."}
              </p>
              <div className="mt-6">
                <h2 className="text-xl font-semibold text-foreground border-b pb-2">
                  Features
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {product.features ||
                    "Premium quality and long-lasting performance."}
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: Info & Actions */}
          <div className="flex flex-col justify-between">
            <div className="border rounded-2xl p-6 shadow-sm bg-card">
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <p className="text-2xl font-semibold text-primary mb-4">
                ₹{product.price.toLocaleString("en-IN")}
              </p>

              {/* Quantity Selector */}
              {isInCart && (
                <div className="flex items-center gap-3 mb-6">
                  <span className="font-medium text-sm text-muted-foreground">
                    Quantity
                  </span>
                  <div className="flex items-center border rounded-lg">
                    <button
                      onClick={handleDecrement}
                      className="px-3 py-2 hover:bg-muted transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 font-semibold">
                      {product.unitType === "weight"
                        ? qty + " kg"
                        : qty + " nos"}
                    </span>
                    <button
                      onClick={handleIncrement}
                      className="px-3 py-2 hover:bg-muted transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Add / Buy Buttons */}
              {!isInCart && (
                <Button
                  onClick={handleAddToCart}
                  className="w-full text-white text-lg py-6 bg-primary hover:bg-primary/90"
                >
                  Add to Cart
                </Button>
              )}
              <Button
                onClick={handleBuyNow}
                variant="outline"
                className="w-full py-6 text-lg mt-3"
              >
                Buy Now
              </Button>

              {/* Services */}
              <div className="grid grid-cols-3 text-center border-t pt-4 gap-2 text-sm text-muted-foreground mt-4">
                <div className="flex flex-col items-center">
                  <Truck className="w-5 h-5 mb-1 text-primary" />
                  <span>Free Shipping</span>
                </div>
                <div className="flex flex-col items-center">
                  <Headphones className="w-5 h-5 mb-1 text-primary" />
                  <span>24/7 Support</span>
                </div>
                <div className="flex flex-col items-center">
                  <ShieldCheck className="w-5 h-5 mb-1 text-primary" />
                  <span>Secure Payment</span>
                </div>
              </div>
            </div>

            <div className="mt-6 text-sm text-muted-foreground leading-relaxed">
              <p>
                <strong>Note:</strong> Images are for illustration purposes
                only.
              </p>
              <p className="mt-3">
                Estimated delivery: <strong>3–5 business days</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}
