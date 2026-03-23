import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  color: string;
  size: string;
  quantity: number;
  stock: number; // 🔥 ADDED: The cart now officially tracks maximum stock
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void; // 🔥 FIX: Removed Omit "id" so we can pass the exact ID
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  removePurchasedItems: (ids: string[]) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item: CartItem) => {
    setCartItems((prev) => {
      // Find the exact item using the ID we passed from ProductDetail
      const existing = prev.find((i) => i.id === item.id);

      if (existing) {
        // 🔥 STRICT STOCK CHECK: Block if existing + new exceeds stock
        if (existing.quantity + item.quantity > item.stock) {
          toast.error(`Cannot add more. Only ${item.stock} items in stock.`, { id: "stock-error" });
          return prev; // Abort the update completely
        }

        toast.success("Updated cart quantity!", { id: "cart-update" });
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }

      // 🔥 STRICT STOCK CHECK FOR BRAND NEW ITEMS
      if (item.quantity > item.stock) {
         toast.error(`Only ${item.stock} items available.`, { id: "stock-error" });
         return prev; // Abort addition completely
      }

      toast.success("Added to cart!", { id: "cart-add" });
      return [...prev, item]; // Add the new item with its proper ID
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    toast.error("Item removed");
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          // 🔥 STRICT CHECK: Stop the Plus (+) button on the Cart Page from exceeding stock
          if (quantity > item.stock) {
            toast.error(`Only ${item.stock} items available in stock.`, { id: "stock-limit" });
            return item; // Return without updating quantity
          }
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => setCartItems([]);

  const getCartTotal = () =>
    cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const getCartCount = () =>
    cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const removePurchasedItems = (ids: string[]) => {
    setCartItems((prev) => prev.filter((item) => !ids.includes(item.id)));
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        removePurchasedItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}