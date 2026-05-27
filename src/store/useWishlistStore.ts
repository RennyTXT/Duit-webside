import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/data/products';

interface WishlistState {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  clearWishlist: () => void;
  isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        const currentItems = get().items;
        if (!currentItems.find((item) => item.id === product.id)) {
          // เก็บเฉพาะข้อมูลที่จำเป็นเพื่อลดขนาด LocalStorage และป้องกันบัคข้อมูลไม่ครบ
          const normalizedProduct: Product = {
            id: product.id,
            name: product.name,
            price: Number(product.price) || 0,
            image: product.image || (product as any).image_url || "/placeholder-product.png",
            category: product.category,
            tagline: product.tagline || '',
            description: '', // ไม่จำเป็นต้องเก็บในคลัง
            features: [],
            specs: []
          };
          set({ items: [...currentItems, normalizedProduct] });
        }
      },
      removeItem: (productId) => {
        set({ items: get().items.filter((item) => item.id !== productId) });
      },
      clearWishlist: () => set({ items: [] }),
      isInWishlist: (productId) => {
        return get().items.some((item) => item.id === productId);
      },
    }),
    {
      name: 'duit-wishlist-storage',
    }
  )
);
