import React, { useContext } from 'react';
import { ConfigContext } from '../context/ConfigContext';
import './Contact.css';

const Contact = () => {
  const { config } = useContext(ConfigContext);
  
  const locationText = config?.location || 'Recife, PE';
  const emailText = config?.email || 'contato@lottuscroche.com.br';
  const whatsappNumber = config?.whatsapp_number || '558192496177';
  const instagramText = config?.instagram_handle || '@lottuscroche';

  // formatação básica do número de telefone se for BR
  const formatPhone = (num) => {
    if (num.length >= 12 && num.startsWith('55')) {
      return `(${num.substring(2,4)}) ${num.substring(4,9)}-${num.substring(9)}`;
    }
    return num;
  };

  return (
    <section id="contact" className="contact">
      <div className="container contact-container">
        <div className="contact-info" data-aos="fade-right">
          <h2 className="brand-font">Entre em Contato</h2>
          <p>Adoramos ouvir o que você tem a dizer. Entre em contato para encomendas personalizadas ou dúvidas.</p>
          
          <div className="contact-details">
            <div className="contact-item">
              <div className="contact-icon">📍</div>
              <div>
                <h4>Localização</h4>
                <p>{locationText}</p>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon">📧</div>
              <div>
                <h4>Email</h4>
                <p>{emailText}</p>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon">📱</div>
              <div>
                <h4>WhatsApp</h4>
                <p>{formatPhone(whatsappNumber)}</p>
              </div>
            </div>
          </div>
          
          <div className="social-links">
            <a href={`https://instagram.com/${instagramText.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="social-link">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                 <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                 <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                 <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
               </svg>
               <span>{instagramText}</span>
            </a>
          </div>
        </div>
        
        <div className="contact-form-wrapper" data-aos="fade-left">
          <form className="contact-form">
            <div className="form-group">
              <input type="text" placeholder="Seu Nome" required />
            </div>
            <div className="form-group">
              <input type="email" placeholder="Seu Email" required />
            </div>
            <div className="form-group">
              <textarea placeholder="Sua Mensagem" rows="5" required></textarea>
            </div>
            <button type="submit" className="btn btn-primary w-full">Enviar Mensagem</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
