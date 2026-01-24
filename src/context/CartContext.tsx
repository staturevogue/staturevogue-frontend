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
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, "id">) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  removePurchasedItems: (ids: string[]) => void; // <--- ADD THIS
  
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

  const addToCart = (item: Omit<CartItem, "id">) => {
    setCartItems((prev) => {
      const existing = prev.find(
        (i) =>
          i.productId === item.productId &&
          i.color === item.color &&
          i.size === item.size
      );

      if (existing) {
        toast.success("Updated cart quantity!");
        return prev.map((i) =>
          i.productId === item.productId &&
          i.color === item.color &&
          i.size === item.size
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      toast.success("Added to cart!");
      return [...prev, { ...item, id: Date.now().toString() }];
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    toast.error("Item removed");
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
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