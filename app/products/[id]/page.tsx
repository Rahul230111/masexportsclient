"use client"

import { ClientLayout } from "@/components/client/client-layout"
import { ProductGallery } from "@/components/client/product-gallery"
import { ProductDetails } from "@/components/client/product-details"
import { ReviewsSection } from "@/components/client/reviews-section"
import { RelatedProducts } from "@/components/client/related-products"
import { Card } from "@/components/ui/card"

// Mock product data - replace with API call
const mockProduct = {
  id: 1,
  name: "Sambarani stick",
  price: 99.99,
  originalPrice: 199,
  rating: 4.8,
  reviews: 128,
  inStock: true,
  category: "Devine",
  description:
    "Experience the divine aroma with our premium Sambarani Sticks, specially crafted for spiritual rituals and meditation. Made from high-quality natural ingredients, these sticks release a soothing fragrance that purifies your surroundings, calms the mind, and enhances focus during prayers. Perfect for home poojas, temples, or any sacred space, our Sambarani Sticks bring tranquility and positivity to your daily spiritual practice.",
  images: ["/sambrani.webp", "/sambrani.webp", "/sambrani.webp"],
  specifications: [
    { label: "Driver Size", value: "40mm" },
    { label: "Frequency Response", value: "20Hz - 20kHz" },
    { label: "Impedance", value: "32 Ohms" },
    { label: "Battery Life", value: "30 hours" },
    { label: "Charging Time", value: "2 hours" },
    { label: "Weight", value: "250g" },
  ],
  features: [
    "Active Noise Cancellation (ANC)",
    "30-hour battery life",
    "Bluetooth 5.0 connectivity",
    "Premium comfort padding",
    "Built-in microphone",
    "Foldable design",
  ],
}

export default function ProductPage() {
  return (
    <ClientLayout>
      <div className="min-h-screen bg-background">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <a href="/" className="hover:text-foreground transition-colors">
              Home
            </a>
            <span>/</span>
            <a href="/products" className="hover:text-foreground transition-colors">
              Products
            </a>
            <span>/</span>
            <span className="text-foreground">{mockProduct.name}</span>
          </div>
        </div>

        {/* Product Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <ProductGallery images={mockProduct.images} productName={mockProduct.name} />
            <ProductDetails product={mockProduct} />
          </div>

          {/* Tabs Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2">
              <Card className="p-6">
                <div className="space-y-6">
                  {/* Description Tab */}
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-4">Description</h3>
                    <p className="text-muted-foreground leading-relaxed">{mockProduct.description}</p>
                  </div>

                  {/* Features Tab */}
                  {/* <div className="border-t border-border pt-6">
                    <h3 className="text-xl font-semibold text-foreground mb-4">Features</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {mockProduct.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="text-primary mt-1">✓</span>
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div> */}

                  {/* Specifications Tab */}
                  {/* <div className="border-t border-border pt-6">
                    <h3 className="text-xl font-semibold text-foreground mb-4">Specifications</h3>
                    <div className="space-y-3">
                      {mockProduct.specifications.map((spec, index) => (
                        <div key={index} className="flex justify-between py-2 border-b border-border last:border-0">
                          <span className="text-muted-foreground">{spec.label}</span>
                          <span className="font-medium text-foreground">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  </div> */}
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            {/* <div className="space-y-4">
              <Card className="p-4 bg-primary/5 border-primary/20">
                <p className="text-sm text-muted-foreground mb-2">Free Shipping</p>
                <p className="font-semibold text-foreground">On orders over ₹2500</p>
              </Card>
              <Card className="p-4 bg-primary/5 border-primary/20">
                <p className="text-sm text-muted-foreground mb-2">30-Day Returns</p>
                <p className="font-semibold text-foreground">Hassle-free returns</p>
              </Card>
              <Card className="p-4 bg-primary/5 border-primary/20">
                <p className="text-sm text-muted-foreground mb-2">Secure Payment</p>
                <p className="font-semibold text-foreground">100% encrypted</p>
              </Card>
            </div> */}
          </div>

          {/* Reviews Section */}
          {/* <ReviewsSection
            productId={mockProduct.id}
            productRating={mockProduct.rating}
            productReviews={mockProduct.reviews}
          /> */}

          {/* Related Products */}
          {/* <RelatedProducts currentProductId={mockProduct.id} /> */}
        </div>
      </div>
    </ClientLayout>
  )
}
