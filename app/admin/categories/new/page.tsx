"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import AdminLayout from "@/components/admin/AdminLayout"
import { createCategory, type CategoryCreateData } from "@/lib/api/admin/categories"
import { slugify } from "@/lib/utils/slugify"
import { ArrowLeft } from "lucide-react"

export default function NewCategoryPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)

    const [formData, setFormData] = useState<CategoryCreateData>({
        name: '',
        slug: '',
        description: ''
    })

    const handleNameChange = (name: string) => {
        setFormData({
            ...formData,
            name,
            slug: slugify(name)
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (!formData.name.trim()) {
            setError('Category name is required')
            return
        }
        if (!formData.slug.trim()) {
            setError('Slug is required')
            return
        }

        try {
            setLoading(true)
            await createCategory(formData)
            setSuccessMessage('Category created successfully!')

            setTimeout(() => {
                router.push('/admin/categories')
            }, 1500)
        } catch (err: any) {
            console.error('Error creating category:', err)
            setError(err.response?.data?.message || 'Failed to create category')
        } finally {
            setLoading(false)
        }
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/categories"
                        className="p-2 hover:bg-secondary rounded-md transition-colors"
                        title="Back to Categories"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-primary">New Category</h1>
                        <p className="text-foreground/60 mt-1">Create a new product category</p>
                    </div>
                </div>

                {/* Success Message */}
                {successMessage && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-md text-green-600">
                        {successMessage}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
                            {error}
                        </div>
                    )}

                    <div className="bg-secondary p-6 rounded-lg border border-border">
                        <h2 className="text-xl font-semibold text-primary mb-4">Category Information</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => handleNameChange(e.target.value)}
                                    className="w-full px-3 py-2 border border-border rounded-md bg-background"
                                    placeholder="e.g., T-Shirts"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Slug <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    className="w-full px-3 py-2 border border-border rounded-md bg-background font-mono text-sm"
                                    placeholder="t-shirts"
                                    required
                                />
                                <p className="text-xs text-foreground/60 mt-1">Auto-generated from name, but can be edited</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Description <span className="text-foreground/60">(Optional)</span>
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-3 py-2 border border-border rounded-md bg-background"
                                    rows={4}
                                    placeholder="Describe this category..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex items-center justify-end gap-4">
                        <Link
                            href="/admin/categories"
                            className="px-6 py-3 border border-border rounded-md hover:bg-secondary transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                        >
                            {loading ? 'Creating...' : 'Create Category'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    )
}
