import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, setToken } from '../../services/api';
import './AdminStyles.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(email, password);
      setToken(data.token);
      navigate('/adm');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="adm-login-page">
      <div className="adm-login-card">
        <div className="adm-login-header">
          <div className="adm-logo-icon">🧶</div>
          <h1>Lottus ADM</h1>
          <p>Painel Administrativo</p>
        </div>

        <form onSubmit={handleSubmit} className="adm-login-form">
          {error && <div className="adm-alert adm-alert-error">{error}</div>}

          <div className="adm-form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
            />
          </div>

          <div className="adm-form-group">
            <label>Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="adm-btn adm-btn-primary" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar no Painel'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
