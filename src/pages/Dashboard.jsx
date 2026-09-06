import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { ArrowRight, BookOpen, Clock, CheckCircle2, TrendingUp } from 'lucide-react';
import Header from '../components/Header';
import ProgressBar from '../components/ProgressBar';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import './Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();
  const { subjects, nextStudies, weeklyGoal } = useData();
  const navigate = useNavigate();

  const topStats = [
    {
      title: '4 matérias',
      subtitle: 'Estudos de Hoje',
      badge: '2 concluídas',
      badgeClass: 'badge-green',
      icon: BookOpen,
      iconColor: '#5842ED',
      iconBg: '#ECEAFC'
    },
    {
      title: '3h 45min',
      subtitle: 'Horas Estudadas',
      badge: '+12% esta semana',
      badgeClass: 'badge-purple',
      icon: Clock,
      iconColor: '#8E59E2',
      iconBg: '#F3EAFD'
    },
    {
      title: '24',
      subtitle: 'Atividades Concluídas',
      badge: 'de 38 planejadas',
      badgeClass: 'badge-blue',
      icon: CheckCircle2,
      iconColor: '#2F80ED',
      iconBg: '#EDF4FE'
    },
    {
      title: '58%',
      subtitle: 'Progresso Geral',
      badge: '↑ 8% este mês',
      badgeClass: 'badge-orange',
      icon: TrendingUp,
      iconColor: '#F79009',
      iconBg: '#FFF4E5'
    }
  ];

  return (
    <div className="dashboard-page">
      <Header pageTitle="Dashboard" />
      <div className="page-content">
        <div className="welcome-banner">
          <h1 className="page-title">{user?.name || 'Estudante'} 👋</h1>
          <p className="page-subtitle">Continue de onde parou — você está indo muito bem!</p>
        </div>

        {/* 4 Cards de Métricas */}
        <div className="metrics-grid">
          {topStats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="card metric-card">
                <div className="metric-header">
                  <div className="metric-icon-box" style={{ backgroundColor: stat.iconBg, color: stat.iconColor }}>
                    <Icon size={18} />
                  </div>
                  <span className={`badge ${stat.badgeClass}`}>{stat.badge}</span>
                </div>
                <div className="metric-value">{stat.title}</div>
                <div className="metric-sub">{stat.subtitle}</div>
              </div>
            );
          })}
        </div>

        {/* Grid Principal: Esquerda (Destaque + Próximos) / Direita (Meta + Progresso) */}
        <div className="dashboard-main-layout">
          {/* Coluna Esquerda */}
          <div className="dashboard-left-col">
            {/* Card Roxo Escuro de Estudo Atual */}
            <div className="featured-study-card">
              <div className="featured-top-tag">
                <span className="live-dot" />
                <span>Próxima atividade</span>
              </div>
              <span className="featured-category-label">ESTUDE AGORA</span>
              <h2 className="featured-title">Funções Quadráticas</h2>
              <div className="featured-subject-badge">
                <span className="subject-name-tag">Matemática</span>
                <span className="subject-sep">•</span>
                <span className="subject-sub-tag">Álgebra</span>
              </div>
              <p className="featured-details">Aula teórica • 10 exercícios • Hoje às 13:00</p>

              <div className="featured-actions">
                <button
                  onClick={() => navigate('/calendario')}
                  className="btn-primary-purple"
                >
                  Começar Estudo <ArrowRight size={16} />
                </button>
                <button
                  onClick={() => navigate('/conteudos')}
                  className="btn-secondary-dark"
                >
                  Ver detalhes
                </button>
              </div>

              <div className="featured-footer-stats">
                <div className="f-stat-item">
                  <span className="f-stat-label">Duração</span>
                  <span className="f-stat-val">1h 30min</span>
                </div>
                <div className="f-stat-item">
                  <span className="f-stat-label">Dificuldade</span>
                  <span className="f-stat-val">Médio</span>
                </div>
                <div className="f-stat-item">
                  <span className="f-stat-label">Questões</span>
                  <span className="f-stat-val">10 exercícios</span>
                </div>
              </div>
            </div>

            {/* Próximos Estudos */}
            <div className="card next-studies-card">
              <div className="card-header-flex">
                <h3 className="section-heading">Próximos Estudos</h3>
                <Link to="/calendario" className="link-action">Ver todos →</Link>
              </div>
              <div className="studies-list">
                {nextStudies.map((item, idx) => (
                  <div key={item.id || idx} className="study-row-item">
                    <span className="study-time-box">{item.time}</span>
                    <div className="study-info-col">
                      <span className="study-title-txt">{item.title}</span>
                      <span className="study-category-txt">{item.category}</span>
                    </div>
                    <span className="badge badge-orange">{item.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Coluna Direita */}
          <div className="dashboard-right-col">
            {/* Meta da Semana com Donut */}
            <div className="card weekly-goal-card">
              <div className="card-header-flex">
                <div>
                  <span className="card-mini-title">META DA SEMANA</span>
                  <h3 className="section-heading">Objetivo semanal</h3>
                </div>
              </div>

              <div className="goal-donut-container">
                <div className="donut-wrapper">
                  <CircularProgressbar
                    value={weeklyGoal?.percentage || 62}
                    text={`${weeklyGoal?.percentage || 62}%`}
                    styles={buildStyles({
                      textSize: '19px',
                      pathColor: '#5842ED',
                      textColor: '#14132A',
                      trailColor: '#F0EFFB',
                      strokeLinecap: 'round',
                    })}
                  />
                  <span className="donut-sublabel">concluído</span>
                </div>
              </div>

              <div className="goal-breakdown">
                <div className="breakdown-row">
                  <span className="breakdown-label">Horas estudadas</span>
                  <span className="breakdown-val">
                    {weeklyGoal?.studiedHours || 12}h / {weeklyGoal?.targetHours || 20}h
                  </span>
                </div>
                <ProgressBar
                  value={weeklyGoal?.percentage || 60}
                  color="#5842ED"
                  showValue={false}
                  height={8}
                />
                <div className="breakdown-row bottom-row">
                  <span className="breakdown-sub">{weeklyGoal?.period || 'Segunda — Domingo'}</span>
                  <span className="breakdown-sub">{weeklyGoal?.remainingHours || 8}h restantes</span>
                </div>
              </div>
            </div>

            {/* Progresso por Matéria */}
            <div className="card subject-progress-card">
              <h3 className="section-heading" style={{ marginBottom: '18px' }}>Progresso por Matéria</h3>
              <div className="progress-bars-stack">
                {subjects.slice(0, 5).map((subj) => (
                  <div key={subj.id} className="subj-progress-item">
                    <div className="subj-info-row">
                      <span className="subj-name">{subj.name}</span>
                      <span className="subj-pct">{subj.progress}%</span>
                    </div>
                    <ProgressBar value={subj.progress} color={subj.color} showValue={false} height={6} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}