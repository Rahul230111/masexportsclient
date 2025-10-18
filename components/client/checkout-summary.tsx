import { Card } from "@/components/ui/card"

// Mock cart items for summary
const cartItems = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 299.99,
    quantity: 1,
  },
  {
    id: 2,
    name: "Luxury Watch",
    price: 599.99,
    quantity: 1,
  },
]

export function CheckoutSummary() {
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 50 ? 0 : 10
  const tax = subtotal * 0.1
  const total = subtotal + shipping + tax

  return (
    <div className="sticky top-24 space-y-4">
      {/* Order Items */}
      <Card className="p-6 space-y-4">
        <h3 className="font-semibold text-lg text-foreground">Order Summary</h3>

        <div className="space-y-3 border-b border-border pb-4">
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {item.name} x {item.quantity}
              </span>
              <span className="text-foreground font-medium">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="space-y-3 border-b border-border pb-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="text-foreground font-medium">${subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Shipping</span>
            <span className="text-foreground font-medium">
              {shipping === 0 ? (
                <span className="text-green-600 dark:text-green-400">Free</span>
              ) : (
                `$${shipping.toFixed(2)}`
              )}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tax (10%)</span>
            <span className="text-foreground font-medium">${tax.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex justify-between text-lg">
          <span className="font-semibold text-foreground">Total</span>
          <span className="font-bold text-primary text-xl">${total.toFixed(2)}</span>
        </div>
      </Card>

      {/* Security Info */}
      <Card className="p-4 bg-primary/5 border-primary/20">
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">🔒 Secure Checkout</span>
          <br />
          Your information is protected with SSL encryption
        </p>
      </Card>

      {/* Guarantees */}
      <Card className="p-4 space-y-2">
        <p className="text-xs font-semibold text-foreground">✓ 30-Day Money Back Guarantee</p>
        <p className="text-xs font-semibold text-foreground">✓ Free Shipping on Orders Over $50</p>
        <p className="text-xs font-semibold text-foreground">✓ 24/7 Customer Support</p>
      </Card>
    </div>
  )
}
