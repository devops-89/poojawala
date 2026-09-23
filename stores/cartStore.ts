import { create } from 'zustand';
import { getCartAPI } from '@/api/cartControllers';

export interface CartItem {
  id: string; // Cart Item ID (used for PATCH and DELETE)
  productId?: string; // Product ID
  title: string;
  price: number;
  image: string;
  quantity: number;
  unitString?: string;
  pricingUnit?: string;
  unitQuantity?: number;
  packQuantity?: number;
  description?: string;
  subtotal?: number;
}

export function parseCartApiResponse(res: any) {
  let cartData: any = null;

  if (res) {
    if (res.data) {
      if (res.data.data && res.data.data.items && Array.isArray(res.data.data.items)) {
        cartData = res.data.data;
      } else if (res.data.items && Array.isArray(res.data.items)) {
        cartData = res.data;
      } else if (Array.isArray(res.data)) {
        cartData = { items: res.data };
      }
    } else if (res.items && Array.isArray(res.items)) {
      cartData = res;
    } else if (Array.isArray(res)) {
      cartData = { items: res };
    }
  }

  if (!cartData || !Array.isArray(cartData.items)) {
    return null;
  }

  const rawItems = cartData.items;
  const apiTotal =
    cartData.total !== undefined
      ? Number(cartData.total)
      : rawItems.reduce(
          (sum: number, item: any) =>
            sum + Number(item.unitPrice || item.price || 0) * Number(item.quantity || 1),
          0
        );
  const totalQty = rawItems.reduce(
    (sum: number, item: any) => sum + Number(item.quantity || 1),
    0
  );
  const apiTotalItems =
    totalQty > 0
      ? totalQty
      : cartData.totalItems !== undefined
      ? Number(cartData.totalItems)
      : rawItems.length;

  const formattedItems: CartItem[] = rawItems.map((item: any) => {
    const pUnit = item.pricingUnit || item.unit || item.product?.pricingUnit || "";
    const uQty = item.unitQuantity || item.packQuantity || item.product?.unitQuantity || item.product?.packQuantity || undefined;
    
    return {
      id: String(item.id || item.productId),
      productId: String(item.productId || item.id),
      title: item.name || item.title || "Pooja Product",
      price: Number(item.unitPrice || item.price || 0),
      image:
        item.imageUrl ||
        item.imageDownloadurl ||
        item.image ||
        "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80",
      quantity: Number(item.quantity || 1),
      unitString: pUnit,
      pricingUnit: pUnit,
      unitQuantity: uQty ? Number(uQty) : undefined,
      packQuantity: uQty ? Number(uQty) : undefined,
      description: item.description || "",
      subtotal: item.subtotal !== undefined ? Number(item.subtotal) : undefined,
    };
  });

  return {
    items: formattedItems,
    total: apiTotal,
    totalItems: apiTotalItems,
  };
}

interface CartState {
  items: CartItem[];
  cartTotal: number;
  totalItemsCount: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  setCartFromApi: (res: any) => void;
  fetchCartFromApi: () => Promise<void>;
  setCartItems: (items: CartItem[]) => void;
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (id: string) => boolean;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  cartTotal: 0,
  totalItemsCount: 0,
  isOpen: false,

  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

  setCartFromApi: (res) => {
    const parsed = parseCartApiResponse(res);
    if (parsed) {
      set({
        items: parsed.items,
        cartTotal: parsed.total,
        totalItemsCount: parsed.totalItems,
      });
    } else {
      // Re-fetch full cart if response did not include items array
      get().fetchCartFromApi();
    }
  },

  fetchCartFromApi: async () => {
    try {
      const res = await getCartAPI();
      const parsed = parseCartApiResponse(res);
      if (parsed) {
        set({
          items: parsed.items,
          cartTotal: parsed.total,
          totalItemsCount: parsed.totalItems,
        });
      }
    } catch (err) {
      console.error("Failed to fetch cart from API:", err);
    }
  },

  setCartItems: (items) => {
    const calculatedTotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const calculatedTotalQty = items.reduce((sum, i) => sum + i.quantity, 0);
    set({
      items,
      cartTotal: calculatedTotal,
      totalItemsCount: calculatedTotalQty,
    });
  },

  addItem: (item) => {
    set((state) => {
      const existingIndex = state.items.findIndex(
        (i) => (i.productId && item.productId && i.productId === item.productId) || i.id === item.id
      );
      let updated: CartItem[];
      if (existingIndex > -1) {
        updated = [...state.items];
        updated[existingIndex].quantity += item.quantity || 1;
      } else {
        updated = [
          ...state.items,
          {
            id: item.id,
            productId: item.productId,
            title: item.title,
            price: item.price,
            image: item.image,
            quantity: item.quantity || 1,
            unitString: item.unitString,
            description: item.description,
          },
        ];
      }
      const calculatedTotal = updated.reduce((sum, i) => sum + i.price * i.quantity, 0);
      const calculatedTotalQty = updated.reduce((sum, i) => sum + i.quantity, 0);
      return {
        items: updated,
        cartTotal: calculatedTotal,
        totalItemsCount: calculatedTotalQty,
      };
    });
  },

  removeItem: (id) => {
    set((state) => {
      const updated = state.items.filter((item) => item.id !== id && item.productId !== id);
      const calculatedTotal = updated.reduce((sum, i) => sum + i.price * i.quantity, 0);
      const calculatedTotalQty = updated.reduce((sum, i) => sum + i.quantity, 0);
      return {
        items: updated,
        cartTotal: calculatedTotal,
        totalItemsCount: calculatedTotalQty,
      };
    });
  },

  updateQuantity: (id, quantity) => {
    if (quantity <= 0) {
      get().removeItem(id);
      return;
    }
    set((state) => {
      const updated = state.items.map((item) =>
        item.id === id || item.productId === id ? { ...item, quantity } : item
      );
      const calculatedTotal = updated.reduce((sum, i) => sum + i.price * i.quantity, 0);
      const calculatedTotalQty = updated.reduce((sum, i) => sum + i.quantity, 0);
      return {
        items: updated,
        cartTotal: calculatedTotal,
        totalItemsCount: calculatedTotalQty,
      };
    });
  },

  clearCart: () => set({ items: [], cartTotal: 0, totalItemsCount: 0 }),

  isInCart: (id) => {
    return get().items.some(
      (item) => String(item.id) === String(id) || String(item.productId) === String(id)
    );
  },

  getTotalPrice: () => {
    const { cartTotal, items } = get();
    if (cartTotal !== undefined && cartTotal > 0) return cartTotal;
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  },

  getTotalItems: () => {
    const { totalItemsCount, items } = get();
    if (totalItemsCount !== undefined && totalItemsCount > 0) return totalItemsCount;
    return items.reduce((total, item) => total + item.quantity, 0);
  },
}));
