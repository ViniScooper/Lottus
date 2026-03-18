import React from 'react';
import './Contact.css';

const Contact = () => {
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
                <p>Recife, PE</p>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon">📧</div>
              <div>
                <h4>Email</h4>
                <p>contato@lottuscroche.com.br</p>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon">📱</div>
              <div>
                <h4>WhatsApp</h4>
                <p>(81) 9249-6177</p>
              </div>
            </div>
          </div>
          
          <div className="social-links">
            <a href="#" className="social-link">
               <img src="/src/assets/branding/icons/icon_insta.png" alt="Instagram" style={{width: '24px', height: '24px'}} />
               <span>@lottuscroche</span>
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
