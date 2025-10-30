import { products, Product } from "../../data/products"
import ProductDetails from "./ProductDetails"

interface ProductPageProps {
  params: { id: string }
}

// For static export
export async function generateStaticParams() {
  return products.map((p: Product) => ({ id: p.id.toString() }))
}

export default function ProductPage({ params }: ProductPageProps) {
  
  const product = products.find((p) => p.id.toString() === params.id)
  if (!product) return <div>Product not found</div>

  // Pass product to client component
  return <ProductDetails product={product} />
}
