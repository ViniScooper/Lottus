import React, { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './AboutPage.css';

const AboutPage = () => {
  useEffect(() => {
    document.title = "Nossa História | Lottus Crochê";
  }, []);

  return (
    <div className="about-page">
      <Header />
      
      <main className="about-content">
        <section className="about-hero">
          <div className="container">
            <h1 className="brand-font about-title">Nossa História</h1>
            <p className="about-subtitle">Como os fios se entrelaçaram para criar a Lottus.</p>
          </div>
        </section>

        <section className="about-story container">
          <div className="story-grid">
            <div className="story-text">
              <h2 className="brand-font">O Começo de Tudo</h2>
              <p>
                A Lottus nasceu de uma paixão genuína pela arte do fazer manual. O que antes era apenas
                um hobby cultivado em tardes tranquilas, um ponto de cada vez, transformou-se no sonho
                de compartilhar afeto através do crochê.
              </p>
              <p>
                O nome "Lottus" (Lótus) foi escolhido por sua simbologia de pureza, renascimento e 
                beleza que emerge com força. Da mesma forma, cada uma de nossas peças nasce de fios 
                simples que, atados com cuidado e paciência, desabrocham em criações únicas e marcantes.
              </p>
              
              <h2 className="brand-font section-spacing">Nossos Valores</h2>
              <ul className="values-list">
                <li>
                  <strong>Artesanal & Único:</strong> Cada bolsa, roupa ou item de decoração leva horas de 
                  dedicação. Nenhuma peça é exatamente igual à outra.
                </li>
                <li>
                  <strong>Sustentabilidade:</strong> Valorizamos fios ecológicos e um processo de 
                  produção lento (slow fashion), que respeita o tempo das coisas.
                </li>
                <li>
                  <strong>Conforto & Estilo:</strong> Acreditamos que o crochê moderno pode ser extremamente 
                  elegante, mesclando a tradição das avós com o design contemporâneo.
                </li>
              </ul>
            </div>
            
            <div className="story-images">
              <div className="image-card primary-image">
                <img src="/images/crochet_bag_1773664603233.png" alt="Detalhe do nosso crochê" />
                <div className="image-caption brand-font">Criado a mão.</div>
              </div>
              <div className="image-card secondary-image">
                <img src="/images/crochet_blanket_1773664622003.png" alt="Nosso ateliê" />
              </div>
            </div>
          </div>
        </section>

        <section className="about-cta">
          <div className="container text-center">
            <h2 className="brand-font">Faça parte da nossa história</h2>
            <p>Leve um pedacinho da Lottus para a sua rotina.</p>
            <a href="/pecas" className="btn btn-secondary mt-3">Ver Nossas Peças</a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
