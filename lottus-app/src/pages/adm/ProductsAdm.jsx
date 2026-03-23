import React, { useState, useEffect } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct, getCollections } from '../../services/api';
import ImageUploader from './ImageUploader';

const emptyProduct = { name: '', price: '', category: 'Bolsas', tag: '', description: '', images: '', collectionName: '', status: 'AVAILABLE' };

const ProductsAdm = () => {
  const [products, setProducts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyProduct);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState('');

  const notify = (msg) => { setMessage(msg); setTimeout(() => setMessage(''), 3000); };

  const load = async () => {
    setLoading(true);
    try { 
      const [prods, colls] = await Promise.all([getProducts(true), getCollections()]);
      setProducts(prods);
      setCollections(colls);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleEdit = (p) => {
    setForm({ 
      ...p, 
      images: Array.isArray(p.images) ? p.images.join('\n') : p.images,
      collectionName: p.collection?.name || ''
    });
    setEditingId(p.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Excluir este produto?')) return;
    await deleteProduct(id);
    notify('Produto excluído!');
    load();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      price: parseFloat(form.price),
      images: form.images.split('\n').map(s => s.trim()).filter(Boolean)
    };
    try {
      if (editingId) {
        await updateProduct(editingId, payload);
        notify('Produto atualizado! ✅');
      } else {
        await createProduct(payload);
        notify('Produto criado! ✅');
      }
      setForm(emptyProduct);
      setEditingId(null);
      setShowForm(false);
      load();
    } catch (err) {
      notify('Erro: ' + err.message);
    }
  };

  return (
    <div className="adm-section">
      {message && <div className="adm-alert adm-alert-success">{message}</div>}

      <div className="adm-section-header">
        <h3>Gerenciar Produtos</h3>
        <button className="adm-btn adm-btn-primary" onClick={() => { setForm(emptyProduct); setEditingId(null); setShowForm(!showForm); }}>
          {showForm ? '✕ Cancelar' : '+ Novo Produto'}
        </button>
      </div>

      {showForm && (
        <form className="adm-form" onSubmit={handleSubmit}>
          <h4>{editingId ? 'Editar Produto' : 'Novo Produto'}</h4>
          <div className="adm-form-row">
            <div className="adm-form-group">
              <label>Nome da Peça *</label>
              <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Ex: Bolsa Boho Lottus" />
            </div>
            <div className="adm-form-group">
              <label>Preço (R$) *</label>
              <input required type="number" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="180.00" />
            </div>
          </div>
          <div className="adm-form-row">
            <div className="adm-form-group">
              <label>Categoria *</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                <option>Bolsas</option>
                <option>Roupas</option>
                <option>Casa</option>
                <option>Acessórios</option>
              </select>
            </div>
            <div className="adm-form-group">
              <label>Status (Estoque) *</label>
              <select value={form.status || 'AVAILABLE'} onChange={e => setForm({ ...form, status: e.target.value })}>
                <option value="AVAILABLE">Pronta Entrega</option>
                <option value="MADE_TO_ORDER">Sob Encomenda</option>
                <option value="OUT_OF_STOCK">Esgotado</option>
              </select>
            </div>
          </div>
          <div className="adm-form-row">
            <div className="adm-form-group">
              <label>Tag (Badge Promocional)</label>
              <input value={form.tag} onChange={e => setForm({ ...form, tag: e.target.value })} placeholder="Ex: Bestseller, Novo, Premium" />
            </div>
          </div>
          <div className="adm-form-row">
            <div className="adm-form-group">
              <label>Coleção (Ex: Inverno 2024, Especial X)</label>
              <input 
                list="collections-list"
                value={form.collectionName} 
                onChange={e => setForm({ ...form, collectionName: e.target.value })} 
                placeholder="Nome da Coleção para agrupar"
              />
              <datalist id="collections-list">
                {collections.map(c => <option key={c.id} value={c.name} />)}
              </datalist>
            </div>
          </div>
          <div className="adm-form-group">
            <label>Descrição *</label>
            <textarea required rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Descreva a peça..." />
          </div>
          <ImageUploader
            label="Foto Principal da Peça *"
            value={form.images.split('\n')[0]?.trim() || ''}
            onChange={(url) => {
              // Substitui a primeira linha com a URL nova; mantém as restantes
              const current = form.images.split('\n').map(s => s.trim()).filter(Boolean);
              current[0] = url;
              setForm({ ...form, images: current.join('\n') });
            }}
          />
          <div className="adm-form-group">
            <label>Fotos Adicionais (URLs, uma por linha)</label>
            <textarea
              rows={2}
              placeholder="/images/foto2.png\nhttps://exemplo.com/foto3.jpg"
              value={form.images.split('\n').slice(1).join('\n')}
              onChange={e => {
                const first = form.images.split('\n')[0] || '';
                const rest = e.target.value;
                setForm({ ...form, images: [first, rest].filter(Boolean).join('\n') });
              }}
            />
          </div>
          <div className="adm-form-actions">
            <button type="submit" className="adm-btn adm-btn-primary">
              {editingId ? '💾 Salvar Alterações' : '✅ Criar Produto'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="adm-loading">Carregando produtos...</div>
      ) : products.length === 0 ? (
        <div className="adm-empty">Nenhum produto ainda. Crie o primeiro!</div>
      ) : (
        <div className="adm-grid">
          {products.map(p => (
            <div className="adm-card" key={p.id}>
              {p.images?.[0] && <img src={p.images[0]} alt={p.name} className="adm-card-img" />}
              <div className="adm-card-body">
                <span className="adm-badge">{p.category}</span>
                {p.status === 'OUT_OF_STOCK' && <span className="adm-badge" style={{background: '#e74c3c', color: 'white'}}>Esgotado</span>}
                {p.status === 'MADE_TO_ORDER' && <span className="adm-badge" style={{background: '#f39c12', color: 'white'}}>Sob Encomenda</span>}
                {p.tag && <span className="adm-badge adm-badge-pink">{p.tag}</span>}
                <h4>{p.name}</h4>
                <p className="adm-price">R$ {Number(p.price).toFixed(2).replace('.', ',')}</p>
                <p className="adm-desc">{p.description}</p>
              </div>
              <div className="adm-card-actions">
                <button className="adm-btn adm-btn-secondary" onClick={() => handleEdit(p)}>✏️ Editar</button>
                <button className="adm-btn adm-btn-danger" onClick={() => handleDelete(p.id)}>🗑️ Excluir</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsAdm;
