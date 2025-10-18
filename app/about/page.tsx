"use client"

import { ClientLayout } from "@/components/client/client-layout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle, Users, Award, Zap } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  return (
    <ClientLayout>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 py-12 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">About PimPom Store</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Discover our story, mission, and commitment to delivering premium products and exceptional customer
              service.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Our Story */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-4">Our Story</h2>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Founded in 2020, PimPom Store began with a simple vision: to bring premium, high-quality products to
                customers worldwide. What started as a small operation has grown into a trusted brand serving thousands
                of satisfied customers.
              </p>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                We believe that everyone deserves access to premium products without compromising on quality or
                affordability. Our carefully curated collection reflects our commitment to excellence in every aspect.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Today, we continue to innovate and expand our offerings, always keeping our customers at the heart of
                everything we do.
              </p>
            </div>
            <div className="bg-muted rounded-lg h-96 flex items-center justify-center">
              <img src="/about-us-team.jpg" alt="Our Team" className="w-full h-full object-cover rounded-lg" />
            </div>
          </div>

          {/* Mission & Values */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <Card className="p-8 bg-card">
              <h3 className="text-2xl font-bold text-foreground mb-4">Our Mission</h3>
              <p className="text-muted-foreground leading-relaxed">
                To provide exceptional products and services that enhance the lives of our customers, while maintaining
                the highest standards of quality, integrity, and customer satisfaction.
              </p>
            </Card>
            <Card className="p-8 bg-card">
              <h3 className="text-2xl font-bold text-foreground mb-4">Our Values</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Quality: Premium products that exceed expectations</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Integrity: Honest and transparent business practices</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Customer Focus: Your satisfaction is our priority</span>
                </li>
              </ul>
            </Card>
          </div>

          {/* Why Choose Us */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Why Choose PimPom Store?</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="p-6 text-center">
                <Award className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">Premium Quality</h3>
                <p className="text-sm text-muted-foreground">
                  Carefully selected products that meet our high standards
                </p>
              </Card>
              <Card className="p-6 text-center">
                <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">Expert Support</h3>
                <p className="text-sm text-muted-foreground">Dedicated customer service team ready to help</p>
              </Card>
              <Card className="p-6 text-center">
                <Zap className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">Fast Shipping</h3>
                <p className="text-sm text-muted-foreground">Quick and reliable delivery to your doorstep</p>
              </Card>
              <Card className="p-6 text-center">
                <CheckCircle className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">Satisfaction Guarantee</h3>
                <p className="text-sm text-muted-foreground">30-day money-back guarantee on all products</p>
              </Card>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-primary/10 rounded-lg p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Ready to Shop?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Explore our collection of premium products and experience the PimPom Store difference.
            </p>
            <Link href="/products">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Browse Products
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </ClientLayout>
  )
}
