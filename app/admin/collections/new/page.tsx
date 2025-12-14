'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import AdminLayout from "@/components/admin/AdminLayout"
import { createCollection } from "@/lib/api/admin/collections"
import { ArrowLeft } from "lucide-react"

export default function NewCollectionPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: ''
    })

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
    }

    const handleNameChange = (name: string) => {
        setFormData({
            ...formData,
            name,
            slug: generateSlug(name)
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (!formData.name.trim()) {
            setError('Collection name is required')
            return
        }

        try {
            setLoading(true)
            await createCollection(formData)
            router.push('/admin/collections')
        } catch (err: any) {
            console.error('Error creating collection:', err)
            setError(err.response?.data?.message || 'Failed to create collection')
        } finally {
            setLoading(false)
        }
    }

    return (
        <AdminLayout>
            <div className="max-w-2xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/collections"
                        className="p-2 hover:bg-secondary rounded-md transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-primary">New Collection</h1>
                        <p className="text-foreground/60 mt-1">Create a new product collection</p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
                            {error}
                        </div>
                    )}

                    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                        <h2 className="text-xl font-semibold text-primary mb-4">Collection Information</h2>

                        <div className="space-y-4">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => handleNameChange(e.target.value)}
                                    className="w-full px-3 py-2 border border-border rounded-md bg-background"
                                    placeholder="e.g., Summer Collection"
                                    required
                                />
                            </div>

                            {/* Slug */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Slug <span className="text-foreground/60 text-xs">(auto-generated)</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    className="w-full px-3 py-2 border border-border rounded-md bg-secondary"
                                    placeholder="summer-collection"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-3 py-2 border border-border rounded-md bg-background"
                                    rows={4}
                                    placeholder="Describe this collection..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 mt-6">
                        <Link
                            href="/admin/collections"
                            className="px-6 py-3 border border-border rounded-md hover:bg-secondary transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-3 bg-sage text-white rounded-md hover:bg-sage/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm"
                        >
                            {loading ? 'Creating...' : 'Create Collection'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    )
}
