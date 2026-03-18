import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <h2 className="brand-font">LOTTUS</h2>
            <p>Artesanato com alma e propósito. Criando peças únicas para momentos especiais.</p>
          </div>
          <div className="footer-links">
            <h4>Páginas</h4>
            <ul>
              <li><Link to="/">Início</Link></li>
              <li><Link to="/pecas">Peças</Link></li>
              <li><Link to="/sobre">Sobre</Link></li>
              <li><a href="/#contact">Contato</a></li>
            </ul>
          </div>
          <div className="footer-newsletter">
             <h4>Newsletter</h4>
             <p>Receba novidades e promoções exclusivas.</p>
             <div className="newsletter-form">
               <input type="email" placeholder="Seu email" />
               <button className="btn-small">Assinar</button>
             </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Lottus Crochê. Todos os direitos reservados.</p>
          <div className="payment-methods">
             {/* Simple payment icons or text */}
             <span>Visa</span> • <span>Mastercard</span> • <span>Pix</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
