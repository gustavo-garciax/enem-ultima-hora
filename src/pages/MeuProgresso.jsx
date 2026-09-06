import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Target, Clock, CheckSquare, Flame } from 'lucide-react';
import Header from '../components/Header';
import ProgressBar from '../components/ProgressBar';
import { useData } from '../context/DataContext';
import './MeuProgresso.css';

export default function MeuProgresso() {
  const { subjects } = useData();
  const topStats = [
    {
      title: '58%',
      subtitle: 'Progresso Geral',
      badge: '↑ 6% este mês',
      badgeClass: 'badge-purple',
      icon: Target,
      iconColor: '#5842ED',
      iconBg: '#ECEAFC'
    },
    {
      title: '86h',
      subtitle: 'Total de Horas',
      badge: 'Este trimestre',
      badgeClass: 'badge-blue',
      icon: Clock,
      iconColor: '#2F80ED',
      iconBg: '#EDF4FE'
    },
    {
      title: '110',
      subtitle: 'Atividades Concluídas',
      badge: 'de 190 planejadas',
      badgeClass: 'badge-green',
      icon: CheckSquare,
      iconColor: '#12B76A',
      iconBg: '#EAF8F1'
    },
    {
      title: '14 dias',
      subtitle: 'Dias Consecutivos',
      badge: 'Sequência atual 🔥',
      badgeClass: 'badge-orange',
      icon: Flame,
      iconColor: '#FB6514',
      iconBg: '#FFF4E5'
    }
  ];

  const weeklyData = [
    { label: 'Sem 1', hours: 8, heightPct: 40 },
    { label: 'Sem 2', hours: 12, heightPct: 60 },
    { label: 'Sem 3', hours: 10, heightPct: 50 },
    { label: 'Sem 4', hours: 16, heightPct: 80 },
    { label: 'Sem 5', hours: 14, heightPct: 70 },
    { label: 'Sem 6', hours: 18, heightPct: 90 },
  ];

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

  return (
    <div className="progresso-page">
      <Header pageTitle="Meu Progresso" />
      <div className="page-content">
        <h1 className="page-title">Meu Progresso</h1>
        <p className="page-subtitle">Acompanhe sua evolução e desempenho ao longo do tempo</p>

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
              {weeklyData.map((bar, i) => (
                <div key={i} className="bar-col">
                  <div className="bar-slot">
                    <div
                      className="bar-fill-element"
                      style={{ height: `${bar.heightPct}%` }}
                    />
                  </div>
                  <span className="bar-label-text">{bar.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card dark-prog-card">
            <span className="dark-prog-kicker">PROGRESSO GERAL</span>
            <div className="dark-donut-wrapper">
              <CircularProgressbar
                value={58}
                text="58%"
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
                <span className="dark-stat-val">72%</span>
              </div>
              <div className="dark-stat-row">
                <span>Redações feitas</span>
                <span className="dark-stat-val">8/12</span>
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

