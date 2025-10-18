"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"

export function CheckoutForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
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

    // Payment
    cardName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Call your backend API to process payment
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Checkout failed")
      }

      // Redirect to success page
      router.push("/order-success")
    } catch (error) {
      console.error("Checkout error:", error)
      alert("Checkout failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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

      {/* Billing Information */}
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

        {!formData.sameAsShipping && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">First Name</label>
              <Input
                type="text"
                name="billingFirstName"
                value={formData.billingFirstName}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Last Name</label>
              <Input type="text" name="billingLastName" value={formData.billingLastName} onChange={handleInputChange} />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">Address</label>
              <Input type="text" name="billingAddress" value={formData.billingAddress} onChange={handleInputChange} />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">City</label>
              <Input type="text" name="billingCity" value={formData.billingCity} onChange={handleInputChange} />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">State</label>
              <Input type="text" name="billingState" value={formData.billingState} onChange={handleInputChange} />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Zip Code</label>
              <Input type="text" name="billingZipCode" value={formData.billingZipCode} onChange={handleInputChange} />
            </div>
          </div>
        )}
      </Card>

      {/* Payment Information */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Payment Information</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Cardholder Name</label>
            <Input
              type="text"
              name="cardName"
              value={formData.cardName}
              onChange={handleInputChange}
              placeholder="John Doe"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Card Number</label>
            <Input
              type="text"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleInputChange}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Expiry Date</label>
              <Input
                type="text"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleInputChange}
                placeholder="MM/YY"
                maxLength={5}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">CVV</label>
              <Input
                type="text"
                name="cvv"
                value={formData.cvv}
                onChange={handleInputChange}
                placeholder="123"
                maxLength={4}
                required
              />
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
          <p className="text-xs text-muted-foreground">
            Your payment information is secure and encrypted. We never store your full card details.
          </p>
        </div>
      </Card>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg font-semibold"
      >
        {isLoading ? "Processing..." : "Complete Purchase"}
      </Button>
    </form>
  )
}
