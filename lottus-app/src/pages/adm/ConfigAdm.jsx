import React, { useState, useEffect } from 'react';
import { getConfig, updateConfig } from '../../services/api';

const CONFIG_FIELDS = [
  { key: 'hero_title',       label: 'Título Principal (Hero)',      type: 'text',     placeholder: 'A elegância do crochê em cada detalhe.' },
  { key: 'hero_subtitle',    label: 'Subtítulo (Feito à mão...)',   type: 'text',     placeholder: 'Feito à mão, com amor' },
  { key: 'hero_description', label: 'Descrição do Hero',           type: 'textarea', placeholder: 'Peças exclusivas, artesanais...' },
  { key: 'whatsapp_number',  label: 'Número WhatsApp (só números)',type: 'text',     placeholder: '558192496177' },
  { key: 'instagram_handle', label: 'Instagram (@usuario)',         type: 'text',     placeholder: '@lottuscroche' },
  { key: 'location',         label: 'Cidade/Localização',           type: 'text',     placeholder: 'Recife, PE' },
  { key: 'email',            label: 'Email de Contato',             type: 'email',    placeholder: 'contato@lottuscroche.com.br' }
];

const ConfigAdm = () => {
  const [config, setConfig] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    getConfig().then(data => { setConfig(data); setLoading(false); });
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateConfig(config);
      setMessage('✅ Configurações salvas com sucesso!');
    } catch (err) {
      setMessage('Erro: ' + err.message);
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (loading) return <div className="adm-loading">Carregando configurações...</div>;

  return (
    <div className="adm-section">
      {message && <div className="adm-alert adm-alert-success">{message}</div>}

      <div className="adm-section-header">
        <h3>Configurações do Site</h3>
        <p className="adm-section-subtitle">Edite os textos e informações que aparecem no site.</p>
      </div>

      <form className="adm-form adm-config-form" onSubmit={handleSave}>
        {CONFIG_FIELDS.map(field => (
          <div className="adm-form-group" key={field.key}>
            <label>{field.label}</label>
            {field.type === 'textarea' ? (
              <textarea
                rows={3}
                value={config[field.key] || ''}
                onChange={e => setConfig({ ...config, [field.key]: e.target.value })}
                placeholder={field.placeholder}
              />
            ) : (
              <input
                type={field.type}
                value={config[field.key] || ''}
                onChange={e => setConfig({ ...config, [field.key]: e.target.value })}
                placeholder={field.placeholder}
              />
            )}
          </div>
        ))}

        <div className="adm-form-actions">
          <button type="submit" className="adm-btn adm-btn-primary" disabled={saving}>
            {saving ? 'Salvando...' : '💾 Salvar Todas as Configurações'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ConfigAdm;
