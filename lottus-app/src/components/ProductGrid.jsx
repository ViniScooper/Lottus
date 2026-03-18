import React from 'react';
import { Link } from 'react-router-dom';
import { createPortal } from 'react-dom';
import './ProductGrid.css';

const products = [
  {
    id: 1,
    name: 'Bolsa Boho Lottus',
    price: 'R$ 180,00',
    image: '/images/crochet_bag_1773664603233.png',
    images: [
      '/images/crochet_bag_1773664603233.png',
      '/images/crochet_rugs_1773664671137.png', // Placeholder 2
      '/images/crochet_blanket_1773664622003.png' // Placeholder 3
    ],
    tag: 'Bestseller',
    details: {
      size: 'M',
      width: '30cm',
      height: '25cm',
      depth: '10cm',
      description: 'Uma bolsa versátil e elegante, perfeita para o dia a dia. Feita com fio de algodão sustentável.'
    }
  },
  {
    id: 2,
    name: 'Manta Cozy Color',
    price: 'R$ 350,00',
    image: '/images/crochet_blanket_1773664622003.png',
    images: [
      '/images/crochet_blanket_1773664622003.png',
      '/images/crochet_bag_1773664603233.png', 
    ],
    tag: 'Novo',
    details: {
      size: 'Casal',
      width: '1.50m',
      height: '2.00m',
      description: 'Aconchego puro para suas noites. Cores vibrantes que alegram qualquer ambiente.'
    }
  },
  {
    id: 3,
    name: 'Top Crochet Summer',
    price: 'R$ 120,00',
    image: '/images/crochet_top_1773664642938.png',
    images: [
      '/images/crochet_top_1773664642938.png',
    ],
    tag: 'Premium',
    details: {
      size: 'P/M',
      width: '40cm (ajustável)',
      height: '35cm',
      description: 'Leveza e estilo para os dias de sol. Design exclusivo que se molda ao corpo.'
    }
  },
  {
    id: 4,
    name: 'Kit Sousplat Mandala',
    price: 'R$ 95,00',
    image: '/images/crochet_rugs_1773664671137.png',
    images: [
      '/images/crochet_rugs_1773664671137.png',
    ],
    tag: 'Artesanal',
    details: {
      size: 'Único',
      width: '35cm (diâmetro)',
      description: 'Mesa posta com carinho. Conjunto de 4 peças com tramas em relevo.'
    }
  }
];

const ProductGrid = () => {
  const [selectedProduct, setSelectedProduct] = React.useState(null);
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

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
    const message = `Olá, Lottus! Gostei muito da *${selectedProduct.name}* (${selectedProduct.price}). Gostaria de encomendar!`;
    const wpUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(wpUrl, '_blank');
  };
  return (
    <section id="products" className="products">
      <div className="container">
        <div className="section-header" data-aos="fade-up">
          <h2 className="section-title">Nossas Peças</h2>
          <p className="section-subtitle">Cada ponto conta uma história</p>
        </div>
        
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
                <img src={product.image} alt={product.name} />
                <span className="product-tag">{product.tag}</span>
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="price">{product.price}</p>
              </div>
            </div>
          ))}
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
                  <p className="modal-price">{selectedProduct.price}</p>
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
        
        <div className="view-more">
          <Link to="/pecas" className="btn btn-outline">Ver Todas as Peças</Link>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
