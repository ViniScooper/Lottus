import React, { useState, useRef } from 'react';
import { uploadImage } from '../../services/api';

/**
 * ImageUploader — campo de upload de imagem reutilizável no ADM.
 * Props:
 *   value    : string  — URL atual da imagem (controlado pelo pai)
 *   onChange : fn(url) — chamado com a nova URL após upload ou edição manual
 *   label    : string  — label do campo
 */
const ImageUploader = ({ value, onChange, label = 'Imagem' }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError]        = useState('');
  const [preview, setPreview]    = useState(value || '');
  const inputRef = useRef();

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Preview local imediato
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);
    setError('');
    setUploading(true);

    try {
      const url = await uploadImage(file);     // ex: /uploads/1234-foto.jpg
      setPreview(url);                          // Vite serve /uploads/ direto
      onChange(url);
    } catch (err) {
      setError('Erro no upload: ' + err.message);
      setPreview(value || '');
    } finally {
      setUploading(false);
    }
  };

  const handleManualUrl = (e) => {
    setPreview(e.target.value);
    onChange(e.target.value);
  };

  return (
    <div className="img-uploader">
      <label className="img-uploader-label">{label}</label>

      {/* Área de drop / clique */}
      <div
        className={`img-drop-zone ${uploading ? 'uploading' : ''} ${preview ? 'has-preview' : ''}`}
        onClick={() => inputRef.current?.click()}
      >
        {preview ? (
          <img src={preview} alt="preview" className="img-preview" />
        ) : (
          <div className="img-drop-placeholder">
            <span className="img-drop-icon">📷</span>
            <p>Clique para selecionar do seu<br />computador ou celular</p>
            <small>JPG, PNG, GIF, WebP — máx. 10MB</small>
          </div>
        )}

        {uploading && (
          <div className="img-uploading-overlay">
            <span>Enviando...</span>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        style={{ display: 'none' }}
        onChange={handleFile}
      />

      {preview && (
        <button
          type="button"
          className="img-change-btn"
          onClick={() => inputRef.current?.click()}
        >
          🔄 Trocar imagem
        </button>
      )}

      {/* Campo manual como alternativa */}
      <details className="img-manual-url">
        <summary>Ou cole uma URL de imagem</summary>
        <input
          type="text"
          placeholder="https://... ou /images/foto.png"
          value={value || ''}
          onChange={handleManualUrl}
        />
      </details>

      {error && <p className="img-error">{error}</p>}
    </div>
  );
};

export default ImageUploader;
