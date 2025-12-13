"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import AdminLayout from "@/components/admin/AdminLayout"
import { getProducts, type Product } from "@/lib/api/products"
import { deleteProduct } from "@/lib/api/admin/products"
import { Pencil, Trash2, Plus } from "lucide-react"

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [deleting, setDeleting] = useState<string | null>(null)

    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        try {
            setLoading(true)
            const response = await getProducts({ limit: 50 })
            setProducts(response.data.products)
        } catch (err: any) {
            console.error('Error fetching products:', err)
            setError('Failed to load products')
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
            await deleteProduct(id)
            setProducts(products.filter(p => p._id !== id))
        } catch (err: any) {
            console.error('Error deleting product:', err)
            alert('Failed to delete product')
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
                        <h1 className="text-3xl font-serif font-bold text-primary">Products</h1>
                        <p className="text-foreground/60 mt-1">Manage your product catalog</p>
                    </div>
                    <Link
                        href="/admin/products/new"
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Add Product
                    </Link>
                </div>

                {/* Products Table */}
                <div className="bg-secondary rounded-lg border border-border overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center text-foreground/60">
                            Loading products...
                        </div>
                    ) : error ? (
                        <div className="p-8 text-center text-red-500">
                            {error}
                        </div>
                    ) : products.length === 0 ? (
                        <div className="p-8 text-center text-foreground/60">
                            No products found. Add your first product to get started.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-background">
                                    <tr>
                                        <th className="text-left py-3 px-4 font-medium text-foreground/60">Image</th>
                                        <th className="text-left py-3 px-4 font-medium text-foreground/60">Name</th>
                                        <th className="text-left py-3 px-4 font-medium text-foreground/60">Code</th>
                                        <th className="text-left py-3 px-4 font-medium text-foreground/60">Price</th>
                                        <th className="text-left py-3 px-4 font-medium text-foreground/60">Stock</th>
                                        <th className="text-left py-3 px-4 font-medium text-foreground/60">Category</th>
                                        <th className="text-right py-3 px-4 font-medium text-foreground/60">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product) => (
                                        <tr key={product._id} className="border-t border-border hover:bg-background">
                                            <td className="py-3 px-4">
                                                {product.primaryImage ? (
                                                    <img
                                                        src={product.primaryImage}
                                                        alt={product.name}
                                                        className="w-12 h-12 object-cover rounded"
                                                    />
                                                ) : (
                                                    <div className="w-12 h-12 bg-background rounded flex items-center justify-center text-foreground/40">
                                                        No Image
                                                    </div>
                                                )}
                                            </td>
                                            <td className="py-3 px-4">
                                                <div>
                                                    <p className="font-medium">{product.name}</p>
                                                    {product.isNewArrival && (
                                                        <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">New</span>
                                                    )}
                                                    {product.isFeatured && (
                                                        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded ml-1">Featured</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-foreground/60">
                                                {product.productCode}
                                            </td>
                                            <td className="py-3 px-4">
                                                <div>
                                                    <p className="font-medium">Rs {product.price.toLocaleString()}</p>
                                                    {product.salePrice && (
                                                        <p className="text-sm text-green-600">
                                                            Sale: Rs {product.salePrice.toLocaleString()}
                                                        </p>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${product.stockStatus === 'IN_STOCK' ? 'bg-green-100 text-green-800' :
                                                    product.stockStatus === 'LOW_STOCK' ? 'bg-orange-100 text-orange-800' :
                                                        'bg-red-100 text-red-800'
                                                    }`}>
                                                    {product.stockStatus.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-foreground/60">
                                                {product.category?.name || 'N/A'}
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={`/admin/products/${product._id}/edit`}
                                                        className="p-2 hover:bg-background rounded-md transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Pencil className="w-4 h-4 text-blue-500" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(product._id, product.name)}
                                                        disabled={deleting === product._id}
                                                        className="p-2 hover:bg-background rounded-md transition-colors disabled:opacity-50"
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
