import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import './CartSidebar.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const resolveImg = (url) => {
  if (!url) return '';
  if (url.startsWith('/uploads')) return `${API}${url}`;
  return url;
};

const CartSidebar = () => {
  const { isCartOpen, setIsCartOpen, cartItems, removeFromCart, updateQuantity, cartTotal, checkout } = useContext(CartContext);

  if (!isCartOpen) return null;

  return (
    <>
      <div className="cart-overlay" onClick={() => setIsCartOpen(false)}></div>
      <div className="cart-sidebar">
        <div className="cart-header">
          <h3>Sua Sacola 🛍️</h3>
          <button className="cart-close" onClick={() => setIsCartOpen(false)}>&times;</button>
        </div>

        <div className="cart-items">
          {cartItems.length === 0 ? (
            <div className="cart-empty">
              <p>Sua sacola está vazia.</p>
              <button className="btn btn-outline" onClick={() => setIsCartOpen(false)}>Continuar Explorando</button>
            </div>
          ) : (
            cartItems.map(item => (
              <div key={item.product.id} className="cart-item">
                <img src={resolveImg(item.product.images?.[0])} alt={item.product.name} className="cart-item-img" />
                <div className="cart-item-info">
                  <h4>{item.product.name}</h4>
                  <p className="cart-item-price">R$ {Number(item.product.price).toFixed(2).replace('.', ',')}</p>
                  
                  <div className="cart-item-actions">
                    <div className="qty-controls">
                      <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>+</button>
                    </div>
                    <button className="cart-item-remove" onClick={() => removeFromCart(item.product.id)}>Remover</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Total:</span>
              <span>R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
            </div>
            <button className="btn btn-primary cart-checkout-btn" onClick={checkout}>
              Finalizar Pedido via WhatsApp
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;
