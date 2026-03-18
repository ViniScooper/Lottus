import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/branding/brand_vars/logo_main.png';
import './Header.css';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
