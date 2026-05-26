import { create } from 'zustand';
import { Product } from '@/data/products';

interface CartItem extends Product {
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  toggleCart: (open?: boolean) => void;
  clearCart: () => void;
  totalPrice: () => number;
  totalItems: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isOpen: false,
  addItem: (product) => set((state) => {
    const existingItem = state.items.find((i) => i.id === product.id);
    if (existingItem) {
      return {
        items: state.items.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        ),
      };
    }
    return { items: [...state.items, { ...product, quantity: 1 }] };
  }),
  removeItem: (id) => set((state) => ({
    items: state.items.filter((i) => i.id !== id),
  })),
  updateQuantity: (id, quantity) => set((state) => ({
    items: state.items.map((i) =>
      i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i
    ),
  })),
  toggleCart: (open) => set((state) => ({ 
    isOpen: open !== undefined ? open : !state.isOpen 
  })),
  clearCart: () => set({ items: [] }),
  totalPrice: () => {
    return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
  },
  totalItems: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },
}));
