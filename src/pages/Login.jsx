import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Mail, Lock, User, ArrowRight, Eye, EyeOff, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Login.css';

export default function Login() {
  const [activeTab, setActiveTab] = useState('login'); // 'login' ou 'register'
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Campos de login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Campos de cadastro
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regGrade, setRegGrade] = useState('');

  const { user, login, register } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await login(loginEmail, loginPassword);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Erro ao realizar login.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await register({
        name: regName,
        email: regEmail,
        password: regPassword,
        grade: regGrade,
      });
      navigate('/');
    } catch (err) {
      setError(err.message || 'Erro ao cadastrar conta.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-wrapper">
      {/* Background shapes decorativos */}
      <div className="login-bg-glow glow-1" />
      <div className="login-bg-glow glow-2" />

      <div className="login-card-container">
        {/* Cabeçalho da Marca */}
        <div className="login-brand-header">
          <div className="login-brand-badge">
            <GraduationCap size={26} color="#FFFFFF" />
          </div>
          <h1 className="login-brand-title">ENEM <span className="highlight-text">Última Hora</span></h1>
          <p className="login-brand-tagline">Sua preparação inteligente e focada para a aprovação</p>
        </div>

        {/* Card Principal */}
        <div className="card login-main-card">
          {/* Alternador de Abas */}
          <div className="login-tabs-nav">
            <button
              type="button"
              className={`login-tab-btn ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => { setActiveTab('login'); setError(''); }}
            >
              Entrar
            </button>
            <button
              type="button"
              className={`login-tab-btn ${activeTab === 'register' ? 'active' : ''}`}
              onClick={() => { setActiveTab('register'); setError(''); }}
            >
              Criar conta
            </button>
          </div>

          {error && <div className="login-error-alert">{error}</div>}

          {activeTab === 'login' ? (
            <form onSubmit={handleLogin} className="login-form">
              <div className="form-group">
                <label className="form-label">E-mail</label>
                <div className="input-with-icon">
                  <Mail size={18} className="input-field-icon" />
                  <input
                    type="email"
                    required
                    placeholder="seu.email@exemplo.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="label-with-action">
                  <label className="form-label">Senha</label>
                  <span className="forgot-password-link">Esqueceu a senha?</span>
                </div>
                <div className="input-with-icon">
                  <Lock size={18} className="input-field-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="form-control"
                  />
                  <button
                    type="button"
                    className="toggle-password-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Alternar exibição de senha"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="login-demo-notice">
                <Sparkles size={14} className="sparkle-icon" />
                <span>Ambiente pronto para banco de dados. Você pode entrar diretamente ou usar novas credenciais.</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-submit-auth"
              >
                {isSubmitting ? 'Entrando...' : (
                  <>
                    Acessar Plataforma <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="login-form">
              <div className="form-group">
                <label className="form-label">Nome Completo</label>
                <div className="input-with-icon">
                  <User size={18} className="input-field-icon" />
                  <input
                    type="text"
                    required
                    placeholder="Ex: Maria Silva"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">E-mail</label>
                <div className="input-with-icon">
                  <Mail size={18} className="input-field-icon" />
                  <input
                    type="email"
                    required
                    placeholder="seu.email@exemplo.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Série / Etapa de Estudos</label>
                <select
                  value={regGrade}
                  onChange={(e) => setRegGrade(e.target.value)}
                  className="form-control form-select"
                >
                  <option value="3º ano — Nível Médio">3º ano — Nível Médio</option>
                  <option value="2º ano — Nível Médio">2º ano — Nível Médio</option>
                  <option value="1º ano — Nível Médio">1º ano — Nível Médio</option>
                  <option value="Pré-Vestibular / Cursinho">Pré-Vestibular / Cursinho</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Criar Senha</label>
                <div className="input-with-icon">
                  <Lock size={18} className="input-field-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="No mínimo 6 caracteres"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="form-control"
                  />
                  <button
                    type="button"
                    className="toggle-password-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Alternar exibição de senha"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-submit-auth"
              >
                {isSubmitting ? 'Criando conta...' : (
                  <>
                    Cadastrar e Começar <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Rodapé institucional */}
        <div className="login-page-footer">
          <span>ENEM Última Hora © {new Date().getFullYear()} — Plataforma de Estudos</span>
        </div>
      </div>
    </div>
  );
}

