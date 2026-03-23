import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('lottus_cart');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('lottus_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;
    setCartItems(prev => 
      prev.map(item => 
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const cartTotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const getWhatsAppLink = () => {
    const phoneNumber = '558192496177';
    let text = `Olá, Lottus! Gostaria de fazer o seguinte pedido:\n\n`;
    
    cartItems.forEach(item => {
      const itemPrice = Number(item.product.price).toFixed(2).replace('.', ',');
      const itemTotal = Number(item.product.price * item.quantity).toFixed(2).replace('.', ',');
      text += `🛍️ *${item.quantity}x ${item.product.name}*\n`;
      text += `   Preço un.: R$ ${itemPrice} | Total: R$ ${itemTotal}\n\n`;
    });
    
    text += `*Valor Total dos Produtos: R$ ${cartTotal.toFixed(2).replace('.', ',')}*\n\n`;
    text += `Aguardo o cálculo do frete e os detalhes para pagamento. Obrigado!`;
    
    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;
  };

  const checkout = () => {
    window.open(getWhatsAppLink(), '_blank');
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      isCartOpen,
      setIsCartOpen,
      addToCart,
      removeFromCart,
      updateQuantity,
      cartTotal,
      cartCount,
      checkout
    }}>
      {children}
    </CartContext.Provider>
  );
};
