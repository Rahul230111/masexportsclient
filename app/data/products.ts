export interface Feature {
  title: string
  image: string
}

export interface Product {
  id: number
  name: string
  price: number
  image: string   // bottle
  
  descriptionItems?: Feature[]
  features?: Feature[]   // new features array
}

export const products: Product[] = [
  { 
    id: 1, 
    name: "Sambarani Stick", 
    price: 99, 
    image: "/creame.png", 
    descriptionItems: [
      { title: "High Quality & Elegant Design Crafted for Premium Experience", image: "/coin1.png" },
      { title: "Made from Premium Ingredients to Ensure Top-notch Performance", image: "/coin2.png" },
      { title: "Eco-Friendly and Sustainable Packaging for a Greener Planet", image: "/coin3.png" },
      { title: "Dedicated 24/7 Customer Support to Assist You Anytime", image: "/coin4.png" },
    ],
    features: [
      { title: "High Quality & Elegant Design Crafted for Premium Experience", image: "/coin1.png" },
      { title: "Made from Premium Ingredients to Ensure Top-notch Performance", image: "/coin2.png" },
      { title: "Eco-Friendly and Sustainable Packaging for a Greener Planet", image: "/coin3.png" },
      { title: "Dedicated 24/7 Customer Support to Assist You Anytime", image: "/coin4.png" },
    ]
  },
  { 
    id: 2, 
    name: "Sambarani Cup", 
    price: 49, 
    image: "/boxcones.png", 
    capImage: "/cap2.png",
    descriptionItems: [
      { title: "High Quality & Elegant Design Crafted for Premium Experience", image: "/coin1.png" },
      { title: "Made from Premium Ingredients to Ensure Top-notch Performance", image: "/coin2.png" },
      { title: "Eco-Friendly and Sustainable Packaging for a Greener Planet", image: "/coin3.png" },
      { title: "Dedicated 24/7 Customer Support to Assist You Anytime", image: "/coin4.png" },
    ],
    features: [
      { title: "High Quality & Elegant Design Crafted for Premium Experience", image: "/coin1.png" },
      { title: "Made from Premium Ingredients to Ensure Top-notch Performance", image: "/coin2.png" },
      { title: "Eco-Friendly and Sustainable Packaging for a Greener Planet", image: "/coin3.png" },
      { title: "Dedicated 24/7 Customer Support to Assist You Anytime", image: "/coin4.png" },
    ]
  },
  { 
    id: 3, 
    name: "Sambarani Cone", 
    price: 79, 
    image: "/premium-product-showcase-3.jpg", 
    capImage: "/cap3.png",
    descriptionItems: [
      { title: "High Quality & Elegant Design Crafted for Premium Experience", image: "/coin1.png" },
      { title: "Made from Premium Ingredients to Ensure Top-notch Performance", image: "/coin2.png" },
      { title: "Eco-Friendly and Sustainable Packaging for a Greener Planet", image: "/coin3.png" },
      { title: "Dedicated 24/7 Customer Support to Assist You Anytime", image: "/coin4.png" },
    ],
    features: [
      { title: "High Quality & Elegant Design Crafted for Premium Experience", image: "/coin1.png" },
      { title: "Made from Premium Ingredients to Ensure Top-notch Performance", image: "/coin2.png" },
      { title: "Eco-Friendly and Sustainable Packaging for a Greener Planet", image: "/coin3.png" },
      { title: "Dedicated 24/7 Customer Support to Assist You Anytime", image: "/coin4.png" },
    ]
  },
]
