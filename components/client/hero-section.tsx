"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const heroSlides = [
  {
    id: 1,
    title: "Discover Premium Products",
    description: "Explore our curated collection of luxury items and everyday essentials. Quality meets affordability.",
    image: "/hero.jpg",
    cta: "Shop Now",
  },
  {
    id: 2,
    title: "Exclusive Deals & Offers",
    description: "Get up to 50% off on selected premium products. Limited time offers available now.",
    image: "/hero1.jpg",
    cta: "View Deals",
  },
  {
    id: 3,
    title: "New Arrivals",
    description: "Check out our latest collection of trending products. Be the first to own them.",
    image: "/hero2.jpg",
    cta: "Explore New",
  },
]

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)

  useEffect(() => {
    if (!autoPlay) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [autoPlay])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    setAutoPlay(false)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
    setAutoPlay(false)
  }

  const slide = heroSlides[currentSlide]

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-white py-20 md:py-32">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/50 rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-balance leading-tight">{slide.title}</h1>
              {/* <p className="text-lg md:text-xl text-slate-300 text-balance">{slide.description}</p> */}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-semibold w-full sm:w-auto">
                  {slide.cta}
                </Button>
              </Link>
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg font-semibold w-full sm:w-auto bg-transparent"
              >
                Learn More
              </Button>
            </div>

            {/* Stats */}
            {/* <div className="grid grid-cols-3 gap-4 pt-8">
              <div>
                <p className="text-2xl font-bold">10K+</p>
                <p className="text-sm text-slate-400">Products</p>
              </div>
              <div>
                <p className="text-2xl font-bold">50K+</p>
                <p className="text-sm text-slate-400">Customers</p>
              </div>
              <div>
                <p className="text-2xl font-bold">4.9★</p>
                <p className="text-sm text-slate-400">Rating</p>
              </div>
            </div> */}
          </div>

          {/* Right Image */}
          <div className="relative h-96 md:h-full">
            <img
              src={slide.image || "/placeholder.svg"}
              alt={slide.title}
              className="w-full h-full object-cover rounded-2xl shadow-2xl"
            />
          </div>
        </div>

        {/* Carousel Controls */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <button onClick={prevSlide} className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Slide Indicators */}
          <div className="flex gap-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentSlide(index)
                  setAutoPlay(false)
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentSlide ? "bg-white w-8" : "bg-white/50"
                }`}
              />
            ))}
          </div>

          <button onClick={nextSlide} className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  )
}
