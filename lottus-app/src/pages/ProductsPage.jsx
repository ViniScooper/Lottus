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
  const [collections, setCollections] = useState([]);
  const [selectedCollectionId, setSelectedCollectionId] = useState('all');
  const [showCollections, setShowCollections]   = useState(false);
  const [selectedProduct, setSelectedProduct]   = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showColdStartInfo, setShowColdStartInfo] = useState(false);
  
  // Estados para reviews
  const [reviewName, setReviewName] = useState('');
  const [reviewEmail, setReviewEmail] = useState('');
  const [reviewText, setReviewText]   = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  const dataLoad = async () => {
    setLoading(true);
    setShowColdStartInfo(false);
    const timer = setTimeout(() => setShowColdStartInfo(true), 3500);

    try {
      const [pRes, cRes] = await Promise.all([
        fetch(`${API}/products`),
        fetch(`${API}/collections`)
      ]);
      const products = await pRes.json();
      const colls = await cRes.json();

      setAllProducts(Array.isArray(products) ? products : []); 
      setCollections(Array.isArray(colls) ? colls : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false); 
      clearTimeout(timer);
    }
  };

  useEffect(() => {
    document.title = 'Coleção e Produtos | Lottus Crochê';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    dataLoad();
  }, []);

  const openModal = (product) => {
    setCurrentImageIndex(0);
    document.body.style.overflow = 'hidden';
    
    // Busca detalhes do produto para pegar as reviews atualizadas
    fetch(`${API}/products/${product.id}`)
      .then(r => r.json())
      .then(data => setSelectedProduct(data))
      .catch(() => setSelectedProduct(product)); // Fallback para o produto da lista
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

  // Categorias dinâmicas a partir dos dados da API
  const categories = ['Todas', ...Array.from(new Set(allProducts.map(p => p.category)))];

  const filteredProducts = allProducts.filter(product => {
    const matchesSearch   = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todas' || product.category === selectedCategory;
    const matchesCollection = selectedCollectionId === 'all' || product.collectionId === selectedCollectionId;
    return matchesSearch && matchesCategory && matchesCollection;
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

          <div className="collection-tabs-container" style={{ marginTop: '20px' }}>
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

            <div className={`collection-tabs-wrapper ${showCollections ? 'open' : ''}`}>
              <div className="collection-tabs" style={{ paddingBottom: '20px' }}>
                <button 
                  className={`collection-tab-btn ${selectedCollectionId === 'all' ? 'active' : ''}`}
                  onClick={() => { setSelectedCollectionId('all'); setShowCollections(false); }}
                >
                  Catálogo Geral
                </button>
                {collections.filter(c => c._count?.products > 0).map(coll => (
                  <button 
                    key={coll.id}
                    className={`collection-tab-btn ${selectedCollectionId === coll.id ? 'active' : ''}`}
                    onClick={() => { setSelectedCollectionId(coll.id); setShowCollections(false); }}
                  >
                    {coll.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {loading ? (
          <div className="loading-container">
            <div className="skeleton-grid">
              {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="skeleton-card" />)}
            </div>
            {showColdStartInfo && (
              <div className="cold-start-info">
                <div className="loader-spinner" style={{ margin: '0 auto 15px' }}></div>
                <p><strong>Buscando catálogo...</strong></p>
                <p>Estamos acordando nosso servidor 🧶<br/>Isso pode levar alguns segundos na primeira carga.</p>
                <button className="btn btn-outline" style={{ marginTop: '20px' }} onClick={fetchProducts}>Recarregar Agora</button>
              </div>
            )}
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
      </main>
      <Footer />
    </div>
  );
};

export default ProductsPage;
