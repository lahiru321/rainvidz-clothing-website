'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import AdminLayout from "@/components/admin/AdminLayout"
import { getCollections } from "@/lib/api/collections"
import { updateCollection, deleteCollection, type Collection } from "@/lib/api/admin/collections"
import { ArrowLeft, Trash2 } from "lucide-react"

export default function EditCollectionPage({ params }: { params: { id: string } }) {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [collection, setCollection] = useState<Collection | null>(null)
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: ''
    })

    useEffect(() => {
        fetchCollection()
    }, [params.id])

    const fetchCollection = async () => {
        try {
            setLoading(true)
            const response = await getCollections()
            const collections = (response.data || []) as unknown as Collection[]
            const found = collections.find(c => c._id === params.id)

            if (!found) {
                setError('Collection not found')
                return
            }

            setCollection(found)
            setFormData({
                name: found.name,
                slug: found.slug,
                description: found.description || ''
            })
        } catch (err: any) {
            console.error('Error fetching collection:', err)
            setError('Failed to load collection')
        } finally {
            setLoading(false)
        }
    }

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
            setSaving(true)
            await updateCollection(params.id, formData)
            router.push('/admin/collections')
        } catch (err: any) {
            console.error('Error updating collection:', err)
            setError(err.response?.data?.message || 'Failed to update collection')
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async () => {
        if (!collection) return

        if (!confirm(`Are you sure you want to delete "${collection.name}"? This action cannot be undone.`)) {
            return
        }

        try {
            setDeleting(true)
            await deleteCollection(params.id)
            router.push('/admin/collections')
        } catch (err: any) {
            console.error('Error deleting collection:', err)
            setError(err.response?.data?.message || 'Failed to delete collection')
        } finally {
            setDeleting(false)
        }
    }

    if (loading) {
        return (
            <AdminLayout>
                <div className="p-8 text-center text-foreground/60">
                    Loading collection...
                </div>
            </AdminLayout>
        )
    }

    if (error && !collection) {
        return (
            <AdminLayout>
                <div className="p-8 text-center text-red-500">
                    {error}
                </div>
            </AdminLayout>
        )
    }

    return (
        <AdminLayout>
            <div className="max-w-2xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/admin/collections"
                            className="p-2 hover:bg-secondary rounded-md transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-primary">Edit Collection</h1>
                            <p className="text-foreground/60 mt-1">{collection?.name}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleDelete}
                        disabled={deleting}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors disabled:opacity-50"
                    >
                        <Trash2 className="w-4 h-4" />
                        {deleting ? 'Deleting...' : 'Delete'}
                    </button>
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
                            disabled={saving}
                            className="px-6 py-3 bg-sage text-white rounded-md hover:bg-sage/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm"
                        >
                            {saving ? 'Saving...' : 'Update Collection'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    )
}
