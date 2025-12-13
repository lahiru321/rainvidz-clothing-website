"use client"

import { useState, useEffect } from "react"
import { slugify, generateSKU } from "@/lib/utils/slugify"
import { getCategories, type Category } from "@/lib/api/categories"
import { getCollections, type Collection } from "@/lib/api/collections"
import { Plus, Trash2, Image as ImageIcon } from "lucide-react"
import type { ProductCreateData } from "@/lib/api/admin/products"

interface ProductFormProps {
    initialData?: Partial<ProductCreateData>
    onSubmit: (data: ProductCreateData) => Promise<void>
    submitLabel?: string
}

export default function ProductForm({ initialData, onSubmit, submitLabel = "Create Product" }: ProductFormProps) {
    // Categories and Collections
    const [categories, setCategories] = useState<Category[]>([])
    const [collections, setCollections] = useState<Collection[]>([])

    // Form state
    const [formData, setFormData] = useState<ProductCreateData>({
        name: initialData?.name || "",
        slug: initialData?.slug || "",
        productCode: initialData?.productCode || "",
        description: initialData?.description || "",
        price: initialData?.price || 0,
        salePrice: initialData?.salePrice || undefined,
        category: initialData?.category || "",
        collection: initialData?.collection || "",
        stockStatus: initialData?.stockStatus || "IN_STOCK",
        isNewArrival: initialData?.isNewArrival || false,
        isFeatured: initialData?.isFeatured || false,
        images: initialData?.images || [],
        variants: initialData?.variants || []
    })

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Fetch categories and collections
    useEffect(() => {
        fetchCategoriesAndCollections()
    }, [])

    const fetchCategoriesAndCollections = async () => {
        try {
            const [categoriesRes, collectionsRes] = await Promise.all([
                getCategories(),
                getCollections()
            ])
            setCategories(categoriesRes.data || [])
            setCollections(collectionsRes.data || [])
        } catch (err) {
            console.error("Error fetching categories/collections:", err)
        }
    }

    // Auto-generate slug from name
    const handleNameChange = (name: string) => {
        setFormData(prev => ({
            ...prev,
            name,
            slug: slugify(name)
        }))
    }

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        // Validation
        if (!formData.name.trim()) {
            setError("Product name is required")
            return
        }
        if (!formData.slug.trim()) {
            setError("Slug is required")
            return
        }
        if (!formData.productCode.trim()) {
            setError("Product code is required")
            return
        }
        if (!formData.description.trim()) {
            setError("Description is required")
            return
        }
        if (formData.price <= 0) {
            setError("Price must be greater than 0")
            return
        }

        try {
            setLoading(true)
            // Clean up empty strings for optional fields
            const cleanedData = {
                ...formData,
                category: formData.category || undefined,
                collection: formData.collection || undefined
            }
            await onSubmit(cleanedData as ProductCreateData)
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to save product")
        } finally {
            setLoading(false)
        }
    }

    // Image management
    const addImage = () => {
        setFormData(prev => ({
            ...prev,
            images: [...prev.images, { url: "", isPrimary: prev.images.length === 0, isHover: false, displayOrder: prev.images.length }]
        }))
    }

    const removeImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }))
    }

    const updateImage = (index: number, field: keyof ProductCreateData['images'][0], value: any) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.map((img, i) => {
                if (i === index) {
                    // If setting isPrimary, unset all others
                    if (field === 'isPrimary' && value === true) {
                        return { ...img, [field]: value }
                    }
                    // If setting isHover, unset all others
                    if (field === 'isHover' && value === true) {
                        return { ...img, [field]: value }
                    }
                    return { ...img, [field]: value }
                }
                // Unset isPrimary/isHover for other images
                if (field === 'isPrimary' && value === true) {
                    return { ...img, isPrimary: false }
                }
                if (field === 'isHover' && value === true) {
                    return { ...img, isHover: false }
                }
                return img
            })
        }))
    }

    // Variant management
    const addVariant = () => {
        setFormData(prev => ({
            ...prev,
            variants: [...prev.variants, { color: "", size: "", quantity: 0, sku: "" }]
        }))
    }

    const removeVariant = (index: number) => {
        setFormData(prev => ({
            ...prev,
            variants: prev.variants.filter((_, i) => i !== index)
        }))
    }

    const updateVariant = (index: number, field: keyof ProductCreateData['variants'][0], value: any) => {
        setFormData(prev => ({
            ...prev,
            variants: prev.variants.map((variant, i) => {
                if (i === index) {
                    const updated = { ...variant, [field]: value }
                    // Auto-generate SKU if color or size changes
                    if ((field === 'color' || field === 'size') && formData.productCode && updated.color && updated.size) {
                        updated.sku = generateSKU(formData.productCode, updated.color, updated.size)
                    }
                    return updated
                }
                return variant
            })
        }))
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
                    {error}
                </div>
            )}

            {/* Basic Information */}
            <div className="bg-secondary p-6 rounded-lg border border-border">
                <h2 className="text-xl font-semibold text-primary mb-4">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-2">
                            Product Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleNameChange(e.target.value)}
                            className="w-full px-3 py-2 border border-border rounded-md bg-background"
                            placeholder="e.g., Novela Tee - Black"
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
                            onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                            className="w-full px-3 py-2 border border-border rounded-md bg-background"
                            placeholder="novela-tee-black"
                            required
                        />
                        <p className="text-xs text-foreground/60 mt-1">Auto-generated from name, but can be edited</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Product Code <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.productCode}
                            onChange={(e) => setFormData(prev => ({ ...prev, productCode: e.target.value.toUpperCase() }))}
                            className="w-full px-3 py-2 border border-border rounded-md bg-background uppercase"
                            placeholder="NT001"
                            required
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-2">
                            Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            className="w-full px-3 py-2 border border-border rounded-md bg-background"
                            rows={4}
                            placeholder="Describe the product..."
                            required
                        />
                    </div>
                </div>
            </div>

            {/* Pricing */}
            <div className="bg-secondary p-6 rounded-lg border border-border">
                <h2 className="text-xl font-semibold text-primary mb-4">Pricing</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Regular Price (Rs) <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            value={formData.price}
                            onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                            className="w-full px-3 py-2 border border-border rounded-md bg-background"
                            min="0"
                            step="0.01"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Sale Price (Rs) <span className="text-foreground/60">(Optional)</span>
                        </label>
                        <input
                            type="number"
                            value={formData.salePrice || ""}
                            onChange={(e) => setFormData(prev => ({ ...prev, salePrice: e.target.value ? Number(e.target.value) : undefined }))}
                            className="w-full px-3 py-2 border border-border rounded-md bg-background"
                            min="0"
                            step="0.01"
                        />
                    </div>
                </div>
            </div>

            {/* Categorization */}
            <div className="bg-secondary p-6 rounded-lg border border-border">
                <h2 className="text-xl font-semibold text-primary mb-4">Categorization</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Category</label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                            className="w-full px-3 py-2 border border-border rounded-md bg-background"
                        >
                            <option value="">Select a category</option>
                            {categories.map((cat) => (
                                <option key={cat._id} value={cat._id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Collection</label>
                        <select
                            value={formData.collection}
                            onChange={(e) => setFormData(prev => ({ ...prev, collection: e.target.value }))}
                            className="w-full px-3 py-2 border border-border rounded-md bg-background"
                        >
                            <option value="">Select a collection</option>
                            {collections.map((col) => (
                                <option key={col._id} value={col._id}>
                                    {col.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Stock & Flags */}
            <div className="bg-secondary p-6 rounded-lg border border-border">
                <h2 className="text-xl font-semibold text-primary mb-4">Stock & Flags</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Stock Status</label>
                        <select
                            value={formData.stockStatus}
                            onChange={(e) => setFormData(prev => ({ ...prev, stockStatus: e.target.value as any }))}
                            className="w-full px-3 py-2 border border-border rounded-md bg-background"
                        >
                            <option value="IN_STOCK">In Stock</option>
                            <option value="LOW_STOCK">Low Stock</option>
                            <option value="OUT_OF_STOCK">Out of Stock</option>
                        </select>
                    </div>

                    <div className="flex gap-6">
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={formData.isNewArrival}
                                onChange={(e) => setFormData(prev => ({ ...prev, isNewArrival: e.target.checked }))}
                                className="w-4 h-4"
                            />
                            <span className="text-sm font-medium">New Arrival</span>
                        </label>

                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={formData.isFeatured}
                                onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                                className="w-4 h-4"
                            />
                            <span className="text-sm font-medium">Featured Product</span>
                        </label>
                    </div>
                </div>
            </div>

            {/* Images */}
            <div className="bg-secondary p-6 rounded-lg border border-border">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-primary">Product Images</h2>
                    <button
                        type="button"
                        onClick={addImage}
                        className="flex items-center gap-2 px-3 py-2 bg-primary text-white rounded-md hover:bg-primary/90 text-sm"
                    >
                        <Plus className="w-4 h-4" />
                        Add Image
                    </button>
                </div>

                {formData.images.length === 0 ? (
                    <div className="text-center py-8 text-foreground/60">
                        <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-20" />
                        <p>No images added yet. Click "Add Image" to get started.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {formData.images.map((image, index) => (
                            <div key={index} className="p-4 bg-background rounded-md border border-border">
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                                    <div className="md:col-span-6">
                                        <input
                                            type="url"
                                            value={image.url}
                                            onChange={(e) => updateImage(index, 'url', e.target.value)}
                                            className="w-full px-3 py-2 border border-border rounded-md bg-secondary text-sm"
                                            placeholder="https://example.com/image.jpg"
                                        />
                                    </div>
                                    <div className="md:col-span-2 flex items-center gap-2">
                                        <label className="flex items-center gap-1 text-sm">
                                            <input
                                                type="checkbox"
                                                checked={image.isPrimary}
                                                onChange={(e) => updateImage(index, 'isPrimary', e.target.checked)}
                                                className="w-4 h-4"
                                            />
                                            Primary
                                        </label>
                                    </div>
                                    <div className="md:col-span-2 flex items-center gap-2">
                                        <label className="flex items-center gap-1 text-sm">
                                            <input
                                                type="checkbox"
                                                checked={image.isHover}
                                                onChange={(e) => updateImage(index, 'isHover', e.target.checked)}
                                                className="w-4 h-4"
                                            />
                                            Hover
                                        </label>
                                    </div>
                                    <div className="md:col-span-1">
                                        <input
                                            type="number"
                                            value={image.displayOrder}
                                            onChange={(e) => updateImage(index, 'displayOrder', Number(e.target.value))}
                                            className="w-full px-2 py-2 border border-border rounded-md bg-secondary text-sm"
                                            min="0"
                                            title="Display Order"
                                        />
                                    </div>
                                    <div className="md:col-span-1 flex justify-end">
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="p-2 hover:bg-red-50 rounded-md transition-colors"
                                            title="Remove"
                                        >
                                            <Trash2 className="w-4 h-4 text-red-500" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Variants */}
            <div className="bg-secondary p-6 rounded-lg border border-border">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-primary">Product Variants</h2>
                    <button
                        type="button"
                        onClick={addVariant}
                        className="flex items-center gap-2 px-3 py-2 bg-primary text-white rounded-md hover:bg-primary/90 text-sm"
                    >
                        <Plus className="w-4 h-4" />
                        Add Variant
                    </button>
                </div>

                {formData.variants.length === 0 ? (
                    <div className="text-center py-8 text-foreground/60">
                        <p>No variants added yet. Click "Add Variant" to add color/size options.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {formData.variants.map((variant, index) => (
                            <div key={index} className="p-4 bg-background rounded-md border border-border">
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                                    <div className="md:col-span-3">
                                        <input
                                            type="text"
                                            value={variant.color}
                                            onChange={(e) => updateVariant(index, 'color', e.target.value)}
                                            className="w-full px-3 py-2 border border-border rounded-md bg-secondary text-sm"
                                            placeholder="Color (e.g., Black)"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <input
                                            type="text"
                                            value={variant.size}
                                            onChange={(e) => updateVariant(index, 'size', e.target.value.toUpperCase())}
                                            className="w-full px-3 py-2 border border-border rounded-md bg-secondary text-sm uppercase"
                                            placeholder="Size (S/M/L)"
                                        />
                                    </div>
                                    <div className="md:col-span-3">
                                        <input
                                            type="text"
                                            value={variant.sku}
                                            onChange={(e) => updateVariant(index, 'sku', e.target.value.toUpperCase())}
                                            className="w-full px-3 py-2 border border-border rounded-md bg-secondary text-sm uppercase"
                                            placeholder="SKU"
                                        />
                                    </div>
                                    <div className="md:col-span-3">
                                        <input
                                            type="number"
                                            value={variant.quantity}
                                            onChange={(e) => updateVariant(index, 'quantity', Number(e.target.value))}
                                            className="w-full px-3 py-2 border border-border rounded-md bg-secondary text-sm"
                                            placeholder="Quantity"
                                            min="0"
                                        />
                                    </div>
                                    <div className="md:col-span-1 flex justify-end">
                                        <button
                                            type="button"
                                            onClick={() => removeVariant(index)}
                                            className="p-2 hover:bg-red-50 rounded-md transition-colors"
                                            title="Remove"
                                        >
                                            <Trash2 className="w-4 h-4 text-red-500" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end gap-4">
                <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                    {loading ? "Saving..." : submitLabel}
                </button>
            </div>
        </form>
    )
}
