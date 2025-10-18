// pages/products/[id]/page.tsx
// Do NOT use "use client" here — server component for static export

import { ClientLayout } from "@/components/client/client-layout"
import { ProductGallery } from "@/components/client/product-gallery"
import { ProductDetails } from "@/components/client/product-details"
import { ReviewsSection } from "@/components/client/reviews-section"
import { RelatedProducts } from "@/components/client/related-products"
import { Card } from "@/components/ui/card"

// Mock products array
const mockProducts = [
  {
    id: 1,
    name: "Sambarani Stick",
    price: 99.99,
    originalPrice: 199,
    rating: 4.8,
    reviews: 128,
    inStock: true,
    category: "Devotional",
    description:
      "Experience the divine aroma with our premium Sambarani Sticks, specially crafted for spiritual rituals and meditation. Made from high-quality natural ingredients, these sticks release a soothing fragrance that purifies your surroundings, calms the mind, and enhances focus during prayers. Perfect for home poojas, temples, or any sacred space, our Sambarani Sticks bring tranquility and positivity to your daily spiritual practice.",
    images: ["/sambrani.webp", "/sambrani-2.webp", "/sambrani-3.webp"],
    specifications: [
      { label: "Weight", value: "50g" },
      { label: "Length", value: "20cm" },
      { label: "Burn Time", value: "45 minutes" },
      { label: "Material", value: "Natural resin & herbs" },
    ],
    features: [
      "Natural ingredients",
      "Long-lasting fragrance",
      "Ideal for meditation & pooja",
      "Purifies the surroundings",
      "Enhances focus & calmness",
    ],
  },
  {
    id: 2,
    name: "Sambarani Cup",
    price: 49.99,
    originalPrice: 99,
    rating: 4.5,
    reviews: 85,
    inStock: true,
    category: "Devotional",
    description:
      "Our Sambarani Cups are perfect for offering during poojas. Crafted from high-quality materials, these cups hold the sacred incense and allow a controlled burn, releasing a gentle and calming fragrance.",
    images: ["/sambranicup.webp", "/sambranicup.webp", "/sambranicup.webp"],
    specifications: [
      { label: "Weight", value: "30g" },
      { label: "Diameter", value: "5cm" },
      { label: "Material", value: "Natural resin & herbs" },
      { label: "Burn Time", value: "30 minutes" },
    ],
    features: [
      "Safe for indoor use",
      "Easy to handle",
      "Natural fragrance",
      "Compact size for small poojas",
    ],
  },
  {
    id: 3,
    name: "Powder",
    price: 79.99,
    originalPrice: 149,
    rating: 4.7,
    reviews: 92,
    inStock: true,
    category: "Devotional",
    description:
      "Sambarani Cones provide a long-lasting aromatic experience for your spiritual rituals. They are handcrafted with natural ingredients to purify your surroundings and elevate your meditation practice.",
    images: ["/powder.webp", "/powder.webp", "/powder.webp"],
    specifications: [
      { label: "Weight", value: "40g" },
      { label: "Height", value: "7cm" },
      { label: "Material", value: "Natural resin & herbs" },
      { label: "Burn Time", value: "40 minutes" },
    ],
    features: [
      "Natural aroma",
      "Handcrafted",
      "Long-lasting burn",
      "Ideal for meditation and poojas",
    ],
  },
  {
    id: 4,
    name: "Donkey Dung",
    price: 79.99,
    originalPrice: 149,
    rating: 4.7,
    reviews: 92,
    inStock: true,
    category: "Devotional",
    description:
      "Sambarani Cones provide a long-lasting aromatic experience for your spiritual rituals. They are handcrafted with natural ingredients to purify your surroundings and elevate your meditation practice.",
    images: ["/dung.webp", "/dung.webp", "/dung.webp"],
    specifications: [
      { label: "Weight", value: "40g" },
      { label: "Height", value: "7cm" },
      { label: "Material", value: "Natural resin & herbs" },
      { label: "Burn Time", value: "40 minutes" },
    ],
    features: [
      "Natural aroma",
      "Handcrafted",
      "Long-lasting burn",
      "Ideal for meditation and poojas",
    ],
  },
  {
    id: 5,
    name: "KalMuthra",
    price: 79.99,
    originalPrice: 149,
    rating: 4.7,
    reviews: 92,
    inStock: true,
    category: "Devotional",
    description:
      "Sambarani Cones provide a long-lasting aromatic experience for your spiritual rituals. They are handcrafted with natural ingredients to purify your surroundings and elevate your meditation practice.",
    images: ["/kalmuthra.webp", "/kalmuthra.webp", "/kalmuthra.webp"],
    specifications: [
      { label: "Weight", value: "40g" },
      { label: "Height", value: "7cm" },
      { label: "Material", value: "Natural resin & herbs" },
      { label: "Burn Time", value: "40 minutes" },
    ],
    features: [
      "Natural aroma",
      "Handcrafted",
      "Long-lasting burn",
      "Ideal for meditation and poojas",
    ],
  },
  {
    id: 6,
    name: "Donkey Hair",
    price: 79.99,
    originalPrice: 149,
    rating: 4.7,
    reviews: 92,
    inStock: true,
    category: "Devotional",
    description:
      "Sambarani Cones provide a long-lasting aromatic experience for your spiritual rituals. They are handcrafted with natural ingredients to purify your surroundings and elevate your meditation practice.",
    images: ["/hair.webp", "/hair.webp", "/hair.webp"],
    specifications: [
      { label: "Weight", value: "40g" },
      { label: "Height", value: "7cm" },
      { label: "Material", value: "Natural resin & herbs" },
      { label: "Burn Time", value: "40 minutes" },
    ],
    features: [
      "Natural aroma",
      "Handcrafted",
      "Long-lasting burn",
      "Ideal for meditation and poojas",
    ],
  },
  {
    id: 7,
    name: "Anklet",
    price: 79.99,
    originalPrice: 149,
    rating: 4.7,
    reviews: 92,
    inStock: true,
    category: "Devotional",
    description:
      "Sambarani Cones provide a long-lasting aromatic experience for your spiritual rituals. They are handcrafted with natural ingredients to purify your surroundings and elevate your meditation practice.",
    images: ["/anklet.webp", "/anklet.webp", "/anklet.webp"],
    specifications: [
      { label: "Weight", value: "40g" },
      { label: "Height", value: "7cm" },
      { label: "Material", value: "Natural resin & herbs" },
      { label: "Burn Time", value: "40 minutes" },
    ],
    features: [
      "Natural aroma",
      "Handcrafted",
      "Long-lasting burn",
      "Ideal for meditation and poojas",
    ],
  },
  {
    id: 8,
    name: "ring",
    price: 79.99,
    originalPrice: 149,
    rating: 4.7,
    reviews: 92,
    inStock: true,
    category: "Devotional",
    description:
      "Sambarani Cones provide a long-lasting aromatic experience for your spiritual rituals. They are handcrafted with natural ingredients to purify your surroundings and elevate your meditation practice.",
    images: ["/ring.webp", "/ring.webp", "/ring.webp"],
    specifications: [
      { label: "Weight", value: "40g" },
      { label: "Height", value: "7cm" },
      { label: "Material", value: "Natural resin & herbs" },
      { label: "Burn Time", value: "40 minutes" },
    ],
    features: [
      "Natural aroma",
      "Handcrafted",
      "Long-lasting burn",
      "Ideal for meditation and poojas",
    ],
  },
  {
    id: 9,
    name: "Keychains",
    price: 79.99,
    originalPrice: 149,
    rating: 4.7,
    reviews: 92,
    inStock: true,
    category: "Devotional",
    description:
      "Sambarani Cones provide a long-lasting aromatic experience for your spiritual rituals. They are handcrafted with natural ingredients to purify your surroundings and elevate your meditation practice.",
    images: ["/key.webp", "/key.webp", "/key.webp"],
    specifications: [
      { label: "Weight", value: "40g" },
      { label: "Height", value: "7cm" },
      { label: "Material", value: "Natural resin & herbs" },
      { label: "Burn Time", value: "40 minutes" },
    ],
    features: [
      "Natural aroma",
      "Handcrafted",
      "Long-lasting burn",
      "Ideal for meditation and poojas",
    ],
  },
  {
    id: 10,
    name: "Doller",
    price: 79.99,
    originalPrice: 149,
    rating: 4.7,
    reviews: 92,
    inStock: true,
    category: "Devotional",
    description:
      "Sambarani Cones provide a long-lasting aromatic experience for your spiritual rituals. They are handcrafted with natural ingredients to purify your surroundings and elevate your meditation practice.",
    images: ["/doller.webp", "/doller.webp", "/doller.webp"],
    specifications: [
      { label: "Weight", value: "40g" },
      { label: "Height", value: "7cm" },
      { label: "Material", value: "Natural resin & herbs" },
      { label: "Burn Time", value: "40 minutes" },
    ],
    features: [
      "Natural aroma",
      "Handcrafted",
      "Long-lasting burn",
      "Ideal for meditation and poojas",
    ],
  },
  {
    id: 11,
    name: "paper weight",
    price: 79.99,
    originalPrice: 149,
    rating: 4.7,
    reviews: 92,
    inStock: true,
    category: "Devotional",
    description:
      "Sambarani Cones provide a long-lasting aromatic experience for your spiritual rituals. They are handcrafted with natural ingredients to purify your surroundings and elevate your meditation practice.",
    images: ["/weight.webp", "/weight.webp", "/weight.webp"],
    specifications: [
      { label: "Weight", value: "40g" },
      { label: "Height", value: "7cm" },
      { label: "Material", value: "Natural resin & herbs" },
      { label: "Burn Time", value: "40 minutes" },
    ],
    features: [
      "Natural aroma",
      "Handcrafted",
      "Long-lasting burn",
      "Ideal for meditation and poojas",
    ],
  },
  {
    id: 12,
    name: "Tumbler",
    price: 79.99,
    originalPrice: 149,
    rating: 4.7,
    reviews: 92,
    inStock: true,
    category: "Devotional",
    description:
      "Sambarani Cones provide a long-lasting aromatic experience for your spiritual rituals. They are handcrafted with natural ingredients to purify your surroundings and elevate your meditation practice.",
    images: ["/tumbler.webp", "/tumbler.webp", "/tumbler.webp"],
    specifications: [
      { label: "Weight", value: "40g" },
      { label: "Height", value: "7cm" },
      { label: "Material", value: "Natural resin & herbs" },
      { label: "Burn Time", value: "40 minutes" },
    ],
    features: [
      "Natural aroma",
      "Handcrafted",
      "Long-lasting burn",
      "Ideal for meditation and poojas",
    ],
  },
  {
    id: 13,
    name: "Soap",
    price: 79.99,
    originalPrice: 149,
    rating: 4.7,
    reviews: 92,
    inStock: true,
    category: "Devotional",
    description:
      "Sambarani Cones provide a long-lasting aromatic experience for your spiritual rituals. They are handcrafted with natural ingredients to purify your surroundings and elevate your meditation practice.",
    images: ["/soap.webp", "/soap.webp", "/soap.webp"],
    specifications: [
      { label: "Weight", value: "40g" },
      { label: "Height", value: "7cm" },
      { label: "Material", value: "Natural resin & herbs" },
      { label: "Burn Time", value: "40 minutes" },
    ],
    features: [
      "Natural aroma",
      "Handcrafted",
      "Long-lasting burn",
      "Ideal for meditation and poojas",
    ],
  },
  {
    id: 14,
    name: "Brightning Scerum",
    price: 79.99,
    originalPrice: 149,
    rating: 4.7,
    reviews: 92,
    inStock: true,
    category: "Devotional",
    description:
      "Sambarani Cones provide a long-lasting aromatic experience for your spiritual rituals. They are handcrafted with natural ingredients to purify your surroundings and elevate your meditation practice.",
    images: ["/serum.webp", "/serum.webp", "/serum.webp"],
    specifications: [
      { label: "Weight", value: "40g" },
      { label: "Height", value: "7cm" },
      { label: "Material", value: "Natural resin & herbs" },
      { label: "Burn Time", value: "40 minutes" },
    ],
    features: [
      "Natural aroma",
      "Handcrafted",
      "Long-lasting burn",
      "Ideal for meditation and poojas",
    ],
  },
  
]

// Static export: generate all product pages
export async function generateStaticParams() {
  return mockProducts.map((product) => ({
    id: product.id.toString(),
  }))
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = mockProducts.find((p) => p.id.toString() === params.id)

  if (!product) return <div className="p-10 text-center text-foreground">Product not found</div>

  return (
    <ClientLayout>
      <div className="min-h-screen bg-background">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <a href="/" className="hover:text-foreground transition-colors">Home</a>
            <span>/</span>
            <a href="/products" className="hover:text-foreground transition-colors">Products</a>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </div>
        </div>

        {/* Product Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <ProductGallery images={product.images} productName={product.name} />
            <ProductDetails product={product} />
          </div>

          {/* Tabs Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2">
              <Card className="p-6 space-y-6">
                {/* Description */}
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-4">Description</h3>
                  <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                </div>

                {/* Features */}
                {/* <div className="border-t border-border pt-6">
                  <h3 className="text-xl font-semibold text-foreground mb-4">Features</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {product.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="text-primary mt-1">✓</span>
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div> */}

                {/* Specifications */}
                <div className="border-t border-border pt-6">
                  {/* <h3 className="text-xl font-semibold text-foreground mb-4">Specifications</h3> */}
                  {/* <div className="space-y-3">
                    {product.specifications.map((spec, idx) => (
                      <div key={idx} className="flex justify-between py-2 border-b border-border last:border-0">
                        <span className="text-muted-foreground">{spec.label}</span>
                        <span className="font-medium text-foreground">{spec.value}</span>
                      </div>
                    ))}
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
            productId={product.id}
            productRating={product.rating}
            productReviews={product.reviews}
          /> */}

          {/* Related Products */}
          {/* <RelatedProducts currentProductId={product.id} /> */}
        </div>
      </div>
    </ClientLayout>
  )
}
