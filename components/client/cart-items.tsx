"use client"

import { useCart } from "@/context/cart-context"
import { Card } from "@/components/ui/card"
import { Trash2, Plus, Minus } from "lucide-react"
import Link from "next/link"

export function CartItems() {
  const { items, updateQuantity, removeFromCart } = useCart()

  if (items.length === 0) {
    return <p className="text-center text-muted-foreground">Your cart is empty 🛍️</p>
  }

  const formatQuantity = (qty: number) => Number(qty.toFixed(2))

  return (
    <div className="space-y-4">
      {items.map((item) => {
        const isWeightBased = item.unitType === "weight"
        const step = isWeightBased ? 0.25 : 1

        const handleDecrement = () => {
          const newQty = formatQuantity(item.quantity - step)
          if (newQty <= 0) {
            removeFromCart(item.id) // 👈 remove item completely
          } else {
            updateQuantity(item.id, newQty)
          }
        }

        const handleIncrement = () => {
          const newQty = formatQuantity(item.quantity + step)
          updateQuantity(item.id, newQty)
        }

        return (
          <Card key={item.id} className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row gap-4 md:gap-6">
              <Link href={`/products/${item.id}`} className="flex-shrink-0">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-lg hover:opacity-80 transition-opacity"
                />
              </Link>

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <Link
                    href={`/products/${item.id}`}
                    className="hover:text-primary transition-colors"
                  >
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                  </Link>
                  <p className="text-sm text-muted-foreground">SKU - {item.id}</p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleDecrement}
                      className="w-8 h-8 border rounded-lg hover:bg-muted flex items-center justify-center"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-semibold w-10 text-center">
                      {isWeightBased ? item.quantity.toFixed(2) : item.quantity}
                    </span>
                    <button
                      onClick={handleIncrement}
                      className="w-8 h-8 border rounded-lg hover:bg-muted flex items-center justify-center"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-bold">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      ₹{item.price.toLocaleString("en-IN")} each
                    </p>
                  </div>
                </div>
              </div>

              <div className="
                w-full md:w-auto 
                flex md:block 
                justify-center md:justify-end 
                mt-3 md:mt-0
              ">
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="
                    text-destructive hover:bg-destructive/10
                    p-2 rounded-lg
                    w-full md:w-auto 
                    flex items-center justify-center
                    border md:border-0
                    bg-black md:bg-white 
                  "
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
