"use client"

import type React from "react"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCart } from "@/context/cart-context"

export function CheckoutForm() {
  const [formData, setFormData] = useState({
    // Shipping
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",

    // Billing
    sameAsShipping: true,
    billingFirstName: "",
    billingLastName: "",
    billingAddress: "",
    billingCity: "",
    billingState: "",
    billingZipCode: "",
  })

  const [discount, setDiscount] = useState(0)
  const { items } = useCart()

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = 0
  const tax = (subtotal - discount) * 0.1
  const total = subtotal - discount + shipping + tax

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  // Google Pay Redirect
  const handleGooglePay = () => {
    const upiId = "srinivasanmasexports@okaxis"
    const name = "Mas Exports"
    const note = "Order Payment"
    const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${total.toFixed(
      2
    )}&cu=INR&tn=${encodeURIComponent(note)}`

    window.location.href = upiLink
  }
  console.log(items )

const handleWhatsAppOrder = () => {
  const phoneNumber = "9159478448"
  const name = `${formData.firstName} ${formData.lastName}`
  const amount = total.toFixed(2)

  // Format cart items
  const productDetails = items
    .map(
      (item, index) =>
        `${index + 1}. ${item.name} — Qty: ${item.quantity} ${item.unitType} — ₹${item.price * item.quantity}`
    )
    .join("%0A")

  // WhatsApp message content
  const message = `Hello Mas Exports 👋,%0A%0AI would like to place an order.%0A%0A` +
    `🧾 *Customer Details*%0A` +
    `Name: ${encodeURIComponent(name)}%0A` +
    `Email: ${encodeURIComponent(formData.email)}%0A` +
    `Phone: ${encodeURIComponent(formData.phone)}%0A` +
    `Address: ${encodeURIComponent(formData.address)}%0A%0A` +
    `🛍️ *Order Details*%0A${productDetails}%0A%0A` +
    `💰 *Total Amount:* ₹${amount}%0A%0A` +
    `Please confirm my order.`

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`
    window.location.href = whatsappUrl
  }

  return (
    <form className="space-y-6">
      {/* Shipping Information */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Shipping Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">First Name</label>
            <Input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Last Name</label>
            <Input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Email</label>
            <Input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Phone</label>
            <Input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-foreground mb-2">Address</label>
            <Input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Street address"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">City</label>
            <Input type="text" name="city" value={formData.city} onChange={handleInputChange} required />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">State</label>
            <Input type="text" name="state" value={formData.state} onChange={handleInputChange} required />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Zip Code</label>
            <Input type="text" name="zipCode" value={formData.zipCode} onChange={handleInputChange} required />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Country</label>
            <Input type="text" name="country" value={formData.country} onChange={handleInputChange} required />
          </div>
        </div>
      </Card>

      {/* Billing Info */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <input
            type="checkbox"
            id="sameAsShipping"
            name="sameAsShipping"
            checked={formData.sameAsShipping}
            onChange={handleInputChange}
            className="w-4 h-4 rounded border-border"
          />
          <label htmlFor="sameAsShipping" className="text-sm font-medium text-foreground">
            Billing address same as shipping
          </label>
        </div>
      </Card>

      {/* Google Pay Button */}
      <Button
        type="button"
        onClick={handleGooglePay}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg font-semibold"
      >
        Pay on Google Pay
      </Button>
      <p style={{textAlign:"center"}}>or</p>
       <Button
        type="button"
        onClick={handleWhatsAppOrder}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg font-semibold"
      >
        Message and order on whatsapp
      </Button>
    </form>
  )
}
