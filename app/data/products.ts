export interface Feature {
  title: string
  image: string
}

export interface Product {
 _id: string;
  name: string
  price: number
  description?: string
  image?: string
  mainImage?: string   // ✅ added
  quantity?: number
  category?: string
  features?: { title: string; image: string }[]
  descriptionItems?: { title: string; image: string }[]
}


export const products: Product[] = [
  { 
    _id: "1", 
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

]
