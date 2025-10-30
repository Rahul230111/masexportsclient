"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { Product } from "../../data/products"
import { useRef, useState } from "react"
import { ClientHeader } from "@/components/client/client-header"
import { Lora } from "next/font/google"
import { useCart } from "@/context/cart-context"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ShoppingCart, Heart } from "lucide-react"
import { useRouter } from "next/navigation"


interface Props {
  product: Product
}
const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "600", "700"], // you can adjust if you want bolder or lighter
})
export default function ProductDetails({ product }: Props) {
    const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const [merged, setMerged] = useState(false)
  const [quantity, setQuantity] = useState<number>(1)
  const { items, addToCart } = useCart()
  
   
const inCart = items.some(i => i.id === product.id)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  // --- Scroll-based animations after merge ---
  const scale = useTransform(scrollYProgress, [0, 0.33, 0.66, 1.5], [1.3, 1.2, 1, 2])
  const x = useTransform(scrollYProgress, [0, 0.33, 0.66, 1], [0, 0, 300, 0])
  const rotate = useTransform(scrollYProgress, [0, 0.33, 0.66, 1], [0, 0, -25, 0])
  const opacity = useTransform(scrollYProgress, [0, 0.05, 0.33], [1, 1, 1])

  // --- Center text animation for Section 1 ---
  const textOpacity = useTransform(scrollYProgress, [0, 0.1, 0.1, 0.1], [1, 0.1, 0.1, 0.1])
  const textScale = useTransform(scrollYProgress, [0, 0.5], [2, 2])

  // Landing positions
  const landingScale = 2

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>, product: Product) => {
  e.preventDefault()
  addToCart({
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.image,
    quantity, // store selected quantity
  })
}
const handleBuyNow = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.preventDefault()

  // Check if item already exists in cart
  const inCart = items.some((i) => i.id === product.id)

  // Only add to cart if it's not already there
  if (!inCart) {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
       quantity: 1, // store selected quantity
    })
  }

  // Redirect to cart page
  router.push("/cart")
}
return (
    <div ref={containerRef} className="relative bg-black min-h-[400vh]">
      <ClientHeader />

      {/* Landing animation */}
     {!merged && (
  <motion.div
    className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none flex flex-col items-center"
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: landingScale, opacity: 1 }}
    transition={{ duration: 1.5, ease: "easeOut" }}
    onAnimationComplete={() => setMerged(true)}
  >
    {/* Bottle / jar body only */}
    <motion.img
      src={product.image}
      alt={product.name}
      className="w-40 md:w-56 object-contain drop-shadow-2xl"
    />
  </motion.div>
)}

{/* After merge: move together */}
{merged && (
  <motion.div
    className="fixed top-[60%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
    style={{ scale, x, rotate, opacity }}
  >
    {/* Bottle / jar body only */}
    <motion.img
      src={product.image}
      alt={product.name}
      className="w-40 md:w-56 object-contain drop-shadow-2xl"
    />
  </motion.div>
)}


      {/* Section 1 */}
<div
  className="relative h-[200vh] w-full"
  style={{
    backgroundImage: "url(/bg1.jpg)",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
  }}
>
  <div className="absolute inset-0 bg-black/40" />

  {/* Features Section */}
  {product.features && (
  <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 flex justify-between px-5 md:px-10 z-20">
    {/* Left column */}
    <div className="flex flex-col gap-25">
      {product.features.slice(0, 2).map((feature, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: index * 0.2 }}
          className="flex items-center gap-4 md:gap-6 flex-row"
        >
          <img
            src={feature.image}
            alt={feature.title}
            className="w-22 h-22 md:w-32 md:h-32 rounded-full object-cover shadow-lg flex-shrink-0"
          />
          <p className="bg-black/60 px-4 py-2 md:py-5 rounded-xl text-white text-sm sm:text-base md:text-lg font-medium shadow-lg max-w-xs">
            {feature.title}
          </p>
        </motion.div>
      ))}
    </div>

    {/* Right column */}
    <div className="flex flex-col gap-25">
      {product.features.slice(2, 4).map((feature, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: index * 0.2 }}
          className="flex items-center gap-4 md:gap-6 flex-row-reverse"
        >
          <img
            src={feature.image}
            alt={feature.title}
            className="w-22 h-22 md:w-32 md:h-32 rounded-full object-cover shadow-lg flex-shrink-0"
          />
          <p className="bg-black/60 px-4 py-2 md:py-5 rounded-xl text-white text-sm sm:text-base md:text-lg font-medium shadow-lg max-w-xs">
            {feature.title}
          </p>
        </motion.div>
      ))}
    </div>
  </div>
)}


  {/* Center fading text */}
  <motion.div
    className={`fixed top-[44%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 text-5xl md:text-8xl font-bold text-center pointer-events-none select-none ${lora.className}`}
    style={{
      opacity: textOpacity,
      scale: textScale,
      color: "#888887",
    }}
  >
    E-commerce
  </motion.div>
</div>


      {/* Section 2 */}
      <div
  className="relative h-[150vh] w-full bg-cover bg-center bg-fixed"
  style={{ backgroundImage: "url(/bg2.jpg)" }}
>
  {/* Overlay */}
  <div className="absolute inset-0 bg-black/30" />

  {/* Fixed hand image on the right */}
  <img src="/hand.png" alt="Side Image" className="absolute top-1/2 right-0 -translate-y-1/2 w-32 md:w-180 object-contain" style={{ top: "60%" }} />

  {/* Zig-Zag Description Section on the LEFT */}
  {product.descriptionItems && (
    <div className="absolute top-1/2 left-5 md:left-10 -translate-y-1/2 flex flex-col gap-15 md:mt-10 z-10">
      {product.descriptionItems.map((item, index) => {
        const isLeft = index % 2 === 0 // controls zig-zag
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: isLeft ? -100 : 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            className="flex items-center gap-4 md:gap-6 justify-start md:justify-start"
          >
            {isLeft && (
              <img
                src={item.image}
                alt={item.title}
                className="w-10 h-10 md:w-22 md:h-22 rounded-full object-cover shadow-lg"
              />
            )}

            <p className="bg-black/60 px-4 py-2 md:py-5 rounded-xl text-white text-sm sm:text-base md:text-lg font-medium shadow-lg max-w-xs">
              {item.title}
            </p>

            {!isLeft && (
              <img
                src={item.image}
                alt={item.title}
                className="w-10 h-10 md:w-22 md:h-22 rounded-full object-cover shadow-lg"
              />
            )}
          </motion.div>
        )
      })}
    </div>
  )}
</div>


      {/* Section 3 */}
      <div
        className="relative h-screen w-full"
        style={{
          backgroundImage: "url(/bg3.jpeg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/35" />
        <div
  className={`absolute top-35 left-1/2 -translate-x-1/2 z-40 text-gray-200 text-2xl sm:text-3xl md:text-6xl font-bold text-center select-none ${lora.className}`}
>
  {product.name}
</div>


        {/* Right-side button & info group */}
        <div className="absolute top-1/2 right-50 -translate-y-1/2 flex flex-col items-end gap-5 z-50 text-white">
          {/* Price & Quantity */}
          <div className="flex flex-col items-end bg-black/60 px-10 py-4 rounded-2xl shadow-lg">
            {/* <p className="text-xl font-semibold mb-2 text-center w-full">{product.name}</p> */}

            <div className="flex items-center gap-8">
              {/* Quantity control */}
              <div className="flex items-center bg-gray-800 rounded-full px-3 py-1">
                <button
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  className="px-2 text-xl font-bold"
                >
                  −
                </button>
                <span className="px-4 text-lg font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity((prev) => prev + 1)}
                  className="px-2 text-xl font-bold"
                >
                  +
                </button>
              </div>

              {/* Price */}
              <p className="text-xl font-semibold">
                ₹{(product.price * quantity).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <Button
  size="lg" // increase size
  className={`bg-primary hover:bg-primary/90 text-primary-foreground gap-3 px-6 py-4 text-lg ${inCart ? 'opacity-50 cursor-not-allowed' : ''}`}
  onClick={(e) => !inCart && handleAddToCart(e, product)}
  disabled={inCart}
>
  <ShoppingCart className="w-5 h-5" />
  <span className="hidden sm:inline">{inCart ? "Added" : "Add to Cart"}</span>
</Button>

            <Button
  size="lg"
  className="px-6 py-4 bg-green-600 hover:bg-green-700 text-white text-lg font-semibold rounded-full shadow-lg transition-all duration-300"
  onClick={handleBuyNow}
>
  Buy Now
</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
