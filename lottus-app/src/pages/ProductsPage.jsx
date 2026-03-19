import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../components/ProductGrid.css';
import './ProductsPage.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Em produção, /uploads é servido pelo Render. Em dev, pelo Vite.
const resolveImg = (url) => {
  if (!url) return '';
  if (url.startsWith('/uploads')) return `${API}${url}`;
  return url;
};

const ProductsPage = () => {
  const [allProducts, setAllProducts]     = useState([]);
  const [loading, setLoading]             = useState(true);
  const [searchTerm, setSearchTerm]       = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [selectedProduct, setSelectedProduct]   = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    document.title = 'Coleção e Produtos | Lottus Crochê';
    window.scrollTo({ top: 0, behavior: 'smooth' });

    fetch(`${API}/products`)
      .then(r => r.json())
      .then(data => { setAllProducts(Array.isArray(data) ? data : []); setLoading(false); })
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

  // Categorias dinâmicas a partir dos dados da API
  const categories = ['Todas', ...Array.from(new Set(allProducts.map(p => p.category)))];

  const filteredProducts = allProducts.filter(product => {
    const matchesSearch   = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todas' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const currentImg = selectedProduct
    ? resolveImg(selectedProduct.images?.[currentImageIndex] || selectedProduct.images?.[0] || '')
    : '';

  return (
    <div className="products-page">
      <Header />
      <main className="container page-content">
        <header className="page-header">
          <h1 className="brand-font">Nossas Peças</h1>
          <p>Explore toda a nossa coleção feita à mão.</p>
        </header>

        <section className="controls">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Buscar peça..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-tabs">
            {categories.map(cat => (
              <button
                key={cat}
                className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {loading ? (
          <div className="no-results">
            <p>Carregando peças... 🧶</p>
          </div>
        ) : (
          <div className="products-grid-full">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="product-card"
                  onClick={() => openModal(product)}
                  data-aos="fade-up"
                  data-aos-delay={index * 50}
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
              ))
            ) : (
              <div className="no-results">
                <p>Nenhuma peça encontrada com esses filtros. 🧶</p>
              </div>
            )}
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
                  <p className="modal-price">
                    R$ {Number(selectedProduct.price).toFixed(2).replace('.', ',')}
                  </p>
                  {selectedProduct.tag && (
                    <span className="product-tag" style={{ display: 'inline-block', marginBottom: '12px' }}>
                      {selectedProduct.tag}
                    </span>
                  )}
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
      </main>
      <Footer />
    </div>
  );
};

export default ProductsPage;
