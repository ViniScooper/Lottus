import React from 'react';
import './Hero.css';

const Hero = () => {
  return (
    <section id="home" className="hero">
      <div className="container hero-container">
        <div className="hero-content" data-aos="fade-right">
          <span className="hero-subtitle">Feito à mão, com amor</span>
          <h2 className="hero-title">A elegância do crochê em cada detalhe.</h2>
          <p className="hero-description">
            Peças exclusivas, artesanais e pensadas para trazer conforto e estilo ao seu dia a dia. Conheça a nossa coleção Lottus.
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
