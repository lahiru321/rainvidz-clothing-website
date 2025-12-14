"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import AdminLayout from "@/components/admin/AdminLayout"
import ProductForm from "@/components/admin/ProductForm"
import { createProduct, type ProductCreateData } from "@/lib/api/admin/products"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewProductPage() {
    const router = useRouter()
    const [successMessage, setSuccessMessage] = useState<string | null>(null)

    const handleSubmit = async (data: ProductCreateData) => {
        try {
            const response = await createProduct(data)
            setSuccessMessage("Product created successfully!")

            // Redirect to products list after 1.5 seconds
            setTimeout(() => {
                router.push("/admin/products")
            }, 1500)
        } catch (error) {
            // Error is handled by ProductForm
            throw error
        }
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
                        <h1 className="text-3xl font-serif font-bold text-primary">Create New Product</h1>
                        <p className="text-foreground/60 mt-1">Add a new product to your catalog</p>
                    </div>
                </div>

                {/* Success Message */}
                {successMessage && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-md text-green-600">
                        {successMessage}
                    </div>
                )}

                {/* Product Form */}
                <ProductForm onSubmit={handleSubmit} submitLabel="Create Product" />
            </div>
        </AdminLayout>
    )
}
