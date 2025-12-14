"use client"

import { useRouter, useParams } from "next/navigation"
import { useState, useEffect } from "react"
import AdminLayout from "@/components/admin/AdminLayout"
import ProductForm from "@/components/admin/ProductForm"
import { updateProduct, getProductById, type ProductCreateData } from "@/lib/api/admin/products"
import type { Product } from "@/lib/api/products"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function EditProductPage() {
    const router = useRouter()
    const params = useParams()
    const productId = params.id as string

    const [product, setProduct] = useState<Product | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)

    useEffect(() => {
        fetchProduct()
    }, [productId])

    const fetchProduct = async () => {
        try {
            setLoading(true)
            const response = await getProductById(productId)
            setProduct(response.data)
        } catch (err: any) {
            console.error("Error fetching product:", err)
            setError(err.response?.data?.message || "Failed to load product")
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (data: ProductCreateData) => {
        try {
            await updateProduct(productId, data)
            setSuccessMessage("Product updated successfully!")

            // Redirect to products list after 1.5 seconds
            setTimeout(() => {
                router.push("/admin/products")
            }, 1500)
        } catch (error) {
            // Error is handled by ProductForm
            throw error
        }
    }

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-64">
                    <p className="text-foreground/60">Loading product...</p>
                </div>
            </AdminLayout>
        )
    }

    if (error || !product) {
        return (
            <AdminLayout>
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/admin/products"
                            className="p-2 hover:bg-secondary rounded-md transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <h1 className="text-3xl font-serif font-bold text-primary">Product Not Found</h1>
                    </div>
                    <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
                        {error || "The product you're looking for doesn't exist."}
                    </div>
                    <Link
                        href="/admin/products"
                        className="inline-block px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                    >
                        Back to Products
                    </Link>
                </div>
            </AdminLayout>
        )
    }

    // Transform product data to match form structure
    const initialData: Partial<ProductCreateData> = {
        name: product.name,
        slug: product.slug,
        productCode: product.productCode,
        description: product.description,
        price: product.price,
        salePrice: product.salePrice,
        category: product.category?._id || "",
        collection: product.collection?._id || "",
        stockStatus: product.stockStatus,
        isNewArrival: product.isNewArrival,
        isFeatured: product.isFeatured,
        images: product.images || [],
        variants: product.variants || []
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/products"
                        className="p-2 hover:bg-secondary rounded-md transition-colors"
                        title="Back to Products"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-primary">Edit Product</h1>
                        <p className="text-foreground/60 mt-1">{product.name}</p>
                    </div>
                </div>

                {/* Success Message */}
                {successMessage && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-md text-green-600">
                        {successMessage}
                    </div>
                )}

                {/* Product Form */}
                <ProductForm
                    initialData={initialData}
                    onSubmit={handleSubmit}
                    submitLabel="Update Product"
                />
            </div>
        </AdminLayout>
    )
}
