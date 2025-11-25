"use client"

import ProductCard from "./product-card"

const shopProducts = [
    {
        id: 11,
        name: "Bohemian Wrap Dress",
        price: "$135",
        category: "Dresses",
        image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80",
        hoverImage: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80",
    },
    {
        id: 12,
        name: "Linen Palazzo Pants",
        price: "$98",
        category: "Bottoms",
        image: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&q=80",
        hoverImage: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&q=80",
    },
    {
        id: 13,
        name: "Embroidered Tunic",
        price: "$115",
        category: "Tops",
        image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=80",
        hoverImage: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=80",
    },
    {
        id: 14,
        name: "Flowy Maxi Skirt",
        price: "$92",
        category: "Bottoms",
        image: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800&q=80",
        hoverImage: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800&q=80",
    },
    {
        id: 15,
        name: "Crochet Beach Cover",
        price: "$78",
        category: "Beachwear",
        image: "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=800&q=80",
        hoverImage: "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=800&q=80",
    },
    {
        id: 16,
        name: "Suede Fringe Bag",
        price: "$165",
        category: "Accessories",
        image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80",
        hoverImage: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80",
    }
]

export default function ShopSection({ onAddToCart }: { onAddToCart: () => void }) {
    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background border-t border-border/40">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-4">Shop the Look</h2>
                    <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
                        Complete your wardrobe with these handpicked essentials
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {shopProducts.map((product) => (
                        <div key={product.id}>
                            <ProductCard product={product} onAddToCart={onAddToCart} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
