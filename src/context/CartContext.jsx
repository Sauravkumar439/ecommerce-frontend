import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const stored = localStorage.getItem("cart");
    return stored ? JSON.parse(stored) : [];
  });

  // 🧠 Sync cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // ✅ Use _id for identification
  const addToCart = (product) => {
    setCart((prev) => {
      const exists = prev.find((item) => item._id === product._id);
      if (exists) {
        return prev.map((item) =>
          item._id === product._id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const decreaseQty = (id) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item._id === id ? { ...item, qty: item.qty - 1 } : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
  };

  const updateQty = (id, qty) => {
    setCart((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, qty: Math.max(1, qty) } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        decreaseQty,
        removeFromCart,
        updateQty,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
