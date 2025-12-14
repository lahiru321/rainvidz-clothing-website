import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getProductBySlug } from '@/lib/api/products';

// Local cart item structure (for guest users)
interface LocalCartItem {
    productId: string;
    productName: string;
    productSlug: string;
    variantId: string;
    variantColor: string;
    variantSize: string;
    quantity: number;
    price: number;
    effectivePrice: number;
    image: string;
    addedAt: string;
}

interface CartStore {
    items: LocalCartItem[];
    loading: boolean;
    error: string | null;

    // Actions
    addItem: (productId: string, variantId: string, quantity: number) => Promise<void>;
    updateQuantity: (variantId: string, quantity: number) => void;
    removeItem: (variantId: string) => void;
    clearCart: () => void;
    getItemCount: () => number;
    getTotal: () => number;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            loading: false,
            error: null,

            addItem: async (productId: string, variantId: string, quantity: number) => {
                set({ loading: true, error: null });
                try {
                    // Fetch product details
                    const response = await getProductBySlug(productId); // Using slug as ID for now
                    const product = response.data;

                    // Find the variant
                    const variant = product.variants.find(v => v.sku === variantId);
                    if (!variant) {
                        throw new Error('Variant not found');
                    }

                    const items = get().items;
                    const existingItemIndex = items.findIndex(item => item.variantId === variantId);

                    if (existingItemIndex > -1) {
                        // Update quantity if item already exists
                        const updatedItems = [...items];
                        updatedItems[existingItemIndex].quantity += quantity;
                        set({ items: updatedItems, loading: false });
                    } else {
                        // Add new item
                        const newItem: LocalCartItem = {
                            productId: product._id,
                            productName: product.name,
                            productSlug: product.slug,
                            variantId: variant.sku,
                            variantColor: variant.color,
                            variantSize: variant.size,
                            quantity,
                            price: product.price,
                            effectivePrice: product.effectivePrice,
                            image: product.images.find(img => img.isPrimary)?.url || product.images[0]?.url || '',
                            addedAt: new Date().toISOString()
                        };
                        set({ items: [...items, newItem], loading: false });
                    }
                } catch (error: any) {
                    console.error('Error adding to cart:', error);
                    set({ error: error.message, loading: false });
                    throw error;
                }
            },

            updateQuantity: (variantId: string, quantity: number) => {
                const items = get().items;
                const updatedItems = items.map(item =>
                    item.variantId === variantId ? { ...item, quantity } : item
                );
                set({ items: updatedItems });
            },

            removeItem: (variantId: string) => {
                const items = get().items;
                const updatedItems = items.filter(item => item.variantId !== variantId);
                set({ items: updatedItems });
            },

            clearCart: () => {
                set({ items: [] });
            },

            getItemCount: () => {
                const items = get().items;
                return items.reduce((total, item) => total + item.quantity, 0);
            },

            getTotal: () => {
                const items = get().items;
                return items.reduce((total, item) => {
                    return total + (item.effectivePrice * item.quantity);
                }, 0);
            },
        }),
        {
            name: 'guest-cart-storage',
        }
    )
);
