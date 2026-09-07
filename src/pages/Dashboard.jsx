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

const ICON_STYLE_MAP = {
  BookOpen: { icon: BookOpen, iconColor: '#5842ED', iconBg: '#ECEAFC' },
  Clock: { icon: Clock, iconColor: '#8E59E2', iconBg: '#F3EAFD' },
  CheckCircle2: { icon: CheckCircle2, iconColor: '#2F80ED', iconBg: '#EDF4FE' },
  TrendingUp: { icon: TrendingUp, iconColor: '#F79009', iconBg: '#FFF4E5' },
};

export default function Dashboard() {
  const { user } = useAuth();
  const { subjects, nextStudies, weeklyGoal, stats, featuredStudy, loading } = useData();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="dashboard-page">
        <Header pageTitle="Dashboard" />
        <div className="page-content">
          <p className="page-subtitle">Carregando seus dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <Header pageTitle="Dashboard" />
      <div className="page-content">
        <div className="welcome-banner">
          <h1 className="page-title">{user?.name || 'Estudante'} 👋</h1>
          <p className="page-subtitle">Continue de onde parou — você está indo muito bem!</p>
        </div>

        <div className="metrics-grid">
          {stats.map((stat) => {
            const style = ICON_STYLE_MAP[stat.icon] || ICON_STYLE_MAP.BookOpen;
            const Icon = style.icon;
            return (
              <div key={stat.id} className="card metric-card">
                <div className="metric-header">
                  <div className="metric-icon-box" style={{ backgroundColor: style.iconBg, color: style.iconColor }}>
                    <Icon size={18} />
                  </div>
                  <span className={`badge ${stat.badgeType}`}>{stat.badge}</span>
                </div>
                <div className="metric-value">{stat.title}</div>
                <div className="metric-sub">{stat.subtitle}</div>
              </div>
            );
          })}
        </div>

        <div className="dashboard-main-layout">
          <div className="dashboard-left-col">
            {featuredStudy && (
              <div className="featured-study-card">
                <div className="featured-top-tag">
                  <span className="live-dot" />
                  <span>{featuredStudy.badge || 'Próxima atividade'}</span>
                </div>
                <span className="featured-category-label">{featuredStudy.tag || 'ESTUDE AGORA'}</span>
                <h2 className="featured-title">{featuredStudy.title}</h2>
                <div className="featured-subject-badge">
                  <span className="subject-name-tag">{featuredStudy.subject}</span>
                  <span className="subject-sep">•</span>
                  <span className="subject-sub-tag">{featuredStudy.area}</span>
                </div>
                <p className="featured-details">{featuredStudy.details}</p>

                <div className="featured-actions">
                  <button onClick={() => navigate('/calendario')} className="btn-primary-purple">
                    Começar Estudo <ArrowRight size={16} />
                  </button>
                  <button onClick={() => navigate('/conteudos')} className="btn-secondary-dark">
                    Ver detalhes
                  </button>
                </div>

                <div className="featured-footer-stats">
                  <div className="f-stat-item">
                    <span className="f-stat-label">Duração</span>
                    <span className="f-stat-val">{featuredStudy.duration}</span>
                  </div>
                  <div className="f-stat-item">
                    <span className="f-stat-label">Dificuldade</span>
                    <span className="f-stat-val">{featuredStudy.difficulty}</span>
                  </div>
                  <div className="f-stat-item">
                    <span className="f-stat-label">Questões</span>
                    <span className="f-stat-val">{featuredStudy.questions}</span>
                  </div>
                </div>
              </div>
            )}

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

          <div className="dashboard-right-col">
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
                    value={weeklyGoal?.percentage || 0}
                    text={`${weeklyGoal?.percentage || 0}%`}
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
                    {weeklyGoal?.studiedHours ?? 0}h / {weeklyGoal?.targetHours ?? 0}h
                  </span>
                </div>
                <ProgressBar value={weeklyGoal?.percentage || 0} color="#5842ED" showValue={false} height={8} />
                <div className="breakdown-row bottom-row">
                  <span className="breakdown-sub">{weeklyGoal?.period || ''}</span>
                  <span className="breakdown-sub">{weeklyGoal?.remainingHours ?? 0}h restantes</span>
                </div>
              </div>
            </div>

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