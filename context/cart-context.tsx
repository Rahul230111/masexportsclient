"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { toast } from "react-hot-toast"

export interface CartItem {
  id: string; 
  name: string;
  price: number;
  image?: string;
  quantity: number;
  unitType?: "unit" | "weight";
}

interface CartContextType {
  items: CartItem[]
  addToCart: (product: Omit<CartItem, "quantity">, quantity?: number) => void
  removeFromCart: (id: string) => void          // ✅ string
  updateQuantity: (id: string, quantity: number) => void // ✅ string
  clearCart: () => void
  totalItems: number
  totalPrice: number
}


const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isHydrated, setIsHydrated] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (error) {
        console.error("Failed to load cart:", error)
      }
    }
    setIsHydrated(true)
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("cart", JSON.stringify(items))
    }
  }, [items, isHydrated])

 const addToCart = (product: Omit<CartItem, "quantity">, quantity = 1) => {
  setItems((prev) => {
    const exists = prev.find((item) => item.id === product.id)
    if (exists) {
      toast.success(`${product.name} quantity updated`)
      return prev.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
      )
    }
   
    return [...prev, { ...product, quantity }]
  })
   toast.success(`${product.name} added to cart`)
}

  const removeFromCart = (id: string) => {
  setItems((prevItems) => prevItems.filter((item) => item.id !== id))
}

const updateQuantity = (id: string, quantity: number) => {
  if (quantity <= 0) {
    removeFromCart(id)
    return
  }
  setItems((prevItems) =>
    prevItems.map((item) => (item.id === id ? { ...item, quantity } : item))
  )
}

  const clearCart = () => {
    setItems([])
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within CartProvider")
  }
  return context
}