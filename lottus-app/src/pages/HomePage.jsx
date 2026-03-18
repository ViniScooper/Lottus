import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import ProductGrid from '../components/ProductGrid';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import '../App.css';
import './HomePage.css'; // Add este para estilos locais

const testimonials = [
  {
    id: 1,
    name: 'Vitória Silva',
    text: 'A bolsa Boho superou todas as expectativas! Os detalhes são perfeitos e recebo elogios sempre que uso.',
    role: 'Cliente Lottus',
    rating: 5
  },
  {
    id: 2,
    name: 'Letícia Andrade',
    text: 'Comprei o Kit Sousplat para dar de presente e o capricho da embalagem junto com a qualidade das peças me deixaram encantada!',
    role: 'Cliente Lottus',
    rating: 5
  },
  {
    id: 3,
    name: 'Camila Rocha',
    text: 'A manta é pesadinha, super quente e lindíssima. A energia e o cuidado no tricô são palpáveis. Super recomendo!',
    role: 'Cliente Lottus',
    rating: 5
  }
];

const faqs = [
  {
    question: 'Como faço para encomendar uma peça que não está no site?',
    answer: 'Nós amamos projetos personalizados! Basta clicar no botão flutuante do WhatsApp e mandar uma foto ou ideia do que você deseja. Vamos conversar sobre cores e o prazo de produção ideal para você.'
  },
  {
    question: 'Qual o tempo médio de produção?',
    answer: 'Nossas peças são 100% manuais ("slow fashion"). Para itens em estoque, o envio é em até 48h. Para encomendas, pedimos de 10 a 15 dias úteis para a confecção da sua peça com o máximo de carinho.'
  },
  {
    question: 'Como devo lavar as minhas peças de crochê?',
    answer: 'Recomendamos a lavagem à mão com sabão neutro e secagem à sombra, em superfície plana (nunca pendure para não deformar). Com esse cuidado, suas peças Lottus podem durar por gerações.'
  },
  {
    question: 'Quais são as formas de pagamento disponíveis?',
    answer: 'Aceitamos PIX, transferência bancária e dividimos no cartão de crédito via link seguro do PagSeguro/MercadoPago. Você escolhe a melhor opção durante nossa conversa pelo WhatsApp!'
  }
];

const FAQItem = ({ faq }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className={`faq-item ${isOpen ? 'active' : ''}`} onClick={() => setIsOpen(!isOpen)}>
      <div className="faq-question">
        <h3 className="brand-font">{faq.question}</h3>
        <span className="faq-toggle">{isOpen ? '−' : '+'}</span>
      </div>
      <div className="faq-answer">
        <p>{faq.answer}</p>
      </div>
    </div>
  );
};

const HomePage = () => {
  useEffect(() => {
    document.title = "Lottus Crochê | Início";
  }, []);

  return (
    <>
      <Hero />
      <ProductGrid />
      
      {/* Depoimentos - Prova Social */}
      <section className="testimonials">
        <div className="container">
          <div className="section-header" data-aos="fade-up">
            <h2 className="section-title">O Que Dizem Nossas Clientes</h2>
            <p className="section-subtitle">O carinho que volta em forma de palavras</p>
          </div>
          
          <div className="testimonials-grid">
            {testimonials.map((testi, i) => (
              <div className="testimonial-card" key={testi.id} data-aos="fade-up" data-aos-delay={i * 150}>
                <div className="stars">{'★'.repeat(testi.rating)}</div>
                <p className="testi-text">"{testi.text}"</p>
                <div className="testi-author">
                  <span className="author-name brand-font">{testi.name}</span>
                  <span className="author-role">{testi.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dúvidas Frequentes (FAQ) */}
      <section className="faq-section bg-light">
        <div className="container">
          <div className="section-header" data-aos="fade-up">
            <h2 className="section-title">Dúvidas Frequentes</h2>
            <p className="section-subtitle">Tudo o que você precisa saber antes de encomendar</p>
          </div>
          
          <div className="faq-container" data-aos="fade-up" data-aos-delay="200">
            {faqs.map((faq, index) => (
              <FAQItem key={index} faq={faq} />
            ))}
          </div>
        </div>
      </section>

      <Contact />
    </>
  );
};

export default HomePage;
