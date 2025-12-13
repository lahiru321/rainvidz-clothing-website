'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import AdminLayout from "@/components/admin/AdminLayout"
import { getHomeSections, deleteHomeSection, type HomeSection } from "@/lib/api/admin/homeSections"
import { Pencil, Trash2, Plus, Image as ImageIcon } from "lucide-react"

export default function AdminHomeContentPage() {
    const [sections, setSections] = useState<HomeSection[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [deleting, setDeleting] = useState<string | null>(null)
    const [filter, setFilter] = useState<'all' | 'hero' | 'banner' | 'card'>('all')

    useEffect(() => {
        fetchSections()
    }, [filter])

    const fetchSections = async () => {
        try {
            setLoading(true)
            const filterType = filter === 'all' ? undefined : filter
            const response = await getHomeSections(filterType)
            setSections(response.data || [])
        } catch (err: any) {
            console.error('Error fetching sections:', err)
            setError('Failed to load homepage sections')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`Are you sure you want to delete "${title}"?`)) {
            return
        }

        try {
            setDeleting(id)
            await deleteHomeSection(id)
            setSections(sections.filter(s => s._id !== id))
            alert(`"${title}" deleted successfully`)
        } catch (err: any) {
            console.error('Error deleting section:', err)
            alert(err.response?.data?.message || 'Failed to delete section')
        } finally {
            setDeleting(null)
        }
    }

    const getTypeBadge = (type: string) => {
        if (type === 'hero') {
            return <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Hero</span>
        } else if (type === 'banner') {
            return <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">Banner</span>
        } else {
            return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Card</span>
        }
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-primary">Homepage Content</h1>
                        <p className="text-foreground/60 mt-1">Manage hero slides, collection banners, and content cards</p>
                    </div>
                    <Link
                        href="/admin/home-content/new"
                        className="flex items-center gap-2 px-4 py-2 bg-sage text-white rounded-md hover:bg-sage/90 transition-colors font-medium shadow-sm"
                    >
                        <Plus className="w-5 h-5" />
                        Add Content
                    </Link>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
                        {error}
                    </div>
                )}

                {/* Filter Tabs */}
                <div className="flex gap-2 border-b border-border">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 font-medium transition-colors ${filter === 'all'
                            ? 'text-sage border-b-2 border-sage'
                            : 'text-foreground/60 hover:text-foreground'
                            }`}
                    >
                        All ({sections.length})
                    </button>
                    <button
                        onClick={() => setFilter('hero')}
                        className={`px-4 py-2 font-medium transition-colors ${filter === 'hero'
                            ? 'text-sage border-b-2 border-sage'
                            : 'text-foreground/60 hover:text-foreground'
                            }`}
                    >
                        Hero Slides
                    </button>
                    <button
                        onClick={() => setFilter('banner')}
                        className={`px-4 py-2 font-medium transition-colors ${filter === 'banner'
                            ? 'text-sage border-b-2 border-sage'
                            : 'text-foreground/60 hover:text-foreground'
                            }`}
                    >
                        Collection Banners
                    </button>
                    <button
                        onClick={() => setFilter('card')}
                        className={`px-4 py-2 font-medium transition-colors ${filter === 'card'
                            ? 'text-sage border-b-2 border-sage'
                            : 'text-foreground/60 hover:text-foreground'
                            }`}
                    >
                        Content Cards
                    </button>
                </div>

                {/* Content Table */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                    {loading ? (
                        <div className="p-8 text-center text-foreground/60">
                            Loading content...
                        </div>
                    ) : error ? (
                        <div className="p-8 text-center text-red-500">
                            {error}
                        </div>
                    ) : sections.length === 0 ? (
                        <div className="p-8 text-center text-foreground/60">
                            <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-20" />
                            <p>No content found. Add your first {filter === 'all' ? 'section' : filter} to get started.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-secondary border-b border-border">
                                    <tr>
                                        <th className="text-left py-3 px-4 font-semibold text-primary">Preview</th>
                                        <th className="text-left py-3 px-4 font-semibold text-primary">Type</th>
                                        <th className="text-left py-3 px-4 font-semibold text-primary">Title</th>
                                        <th className="text-left py-3 px-4 font-semibold text-primary">Tags</th>
                                        <th className="text-left py-3 px-4 font-semibold text-primary">Order</th>
                                        <th className="text-left py-3 px-4 font-semibold text-primary">Status</th>
                                        <th className="text-right py-3 px-4 font-semibold text-primary">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sections.map((section) => (
                                        <tr key={section._id} className="border-t border-border hover:bg-background">
                                            <td className="py-3 px-4">
                                                <img
                                                    src={section.imageUrl}
                                                    alt={section.title}
                                                    className="w-20 h-12 object-cover rounded"
                                                />
                                            </td>
                                            <td className="py-3 px-4">
                                                {getTypeBadge(section.type)}
                                            </td>
                                            <td className="py-3 px-4">
                                                <div>
                                                    <p className="font-medium">{section.title}</p>
                                                    {section.subtitle && (
                                                        <p className="text-sm text-foreground/60">{section.subtitle}</p>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                {section.tags && section.tags.length > 0 ? (
                                                    <div className="flex flex-wrap gap-1">
                                                        {section.tags.map((tag, idx) => (
                                                            <span key={idx} className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded">
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <span className="text-foreground/40 text-sm">—</span>
                                                )}
                                            </td>
                                            <td className="py-3 px-4 text-foreground/60">{section.displayOrder}</td>
                                            <td className="py-3 px-4">
                                                {section.isActive ? (
                                                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Active</span>
                                                ) : (
                                                    <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">Inactive</span>
                                                )}
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={`/admin/home-content/${section._id}/edit`}
                                                        className="p-2 hover:bg-sage/10 rounded-md transition-colors group"
                                                        title="Edit"
                                                    >
                                                        <Pencil className="w-4 h-4 text-gray-600 group-hover:text-sage transition-colors" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(section._id, section.title)}
                                                        disabled={deleting === section._id}
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
