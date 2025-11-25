"use client"
import ProductCard from "./product-card"

const products = [
  {
    id: 1,
    name: "Silk Minimalist Blouse",
    price: "$189",
    category: "Tops",
    image: "/elegant-silk-blouse-luxury-fashion.jpg",
    hoverImage: "/silk-blouse-detail-view-luxury.jpg",
  },
  {
    id: 2,
    name: "Tailored Wool Trousers",
    price: "$249",
    category: "Bottoms",
    image: "/tailored-wool-trousers-premium-quality.jpg",
    hoverImage: "/wool-trousers-fitting-view.jpg",
  },
  {
    id: 3,
    name: "Cashmere Luxury Sweater",
    price: "$349",
    category: "Knitwear",
    image: "/cashmere-sweater-luxury-knit.jpg",
    hoverImage: "/cashmere-sweater-detail-fabric.jpg",
  },
  {
    id: 4,
    name: "Premium Leather Jacket",
    price: "$599",
    category: "Outerwear",
    image: "/premium-leather-jacket-black.jpg",
    hoverImage: "/leather-jacket-detail-view.jpg",
  },
  {
    id: 5,
    name: "Linen Summer Dress",
    price: "$229",
    category: "Dresses",
    image: "/linen-summer-dress-elegant.jpg",
    hoverImage: "/summer-dress-fitted-view.jpg",
  },
  {
    id: 6,
    name: "Designer Ankle Boots",
    price: "$449",
    category: "Footwear",
    image: "/designer-ankle-boots-luxury.jpg",
    hoverImage: "/ankle-boots-side-view.jpg",
  },
  {
    id: 7,
    name: "Classic White Shirt",
    price: "$159",
    category: "Basics",
    image: "/classic-white-shirt-premium.jpg",
    hoverImage: "/white-shirt-tailored-fit.jpg",
  },
  {
    id: 8,
    name: "Structured Handbag",
    price: "$529",
    category: "Accessories",
    image: "/placeholder.svg?height=400&width=300",
    hoverImage: "/placeholder.svg?height=400&width=300",
  },
]

export default function ProductGrid({ onAddToCart }: { onAddToCart: () => void }) {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-4">Featured Collection</h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Handpicked pieces for the modern fashion enthusiast
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
              <ProductCard product={product} onAddToCart={onAddToCart} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
