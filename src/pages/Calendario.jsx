import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Clock, X, Trash2 } from 'lucide-react';
import Header from '../components/Header';
import { useData } from '../context/DataContext';
import './Calendario.css';

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];
const WEEK_DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const SUBJECT_OPTIONS = [
  { name: 'Matemática', color: '#5842ED' },
  { name: 'Português', color: '#8E59E2' },
  { name: 'Redação', color: '#7C4DFF' },
  { name: 'História', color: '#F79009' },
  { name: 'Geografia', color: '#12B76A' },
  { name: 'Biologia', color: '#06AED4' },
  { name: 'Física', color: '#F04438' },
  { name: 'Química', color: '#FB6514' },
];

export default function Calendario() {
  const { calendarActivities, addCalendarActivity, updateActivityStatus, deleteCalendarActivity } = useData();
  const [selectedDay, setSelectedDay] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form de nova atividade
  const [newSubject, setNewSubject] = useState('Matemática');
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('14:00');
  const [newStatus, setNewStatus] = useState('pendente');

  const currentMonth = 8; // Setembro (0-indexed)
  const currentYear = 2026;

  const daysInMonth = 30;
  const startDayOfWeek = 2; // Terça-feira
  const totalSlots = 35; // 5 semanas

  const calendarGrid = [];
  for (let i = 0; i < startDayOfWeek; i++) {
    calendarGrid.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarGrid.push(d);
  }
  while (calendarGrid.length < totalSlots) {
    calendarGrid.push(null);
  }

  const selectedDateKey = `2026-09-${String(selectedDay).padStart(2, '0')}`;
  const dayActivities = calendarActivities[selectedDateKey] || [];

  const handleToggleStatus = (act) => {
    let nextStatus = 'pendente';
    if (act.status === 'pendente') nextStatus = 'em_andamento';
    else if (act.status === 'em_andamento') nextStatus = 'concluida';
    else if (act.status === 'concluida') nextStatus = 'pendente';

    updateActivityStatus(selectedDateKey, act.id, nextStatus);
  };

  const handleCreateActivity = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const chosenSub = SUBJECT_OPTIONS.find((s) => s.name === newSubject);

    await addCalendarActivity(selectedDateKey, {
      subject: newSubject,
      title: newTitle.trim(),
      time: newTime || '14:00',
      status: newStatus,
      color: chosenSub ? chosenSub.color : '#5842ED',
    });

    setNewTitle('');
    setIsModalOpen(false);
  };

  const getStatusBadge = (status) => {
    if (status === 'concluida') {
      return <span className="badge badge-green clickable-badge">Concluída ↺</span>;
    }
    if (status === 'em_andamento') {
      return <span className="badge badge-orange clickable-badge">Em andamento ↺</span>;
    }
    return <span className="badge badge-purple clickable-badge">Pendente ↺</span>;
  };

  return (
    <div className="calendario-page">
      <Header pageTitle="Calendário" />
      <div className="page-content">
        <div className="calendar-layout">
          {/* Coluna Esquerda: Grade do Calendário */}
          <div className="card calendar-main-card">
            <div className="calendar-card-header">
              <div>
                <h2 className="month-title">{MONTH_NAMES[currentMonth]} {currentYear}</h2>
                <p className="month-subtitle">Clique em um dia para gerenciar os estudos</p>
              </div>
              <div className="calendar-nav-buttons">
                <button className="nav-arrow-btn" aria-label="Mês anterior">
                  <ChevronLeft size={16} />
                </button>
                <button className="nav-arrow-btn" aria-label="Próximo mês">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            <div className="days-of-week-row">
              {WEEK_DAYS.map((day) => (
                <div key={day} className="weekday-header-cell">{day}</div>
              ))}
            </div>

            <div className="calendar-days-grid">
              {calendarGrid.map((dayNumber, idx) => {
                if (dayNumber === null) {
                  return <div key={idx} className="day-cell empty-cell" />;
                }

                const isSelected = dayNumber === selectedDay;
                const dateKey = `2026-09-${String(dayNumber).padStart(2, '0')}`;
                const dayDots = calendarActivities[dateKey] || [];

                return (
                  <div
                    key={idx}
                    className={`day-cell ${isSelected ? 'selected-day' : ''}`}
                    onClick={() => setSelectedDay(dayNumber)}
                  >
                    <span className="day-number">{dayNumber}</span>
                    <div className="day-indicators">
                      {dayDots.slice(0, 4).map((dot, dIdx) => (
                        <span
                          key={dIdx}
                          className="status-dot"
                          style={{ backgroundColor: dot.color || '#5842ED' }}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="calendar-legend-bar">
              <div className="legend-items">
                <div className="legend-item">
                  <span className="legend-dot green" />
                  <span>Concluída</span>
                </div>
                <div className="legend-item">
                  <span className="legend-dot purple" />
                  <span>Pendente</span>
                </div>
                <div className="legend-item">
                  <span className="legend-dot orange" />
                  <span>Em andamento</span>
                </div>
              </div>
              <span className="legend-instruction">
                💡 Clique na tag de status para alternar
              </span>
            </div>
          </div>

          {/* Coluna Direita: Painel do Dia Selecionado */}
          <div className="card day-details-panel">
            <div className="day-panel-top">
              <span className="day-panel-kicker">DIA SELECIONADO</span>
              <h3 className="day-panel-heading">{selectedDay} de Setembro</h3>
              <span className="day-panel-count">{dayActivities.length} {dayActivities.length === 1 ? 'atividade' : 'atividades'}</span>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-add-study-primary"
            >
              <Plus size={16} /> Adicionar estudo
            </button>

            <div className="day-activities-list">
              {dayActivities.length === 0 ? (
                <div className="empty-activities-notice">
                  <p>Nenhum estudo programado para este dia.</p>
                  <span>Clique no botão acima para adicionar!</span>
                </div>
              ) : (
                dayActivities.map((act) => (
                  <div
                    key={act.id}
                    className={`activity-card-item ${
                      act.status === 'concluida' ? 'act-concluida' : act.status === 'em_andamento' ? 'act-andamento' : 'act-pendente'
                    }`}
                  >
                    <div className="act-header">
                      <span className="act-subject" style={{ color: act.color || '#5842ED' }}>
                        ● {act.subject || 'Geral'}
                      </span>
                      <button
                        onClick={() => deleteCalendarActivity(selectedDateKey, act.id)}
                        className="btn-del-act"
                        title="Remover atividade"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                    <h4 className="act-title">{act.title}</h4>
                    <div className="act-footer">
                      <span className="act-time">
                        <Clock size={13} /> {act.time || '10:00'}
                      </span>
                      <div
                        onClick={() => handleToggleStatus(act)}
                        style={{ cursor: 'pointer' }}
                        title="Clique para mudar status"
                      >
                        {getStatusBadge(act.status)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Modal de Adicionar Estudo */}
        {isModalOpen && (
          <div className="modal-backdrop">
            <div className="modal-container">
              <div className="modal-header">
                <h3 className="modal-title">Novo Estudo — {selectedDay} de Setembro</h3>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="modal-close-btn"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateActivity} className="modal-form">
                <div className="form-group">
                  <label className="form-label">Matéria</label>
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="form-control form-select-light"
                  >
                    {SUBJECT_OPTIONS.map((s) => (
                      <option key={s.name} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Título da Atividade / Conteúdo</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Cinemática e Gráficos"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="form-control form-control-light"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Horário</label>
                    <input
                      type="time"
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                      className="form-control form-control-light"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Status Inicial</label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="form-control form-select-light"
                    >
                      <option value="pendente">Pendente</option>
                      <option value="em_andamento">Em andamento</option>
                      <option value="concluida">Concluída</option>
                    </select>
                  </div>
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="btn-modal-cancel"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn-modal-submit"
                  >
                    Salvar Atividade
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}