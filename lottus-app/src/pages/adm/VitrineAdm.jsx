import React, { useState, useEffect } from 'react';
import { getProducts, setProductFeatured } from '../../services/api';

// /uploads/ é servido pelo Vite (public/uploads/) — sem prefixo
const resolveImg = (url) => url || '';

const VitrineAdm = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [message, setMessage]   = useState('');

  const notify = (msg) => { setMessage(msg); setTimeout(() => setMessage(''), 3000); };

  const load = async () => {
    setLoading(true);
    try { setProducts(await getProducts()); } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const toggleFeatured = async (product) => {
    try {
      await setProductFeatured(product.id, !product.featured);
      notify(
        product.featured
          ? `"${product.name}" removido da Home.`
          : `"${product.name}" adicionado à Home! 🎉`
      );
      load();
    } catch (err) {
      notify('Erro: ' + err.message);
    }
  };

  const featured  = products.filter(p => p.featured);
  const available = products.filter(p => !p.featured);

  return (
    <div className="adm-section">
      {message && <div className="adm-alert adm-alert-success">{message}</div>}

      <div className="adm-vitrine-info">
        <p>
          Gerencie quais produtos aparecem em destaque na <strong>Página Inicial</strong>, 
          na seção <strong>"Nossas Peças"</strong>. Todos os produtos sempre aparecem na 
          página <strong>/pecas</strong> automaticamente.
        </p>
      </div>

      {loading ? (
        <div className="adm-loading">Carregando produtos...</div>
      ) : products.length === 0 ? (
        <div className="adm-empty">
          Nenhum produto cadastrado ainda.<br />
          Vá em <strong>📦 Produtos</strong> para criar o primeiro!
        </div>
      ) : (
        <>
          {/* SEÇÃO: Em Destaque na Home */}
          <div className="adm-vitrine-section">
            <div className="adm-vitrine-section-header featured">
              <span>🏠 Na Home agora</span>
              <small>{featured.length} produto(s) em destaque</small>
            </div>

            {featured.length === 0 ? (
              <div className="adm-vitrine-empty">
                Nenhum produto na Home ainda. Adicione abaixo ↓
              </div>
            ) : (
              <div className="adm-vitrine-grid">
                {featured.map(p => (
                  <div className="adm-vitrine-card active" key={p.id}>
                    {p.images?.[0] && (
                      <img src={resolveImg(p.images?.[0])} alt={p.name} />
                    )}
                    <div className="adm-vitrine-card-info">
                      <span className="adm-badge">{p.category}</span>
                      <h4>{p.name}</h4>
                      <p>R$ {Number(p.price).toFixed(2).replace('.', ',')}</p>
                    </div>
                    <button
                      className="adm-btn adm-btn-warning adm-vitrine-btn"
                      onClick={() => toggleFeatured(p)}
                    >
                      ✕ Remover da Home
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SEÇÃO: Disponíveis para adicionar */}
          {available.length > 0 && (
            <div className="adm-vitrine-section">
              <div className="adm-vitrine-section-header">
                <span>📦 Disponíveis para destacar</span>
                <small>{available.length} produto(s)</small>
              </div>
              <div className="adm-vitrine-grid">
                {available.map(p => (
                  <div className="adm-vitrine-card" key={p.id}>
                    {p.images?.[0] && (
                      <img src={resolveImg(p.images?.[0])} alt={p.name} />
                    )}
                    <div className="adm-vitrine-card-info">
                      <span className="adm-badge">{p.category}</span>
                      <h4>{p.name}</h4>
                      <p>R$ {Number(p.price).toFixed(2).replace('.', ',')}</p>
                    </div>
                    <button
                      className="adm-btn adm-btn-success adm-vitrine-btn"
                      onClick={() => toggleFeatured(p)}
                    >
                      + Colocar na Home
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default VitrineAdm;
