import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../components/ProductGrid.css';
import './ProductsPage.css';

const allProducts = [
  {
    id: 1,
    name: 'Bolsa Boho Lottus',
    price: 180.00,
    category: 'Bolsas',
    image: '/images/crochet_bag_1773664603233.png',
    details: { size: 'M', width: '30cm', height: '25cm', description: 'Uma bolsa versátil e elegante.' }
  },
  {
    id: 2,
    name: 'Manta Cozy Color',
    price: 350.00,
    category: 'Casa',
    image: '/images/crochet_blanket_1773664622003.png',
    details: { size: 'Casal', width: '1.50m', height: '2.00m', description: 'Aconchego puro para suas noites.' }
  },
  {
    id: 3,
    name: 'Top Crochet Summer',
    price: 120.00,
    category: 'Roupas',
    image: '/images/crochet_top_1773664642938.png',
    details: { size: 'P/M', width: '40cm', height: '35cm', description: 'Leveza e estilo para os dias de sol.' }
  },
  {
    id: 4,
    name: 'Kit Sousplat Mandala',
    price: 95.00,
    category: 'Casa',
    image: '/images/crochet_rugs_1773664671137.png',
    details: { size: 'Único', width: '35cm', description: 'Mesa posta com carinho.' }
  },
  // Adicionando mais alguns exemplos para popular a busca/filtro
  {
    id: 5,
    name: 'Bolsa de Praia Shell',
    price: 150.00,
    category: 'Bolsas',
    image: '/images/crochet_bag_1773664603233.png',
    details: { size: 'G', width: '45cm', height: '40cm', description: 'Espaçosa e ideal para o verão.' }
  },
  {
    id: 6,
    name: 'Cestinho Organizador',
    price: 45.00,
    category: 'Casa',
    image: '/images/crochet_rugs_1773664671137.png',
    details: { size: 'P', width: '15cm', height: '15cm', description: 'Mantenha tudo no lugar com charme.' }
  }
];

const ProductsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    document.title = "Nossas Coleções | Lottus Crochê";
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    if (selectedProduct && selectedProduct.images) {
      setCurrentImageIndex((prev) => (prev === selectedProduct.images.length - 1 ? 0 : prev + 1));
    }
  };

  const prevImage = (e) => {
    e.stopPropagation();
    if (selectedProduct && selectedProduct.images) {
      setCurrentImageIndex((prev) => (prev === 0 ? selectedProduct.images.length - 1 : prev - 1));
    }
  };

  const handleWhatsAppOrder = () => {
    if(!selectedProduct) return;
    const phoneNumber = "558192496177"; 
    const message = `Olá, Lottus! Gostei muito da *${selectedProduct.name}* (R$ ${selectedProduct.price.toFixed(2).replace('.', ',')}). Gostaria de encomendar!`;
    const wpUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(wpUrl, '_blank');
  };

  const categories = ['Todas', 'Bolsas', 'Roupas', 'Casa'];

  const filteredProducts = allProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todas' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
                  <img src={product.image} alt={product.name} />
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="price">R$ {product.price.toFixed(2).replace('.', ',')}</p>
                </div>
              </div>
                ))
          ) : (
            <div className="no-results">
              <p>Nenhuma peça encontrada com esses filtros. 🧶</p>
            </div>
          )}
        </div>

        {selectedProduct && createPortal(
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={closeModal}>&times;</button>
              <div className="modal-body">
                <div className="modal-image">
                  <img src={selectedProduct.images ? selectedProduct.images[currentImageIndex] : selectedProduct.image} alt={selectedProduct.name} />
                  {selectedProduct.images && selectedProduct.images.length > 1 && (
                    <div className="gallery-controls">
                      <button className="gallery-btn" onClick={prevImage}>&#10094;</button>
                      <button className="gallery-btn" onClick={nextImage}>&#10095;</button>
                    </div>
                  )}
                  {selectedProduct.images && selectedProduct.images.length > 1 && (
                    <div className="gallery-dots">
                      {selectedProduct.images.map((_, idx) => (
                        <span key={idx} className={`dot ${idx === currentImageIndex ? 'active' : ''}`} onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx) }}></span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="modal-details">
                  <h2 className="brand-font">{selectedProduct.name}</h2>
                  <p className="modal-price">R$ {selectedProduct.price.toFixed(2).replace('.', ',')}</p>
                  <p className="modal-desc">{selectedProduct.details.description}</p>
                  
                  <div className="specs">
                    <div className="spec-item">
                      <span>Tamanho:</span>
                      <strong>{selectedProduct.details.size}</strong>
                    </div>
                    {selectedProduct.details.width && (
                      <div className="spec-item">
                        <span>Largura:</span>
                        <strong>{selectedProduct.details.width}</strong>
                      </div>
                    )}
                    {selectedProduct.details.height && (
                      <div className="spec-item">
                        <span>Altura:</span>
                        <strong>{selectedProduct.details.height}</strong>
                      </div>
                    )}
                  </div>
                  
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
