
import Image from "next/image"
import { Phone, Mail, Instagram, Facebook } from "lucide-react"

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

                        {/* Contact Information */}
                        <div className="pt-6 border-t border-border">
                            <h3 className="text-xl font-semibold text-primary mb-4">Get In Touch</h3>
                            <div className="space-y-3">
                                {/* Phone */}
                                <a
                                    href="tel:+94771234567"
                                    className="flex items-center gap-3 text-foreground/80 hover:text-sage transition-colors group"
                                >
                                    <div className="w-10 h-10 rounded-full bg-sage/10 flex items-center justify-center group-hover:bg-sage/20 transition-colors">
                                        <Phone className="w-5 h-5 text-sage" />
                                    </div>
                                    <span className="font-medium">+94 77 123 4567</span>
                                </a>

                                {/* Email */}
                                <a
                                    href="mailto:hello@rainvidz.com"
                                    className="flex items-center gap-3 text-foreground/80 hover:text-sage transition-colors group"
                                >
                                    <div className="w-10 h-10 rounded-full bg-sage/10 flex items-center justify-center group-hover:bg-sage/20 transition-colors">
                                        <Mail className="w-5 h-5 text-sage" />
                                    </div>
                                    <span className="font-medium">hello@rainvidz.com</span>
                                </a>
                            </div>

                            {/* Social Media */}
                            <div className="mt-6">
                                <p className="text-sm font-medium text-foreground/60 mb-3">Follow Us</p>
                                <div className="flex gap-3">
                                    <a
                                        href="https://instagram.com/rainvidz"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center text-white hover:scale-110 transition-transform duration-300 shadow-lg hover:shadow-xl"
                                    >
                                        <Instagram className="w-6 h-6" />
                                    </a>
                                    <a
                                        href="https://facebook.com/rainvidz"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-12 h-12 rounded-full bg-[#1877F2] flex items-center justify-center text-white hover:scale-110 transition-transform duration-300 shadow-lg hover:shadow-xl"
                                    >
                                        <Facebook className="w-6 h-6" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
