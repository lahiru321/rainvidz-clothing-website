"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import AdminLayout from "@/components/admin/AdminLayout"
import { getCategories, type Category } from "@/lib/api/categories"
import { deleteCategory } from "@/lib/api/admin/categories"
import { Plus, Edit, Trash2, Search } from "lucide-react"

export default function CategoriesPage() {
    const router = useRouter()
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        fetchCategories()
    }, [])

    const fetchCategories = async () => {
        try {
            setLoading(true)
            const response = await getCategories()
            setCategories(response.data || [])
        } catch (err: any) {
            console.error('Error fetching categories:', err)
            setError('Failed to load categories')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
            return
        }

        try {
            await deleteCategory(id)
            alert('Category deleted successfully!')
            fetchCategories() // Refresh list
        } catch (err: any) {
            console.error('Error deleting category:', err)
            alert(err.response?.data?.message || 'Failed to delete category')
        }
    }

    const filteredCategories = categories.filter(cat =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.slug.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-primary">Categories</h1>
                        <p className="text-foreground/60 mt-1">Manage product categories</p>
                    </div>
                    <Link
                        href="/admin/categories/new"
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Add Category
                    </Link>
                </div>

                {/* Search */}
                <div className="bg-secondary p-4 rounded-lg border border-border">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search categories..."
                            className="w-full pl-10 pr-3 py-2 border border-border rounded-md bg-background text-sm"
                        />
                    </div>
                </div>

                {/* Categories Table */}
                <div className="bg-secondary rounded-lg border border-border overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center text-foreground/60">
                            Loading categories...
                        </div>
                    ) : error ? (
                        <div className="p-8 text-center text-red-500">
                            {error}
                        </div>
                    ) : filteredCategories.length === 0 ? (
                        <div className="p-8 text-center text-foreground/60">
                            {searchQuery ? 'No categories found matching your search.' : 'No categories yet. Create your first category!'}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-background">
                                    <tr>
                                        <th className="text-left py-3 px-4 font-medium text-foreground/60">Name</th>
                                        <th className="text-left py-3 px-4 font-medium text-foreground/60">Slug</th>
                                        <th className="text-left py-3 px-4 font-medium text-foreground/60">Description</th>
                                        <th className="text-right py-3 px-4 font-medium text-foreground/60">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredCategories.map((category) => (
                                        <tr key={category._id} className="border-t border-border hover:bg-background">
                                            <td className="py-3 px-4 font-medium">{category.name}</td>
                                            <td className="py-3 px-4 text-foreground/60 font-mono text-sm">{category.slug}</td>
                                            <td className="py-3 px-4 text-foreground/60 text-sm">
                                                {category.description || '-'}
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={`/admin/categories/${category._id}/edit`}
                                                        className="p-2 hover:bg-secondary rounded-md transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit className="w-4 h-4 text-blue-500" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(category._id, category.name)}
                                                        className="p-2 hover:bg-secondary rounded-md transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-4 h-4 text-red-500" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    )
}
