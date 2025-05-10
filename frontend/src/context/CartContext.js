import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const CartContext = createContext();
const API_BASE = 'http://localhost:5000/api/cart';
const USER_ID = 'user123';

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const { data } = await axios.get(`${API_BASE}/${USER_ID}`);
        setCart(data);
      } catch (err) {
        console.error('Failed to fetch cart:', err);
      }
    };
    fetchCart();
  }, []);

  const syncCart = async (updatedCart) => {
    setCart(updatedCart);
    try {
      await axios.post(`${API_BASE}/${USER_ID}`, { items: updatedCart });
    } catch (err) {
      console.error('Failed to sync cart:', err);
    }
  };

  const updateQuantity = (id, quantity) => {
    const updatedCart = cart.map(item =>
      item._id === id ? { ...item, quantity } : item
    );
    syncCart(updatedCart);
  };

  const removeFromCart = (id) => {
    const updatedCart = cart.filter(item => item._id !== id);
    syncCart(updatedCart);
  };

  const clearCart = () => syncCart([]);

  const addToCart = (newItem) => {
    const exists = cart.find(item => item._id === newItem._id);
    const updatedCart = exists
      ? cart.map(item =>
        item._id === newItem._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
      : [...cart, { ...newItem, quantity: 1 }];
    syncCart(updatedCart);
  };

  const getCartCount = () => cart.reduce((acc, item) => acc + item.quantity, 0);
  const getCartTotal = () =>
    cart.reduce((acc, item) => acc + item.quantity * item.price, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        updateQuantity,
        removeFromCart,
        clearCart,
        addToCart,
        getCartCount,
        getCartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
