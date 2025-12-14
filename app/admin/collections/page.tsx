'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import AdminLayout from "@/components/admin/AdminLayout"
import { getCollections } from "@/lib/api/collections"
import { deleteCollection, type Collection } from "@/lib/api/admin/collections"
import { Pencil, Trash2, Plus, Search } from "lucide-react"

export default function AdminCollectionsPage() {
    const [collections, setCollections] = useState<Collection[]>([])
    const [filteredCollections, setFilteredCollections] = useState<Collection[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [deleting, setDeleting] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        fetchCollections()
    }, [])

    useEffect(() => {
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase()
            setFilteredCollections(
                collections.filter(c =>
                    c.name.toLowerCase().includes(query) ||
                    c.slug.toLowerCase().includes(query) ||
                    c.description?.toLowerCase().includes(query)
                )
            )
        } else {
            setFilteredCollections(collections)
        }
    }, [searchQuery, collections])

    const fetchCollections = async () => {
        try {
            setLoading(true)
            const response = await getCollections()
            const data = (response.data || []) as unknown as Collection[]
            setCollections(data)
            setFilteredCollections(data)
        } catch (err: any) {
            console.error('Error fetching collections:', err)
            setError('Failed to load collections')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete "${name}"?`)) {
            return
        }

        try {
            setDeleting(id)
            await deleteCollection(id)
            setCollections(collections.filter(c => c._id !== id))
            alert(`"${name}" deleted successfully`)
        } catch (err: any) {
            console.error('Error deleting collection:', err)
            alert(err.response?.data?.message || 'Failed to delete collection')
        } finally {
            setDeleting(null)
        }
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-primary">Collections</h1>
                        <p className="text-foreground/60 mt-1">Manage product collections</p>
                    </div>
                    <Link
                        href="/admin/collections/new"
                        className="flex items-center gap-2 px-4 py-2 bg-sage text-white rounded-md hover:bg-sage/90 transition-colors font-medium shadow-sm"
                    >
                        <Plus className="w-5 h-5" />
                        Add Collection
                    </Link>
                </div>

                {/* Search */}
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search collections..."
                            className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-background"
                        />
                    </div>
                </div>

                {/* Collections Table */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                    {loading ? (
                        <div className="p-8 text-center text-foreground/60">
                            Loading collections...
                        </div>
                    ) : error ? (
                        <div className="p-8 text-center text-red-500">
                            {error}
                        </div>
                    ) : filteredCollections.length === 0 ? (
                        <div className="p-8 text-center text-foreground/60">
                            {searchQuery
                                ? 'No collections match your search.'
                                : 'No collections found. Add your first collection to get started.'}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-secondary border-b border-border">
                                    <tr>
                                        <th className="text-left py-3 px-4 font-semibold text-primary">Name</th>
                                        <th className="text-left py-3 px-4 font-semibold text-primary">Slug</th>
                                        <th className="text-left py-3 px-4 font-semibold text-primary">Description</th>
                                        <th className="text-right py-3 px-4 font-semibold text-primary">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredCollections.map((collection) => (
                                        <tr key={collection._id} className="border-t border-border hover:bg-background">
                                            <td className="py-3 px-4 font-medium">{collection.name}</td>
                                            <td className="py-3 px-4 text-foreground/60">{collection.slug}</td>
                                            <td className="py-3 px-4 text-foreground/60">
                                                {collection.description || '-'}
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={`/admin/collections/${collection._id}/edit`}
                                                        className="p-2 hover:bg-sage/10 rounded-md transition-colors group"
                                                        title="Edit"
                                                    >
                                                        <Pencil className="w-4 h-4 text-gray-600 group-hover:text-sage transition-colors" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(collection._id, collection.name)}
                                                        disabled={deleting === collection._id}
                                                        className="p-2 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50 group"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-4 h-4 text-gray-600 group-hover:text-red-500 transition-colors" />
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
