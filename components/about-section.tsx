
import Image from "next/image"

export default function AboutSection() {
    return (
        <section id="about" className="py-24 bg-secondary/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Image Side */}
                    <div className="relative aspect-[4/5] lg:aspect-square overflow-hidden rounded-lg">
                        <Image
                            src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80"
                            alt="Bohemian fashion lifestyle"
                            fill
                            className="object-cover hover:scale-105 transition-transform duration-700"
                        />
                    </div>

                    {/* Content Side */}
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary">
                                Our Story
                            </h2>
                            <div className="w-20 h-1 bg-accent"></div>
                        </div>

                        <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                            <p>
                                Born from a love for the free-spirited and the unconventional, Rainvidz is more than just a clothing brand—it's a celebration of individuality. We believe in fashion that flows with you, embracing natural fabrics, earthy tones, and timeless silhouettes.
                            </p>
                            <p>
                                Our journey began in small artisan markets, collecting pieces that told a story. Today, we curate collections that blend bohemian elegance with modern comfort, ensuring every piece feels as good as it looks.
                            </p>
                            <p>
                                Sustainability is at our heart. We work closely with ethical manufacturers to bring you clothing that honors both the maker and the wearer.
                            </p>
                        </div>

                        <div className="pt-4">
                            <button className="border-2 border-primary text-primary px-8 py-3 font-medium hover:bg-primary hover:text-primary-foreground transition-colors duration-300 uppercase tracking-widest text-sm">
                                Read More
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
