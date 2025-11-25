"use client"

const collections = [
    {
        id: 1,
        title: "Joseph Ribkoff",
        description: "mit Großstadtflair",
        image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80",
    },
    {
        id: 2,
        title: "Woden",
        description: "Nachhaltige Sneaker mit skandinavischem Design und modernem Stil.",
        image: "https://images.unsplash.com/photo-1540221652346-e5dd6b50f3e7?w=800&q=80",
    },
    {
        id: 3,
        title: "Natural World",
        description: "Zeitlose Taschen für moderne Individualisten",
        image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80",
    }
]

export default function FeaturedCollection() {
    return (
        <section className="w-full py-12 px-4 md:px-8 bg-background">
            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px]">
                {collections.map((collection) => (
                    <div
                        key={collection.id}
                        className="relative group overflow-hidden h-full w-full cursor-pointer"
                    >
                        {/* Background Image */}
                        <img
                            src={collection.image}
                            alt={collection.title}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />

                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-80" />

                        {/* Content */}
                        <div className="absolute bottom-0 left-0 p-8 w-full text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                            <h3 className="text-3xl md:text-4xl font-bold mb-2">
                                {collection.title}
                            </h3>
                            <p className="text-sm md:text-base text-gray-200 leading-relaxed max-w-[90%]">
                                {collection.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer Text (Optional based on image) */}
            <div className="text-center mt-16">
                <p className="text-lg text-gray-600">Regenfeste Rucksäcke & Taschen</p>
            </div>
        </section>
    )
}
