import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPortal } from 'react-dom';
import './ProductGrid.css';

const API = 'http://localhost:3001';

// /uploads/ é servido pelo Vite (public/uploads/) — não precisa do prefixo da API
const resolveImg = (url) => {
  if (!url) return '';
  return url; // O browser resolve relativo ao origin atual (localhost:5173)
};

const ProductGrid = () => {
  const [products, setProducts]           = useState([]);
  const [loading, setLoading]             = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Busca apenas produtos marcados como "featured" (Vitrine da Home)
  useEffect(() => {
    fetch(`${API}/products?featured=true`)
      .then(r => r.json())
      .then(data => { setProducts(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const openModal = (product) => {
    setSelectedProduct(product);
    setCurrentImageIndex(0);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedProduct(null);
    document.body.style.overflow = '';
  };

  const nextImage = (e) => {
    e.stopPropagation();
    if (selectedProduct?.images?.length) {
      setCurrentImageIndex(prev => (prev === selectedProduct.images.length - 1 ? 0 : prev + 1));
    }
  };

  const prevImage = (e) => {
    e.stopPropagation();
    if (selectedProduct?.images?.length) {
      setCurrentImageIndex(prev => (prev === 0 ? selectedProduct.images.length - 1 : prev - 1));
    }
  };

  const handleWhatsAppOrder = () => {
    if (!selectedProduct) return;
    const phoneNumber = '558192496177';
    const price = `R$ ${Number(selectedProduct.price).toFixed(2).replace('.', ',')}`;
    const message = `Olá, Lottus! Gostei muito da *${selectedProduct.name}* (${price}). Gostaria de encomendar!`;
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const currentImg = selectedProduct
    ? resolveImg(selectedProduct.images?.[currentImageIndex] || selectedProduct.images?.[0] || '')
    : '';

  return (
    <section id="products" className="products">
      <div className="container">
        <div className="section-header" data-aos="fade-up">
          <h2 className="section-title">Nossas Peças</h2>
          <p className="section-subtitle">Cada ponto conta uma história</p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#888' }}>Carregando peças...</div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#888' }}>
            <p style={{ fontSize: '1.1rem' }}>Em breve novidades! 🧶</p>
            <p style={{ fontSize: '0.9rem', marginTop: '8px' }}>
              Enquanto isso, <Link to="/pecas" style={{ color: 'var(--primary)' }}>veja todo o catálogo</Link>.
            </p>
          </div>
        ) : (
          <div className="product-grid">
            {products.map((product, index) => (
              <div
                key={product.id}
                className="product-card"
                onClick={() => openModal(product)}
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="product-image">
                  <img src={resolveImg(product.images?.[0])} alt={product.name} />
                  {product.tag && <span className="product-tag">{product.tag}</span>}
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="price">R$ {Number(product.price).toFixed(2).replace('.', ',')}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedProduct && createPortal(
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={closeModal}>&times;</button>
              <div className="modal-body">
                <div className="modal-image">
                  <img src={currentImg} alt={selectedProduct.name} />
                  {selectedProduct.images?.length > 1 && (
                    <>
                      <div className="gallery-controls">
                        <button className="gallery-btn" onClick={prevImage}>&#10094;</button>
                        <button className="gallery-btn" onClick={nextImage}>&#10095;</button>
                      </div>
                      <div className="gallery-dots">
                        {selectedProduct.images.map((_, idx) => (
                          <span
                            key={idx}
                            className={`dot ${idx === currentImageIndex ? 'active' : ''}`}
                            onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx); }}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
                <div className="modal-details">
                  <h2 className="brand-font">{selectedProduct.name}</h2>
                  <p className="modal-price">R$ {Number(selectedProduct.price).toFixed(2).replace('.', ',')}</p>
                  {selectedProduct.tag && <span className="product-tag" style={{ display: 'inline-block', marginBottom: '12px' }}>{selectedProduct.tag}</span>}
                  <p className="modal-desc">{selectedProduct.description}</p>
                  <button className="btn btn-primary modal-buy-btn" onClick={handleWhatsAppOrder}>
                    Pedir no WhatsApp
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}

        <div className="view-more">
          <Link to="/pecas" className="btn btn-outline">Ver Todas as Peças</Link>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
