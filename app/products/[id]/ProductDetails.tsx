"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
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
}

export default function ProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const { items, addToCart } = useCart();

  // Fetch product by ID
  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/product/${id}`
        );
        setProduct(res.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // Add to Cart (only once)
  const handleAddToCart = async () => {
    if (!product) return;
    setIsAdding(true);

    const isInCart = items.some((item) => item.id === String(product._id));
    if (isInCart) {
      setIsAdding(false);
      return;
    }

    addToCart(
      {
        id: String(product._id),
        name: product.name,
        price: Number(product.price),
        image: product.mainImage || "",
      },
      quantity
    );

    
    setIsAdding(false);
    setQuantity(1);
  };

  // Buy Now
  const handleBuyNow = async () => {
    if (!product) return;
    handleAddToCart();
    router.push("/cart");
  };

  if (loading)
    return <p className="text-center mt-10 text-gray-500">Loading product...</p>;
  if (!product)
    return (
      <p className="text-center mt-10 text-red-500 font-medium">
        Product not found.
      </p>
    );

  const isInCart = items.some((item) => item.id === String(product._id));

  return (
    <ClientLayout>
      <div className="max-w-6xl mx-auto p-6">
        <Button onClick={() => router.back()} variant="outline" className="mb-6">
          ← Back
        </Button>

        <div className="grid md:grid-cols-2 gap-10">
          {/* LEFT: Image and Description */}
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
                {product.description ||
                  "This product is crafted with high-quality materials ensuring durability and comfort."}
              </p>

              <div className="mt-6">
                <h2 className="text-xl font-semibold text-foreground border-b pb-2">
                  Features
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {product.features ||
                    "Made with premium quality components and designed for long-lasting performance."}
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: Product Info & Actions */}
          <div className="flex flex-col justify-between">
            <div className="border rounded-2xl p-6 shadow-sm bg-card">
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <p className="text-2xl font-semibold text-primary mb-4">
                ₹{product.price.toLocaleString("en-IN")}
              </p>

              {/* Quantity Selector */}
              <div className="flex items-center gap-3 mb-6">
                <span className="font-medium text-sm text-muted-foreground">
                  Quantity
                </span>
                <div className="flex items-center border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 hover:bg-muted transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 hover:bg-muted transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-3 mb-6">
                <Button
                  onClick={handleAddToCart}
                  disabled={isAdding || isInCart}
                  className={`w-full text-white text-lg py-6 ${
                    isInCart
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-primary hover:bg-primary/90"
                  }`}
                >
                  {isInCart
                    ? "Already in Cart"
                    : isAdding
                    ? "Adding..."
                    : "Add to Cart"}
                </Button>

                <Button
                  onClick={handleBuyNow}
                  variant="outline"
                  className="w-full py-6 text-lg"
                >
                  Buy Now
                </Button>
              </div>

              {/* Services */}
              <div className="grid grid-cols-3 text-center border-t pt-4 gap-2 text-sm text-muted-foreground">
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
                <strong>Note:</strong> Images are for illustration purposes only.
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
