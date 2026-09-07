import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Target, Clock, CheckSquare, Flame } from 'lucide-react';
import Header from '../components/Header';
import ProgressBar from '../components/ProgressBar';
import { useData } from '../context/DataContext';
import './MeuProgresso.css';

const ICON_STYLE_MAP = {
  Target: { icon: Target, iconColor: '#5842ED', iconBg: '#ECEAFC' },
  Clock: { icon: Clock, iconColor: '#2F80ED', iconBg: '#EDF4FE' },
  CheckSquare: { icon: CheckSquare, iconColor: '#12B76A', iconBg: '#EAF8F1' },
  Flame: { icon: Flame, iconColor: '#FB6514', iconBg: '#FFF4E5' },
};

export default function MeuProgresso() {
  const { subjects, progressStats, weeklyProgress, overallProgress, loading } = useData();

  const colLeft = [
    subjects.find((s) => s.id === 'portugues'),
    subjects.find((s) => s.id === 'quimica'),
    subjects.find((s) => s.id === 'geografia'),
    subjects.find((s) => s.id === 'historia'),
  ].filter(Boolean);

  const colRight = [
    subjects.find((s) => s.id === 'matematica'),
    subjects.find((s) => s.id === 'biologia'),
    subjects.find((s) => s.id === 'redacao'),
    subjects.find((s) => s.id === 'fisica'),
  ].filter(Boolean);

  if (loading) {
    return (
      <div className="progresso-page">
        <Header pageTitle="Meu Progresso" />
        <div className="page-content">
          <p className="page-subtitle">Carregando seus dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="progresso-page">
      <Header pageTitle="Meu Progresso" />
      <div className="page-content">
        <h1 className="page-title">Meu Progresso</h1>
        <p className="page-subtitle">Acompanhe sua evolução e desempenho ao longo do tempo</p>

        <div className="metrics-grid">
          {progressStats.map((stat) => {
            const style = ICON_STYLE_MAP[stat.icon] || ICON_STYLE_MAP.Target;
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

        <div className="progress-mid-layout">
          <div className="card weekly-chart-card">
            <div className="chart-header-row">
              <div>
                <h3 className="section-heading">Evolução Semanal</h3>
                <span className="chart-subheading">Horas estudadas por semana</span>
              </div>
              <span className="legend-indicator-dot">
                <span className="dot-purple" /> Horas
              </span>
            </div>

            <div className="bar-chart-container">
              {weeklyProgress.map((bar, i) => (
                <div key={i} className="bar-col">
                  <div className="bar-slot">
                    <div className="bar-fill-element" style={{ height: `${bar.heightPct}%` }} />
                  </div>
                  <span className="bar-label-text">{bar.week}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card dark-prog-card">
            <span className="dark-prog-kicker">PROGRESSO GERAL</span>
            <div className="dark-donut-wrapper">
              <CircularProgressbar
                value={overallProgress?.percentage || 0}
                text={`${overallProgress?.percentage || 0}%`}
                styles={buildStyles({
                  textSize: '20px',
                  pathColor: '#7C6CE8',
                  textColor: '#FFFFFF',
                  trailColor: 'rgba(255, 255, 255, 0.1)',
                  strokeLinecap: 'round',
                })}
              />
              <span className="dark-donut-sub">concluído</span>
            </div>

            <div className="dark-stats-footer">
              <div className="dark-stat-row">
                <span>Prova simulada</span>
                <span className="dark-stat-val">{overallProgress?.simulatedExamScore ?? 0}%</span>
              </div>
              <div className="dark-stat-row">
                <span>Redações feitas</span>
                <span className="dark-stat-val">
                  {overallProgress?.essaysDone ?? 0}/{overallProgress?.essaysTotal ?? 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="card subject-breakdown-card">
          <div className="card-header-flex">
            <h3 className="section-heading">Progresso por Matéria</h3>
            <span className="updated-tag">Atualizado hoje</span>
          </div>

          <div className="subjects-columns-grid">
            <div className="subj-col-stack">
              {colLeft.map((subj) => (
                <div key={subj.id} className="subj-detail-item">
                  <div className="subj-detail-top">
                    <span className="subj-detail-name">
                      <span className="subj-color-bullet" style={{ color: subj.color }}>●</span> {subj.name}
                    </span>
                    <span className="subj-detail-stats">
                      {subj.studiedHours}h estudadas <strong style={{ color: subj.color, marginLeft: 8 }}>{subj.progress}%</strong>
                    </span>
                  </div>
                  <ProgressBar value={subj.progress} color={subj.color} showValue={false} height={7} />
                </div>
              ))}
            </div>

            <div className="subj-col-stack">
              {colRight.map((subj) => (
                <div key={subj.id} className="subj-detail-item">
                  <div className="subj-detail-top">
                    <span className="subj-detail-name">
                      <span className="subj-color-bullet" style={{ color: subj.color }}>●</span> {subj.name}
                    </span>
                    <span className="subj-detail-stats">
                      {subj.studiedHours}h estudadas <strong style={{ color: subj.color, marginLeft: 8 }}>{subj.progress}%</strong>
                    </span>
                  </div>
                  <ProgressBar value={subj.progress} color={subj.color} showValue={false} height={7} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}