"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import AdminLayout from "@/components/admin/AdminLayout"
import { getCategories, type Category } from "@/lib/api/categories"
import { updateCategory, deleteCategory, type CategoryCreateData } from "@/lib/api/admin/categories"
import { slugify } from "@/lib/utils/slugify"
import { ArrowLeft, Trash2 } from "lucide-react"

export default function EditCategoryPage() {
    const router = useRouter()
    const params = useParams()
    const categoryId = params.id as string

    const [category, setCategory] = useState<Category | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)

    const [formData, setFormData] = useState<CategoryCreateData>({
        name: '',
        slug: '',
        description: ''
    })

    useEffect(() => {
        fetchCategory()
    }, [categoryId])

    const fetchCategory = async () => {
        try {
            setLoading(true)
            const response = await getCategories()
            const cat = response.data?.find((c: Category) => c._id === categoryId)

            if (!cat) {
                setError('Category not found')
                return
            }

            setCategory(cat)
            setFormData({
                name: cat.name,
                slug: cat.slug,
                description: cat.description || ''
            })
        } catch (err: any) {
            console.error('Error fetching category:', err)
            setError('Failed to load category')
        } finally {
            setLoading(false)
        }
    }

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
            setSaving(true)
            await updateCategory(categoryId, formData)
            setSuccessMessage('Category updated successfully!')

            setTimeout(() => {
                router.push('/admin/categories')
            }, 1500)
        } catch (err: any) {
            console.error('Error updating category:', err)
            setError(err.response?.data?.message || 'Failed to update category')
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async () => {
        if (!confirm(`Are you sure you want to delete "${category?.name}"? This action cannot be undone.`)) {
            return
        }

        try {
            await deleteCategory(categoryId)
            alert('Category deleted successfully!')
            router.push('/admin/categories')
        } catch (err: any) {
            console.error('Error deleting category:', err)
            alert(err.response?.data?.message || 'Failed to delete category')
        }
    }

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-64">
                    <p className="text-foreground/60">Loading category...</p>
                </div>
            </AdminLayout>
        )
    }

    if (error && !category) {
        return (
            <AdminLayout>
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/categories" className="p-2 hover:bg-secondary rounded-md transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <h1 className="text-3xl font-serif font-bold text-primary">Category Not Found</h1>
                    </div>
                    <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
                        {error}
                    </div>
                    <Link href="/admin/categories" className="inline-block px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90">
                        Back to Categories
                    </Link>
                </div>
            </AdminLayout>
        )
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/categories" className="p-2 hover:bg-secondary rounded-md transition-colors" title="Back to Categories">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-serif font-bold text-primary">Edit Category</h1>
                            <p className="text-foreground/60 mt-1">{category?.name}</p>
                        </div>
                    </div>
                    <button onClick={handleDelete} className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors">
                        <Trash2 className="w-4 h-4" />
                        Delete
                    </button>
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
                        <Link href="/admin/categories" className="px-6 py-3 border border-border rounded-md hover:bg-secondary transition-colors">
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                        >
                            {saving ? 'Saving...' : 'Update Category'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    )
}
