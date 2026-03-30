import React, { useContext } from 'react';
import { ConfigContext } from '../context/ConfigContext';
import './Hero.css';

const Hero = () => {
  const { config } = useContext(ConfigContext);
  
  const title = config?.hero_title || 'A elegância do crochê em cada detalhe.';
  const subtitle = config?.hero_subtitle || 'Feito à mão, com amor';
  const description = config?.hero_description || 'Peças exclusivas, artesanais e pensadas para trazer conforto e estilo ao seu dia a dia. Conheça a nossa coleção Lottus.';

  return (
    <section id="home" className="hero">
      <div className="container hero-container">
        <div className="hero-content" data-aos="fade-right">
          <span className="hero-subtitle">{subtitle}</span>
          <h2 className="hero-title">{title}</h2>
          <p className="hero-description">
            {description}
          </p>
          <div className="hero-btns">
            <a href="#products" className="btn btn-primary">Ver Coleção</a>
            <a href="#contact" className="btn btn-outline">Falar Conosco</a>
          </div>
        </div>
        <div className="hero-image" data-aos="fade-left">
           <div className="image-wrapper">
             <img src="/images/crochet_bag_1773664603233.png" alt="Lottus Crochet Bag" />
             <div className="image-badge">Handmade</div>
           </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
