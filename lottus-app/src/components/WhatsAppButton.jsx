import React from 'react';
import './WhatsAppButton.css';

const WhatsAppButton = () => {
  const phoneNumber = "558192496177"; 
  const message = "Olá, Lottus! Gostaria de tirar algumas dúvidas.";
  
  const wpUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a href={wpUrl} target="_blank" rel="noopener noreferrer" className="floating-whatsapp" aria-label="Falar no WhatsApp">
      <svg viewBox="0 0 32 32" className="whatsapp-icon" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 2.5C8.5 2.5 2.5 8.5 2.5 16c0 2.5.7 4.9 1.9 6.9L2.5 29.5l6.9-1.8c1.9 1 4.2 1.6 6.6 1.6 7.5 0 13.5-6 13.5-13.5S23.5 2.5 16 2.5z" fill="#4CAF50"/>
        <path d="M22.9 20.3c-.3 1-1.6 1.8-2.6 1.9-1.1.2-2.5.5-4.8-1.5-2.7-2.3-4.5-5.9-4.8-6.3-.3-.4-1.2-1.6-1.2-3.1 0-1.4.7-2.1 1-2.5.3-.3.7-.4 1-.4.2 0 .4 0 .6.1.2.1.5-.1.8.6.3.7.9 2.1 1 2.3.1.2.1.4 0 .6s-.2.3-.4.6c-.2.2-.4.4-.6.6.6 1 1.4 1.8 2.3 2.5.9.6 1.6 1 2.3 1.2.2-.3.5-.6.7-.8.3-.3.6-.3.8-.2.3.1 1.8.8 2.1 1 .3.1.5.2.6.4.2.3.2 1.1-.1 2z" fill="#FFF"/>
      </svg>
    </a>
  );
};

export default WhatsAppButton;
