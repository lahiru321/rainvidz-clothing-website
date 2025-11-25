
export interface Product {
    id: number
    name: string
    price: string
    category: string
    image: string
    hoverImage: string
    collection?: string
    isNew?: boolean
    colors?: string[]
    sizes?: string[]
}

export interface Collection {
    name: string
    slug: string
    description: string
}

export const products: Product[] = [
    // Existing Collection Products
    {
        id: 1,
        name: "Novela Tee - Black",
        price: "Rs 3,290",
        category: "Tops",
        image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=80",
        hoverImage: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=80&sat=-100",
        collection: "summer-collection",
        colors: ["Black", "White"],
        sizes: ["S", "M", "L"]
    },
    {
        id: 2,
        name: "Novela Tee - Brown",
        price: "Rs 3,290",
        category: "Tops",
        image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80",
        hoverImage: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80&sat=-100",
        collection: "winter-collection",
        colors: ["Brown", "Beige"],
        sizes: ["M", "L", "XL"]
    },
    {
        id: 3,
        name: "Gia Tee - White",
        price: "Rs 2,990",
        category: "Tops",
        image: "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=800&q=80",
        hoverImage: "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=800&q=80&sat=-100",
        collection: "summer-collection",
        colors: ["White"],
        sizes: ["XS", "S", "M"]
    },
    {
        id: 4,
        name: "Kylie Tee - White",
        price: "Rs 2,990",
        category: "Tops",
        image: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&q=80",
        hoverImage: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&q=80&sat=-100",
        collection: "winter-collection",
        colors: ["White", "Black"],
        sizes: ["S", "M"]
    },
    // New Arrivals
    {
        id: 5,
        name: "Boho Maxi Dress",
        price: "$129",
        category: "Dresses",
        image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80",
        hoverImage: "https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=800&q=80",
        isNew: true,
        colors: ["Red", "Blue"],
        sizes: ["S", "M", "L"]
    },
    {
        id: 6,
        name: "Linen Wide Leg Pants",
        price: "$89",
        category: "Bottoms",
        image: "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?w=800&q=80",
        hoverImage: "https://images.unsplash.com/photo-1594631252976-72920f599419?w=800&q=80",
        isNew: true,
        colors: ["Beige", "White"],
        sizes: ["M", "L"]
    },
    {
        id: 7,
        name: "Crochet Summer Top",
        price: "$65",
        category: "Tops",
        image: "https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=800&q=80",
        hoverImage: "https://images.unsplash.com/photo-1617019114610-3367369f76f4?w=800&q=80",
        isNew: true,
        colors: ["Cream"],
        sizes: ["XS", "S"]
    },
    {
        id: 8,
        name: "Embroidered Peasant Blouse",
        price: "$95",
        category: "Tops",
        image: "https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?w=800&q=80",
        hoverImage: "https://images.unsplash.com/photo-1564584217180-2271feaeb3c5?w=800&q=80",
        isNew: true,
        colors: ["White", "Blue"],
        sizes: ["S", "M", "L", "XL"]
    },
    {
        id: 9,
        name: "Floral Wrap Skirt",
        price: "$79",
        category: "Bottoms",
        image: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800&q=80",
        hoverImage: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800&q=80",
        isNew: true,
        colors: ["Pink", "Green"],
        sizes: ["S", "M"]
    },
    {
        id: 10,
        name: "Woven Straw Hat",
        price: "$45",
        category: "Accessories",
        image: "https://images.unsplash.com/photo-1521320226546-87b106956014?w=800&q=80",
        hoverImage: "https://images.unsplash.com/photo-1521320226546-87b106956014?w=800&q=80",
        isNew: true,
        colors: ["Beige"],
        sizes: ["One Size"]
    }
]

export const collections: Collection[] = [
    {
        name: "Summer Collection",
        slug: "summer-collection",
        description: "Light and breezy pieces for the warm season."
    },
    {
        name: "Winter Collection",
        slug: "winter-collection",
        description: "Cozy and warm styles for the cold days."
    }
]

export function getCollectionBySlug(slug: string) {
    return collections.find(c => c.slug === slug)
}

export function getProductsByCollection(slug: string) {
    return products.filter(p => p.collection === slug)
}

export function getNewArrivals() {
    return products.filter(p => p.isNew)
}

export function getAllProducts() {
    return products
}

export interface FilterState {
    sizes: string[]
    colors: string[]
    types: string[]
}

export type SortOption = 'featured' | 'availability' | 'best-selling' | 'price-asc' | 'price-desc'

export function filterAndSortProducts(
    products: Product[],
    filters: FilterState,
    sort: SortOption
): Product[] {
    let filtered = [...products]

    // Apply Filters
    if (filters.sizes.length > 0) {
        filtered = filtered.filter(p => p.sizes?.some(s => filters.sizes.includes(s)))
    }
    if (filters.colors.length > 0) {
        filtered = filtered.filter(p => p.colors?.some(c => filters.colors.includes(c)))
    }
    if (filters.types.length > 0) {
        filtered = filtered.filter(p => filters.types.includes(p.category))
    }

    // Apply Sort
    // Note: Since prices are strings like "$129" or "Rs 3,290", we need to parse them for sorting.
    // This is a simple parser for demonstration.
    const parsePrice = (p: string) => parseFloat(p.replace(/[^0-9.]/g, ''))

    switch (sort) {
        case 'price-asc':
            filtered.sort((a, b) => parsePrice(a.price) - parsePrice(b.price))
            break
        case 'price-desc':
            filtered.sort((a, b) => parsePrice(b.price) - parsePrice(a.price))
            break
        // 'featured', 'availability', 'best-selling' would typically rely on other fields
        // For now, we'll leave them as default order or implement random shuffle if needed
        default:
            break
    }

    return filtered
}
