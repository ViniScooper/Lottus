import React, { useState, useEffect } from 'react';
import { getPosts, createPost, updatePost, deletePost } from '../../services/api';
import ImageUploader from './ImageUploader';

const emptyPost = { title: '', content: '', image: '', published: false };

const PostsAdm = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyPost);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState('');

  const notify = (msg) => { setMessage(msg); setTimeout(() => setMessage(''), 3000); };

  const load = async () => {
    setLoading(true);
    try { setPosts(await getPosts()); } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleEdit = (post) => {
    setForm(post);
    setEditingId(post.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Excluir este post?')) return;
    await deletePost(id);
    notify('Post excluído!');
    load();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updatePost(editingId, form);
        notify('Post atualizado! ✅');
      } else {
        await createPost(form);
        notify('Post publicado! ✅');
      }
      setForm(emptyPost);
      setEditingId(null);
      setShowForm(false);
      load();
    } catch (err) {
      notify('Erro: ' + err.message);
    }
  };

  const togglePublished = async (post) => {
    await updatePost(post.id, { ...post, published: !post.published });
    notify(post.published ? 'Post despublicado.' : 'Post publicado no site! 🎉');
    load();
  };

  return (
    <div className="adm-section">
      {message && <div className="adm-alert adm-alert-success">{message}</div>}

      <div className="adm-section-header">
        <h3>Gerenciar Posts</h3>
        <button className="adm-btn adm-btn-primary" onClick={() => { setForm(emptyPost); setEditingId(null); setShowForm(!showForm); }}>
          {showForm ? '✕ Cancelar' : '+ Novo Post'}
        </button>
      </div>

      {showForm && (
        <form className="adm-form" onSubmit={handleSubmit}>
          <h4>{editingId ? 'Editar Post' : 'Novo Post'}</h4>
          <div className="adm-form-group">
            <label>Título *</label>
            <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Ex: Nova coleção de inverno disponível!" />
          </div>
          <div className="adm-form-group">
            <label>Conteúdo / Descrição *</label>
            <textarea required rows={5} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} placeholder="Escreva aqui o conteúdo do post..." />
          </div>
          <ImageUploader
            label="Imagem do Post (opcional)"
            value={form.image}
            onChange={(url) => setForm({ ...form, image: url })}
          />
          <div className="adm-form-group adm-checkbox-group">
            <label>
              <input type="checkbox" checked={form.published} onChange={e => setForm({ ...form, published: e.target.checked })} />
              Publicar no site agora
            </label>
          </div>
          <div className="adm-form-actions">
            <button type="submit" className="adm-btn adm-btn-primary">
              {editingId ? '💾 Salvar Alterações' : '🚀 Criar Post'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="adm-loading">Carregando posts...</div>
      ) : posts.length === 0 ? (
        <div className="adm-empty">Nenhum post ainda. Crie o primeiro!</div>
      ) : (
        <div className="adm-list">
          {posts.map(post => (
            <div className="adm-list-item" key={post.id}>
              {post.image && <img src={post.image} alt={post.title} className="adm-list-img" />}
              <div className="adm-list-body">
                <div className="adm-list-meta">
                  <span className={`adm-status ${post.published ? 'published' : 'draft'}`}>
                    {post.published ? '🟢 Publicado' : '⚪ Rascunho'}
                  </span>
                  <small>{new Date(post.createdAt).toLocaleDateString('pt-BR')}</small>
                </div>
                <h4>{post.title}</h4>
                <p>{post.content.substring(0, 120)}...</p>
              </div>
              <div className="adm-list-actions">
                <button className="adm-btn adm-btn-secondary" onClick={() => handleEdit(post)}>✏️ Editar</button>
                <button className={`adm-btn ${post.published ? 'adm-btn-warning' : 'adm-btn-success'}`} onClick={() => togglePublished(post)}>
                  {post.published ? '⚪ Despublicar' : '🟢 Publicar'}
                </button>
                <button className="adm-btn adm-btn-danger" onClick={() => handleDelete(post.id)}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostsAdm;
