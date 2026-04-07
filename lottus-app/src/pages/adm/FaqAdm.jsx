import React, { useState, useEffect } from 'react';
import { getConfig, updateConfig } from '../../services/api';
import './AdminStyles.css';

const faqsDefault = [
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

const FaqAdm = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    getConfig().then(data => {
      if (data && data.faqs) {
        try {
          const parsed = JSON.parse(data.faqs);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setFaqs(parsed);
          } else {
            setFaqs(faqsDefault);
          }
        } catch (e) {
          setFaqs(faqsDefault);
        }
      } else {
        setFaqs(faqsDefault);
      }
      setLoading(false);
    }).catch(() => {
      setFaqs(faqsDefault);
      setLoading(false);
    });
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateConfig({ faqs: JSON.stringify(faqs) });
      setMessage('✅ Dúvidas salvas com sucesso!');
    } catch (err) {
      setMessage('Erro: ' + err.message);
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleAddFaq = () => {
    setFaqs([...faqs, { question: '', answer: '' }]);
  };

  const handleRemoveFaq = (index) => {
    const newFaqs = faqs.filter((_, i) => i !== index);
    setFaqs(newFaqs);
  };

  const handleChange = (index, field, value) => {
    const newFaqs = [...faqs];
    newFaqs[index][field] = value;
    setFaqs(newFaqs);
  };

  if (loading) return <div className="adm-loading">Carregando dúvidas...</div>;

  return (
    <div className="adm-section">
      {message && <div className="adm-alert adm-alert-success">{message}</div>}

      <div className="adm-section-header">
        <h3>Dúvidas Frequentes (FAQ)</h3>
        <p className="adm-section-subtitle">Gerencie as perguntas e respostas que aparecem na página inicial.</p>
        <button type="button" className="adm-btn adm-btn-secondary" onClick={handleAddFaq} style={{ marginTop: '10px' }}>
          ➕ Adicionar Nova Dúvida
        </button>
      </div>

      <form className="adm-form" onSubmit={handleSave}>
        {faqs.map((faq, index) => (
          <div key={index} style={{ border: '1px solid var(--adm-border)', padding: '20px', borderRadius: '12px', marginBottom: '20px', position: 'relative', background: 'var(--adm-surface-2)' }}>
            <button 
              type="button" 
              onClick={() => handleRemoveFaq(index)}
              style={{ position: 'absolute', top: '15px', right: '15px', background: 'rgba(224,82,82,0.15)', color: 'var(--adm-danger)', border: '1px solid rgba(224,82,82,0.3)', borderRadius: '8px', cursor: 'pointer', padding: '5px 12px', fontSize: '14px', fontWeight: 'bold' }}
              title="Remover"
            >
              Remover 🗑️
            </button>
            <div className="adm-form-group">
              <label>Pergunta</label>
              <input
                type="text"
                value={faq.question}
                onChange={e => handleChange(index, 'question', e.target.value)}
                placeholder="Ex: Qual o tempo de produção?"
                required
              />
            </div>
            <div className="adm-form-group">
              <label>Resposta</label>
              <textarea
                rows={3}
                value={faq.answer}
                onChange={e => handleChange(index, 'answer', e.target.value)}
                placeholder="Resposta detalhada..."
                required
              />
            </div>
          </div>
        ))}

        {faqs.length === 0 && (
          <p style={{ textAlign: 'center', color: 'var(--adm-text-muted)', marginBottom: '20px' }}>Nenhuma dúvida cadastrada.</p>
        )}

        <div className="adm-form-actions mt-3">
          <button type="submit" className="adm-btn adm-btn-primary" disabled={saving}>
            {saving ? 'Salvando...' : '💾 Salvar Alterações'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FaqAdm;
