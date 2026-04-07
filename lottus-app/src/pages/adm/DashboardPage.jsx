import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { removeToken } from '../../services/api';
import ProductsAdm from './ProductsAdm';
import VitrineAdm from './VitrineAdm';
import ConfigAdm from './ConfigAdm';
import ReviewsAdm from './ReviewsAdm';
import StockAdm from './StockAdm';
import OrdersAdm from './OrdersAdm';
import FaqAdm from './FaqAdm';
import AboutAdm from './AboutAdm';
import './AdminStyles.css';

const DashboardPage = () => {
  const [activeSection, setActiveSection] = useState('products');
  const navigate = useNavigate();

  const adminName = (() => {
    try {
      const token = localStorage.getItem('lottus_adm_token');
      if (!token) return 'Admin';
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.name || 'Admin';
    } catch { return 'Admin'; }
  })();

  const handleLogout = () => {
    removeToken();
    navigate('/adm/login');
  };

  const sections = [
    { id: 'products', label: '📦 Produtos',    icon: '📦' },
    { id: 'orders',   label: '🛋️ Pedidos',    icon: '🛋️' },
    { id: 'stock',    label: '🧵 Estoque',    icon: '🧵' },
    { id: 'vitrine',  label: '🏠 Vitrine',    icon: '🏠' },
    { id: 'about',    label: '📖 História',   icon: '📖' },
    { id: 'reviews',  label: '⭐ Avaliações', icon: '⭐' },
    { id: 'faqs',     label: '❓ Dúvidas',    icon: '❓' },
    { id: 'config',   label: '⚙️ Site',       icon: '⚙️' },
  ];

  return (
    <div className="adm-layout">
      {/* Sidebar */}
      <aside className="adm-sidebar">
        <div className="adm-sidebar-brand">
          <span className="adm-brand-icon">🧶</span>
          <div>
            <strong>Lottus ADM</strong>
            <small>Olá, {adminName}</small>
          </div>
        </div>

        <nav className="adm-nav">
          {sections.map(s => (
            <button
              key={s.id}
              className={`adm-nav-item ${activeSection === s.id ? 'active' : ''}`}
              onClick={() => setActiveSection(s.id)}
            >
              <span>{s.icon}</span>
              {s.label.replace(/^[^ ]+ /, '')}
            </button>
          ))}
        </nav>

        <div className="adm-sidebar-footer">
          <a href="/" target="_blank" className="adm-nav-item">
            <span>🌐</span> Ver Site
          </a>
          <button className="adm-nav-item adm-logout" onClick={handleLogout}>
            <span>🚪</span> Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="adm-main">
        <div className="adm-topbar">
          <h2>
            {sections.find(s => s.id === activeSection)?.label}
          </h2>
        </div>

        <div className="adm-content">
          {activeSection === 'products' && <ProductsAdm />}
          {activeSection === 'vitrine'  && <VitrineAdm />}
          {activeSection === 'about'    && <AboutAdm />}
          {activeSection === 'reviews'  && <ReviewsAdm />}
          {activeSection === 'faqs'     && <FaqAdm />}
          {activeSection === 'stock'    && <StockAdm />}
          {activeSection === 'orders'   && <OrdersAdm />}
          {activeSection === 'config'   && <ConfigAdm />}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
