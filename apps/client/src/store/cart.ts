import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  variant?: {
    size?: string;
    color?: string;
    [key: string]: any;
  };
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  
  // Actions
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setCartOpen: (open: boolean) => void;
  
  // Computed values
  getTotalPrice: () => number;
  getTotalItems: () => number;
  getItemCount: (productId: string, variant?: CartItem['variant']) => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (newItem) => {
        const items = get().items;
        const itemId = `${newItem.productId}-${JSON.stringify(newItem.variant || {})}`;
        
        const existingItem = items.find(item => item.id === itemId);

        if (existingItem) {
          // Update quantity of existing item
          set({
            items: items.map((item) =>
              item.id === itemId
                ? { ...item, quantity: item.quantity + newItem.quantity }
                : item
            ),
          });
        } else {
          // Add new item
          const cartItem: CartItem = {
            ...newItem,
            id: itemId,
          };
          set({ items: [...items, cartItem] });
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) });
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      toggleCart: () => set({ isOpen: !get().isOpen }),

      setCartOpen: (isOpen) => set({ isOpen }),

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getItemCount: (productId, variant) => {
        const itemId = `${productId}-${JSON.stringify(variant || {})}`;
        const item = get().items.find(item => item.id === itemId);
        return item?.quantity || 0;
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({
        items: state.items,
      }),
    }
  )
);