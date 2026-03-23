import React, { useState, useEffect } from 'react';
import { getStock, createStockItem, updateStockItem, deleteStockItem } from '../../services/api';

const CATEGORIES = ['Linha', 'Sacola', 'Adesivo', 'Cartão', 'Etiqueta', 'Peças Prontas', 'Outro'];
const UNITS = ['unidades', 'metros', 'rolos', 'pacotes', 'folhas'];

const empty = { name: '', category: 'Linha', quantity: 0, unit: 'unidades', minAlert: 5 };

const levelColor = (qty, min) => {
  if (qty === 0) return '#e74c3c';
  if (qty <= min) return '#f39c12';
  return '#27ae60';
};

const levelLabel = (qty, min) => {
  if (qty === 0) return '🔴 Esgotado';
  if (qty <= min) return '🟡 Baixo';
  return '🟢 OK';
};

const StockAdm = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState('');
  const [adjustId, setAdjustId] = useState(null);
  const [adjustQty, setAdjustQty] = useState(0);

  const notify = (msg) => { setMessage(msg); setTimeout(() => setMessage(''), 3000); };

  const load = async () => {
    setLoading(true);
    try { setItems(await getStock()); } 
    catch { notify('Erro ao carregar estoque.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleEdit = (item) => {
    setForm({ ...item });
    setEditingId(item.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateStockItem(editingId, form);
        notify('✅ Item atualizado!');
      } else {
        await createStockItem(form);
        notify('✅ Item adicionado ao estoque!');
      }
      setForm(empty);
      setEditingId(null);
      setShowForm(false);
      load();
    } catch (err) { notify('Erro: ' + err.message); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Excluir este item do estoque?')) return;
    await deleteStockItem(id);
    notify('🗑️ Item removido.');
    load();
  };

  const handleAdjust = async (item, delta) => {
    const newQty = Math.max(0, item.quantity + delta);
    await updateStockItem(item.id, { quantity: newQty });
    load();
  };

  const handleAdjustSave = async (item) => {
    await updateStockItem(item.id, { quantity: Math.max(0, parseInt(adjustQty) || 0) });
    setAdjustId(null);
    notify('✅ Quantidade atualizada!');
    load();
  };

  // Summary cards
  const total = items.length;
  const outOfStock = items.filter(i => i.quantity === 0).length;
  const lowStock = items.filter(i => i.quantity > 0 && i.quantity <= i.minAlert).length;

  return (
    <div className="adm-section">
      {message && <div className="adm-alert adm-alert-success">{message}</div>}

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '28px' }}>
        <div style={{ background: 'var(--adm-surface)', border: '1px solid var(--adm-border)', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--adm-primary)' }}>{total}</div>
          <div style={{ color: 'var(--adm-text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>Itens Cadastrados</div>
        </div>
        <div style={{ background: 'var(--adm-surface)', border: '1px solid rgba(243,156,18,0.4)', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#f39c12' }}>{lowStock}</div>
          <div style={{ color: 'var(--adm-text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>Estoque Baixo</div>
        </div>
        <div style={{ background: 'var(--adm-surface)', border: '1px solid rgba(231,76,60,0.4)', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#e74c3c' }}>{outOfStock}</div>
          <div style={{ color: 'var(--adm-text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>Esgotados</div>
        </div>
      </div>

      <div className="adm-section-header">
        <h3>Controle de Materiais & Estoque</h3>
        <button className="adm-btn adm-btn-primary" onClick={() => { setForm(empty); setEditingId(null); setShowForm(!showForm); }}>
          {showForm ? '✕ Cancelar' : '+ Novo Item'}
        </button>
      </div>

      {showForm && (
        <form className="adm-form" onSubmit={handleSubmit}>
          <h4>{editingId ? 'Editar Item' : 'Cadastrar Item de Estoque'}</h4>
          <div className="adm-form-row">
            <div className="adm-form-group">
              <label>Nome do Item *</label>
              <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Ex: Linha Rosa Pastel, Sachê Cristal" />
            </div>
            <div className="adm-form-group">
              <label>Categoria</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="adm-form-row">
            <div className="adm-form-group">
              <label>Quantidade Atual</label>
              <input type="number" min="0" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} />
            </div>
            <div className="adm-form-group">
              <label>Unidade</label>
              <select value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })}>
                {UNITS.map(u => <option key={u}>{u}</option>)}
              </select>
            </div>
          </div>
          <div className="adm-form-group" style={{ maxWidth: '300px' }}>
            <label>Alerta Mínimo (abaixo disso = estoque baixo)</label>
            <input type="number" min="0" value={form.minAlert} onChange={e => setForm({ ...form, minAlert: e.target.value })} />
          </div>
          <div className="adm-form-actions">
            <button type="submit" className="adm-btn adm-btn-primary">{editingId ? '💾 Salvar' : '✅ Cadastrar'}</button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="adm-loading">Carregando estoque...</div>
      ) : items.length === 0 ? (
        <div className="adm-empty">Nenhum item cadastrado. Adicione o primeiro material!</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--adm-surface-2)', color: 'var(--adm-text)' }}>
                <th style={{ padding: '12px' }}>Item</th>
                <th style={{ padding: '12px' }}>Categoria</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Nível</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Quantidade</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--adm-border)' }}>
                  <td style={{ padding: '14px' }}>
                    <strong style={{ color: 'var(--adm-text)' }}>{item.name}</strong>
                  </td>
                  <td style={{ padding: '14px' }}>
                    <span className="adm-badge">{item.category}</span>
                  </td>
                  <td style={{ padding: '14px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                      <div style={{ width: '80px', height: '8px', background: 'var(--adm-surface-2)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ 
                          height: '100%', 
                          borderRadius: '4px',
                          background: levelColor(item.quantity, item.minAlert),
                          width: `${Math.min(100, (item.quantity / Math.max(item.minAlert * 3, 1)) * 100)}%`,
                          transition: 'width 0.4s ease'
                        }} />
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--adm-text-muted)' }}>
                        {levelLabel(item.quantity, item.minAlert)}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '14px', textAlign: 'center' }}>
                    {adjustId === item.id ? (
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', alignItems: 'center' }}>
                        <input 
                          type="number" 
                          min="0"
                          defaultValue={item.quantity}
                          onChange={e => setAdjustQty(e.target.value)}
                          style={{ width: '70px', background: 'var(--adm-bg)', border: '1px solid var(--adm-border)', borderRadius: '6px', color: 'var(--adm-text)', padding: '4px 8px', textAlign: 'center' }}
                        />
                        <button className="adm-btn adm-btn-success" style={{ padding: '4px 8px', fontSize: '0.8rem' }} onClick={() => handleAdjustSave(item)}>✓</button>
                        <button className="adm-btn adm-btn-secondary" style={{ padding: '4px 8px', fontSize: '0.8rem' }} onClick={() => setAdjustId(null)}>✕</button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', alignItems: 'center' }}>
                        <button className="adm-btn adm-btn-secondary" style={{ padding: '4px 10px', fontSize: '1rem' }} onClick={() => handleAdjust(item, -1)}>−</button>
                        <span 
                          style={{ minWidth: '50px', textAlign: 'center', fontWeight: 700, fontSize: '1rem', color: levelColor(item.quantity, item.minAlert), cursor: 'pointer' }}
                          onClick={() => { setAdjustId(item.id); setAdjustQty(item.quantity); }}
                          title="Clique para editar"
                        >
                          {item.quantity} <small style={{ fontSize: '0.7rem', fontWeight: 400, color: 'var(--adm-text-muted)' }}>{item.unit}</small>
                        </span>
                        <button className="adm-btn adm-btn-secondary" style={{ padding: '4px 10px', fontSize: '1rem' }} onClick={() => handleAdjust(item, 1)}>+</button>
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '14px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button className="adm-btn adm-btn-secondary" style={{ padding: '5px 10px', fontSize: '0.8rem' }} onClick={() => handleEdit(item)}>✏️</button>
                      <button className="adm-btn adm-btn-danger" style={{ padding: '5px 10px', fontSize: '0.8rem' }} onClick={() => handleDelete(item.id)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StockAdm;
