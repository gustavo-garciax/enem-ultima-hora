import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { Check, Save } from 'lucide-react';
import './Configuracoes.css';

export default function Configuracoes() {
  const { user, updateProfile } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    birthdate: '',
    school: '',
  });

  const [level, setLevel] = useState('medio');

  const [toggles, setToggles] = useState({
    lembretes: true,
    alertas: true,
    email: false,
    modoEscuro: false,
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        birthdate: user.birthdate || '15/03/2008',
        school: user.school || 'Colégio Estadual São Paulo',
      });
      setLevel(user.level || 'medio');
      if (user.preferences) {
        setToggles({
          lembretes: user.preferences.studyReminders ?? true,
          alertas: user.preferences.goalAlerts ?? true,
          email: user.preferences.emailNotifications ?? false,
          modoEscuro: user.preferences.darkMode ?? false,
        });
      }
    }
  }, [user]);

  const handleToggle = (key) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedSuccess(false);

    try {
      await updateProfile({
        name: formData.name,
        email: formData.email,
        birthdate: formData.birthdate,
        school: formData.school,
        level,
        preferences: {
          studyReminders: toggles.lembretes,
          goalAlerts: toggles.alertas,
          emailNotifications: toggles.email,
          darkMode: toggles.modoEscuro,
        },
      });

      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
      }, 3500);
    } catch (err) {
      console.error('Erro ao salvar alterações:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="configuracoes-page">
      <Header pageTitle="Configurações" />
      <div className="page-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 className="page-title">Configurações</h1>
            <p className="page-subtitle" style={{ marginBottom: 0 }}>Gerencie seu perfil, preferências e alertas de estudo</p>
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="btn-save-settings"
          >
            {savedSuccess ? (
              <>
                <Check size={18} /> Salvo com sucesso!
              </>
            ) : (
              <>
                <Save size={18} /> {isSaving ? 'Salvando...' : 'Salvar Alterações'}
              </>
            )}
          </button>
        </div>

        {savedSuccess && (
          <div className="config-success-banner">
            <Check size={18} />
            <span>Suas alterações foram salvas e sincronizadas com sucesso!</span>
          </div>
        )}

        <div className="config-sections-wrapper">
          {/* Card 1: Dados do Aluno */}
          <div className="card config-card">
            <h2 className="config-block-title">Dados do Aluno</h2>

            <div className="student-profile-header">
              <div className="student-big-avatar">{user?.initials || 'AL'}</div>
              <div className="student-meta-info">
                <span className="student-profile-name">{formData.name}</span>
                <span className="student-profile-email">{formData.email}</span>
              </div>
            </div>

            <div className="form-fields-grid">
              <div className="input-group">
                <label className="input-label">Nome completo</label>
                <input
                  type="text"
                  className="input-control"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="input-group">
                <label className="input-label">E-mail</label>
                <input
                  type="email"
                  className="input-control"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="input-group">
                <label className="input-label">Data de nascimento</label>
                <input
                  type="text"
                  className="input-control"
                  value={formData.birthdate}
                  onChange={(e) => setFormData({ ...formData, birthdate: e.target.value })}
                />
              </div>

              <div className="input-group">
                <label className="input-label">Escola</label>
                <input
                  type="text"
                  className="input-control"
                  value={formData.school}
                  onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Card 2: Nível e Desempenho */}
          <div className="card config-card">
            <h2 className="config-block-title">Nível e Desempenho</h2>

            <div className="level-selection-row">
              <div
                className={`level-choice-card ${level === 'baixo' ? 'selected' : ''}`}
                onClick={() => setLevel('baixo')}
              >
                <span className="level-dot-mark red">●</span>
                <div className="level-text-info">
                  <div className="level-name-wrap">
                    <span className="level-title">Nível Baixo</span>
                  </div>
                  <span className="level-desc">Iniciante nos estudos</span>
                </div>
              </div>

              <div
                className={`level-choice-card ${level === 'medio' ? 'selected' : ''}`}
                onClick={() => setLevel('medio')}
              >
                <span className="level-dot-mark orange">●</span>
                <div className="level-text-info">
                  <div className="level-name-wrap">
                    <span className="level-title">Nível Médio</span>
                    <span className="badge-atual">Atual</span>
                  </div>
                  <span className="level-desc">Estudante consistente</span>
                </div>
              </div>

              <div
                className={`level-choice-card ${level === 'alto' ? 'selected' : ''}`}
                onClick={() => setLevel('alto')}
              >
                <span className="level-dot-mark green">●</span>
                <div className="level-text-info">
                  <div className="level-name-wrap">
                    <span className="level-title">Nível Alto</span>
                  </div>
                  <span className="level-desc">Alto desempenho</span>
                </div>
              </div>
            </div>

            <p className="level-explanation-note">
              Seu nível personaliza o ritmo dos exercícios e a dificuldade sugerida para seus estudos.
            </p>
          </div>

          {/* Card 3: Preferências */}
          <div className="card config-card">
            <h2 className="config-block-title">Preferências</h2>

            <div className="toggles-list">
              <div className="toggle-row-item">
                <div className="toggle-text-block">
                  <span className="toggle-main-label">Lembretes de estudo</span>
                  <span className="toggle-sub-label">Notificações diárias para seus horários de estudo</span>
                </div>
                <button
                  className={`switch-toggle ${toggles.lembretes ? 'active' : ''}`}
                  onClick={() => handleToggle('lembretes')}
                >
                  <span className="switch-circle" />
                </button>
              </div>

              <div className="toggle-row-item">
                <div className="toggle-text-block">
                  <span className="toggle-main-label">Alertas de meta</span>
                  <span className="toggle-sub-label">Aviso quando estiver próximo de atingir sua meta semanal</span>
                </div>
                <button
                  className={`switch-toggle ${toggles.alertas ? 'active' : ''}`}
                  onClick={() => handleToggle('alertas')}
                >
                  <span className="switch-circle" />
                </button>
              </div>

              <div className="toggle-row-item">
                <div className="toggle-text-block">
                  <span className="toggle-main-label">Notificações por e-mail</span>
                  <span className="toggle-sub-label">Receber resumo semanal do seu progresso</span>
                </div>
                <button
                  className={`switch-toggle ${toggles.email ? 'active' : ''}`}
                  onClick={() => handleToggle('email')}
                >
                  <span className="switch-circle" />
                </button>
              </div>

              <div className="toggle-row-item">
                <div className="toggle-text-block">
                  <span className="toggle-main-label">Modo escuro</span>
                  <span className="toggle-sub-label">Interface com fundo escuro (em breve)</span>
                </div>
                <button
                  className={`switch-toggle ${toggles.modoEscuro ? 'active' : ''}`}
                  onClick={() => handleToggle('modoEscuro')}
                >
                  <span className="switch-circle" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
