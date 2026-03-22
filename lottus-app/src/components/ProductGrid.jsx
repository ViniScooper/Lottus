import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPortal } from 'react-dom';
import './ProductGrid.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Em produção, /uploads é servido pelo Render (API). Em dev, pelo Vite.
const resolveImg = (url) => {
  if (!url) return '';
  if (url.startsWith('/uploads')) return `${API}${url}`;
  return url;
};

const ProductGrid = () => {
  const [products, setProducts]           = useState([]);
  const [collections, setCollections]     = useState([]);
  const [activeCollectionId, setActiveCollectionId] = useState('featured');
  const [showCollections, setShowCollections]   = useState(false);
  const [featuredCollection, setFeaturedCollection] = useState(null);
  const [loading, setLoading]             = useState(true);
  const [showColdStartInfo, setShowColdStartInfo] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Estados para reviews
  const [reviewName, setReviewName] = useState('');
  const [reviewEmail, setReviewEmail] = useState('');
  const [reviewText, setReviewText]   = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    setShowColdStartInfo(false);
    const timer = setTimeout(() => setShowColdStartInfo(true), 3500);

    try {
      // 1. Busca configurações e coleções simultaneamente
      const [cfgRes, collsRes] = await Promise.all([
        fetch(`${API}/config`),
        fetch(`${API}/collections`)
      ]);
      
      const cfg = await cfgRes.json();
      const colls = await collsRes.json();
      
      // Filtrar apenas coleções que possuem produtos
      const activeColls = (Array.isArray(colls) ? colls : []).filter(c => c._count?.products > 0);
      setCollections(activeColls);

      // 2. Determina qual coleção/filtro mostrar primeiro
      let initialCollId = 'featured';
      if (cfg.featured_collection_id) {
        initialCollId = cfg.featured_collection_id;
      }
      
      setActiveCollectionId(initialCollId);
      await loadCollectionProducts(initialCollId);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      clearTimeout(timer);
    }
  };

  const loadCollectionProducts = async (collId) => {
    try {
      if (collId === 'featured') {
        const res = await fetch(`${API}/products?featured=true`);
        const data = await res.json();
        setProducts(data);
      } else {
        const res = await fetch(`${API}/collections/${collId}`);
        const data = await res.json();
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error('Erro ao carregar produtos da coleção:', err);
    }
  };

  const handleCollectionChange = (id) => {
    setActiveCollectionId(id);
    loadCollectionProducts(id);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openModal = (product) => {
    setCurrentImageIndex(0);
    document.body.style.overflow = 'hidden';

    // Busca detalhes do produto para pegar as reviews atualizadas
    fetch(`${API}/products/${product.id}`)
      .then(r => r.json())
      .then(data => setSelectedProduct(data))
      .catch(() => setSelectedProduct(product));
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

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewName || !reviewEmail || !reviewText) {
      setReviewError('Por favor, preencha todos os campos.');
      return;
    }

    setIsSubmittingReview(true);
    setReviewError('');
    setReviewSuccess('');

    try {
      const res = await fetch(`${API}/products/${selectedProduct.id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: reviewName,
          email: reviewEmail,
          review: reviewText
        })
      });

      if (!res.ok) throw new Error('Erro ao enviar avaliação.');

      setReviewSuccess('Avaliação enviada com sucesso!');
      setReviewName('');
      setReviewEmail('');
      setReviewText('');

      // Recarrega o produto para mostrar a nova review
      const productRes = await fetch(`${API}/products/${selectedProduct.id}`);
      const updatedProduct = await productRes.json();
      setSelectedProduct(updatedProduct);

    } catch (err) {
      setReviewError(err.message);
    } finally {
      setIsSubmittingReview(false);
    }
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

          {/* Flag de Coleções */}
          <div className="collections-flag-container">
            <button 
              className={`collections-flag ${showCollections ? 'active' : ''}`}
              onClick={() => setShowCollections(!showCollections)}
            >
              <span>{showCollections ? 'Ocultar Coleções' : 'Ver Coleções'}</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d={showCollections ? "M18 15l-6-6-6 6" : "M6 9l6 6 6-6"}/>
              </svg>
            </button>
          </div>

          {/* Filtros de Coleção (Condicional) */}
          <div className={`collection-tabs-wrapper ${showCollections ? 'open' : ''}`}>
            <div className="collection-tabs">
              <button 
                className={`collection-tab-btn ${activeCollectionId === 'featured' ? 'active' : ''}`}
                onClick={() => { handleCollectionChange('featured'); setShowCollections(false); }}
              >
                Destaques
              </button>
              {collections.map(coll => (
                <button 
                  key={coll.id}
                  className={`collection-tab-btn ${activeCollectionId === coll.id ? 'active' : ''}`}
                  onClick={() => { handleCollectionChange(coll.id); setShowCollections(false); }}
                >
                  {coll.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="skeleton-grid">
              {[1, 2, 3].map(i => <div key={i} className="skeleton-card" />)}
            </div>
            {showColdStartInfo && (
              <div className="cold-start-info">
                <div className="loader-spinner" style={{ margin: '0 auto 15px' }}></div>
                <p><strong>Aguarde um instante...</strong></p>
                <p>Estamos acordando nosso servidor 🧶<br/>Como usamos um serviço gratuito, a primeira carga do dia pode levar até 40 segundos.</p>
              </div>
            )}
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#888' }}>
            <p style={{ fontSize: '1.2rem' }}>Ainda não temos peças em destaque aqui. 🧶</p>
            <p style={{ fontSize: '0.9rem', marginTop: '12px' }}>
              Mas você pode conferir o <Link to="/pecas" style={{ color: 'var(--primary)', fontWeight: '600' }}>catálogo completo clicando aqui</Link>.
            </p>
            <button className="btn btn-outline" style={{ marginTop: '20px' }} onClick={fetchProducts}>Tentar Novamente</button>
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

                  {/* Seção de Avaliações */}
                  <div className="modal-reviews-section">
                    <hr className="modal-divider" />
                    <h3 className="brand-font">Avaliações</h3>
                    
                    <div className="reviews-list">
                      {selectedProduct.reviews?.length > 0 ? (
                        selectedProduct.reviews.map((rev) => (
                          <div key={rev.id} className="review-item">
                            <div className="review-header">
                              <span className="review-author">{rev.name}</span>
                              <span className="review-date">
                                {new Date(rev.createdAt).toLocaleDateString('pt-BR')}
                              </span>
                            </div>
                            <p className="review-comment">{rev.review}</p>
                          </div>
                        ))
                      ) : (
                        <p className="no-reviews">Ainda não há avaliações para esta peça. Seja o primeiro!</p>
                      )}
                    </div>

                    <form className="review-form" onSubmit={handleReviewSubmit}>
                      <h4 className="brand-font">Deixe sua avaliação</h4>
                      <div className="form-group">
                        <input
                          type="text"
                          placeholder="Seu Nome"
                          value={reviewName}
                          onChange={(e) => setReviewName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <input
                          type="email"
                          placeholder="Seu Email"
                          value={reviewEmail}
                          onChange={(e) => setReviewEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <textarea
                          placeholder="Seu comentário sobre o produto..."
                          value={reviewText}
                          onChange={(e) => setReviewText(e.target.value)}
                          required
                        />
                      </div>
                      
                      {reviewError && <p className="review-error">{reviewError}</p>}
                      {reviewSuccess && <p className="review-success">{reviewSuccess}</p>}
                      
                      <button 
                        type="submit" 
                        className="btn btn-outline btn-sm" 
                        disabled={isSubmittingReview}
                      >
                        {isSubmittingReview ? 'Enviando...' : 'Publicar Avaliação'}
                      </button>
                    </form>
                  </div>
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
