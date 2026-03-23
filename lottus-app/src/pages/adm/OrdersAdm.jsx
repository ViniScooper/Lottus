import React, { useState, useEffect } from 'react';
import { getOrders, createOrder, updateOrder, deleteOrder } from '../../services/api';

const COLUMNS = [
  { id: 'TODO',        label: 'A Fazer',       color: '#8b93a7', emoji: '📋' },
  { id: 'IN_PROGRESS', label: 'Em Andamento',  color: '#f39c12', emoji: '🔨' },
  { id: 'DONE',        label: 'Pronto',         color: '#27ae60', emoji: '✅' },
  { id: 'DELIVERED',   label: 'Entregue',       color: '#90a624', emoji: '🎁' },
];

const SALE_TYPES = [
  { value: 'SOB_ENCOMENDA', label: 'Sob Encomenda' },
  { value: 'PRONTA_ENTREGA', label: 'Pronta Entrega' },
  { value: 'ATACADO', label: 'Atacado' },
];

const emptyOrder = { clientName: '', description: '', saleType: 'SOB_ENCOMENDA', value: '', dueDate: '', notes: '', status: 'TODO' };

const OrdersAdm = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyOrder);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState('');
  
  // Drag and drop state
  const [draggedOrder, setDraggedOrder] = useState(null);
  const [dragOverCol, setDragOverCol] = useState(null);

  const notify = (msg) => { setMessage(msg); setTimeout(() => setMessage(''), 3000); };

  const load = async () => {
    setLoading(true);
    try { setOrders(await getOrders()); }
    catch { notify('Erro ao carregar pedidos.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleEdit = (order) => {
    setForm({
      ...order,
      value: order.value || '',
      dueDate: order.dueDate ? order.dueDate.slice(0, 10) : ''
    });
    setEditingId(order.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, value: form.value ? parseFloat(form.value) : null };
      if (editingId) {
        await updateOrder(editingId, payload);
        notify('✅ Pedido atualizado!');
      } else {
        await createOrder(payload);
        notify('✅ Pedido cadastrado!');
      }
      setForm(emptyOrder);
      setEditingId(null);
      setShowForm(false);
      load();
    } catch (err) { notify('Erro: ' + err.message); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Excluir este pedido?')) return;
    await deleteOrder(id);
    notify('🗑️ Pedido removido.');
    load();
  };

  const moveStatus = async (order, direction) => {
    const idx = COLUMNS.findIndex(c => c.id === order.status);
    const nextIdx = idx + direction;
    if (nextIdx < 0 || nextIdx >= COLUMNS.length) return;
    await updateOrder(order.id, { status: COLUMNS[nextIdx].id });
    load();
  };

  const handleDragStart = (order) => {
    setDraggedOrder(order);
  };

  const handleDragOver = (e, colId) => {
    e.preventDefault();
    setDragOverCol(colId);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOverCol(null);
  };

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    setDragOverCol(null);
    if (!draggedOrder || draggedOrder.status === newStatus) return;

    // Otimista
    setOrders(orders.map(o => o.id === draggedOrder.id ? { ...o, status: newStatus } : o));
    
    try {
      await updateOrder(draggedOrder.id, { status: newStatus });
    } catch (err) {
      notify('Erro ao mover: ' + err.message);
      load(); // rollback
    }
    setDraggedOrder(null);
  };

  const getByStatus = (status) => orders.filter(o => o.status === status);

  // Summary
  const totalValue = orders.filter(o => o.status !== 'DELIVERED').reduce((acc, o) => acc + (o.value || 0), 0);
  const delivered = orders.filter(o => o.status === 'DELIVERED').length;

  return (
    <div className="adm-section">
      {message && <div className="adm-alert adm-alert-success">{message}</div>}

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '28px' }}>
        <div style={{ background: 'var(--adm-surface)', border: '1px solid var(--adm-border)', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--adm-primary)' }}>{orders.filter(o => o.status !== 'DELIVERED').length}</div>
          <div style={{ color: 'var(--adm-text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>Pedidos Ativos</div>
        </div>
        <div style={{ background: 'var(--adm-surface)', border: '1px solid rgba(144,166,36,0.4)', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--adm-primary)' }}>
            R$ {totalValue.toFixed(2).replace('.', ',')}
          </div>
          <div style={{ color: 'var(--adm-text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>Valor em Aberto</div>
        </div>
        <div style={{ background: 'var(--adm-surface)', border: '1px solid rgba(39,174,96,0.4)', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#27ae60' }}>{delivered}</div>
          <div style={{ color: 'var(--adm-text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>Entregues</div>
        </div>
      </div>

      <div className="adm-section-header">
        <h3>Quadro de Pedidos</h3>
        <button className="adm-btn adm-btn-primary" onClick={() => { setForm(emptyOrder); setEditingId(null); setShowForm(!showForm); }}>
          {showForm ? '✕ Cancelar' : '+ Novo Pedido'}
        </button>
      </div>

      {showForm && (
        <form className="adm-form" onSubmit={handleSubmit}>
          <h4>{editingId ? 'Editar Pedido' : 'Cadastrar Pedido'}</h4>
          <div className="adm-form-row">
            <div className="adm-form-group">
              <label>Nome do Cliente *</label>
              <input required value={form.clientName} onChange={e => setForm({ ...form, clientName: e.target.value })} placeholder="Ex: Ana Paula" />
            </div>
            <div className="adm-form-group">
              <label>Tipo de Venda</label>
              <select value={form.saleType} onChange={e => setForm({ ...form, saleType: e.target.value })}>
                {SALE_TYPES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
          </div>
          <div className="adm-form-group">
            <label>Descrição / Produto Pedido *</label>
            <textarea required rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Ex: Bolsa Boho Bege P, com alça comprida" />
          </div>
          <div className="adm-form-row">
            <div className="adm-form-group">
              <label>Valor (R$)</label>
              <input type="number" step="0.01" value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} placeholder="Ex: 150.00" />
            </div>
            <div className="adm-form-group">
              <label>Prazo de Entrega</label>
              <input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} />
            </div>
          </div>
          <div className="adm-form-row">
            <div className="adm-form-group">
              <label>Status Inicial</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                {COLUMNS.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>)}
              </select>
            </div>
            <div className="adm-form-group">
              <label>Observações</label>
              <input value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Ex: Cliente quer entrega presencial" />
            </div>
          </div>
          <div className="adm-form-actions">
            <button type="submit" className="adm-btn adm-btn-primary">{editingId ? '💾 Salvar Alterações' : '✅ Cadastrar Pedido'}</button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="adm-loading">Carregando pedidos...</div>
      ) : (
        <div style={{ overflowX: 'auto', paddingBottom: '8px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(230px, 1fr))', gap: '16px', marginTop: '8px', minWidth: '920px' }}>
          {COLUMNS.map(col => {
            const colOrders = getByStatus(col.id);
            const isDragOver = dragOverCol === col.id;
            return (
              <div 
                key={col.id} 
                onDragOver={(e) => handleDragOver(e, col.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, col.id)}
                style={{ 
                  background: isDragOver ? 'var(--adm-surface-2)' : 'var(--adm-surface)', 
                  border: `1px solid ${isDragOver ? col.color : 'var(--adm-border)'}`, 
                  borderTop: `3px solid ${col.color}`, 
                  borderRadius: '12px', 
                  overflow: 'hidden',
                  transition: 'all 0.2s ease'
                }}
              >
                {/* Column Header */}
                <div style={{ padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--adm-border)' }}>
                  <span style={{ fontWeight: 600, color: col.color, fontSize: '0.95rem' }}>{col.emoji} {col.label}</span>
                  <span style={{ background: col.color, color: 'white', borderRadius: '12px', padding: '2px 8px', fontSize: '0.75rem', fontWeight: 700 }}>{colOrders.length}</span>
                </div>

                {/* Cards */}
                <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px', minHeight: '100px' }}>
                  {colOrders.length === 0 ? (
                    <p style={{ color: 'var(--adm-text-muted)', fontSize: '0.8rem', textAlign: 'center', padding: '20px 0' }}>Nenhum pedido aqui</p>
                  ) : colOrders.map(order => {
                    const isOverdue = order.dueDate && new Date(order.dueDate) < new Date() && order.status !== 'DELIVERED';
                    const saleLabel = SALE_TYPES.find(s => s.value === order.saleType)?.label || order.saleType;
                    const colIdx = COLUMNS.findIndex(c => c.id === order.status);
                    return (
                      <div 
                        key={order.id} 
                        draggable
                        onDragStart={() => handleDragStart(order)}
                        style={{ 
                          background: 'var(--adm-surface-2)', 
                          border: `1px solid ${isOverdue ? 'rgba(231,76,60,0.5)' : 'var(--adm-border)'}`, 
                          borderRadius: '10px', 
                          padding: '14px',
                          cursor: 'grab',
                          opacity: draggedOrder?.id === order.id ? 0.5 : 1
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '6px' }}>
                          <strong style={{ color: 'var(--adm-text)', fontSize: '0.9rem' }}>{order.clientName}</strong>
                          {isOverdue && <span style={{ fontSize: '0.7rem', color: '#e74c3c', fontWeight: 600, flexShrink: 0 }}>⚠️ Atrasado</span>}
                        </div>
                        <p style={{ color: 'var(--adm-text-muted)', fontSize: '0.82rem', margin: '0 0 8px', lineHeight: 1.4 }}>{order.description}</p>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                          <span style={{ background: 'rgba(144,166,36,0.12)', color: 'var(--adm-primary)', borderRadius: '8px', padding: '2px 7px', fontSize: '0.72rem' }}>{saleLabel}</span>
                          {order.value && <span style={{ background: 'rgba(240,143,175,0.12)', color: 'var(--adm-secondary)', borderRadius: '8px', padding: '2px 7px', fontSize: '0.72rem', fontWeight: 600 }}>R$ {Number(order.value).toFixed(2).replace('.', ',')}</span>}
                          {order.dueDate && <span style={{ background: 'rgba(139,147,167,0.1)', color: 'var(--adm-text-muted)', borderRadius: '8px', padding: '2px 7px', fontSize: '0.72rem' }}>📅 {new Date(order.dueDate).toLocaleDateString('pt-BR')}</span>}
                        </div>
                        {order.notes && <p style={{ color: 'var(--adm-text-muted)', fontSize: '0.78rem', fontStyle: 'italic', margin: '0 0 8px' }}>💬 {order.notes}</p>}

                        <div style={{ display: 'flex', gap: '6px', marginTop: '8px', borderTop: '1px solid var(--adm-border)', paddingTop: '8px', justifyContent: 'flex-end' }}>
                          <button className="adm-btn adm-btn-secondary" style={{ padding: '3px 8px', fontSize: '0.75rem' }} onClick={() => handleEdit(order)}>✏️</button>
                          <button className="adm-btn adm-btn-danger" style={{ padding: '3px 8px', fontSize: '0.75rem' }} onClick={() => handleDelete(order.id)}>🗑️</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersAdm;
