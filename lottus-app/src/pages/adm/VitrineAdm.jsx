import React, { useState, useEffect } from 'react';
import { getProducts, setProductFeatured, getCollections, getConfig, updateConfig, deleteCollection } from '../../services/api';

// /uploads/ é servido pelo Vite (public/uploads/) — sem prefixo
const resolveImg = (url) => url || '';

const VitrineAdm = () => {
  const [products, setProducts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [config, setConfig]       = useState({});
  const [loading, setLoading]   = useState(true);
  const [message, setMessage]   = useState('');
  const [selectedCollId, setSelectedCollId] = useState('');

  const notify = (msg) => { setMessage(msg); setTimeout(() => setMessage(''), 3000); };

  const load = async () => {
    setLoading(true);
    try { 
      const [prods, colls, cfg] = await Promise.all([getProducts(), getCollections(), getConfig()]);
      setProducts(prods);
      setCollections(colls);
      setConfig(cfg);
      if (cfg.featured_collection_id) setSelectedCollId(cfg.featured_collection_id);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const toggleFeatured = async (product) => {
    try {
      await setProductFeatured(product.id, !product.featured);
      notify(
        product.featured
          ? `"${product.name}" removido da Vitrine Geral.`
          : `"${product.name}" adicionado à Vitrine Geral! 🎉`
      );
      load();
    } catch (err) {
      notify('Erro: ' + err.message);
    }
  };

  const saveFeaturedCollection = async () => {
    try {
      await updateConfig({ featured_collection_id: selectedCollId });
      notify('Coleção em destaque atualizada! 🚀');
      load();
    } catch (err) {
      notify('Erro: ' + err.message);
    }
  };

  const handleDeleteCollection = async (id) => {
    if (!confirm('Deseja excluir esta coleção? Os produtos não serão excluídos, apenas perderão o vínculo com ela.')) return;
    try {
      await deleteCollection(id);
      notify('Coleção excluída! ✨');
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
          Gerencie quais produtos e coleções aparecem em destaque na <strong>Página Inicial</strong>.
        </p>
      </div>

      <div className="adm-vitrine-section featured-collection-manager">
        <div className="adm-vitrine-section-header featured">
          <span>🌟 Coleção em Destaque</span>
          <small>Escolha qual coleção aparecerá primeiro na Home</small>
        </div>
        <div className="adm-config-row" style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
          <select 
            className="adm-input" 
            style={{ width: 'auto' }}
            value={selectedCollId} 
            onChange={e => setSelectedCollId(e.target.value)}
          >
            <option value="">Nenhuma (Mostrar destaques avulsos)</option>
            {collections.map(c => (
              <option key={c.id} value={c.id}>{c.name} ({c._count.products} itens)</option>
            ))}
          </select>
          <button className="adm-btn adm-btn-primary" onClick={saveFeaturedCollection}>
            💾 Salvar Coleção
          </button>
        </div>
        {config.featured_collection_id && (
          <p style={{ marginTop: '10px', fontSize: '0.9rem', color: '#666' }}>
            Atualmente exibindo: <strong>{collections.find(c => c.id === config.featured_collection_id)?.name || '...'}</strong>
          </p>
        )}
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

      {/* Gerenciamento de Coleções */}
      <div className="adm-vitrine-section">
        <div className="adm-vitrine-section-header">
          <span>📂 Todas as Coleções</span>
          <small>{collections.length} coleções cadastradas</small>
        </div>
        <div className="adm-collections-list" style={{ marginTop: '20px' }}>
          {collections.length === 0 ? (
            <p className="adm-empty">Nenhuma coleção criada ainda.</p>
          ) : (
            <div className="adm-table-wrapper">
              <table className="adm-table" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--adm-surface-2)' }}>
                    <th style={{ padding: '12px' }}>Nome</th>
                    <th style={{ padding: '12px' }}>Produtos</th>
                    <th style={{ padding: '12px' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {collections.map(c => (
                    <tr key={c.id} style={{ borderBottom: '1px solid var(--adm-border)' }}>
                      <td style={{ padding: '12px' }}>{c.name}</td>
                      <td style={{ padding: '12px' }}>{c._count?.products || 0} item(ns)</td>
                      <td style={{ padding: '12px' }}>
                        <button 
                          className="adm-btn adm-btn-danger" 
                          style={{ padding: '5px 10px', fontSize: '0.8rem' }}
                          onClick={() => handleDeleteCollection(c.id)}
                        >
                          🗑️ Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VitrineAdm;
