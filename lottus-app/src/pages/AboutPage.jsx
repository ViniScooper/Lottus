import React, { useEffect, useContext } from 'react';
import { ConfigContext } from '../context/ConfigContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './AboutPage.css';

const defaultValuesList = [
  {
    title: 'Artesanal & Único',
    text: 'Cada bolsa, roupa ou item de decoração leva horas de dedicação. Nenhuma peça é exatamente igual à outra.'
  },
  {
    title: 'Sustentabilidade',
    text: 'Valorizamos fios ecológicos e um processo de produção lento (slow fashion), que respeita o tempo das coisas.'
  },
  {
    title: 'Conforto & Estilo',
    text: 'Acreditamos que o crochê moderno pode ser extremamente elegante, mesclando a tradição das avós com o design contemporâneo.'
  }
];

const AboutPage = () => {
  const { config } = useContext(ConfigContext);
  
  const title = config?.about_title || 'Nossa História';
  const subtitle = config?.about_subtitle || 'Como os fios se entrelaçaram para criar a Lottus.';
  const contentTitle = config?.about_content_title || 'O Começo de Tudo';
  const description1 = config?.about_description_1 || config?.about_description || 'A Lottus nasceu de uma paixão genuína pela arte do fazer manual. O que antes era apenas um hobby cultivado em tardes tranquilas, um ponto de cada vez, transformou-se no sonho de compartilhar afeto através do crochê.';
  const description2 = config?.about_description_2 || 'O nome "Lottus" (Lótus) foi escolhido por sua simbologia de pureza, renascimento e beleza que emerge com força. Da mesma forma, cada uma de nossas peças nasce de fios simples que, atados com cuidado e paciência, desabrocham em criações únicas e marcantes.';
  
  const imgPrimary = config?.about_img_primary || '/images/crochet_bag_1773664603233.png';
  const imgSecondary = config?.about_img_secondary || '/images/crochet_blanket_1773664622003.png';

  const ctaTitle = config?.about_cta_title || 'Faça parte da nossa história';
  const ctaSubtitle = config?.about_cta_subtitle || 'Leve um pedacinho da Lottus para a sua rotina.';
  const ctaButtonText = config?.about_cta_button_text || 'Ver Nossas Peças';

  let parsedValues = defaultValuesList;
  if (config?.about_values) {
    try {
      const parsed = JSON.parse(config.about_values);
      if (Array.isArray(parsed) && parsed.length > 0) parsedValues = parsed;
    } catch(e) {}
  }

  useEffect(() => {
    document.title = `${title} | Lottus Crochê`;
  }, [title]);

  return (
    <div className="about-page">
      <Header />
      
      <main className="about-content">
        <section className="about-hero">
          <div className="container">
            <h1 className="brand-font about-title">{title}</h1>
            <p className="about-subtitle">{subtitle}</p>
          </div>
        </section>

        <section className="about-story container">
          <div className="story-grid">
            <div className="story-text">
              <h2 className="brand-font">{contentTitle}</h2>
              <p>{description1}</p>
              <p>{description2}</p>
              
              <h2 className="brand-font section-spacing">Nossos Valores</h2>
              <ul className="values-list">
                {parsedValues.map((val, idx) => (
                  <li key={idx}>
                    <strong>{val.title}: </strong> {val.text}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="story-images">
              <div className="image-card primary-image">
                <img src={imgPrimary} alt="Detalhe do nosso crochê" />
                <div className="image-caption brand-font">Criado a mão.</div>
              </div>
              <div className="image-card secondary-image">
                <img src={imgSecondary} alt="Nosso ateliê" />
              </div>
            </div>
          </div>
        </section>

        <section className="about-cta">
          <div className="container text-center">
            <h2 className="brand-font">{ctaTitle}</h2>
            <p>{ctaSubtitle}</p>
            <a href="/pecas" className="btn btn-secondary mt-3">{ctaButtonText}</a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
