'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import AdminLayout from "@/components/admin/AdminLayout"
import { createHomeSection } from "@/lib/api/admin/homeSections"
import { ArrowLeft } from "lucide-react"

export default function NewHomeContentPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [formData, setFormData] = useState({
        type: 'hero' as 'hero' | 'banner',
        title: '',
        subtitle: '',
        description: '',
        imageUrl: '',
        ctaText: 'Shop Now',
        ctaLink: '/shop',
        backgroundColor: '#A7C1A8',
        season: '',
        displayOrder: 0,
        isActive: true
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (!formData.title.trim()) {
            setError('Title is required')
            return
        }

        if (!formData.imageUrl.trim()) {
            setError('Please provide an image URL or upload an image')
            return
        }

        try {
            setLoading(true)
            await createHomeSection(formData)
            router.push('/admin/home-content')
        } catch (err: any) {
            console.error('Error creating section:', err)
            setError(err.response?.data?.message || 'Failed to create section')
        } finally {
            setLoading(false)
        }
    }

    return (
        <AdminLayout>
            <div className="max-w-3xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/home-content"
                        className="p-2 hover:bg-secondary rounded-md transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-primary">New Homepage Content</h1>
                        <p className="text-foreground/60 mt-1">Add a new hero slide or collection banner</p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
                            {error}
                        </div>
                    )}

                    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-6">
                        {/* Type Selection */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Content Type <span className="text-red-500">*</span>
                            </label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        value="hero"
                                        checked={formData.type === 'hero'}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value as 'hero' })}
                                        className="w-4 h-4"
                                    />
                                    <span>Hero Slide</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        value="banner"
                                        checked={formData.type === 'banner'}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value as 'banner' })}
                                        className="w-4 h-4"
                                    />
                                    <span>Collection Banner</span>
                                </label>
                            </div>
                        </div>

                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-3 py-2 border border-border rounded-md bg-background"
                                placeholder="e.g., Natural Beauty"
                                required
                            />
                        </div>

                        {/* Subtitle */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Subtitle</label>
                            <input
                                type="text"
                                value={formData.subtitle}
                                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                className="w-full px-3 py-2 border border-border rounded-md bg-background"
                                placeholder="Short tagline"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-3 py-2 border border-border rounded-md bg-background"
                                rows={3}
                                placeholder="Detailed description"
                            />
                        </div>

                        {/* Image URL */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Image URL <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="url"
                                value={formData.imageUrl}
                                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                className="w-full px-3 py-2 border border-border rounded-md bg-background"
                                placeholder="https://example.com/image.jpg"
                            />

                            {/* File Upload */}
                            <div className="mt-3">
                                <label className="block text-sm font-medium mb-2">Or upload an image</label>
                                <input
                                    type="file"
                                    accept="image/jpeg,image/png"
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0]
                                        if (file) {
                                            // Validate file size (5MB = 5 * 1024 * 1024 bytes)
                                            const maxSize = 5 * 1024 * 1024
                                            if (file.size > maxSize) {
                                                setError(`File size must be less than 5MB. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB`)
                                                e.target.value = '' // Clear the input
                                                return
                                            }

                                            // Validate file type
                                            if (!['image/jpeg', 'image/png'].includes(file.type)) {
                                                setError('Only JPG and PNG images are allowed')
                                                e.target.value = '' // Clear the input
                                                return
                                            }

                                            try {
                                                setLoading(true)
                                                setError(null)
                                                const { uploadImage } = await import('@/lib/api/admin/upload')
                                                const result = await uploadImage(file)
                                                setFormData({ ...formData, imageUrl: result.url })
                                            } catch (err: any) {
                                                console.error('Upload error:', err)
                                                setError(err.response?.data?.message || 'Failed to upload image')
                                            } finally {
                                                setLoading(false)
                                                e.target.value = '' // Clear the input
                                            }
                                        }
                                    }}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-sage file:text-white hover:file:bg-sage/90 cursor-pointer"
                                    disabled={loading}
                                />
                                <p className="text-xs text-gray-500 mt-1">JPG or PNG, max 5MB</p>
                            </div>

                            {formData.imageUrl && (
                                <img
                                    src={formData.imageUrl}
                                    alt="Preview"
                                    className="mt-3 w-full h-64 object-cover rounded border border-gray-200"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none'
                                    }}
                                />
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* CTA Text */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Button Text</label>
                                <input
                                    type="text"
                                    value={formData.ctaText}
                                    onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                                    className="w-full px-3 py-2 border border-border rounded-md bg-background"
                                />
                            </div>

                            {/* CTA Link */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Button Link</label>
                                <input
                                    type="text"
                                    value={formData.ctaLink}
                                    onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
                                    className="w-full px-3 py-2 border border-border rounded-md bg-background"
                                />
                            </div>
                        </div>

                        {formData.type === 'banner' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Background Color */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">Background Color</label>
                                    <input
                                        type="color"
                                        value={formData.backgroundColor}
                                        onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
                                        className="w-full h-10 border border-border rounded-md"
                                    />
                                </div>

                                {/* Season */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">Season Label</label>
                                    <input
                                        type="text"
                                        value={formData.season}
                                        onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                                        className="w-full px-3 py-2 border border-border rounded-md bg-background"
                                        placeholder="e.g., New Season"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Display Order */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Display Order</label>
                                <input
                                    type="number"
                                    value={formData.displayOrder}
                                    onChange={(e) => setFormData({ ...formData, displayOrder: Number(e.target.value) })}
                                    className="w-full px-3 py-2 border border-border rounded-md bg-background"
                                    min="0"
                                />
                            </div>

                            {/* Active Status */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Status</label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.isActive}
                                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                        className="w-4 h-4"
                                    />
                                    <span>Active (visible on homepage)</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 mt-6">
                        <Link
                            href="/admin/home-content"
                            className="px-6 py-3 border border-border rounded-md hover:bg-secondary transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-3 bg-sage text-white rounded-md hover:bg-sage/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm"
                        >
                            {loading ? 'Creating...' : 'Create Content'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    )
}
