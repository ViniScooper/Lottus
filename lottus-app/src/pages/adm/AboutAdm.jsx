import React, { useState, useEffect } from 'react';
import { getConfig, updateConfig } from '../../services/api';
import ImageUploader from './ImageUploader';
import './AdminStyles.css';

const defaultValuesList = [
  {
    title: 'Artesanal & Único',
    text: 'Cada bolsa, roupa ou item de decoração leva horas de dedicação. Nenhuma peça é exatamente igual à outra.'
  },
  {
    title: 'Sustentabilidade',
    text: 'Valorizamos fios ecológicos e um processo de produção lento (slow fashion), que respeita o tempo das coisas.'
  },
  {
    title: 'Conforto & Estilo',
    text: 'Acreditamos que o crochê moderno pode ser extremamente elegante, mesclando a tradição das avós com o design contemporâneo.'
  }
];

const AboutAdm = () => {
  const [config, setConfig] = useState({
    about_title: '',
    about_subtitle: '',
    about_content_title: '',
    about_description_1: '',
    about_description_2: '',
    about_img_primary: '',
    about_img_secondary: '',
    about_cta_title: '',
    about_cta_subtitle: '',
    about_cta_button_text: '',
  });
  const [valuesList, setValuesList] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    getConfig().then(data => {
      setConfig({
        about_title: data.about_title || '',
        about_subtitle: data.about_subtitle || '',
        about_content_title: data.about_content_title || '',
        about_description_1: data.about_description_1 || data.about_description || '',  // migração suave
        about_description_2: data.about_description_2 || '',
        about_img_primary: data.about_img_primary || '',
        about_img_secondary: data.about_img_secondary || '',
        about_cta_title: data.about_cta_title || '',
        about_cta_subtitle: data.about_cta_subtitle || '',
        about_cta_button_text: data.about_cta_button_text || '',
      });

      if (data.about_values) {
        try {
          const parsed = JSON.parse(data.about_values);
          setValuesList(Array.isArray(parsed) && parsed.length > 0 ? parsed : defaultValuesList);
        } catch (e) {
          setValuesList(defaultValuesList);
        }
      } else {
        setValuesList(defaultValuesList);
      }
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setValuesList(defaultValuesList);
      setLoading(false);
    });
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const configToSave = {
        ...config,
        about_values: JSON.stringify(valuesList)
      };
      
      await updateConfig(configToSave);
      setMessage('✅ Página Nossa História salva com sucesso!');
    } catch (err) {
      setMessage('Erro: ' + err.message);
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleValuesChange = (index, field, val) => {
    const list = [...valuesList];
    list[index][field] = val;
    setValuesList(list);
  };

  const handleAddValueItem = () => {
    setValuesList([...valuesList, { title: '', text: '' }]);
  };

  const handleRemoveValueItem = (index) => {
    const list = valuesList.filter((_, i) => i !== index);
    setValuesList(list);
  };

  if (loading) return <div className="adm-loading">Carregando dados da página...</div>;

  return (
    <div className="adm-section">
      {message && <div className="adm-alert adm-alert-success">{message}</div>}

      <div className="adm-section-header">
        <h3>Página "Nossa História"</h3>
        <p className="adm-section-subtitle">Gerencie todos os textos e imagens da área sobre a marca Lottus.</p>
      </div>

      <form className="adm-form" onSubmit={handleSave}>
        
        <h4 style={{ marginTop: '20px', marginBottom: '10px', color: 'var(--adm-primary)' }}>Sessão Principal (Hero)</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '15px' }}>
          <div className="adm-form-group">
            <label>Título Principal</label>
            <input
              type="text"
              value={config.about_title}
              onChange={e => setConfig({ ...config, about_title: e.target.value })}
              placeholder="Ex: Nossa História"
            />
          </div>
          <div className="adm-form-group">
            <label>Subtítulo do Hero</label>
            <input
              type="text"
              value={config.about_subtitle}
              onChange={e => setConfig({ ...config, about_subtitle: e.target.value })}
              placeholder="Ex: Como os fios se entrelaçaram para criar a Lottus."
            />
          </div>
        </div>

        <h4 style={{ marginTop: '30px', marginBottom: '10px', color: 'var(--adm-primary)' }}>Corpo - O Começo de Tudo</h4>
        <div className="adm-form-group">
          <label>Título da Sessão</label>
          <input
            type="text"
            value={config.about_content_title}
            onChange={e => setConfig({ ...config, about_content_title: e.target.value })}
            placeholder="Ex: O Começo de Tudo"
          />
        </div>
        <div className="adm-form-group">
          <label>1º Parágrafo de História</label>
          <textarea
            rows={4}
            value={config.about_description_1}
            onChange={e => setConfig({ ...config, about_description_1: e.target.value })}
            placeholder="A Lottus nasceu de uma paixão genuína..."
          />
        </div>
        <div className="adm-form-group">
          <label>2º Parágrafo de História</label>
          <textarea
            rows={3}
            value={config.about_description_2}
            onChange={e => setConfig({ ...config, about_description_2: e.target.value })}
            placeholder="O nome 'Lottus' foi escolhido..."
          />
        </div>

        <h4 style={{ marginTop: '40px', marginBottom: '10px', color: 'var(--adm-primary)' }}>Imagens Principais</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', background: 'var(--adm-surface-2)', padding: '20px', borderRadius: '12px' }}>
            <div>
              <p style={{ fontWeight: '600', marginBottom: '10px' }}>Imagem Primária (vertical/maior)</p>
              <ImageUploader
                label="Imagem Principal"
                value={config.about_img_primary}
                onChange={url => setConfig({ ...config, about_img_primary: url })}
              />
            </div>
            <div>
              <p style={{ fontWeight: '600', marginBottom: '10px' }}>Imagem Secundária (quadrada/menor)</p>
              <ImageUploader
                label="Imagem Secundária"
                value={config.about_img_secondary}
                onChange={url => setConfig({ ...config, about_img_secondary: url })}
              />
            </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '40px', marginBottom: '15px' }}>
            <h4 style={{ color: 'var(--adm-primary)', margin: 0 }}>Nossos Valores</h4>
            <button type="button" className="adm-btn adm-btn-secondary" onClick={handleAddValueItem} style={{ padding: '6px 12px', fontSize: '13px' }}>
              ➕ Adicionar Valor
            </button>
        </div>

        <div style={{ background: 'var(--adm-surface-2)', padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
          {valuesList.map((item, index) => (
            <div key={index} style={{ border: '1px solid var(--adm-border)', padding: '15px', borderRadius: '8px', marginBottom: '15px', position: 'relative', background: 'var(--adm-bg)' }}>
              <button 
                type="button" 
                onClick={() => handleRemoveValueItem(index)}
                style={{ position: 'absolute', top: '15px', right: '15px', background: 'rgba(224,82,82,0.15)', color: 'var(--adm-danger)', border: '1px solid rgba(224,82,82,0.3)', borderRadius: '6px', cursor: 'pointer', padding: '4px 10px', fontSize: '12px', fontWeight: 'bold' }}
                title="Remover"
              >
                Remover 🗑️
              </button>
              <div className="adm-form-group">
                <label>Título do Valor (em negrito)</label>
                <input
                  type="text"
                  value={item.title}
                  onChange={e => handleValuesChange(index, 'title', e.target.value)}
                  placeholder="Ex: Sustentabilidade"
                  required
                />
              </div>
              <div className="adm-form-group">
                <label>Descrição do Valor</label>
                <textarea
                  rows={2}
                  value={item.text}
                  onChange={e => handleValuesChange(index, 'text', e.target.value)}
                  placeholder="Explique este valor brevemente..."
                  required
                />
              </div>
            </div>
          ))}

          {valuesList.length === 0 && (
            <p style={{ textAlign: 'center', color: 'var(--adm-text-muted)', marginBottom: '10px' }}>Nenhum valor criado.</p>
          )}
        </div>

        <h4 style={{ marginTop: '40px', marginBottom: '10px', color: 'var(--adm-primary)' }}>Rodapé (Chamada para Ação)</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '15px', background: 'var(--adm-surface-2)', padding: '20px', borderRadius: '12px' }}>
          <div className="adm-form-group">
            <label>Título</label>
            <input
              type="text"
              value={config.about_cta_title}
              onChange={e => setConfig({ ...config, about_cta_title: e.target.value })}
              placeholder="Ex: Faça parte da nossa história"
            />
          </div>
          <div className="adm-form-group">
            <label>Subtítulo</label>
            <input
              type="text"
              value={config.about_cta_subtitle}
              onChange={e => setConfig({ ...config, about_cta_subtitle: e.target.value })}
              placeholder="Ex: Leve um pedacinho da Lottus para a sua rotina."
            />
          </div>
          <div className="adm-form-group">
            <label>Texto do Botão</label>
            <input
              type="text"
              value={config.about_cta_button_text}
              onChange={e => setConfig({ ...config, about_cta_button_text: e.target.value })}
              placeholder="Ex: Ver Nossas Peças"
            />
          </div>
        </div>

        <div className="adm-form-actions mt-4">
          <button type="submit" className="adm-btn adm-btn-primary" disabled={saving}>
            {saving ? 'Salvando...' : '💾 Salvar Alterações'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AboutAdm;
