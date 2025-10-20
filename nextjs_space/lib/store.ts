
'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CartItem {
  id: string
  name: string
  price: number
  imageUrl: string
  quantity: number
  storageType: string
}

interface CartStore {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  updateQuantity: (id: string, quantity: number) => void
  removeItem: (id: string) => void
  clearCart: () => void
  getTotalPrice: () => number
  getTotalItems: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => set((state) => {
        const existingItem = state.items?.find(i => i?.id === item?.id)
        if (existingItem) {
          return {
            items: state.items?.map(i =>
              i?.id === item?.id 
                ? { ...i, quantity: (i?.quantity || 0) + 1 }
                : i
            ) || []
          }
        }
        return {
          items: [...(state.items || []), { ...item, quantity: 1 }]
        }
      }),
      updateQuantity: (id, quantity) => set((state) => {
        if (quantity <= 0) {
          return { items: state.items?.filter(i => i?.id !== id) || [] }
        }
        return {
          items: state.items?.map(i =>
            i?.id === id ? { ...i, quantity } : i
          ) || []
        }
      }),
      removeItem: (id) => set((state) => ({
        items: state.items?.filter(i => i?.id !== id) || []
      })),
      clearCart: () => set({ items: [] }),
      getTotalPrice: () => {
        const state = get()
        return state.items?.reduce((total, item) => 
          total + ((item?.price || 0) * (item?.quantity || 0)), 0
        ) || 0
      },
      getTotalItems: () => {
        const state = get()
        return state.items?.reduce((total, item) => total + (item?.quantity || 0), 0) || 0
      }
    }),
    {
      name: 'cart-storage',
      skipHydration: true
    }
  )
)
