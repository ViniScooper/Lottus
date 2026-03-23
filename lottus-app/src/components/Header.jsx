import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import logo from '../assets/branding/brand_vars/logo_main.png';
import './Header.css';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartCount, setIsCartOpen } = useContext(CartContext);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container header-container">
        <div className="logo">
          <Link to="/"><img src={logo} alt="Lottus" className="logo-img" /></Link>
        </div>
        
        <nav className={`nav ${isMenuOpen ? 'open' : ''}`}>
          <ul>
            <li><Link to="/" onClick={closeMenu}>Início</Link></li>
            <li><Link to="/pecas" onClick={closeMenu}>Peças</Link></li>
            <li><Link to="/sobre" onClick={closeMenu}>Sobre</Link></li>
            <li><a href="/#contact" onClick={closeMenu}>Contato</a></li>
          </ul>
        </nav>

        <div className="header-actions">
           <button className="cart-toggle-btn" onClick={() => setIsCartOpen(true)} aria-label="Abrir Sacola" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem', position: 'relative', marginRight: '15px' }}>
             <span className="cart-icon">🛒</span>
             {cartCount > 0 && <span className="cart-badge" style={{ position: 'absolute', top: '-5px', right: '-10px', background: 'var(--primary)', color: 'white', borderRadius: '50%', padding: '2px 6px', fontSize: '0.7rem', fontWeight: 'bold' }}>{cartCount}</span>}
           </button>

           <button className="menu-toggle" onClick={toggleMenu} aria-label="Abrir Menu">
             {isMenuOpen ? (
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
             ) : (
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
             )}
           </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
