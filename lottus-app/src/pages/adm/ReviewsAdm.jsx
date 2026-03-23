import React, { useState, useEffect } from 'react';
import { getPendingReviews, approveReview, deleteReview } from '../../services/api';

const ReviewsAdm = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const notify = (msg) => { setMessage(msg); setTimeout(() => setMessage(''), 3000); };

  const loadReviews = async () => {
    setLoading(true);
    try {
      const data = await getPendingReviews();
      setReviews(Array.isArray(data) ? data : []);
    } catch (err) {
      notify('Erro ao carregar avaliações.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleApprove = async (id) => {
    try {
      await approveReview(id);
      notify('✅ Avaliação aprovada e publicada!');
      loadReviews();
    } catch (err) {
      notify('Erro: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Deseja realmente EXCLUIR esta avaliação? Esta ação não pode ser desfeita.')) return;
    try {
      await deleteReview(id);
      notify('🗑️ Avaliação excluída.');
      loadReviews();
    } catch (err) {
      notify('Erro: ' + err.message);
    }
  };

  if (loading) return <div className="adm-loading">Buscando avaliações pendentes...</div>;

  return (
    <div className="adm-section">
      {message && <div className="adm-alert adm-alert-success">{message}</div>}

      <div className="adm-section-header">
        <h3>Moderação de Avaliações</h3>
        <p className="adm-section-subtitle">
          Gerencie as avaliações enviadas pelos clientes. Apenas as aprovadas aparecerão no site.
        </p>
      </div>

      <div className="adm-collections-list" style={{ marginTop: '20px' }}>
        {reviews.length === 0 ? (
          <div className="adm-empty">✨ Nenhuma avaliação pendente no momento!</div>
        ) : (
          <div className="adm-table-wrapper">
            <table className="adm-table" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f9f9f9' }}>
                  <th style={{ padding: '12px' }}>Data</th>
                  <th style={{ padding: '12px' }}>Produto</th>
                  <th style={{ padding: '12px' }}>Cliente</th>
                  <th style={{ padding: '12px', minWidth: '300px' }}>Comentário</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map(r => (
                  <tr key={r.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px', fontSize: '0.85rem', color: '#666' }}>
                      {new Date(r.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {r.product?.images?.[0] && (
                          <img 
                            src={r.product.images[0].startsWith('/uploads') ? `http://localhost:3001${r.product.images[0]}` : r.product.images[0]} 
                            alt={r.product.name} 
                            style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '5px' }}
                          />
                        )}
                        <span style={{ fontWeight: '600' }}>{r.product?.name || 'Produto removido'}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <strong>{r.name}</strong><br/>
                      <span style={{ fontSize: '0.8rem', color: '#888' }}>{r.email}</span>
                    </td>
                    <td style={{ padding: '12px', fontStyle: 'italic', color: '#444' }}>
                      "{r.review}"
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button 
                          className="adm-btn adm-btn-success" 
                          style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                          onClick={() => handleApprove(r.id)}
                        >
                          ✅ Aprovar
                        </button>
                        <button 
                          className="adm-btn adm-btn-danger" 
                          style={{ padding: '6px 12px', fontSize: '0.8rem', background: '#fff', color: '#e74c3c', border: '1px solid #e74c3c' }}
                          onClick={() => handleDelete(r.id)}
                        >
                          🗑️ Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsAdm;
