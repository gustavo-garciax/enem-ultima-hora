// utils/statsCalculator.js
// Calcula todas as estatísticas (dashboard, progresso, meta semanal, etc.)
// diretamente a partir das atividades reais do calendário, em vez de números fixos.

function pad(n) {
  return String(n).padStart(2, '0');
}

function getDateKey(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function startOfWeek(date) {
  // Semana começando na Segunda-feira
  const d = new Date(date);
  const day = d.getDay(); // 0 = domingo
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function flattenActivities(calendarActivities) {
  const all = [];
  Object.keys(calendarActivities || {}).forEach((dateKey) => {
    (calendarActivities[dateKey] || []).forEach((act) => {
      all.push({ ...act, dateKey, duration: act.duration || 60 });
    });
  });
  return all;
}

function formatHours(totalMinutes) {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
}

export function computeDashboardStats(calendarActivities) {
  const all = flattenActivities(calendarActivities);
  const todayKey = getDateKey(new Date());
  const todayActs = all.filter((a) => a.dateKey === todayKey);
  const todayConcluded = todayActs.filter((a) => a.status === 'concluida').length;
  const todayMinutes = todayActs.reduce((sum, a) => sum + a.duration, 0);

  const weekStart = startOfWeek(new Date());
  const weekActs = all.filter((a) => new Date(a.dateKey) >= weekStart);
  const weekMinutes = weekActs.reduce((sum, a) => sum + a.duration, 0);

  const totalConcluded = all.filter((a) => a.status === 'concluida').length;
  const totalActs = all.length;
  const overallPct = totalActs > 0 ? Math.round((totalConcluded / totalActs) * 100) : 0;

  return [
    {
      id: 1,
      title: `${todayActs.length} ${todayActs.length === 1 ? 'matéria' : 'matérias'}`,
      subtitle: 'Estudos de Hoje',
      badge: `${todayConcluded} concluídas`,
      badgeType: 'badge-green',
      icon: 'BookOpen',
    },
    {
      id: 2,
      title: formatHours(todayMinutes),
      subtitle: 'Horas Estudadas',
      badge: `${formatHours(weekMinutes)} esta semana`,
      badgeType: 'badge-purple',
      icon: 'Clock',
    },
    {
      id: 3,
      title: `${totalConcluded}`,
      subtitle: 'Atividades Concluídas',
      badge: `de ${totalActs} planejadas`,
      badgeType: 'badge-blue',
      icon: 'CheckCircle2',
    },
    {
      id: 4,
      title: `${overallPct}%`,
      subtitle: 'Progresso Geral',
      badge: `${totalConcluded}/${totalActs} concluídas`,
      badgeType: 'badge-orange',
      icon: 'TrendingUp',
    },
  ];
}

function computeStreak(calendarActivities) {
  const hasConcluded = (dateKey) =>
    (calendarActivities[dateKey] || []).some((a) => a.status === 'concluida');

  let cursor = new Date();
  if (!hasConcluded(getDateKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
  }

  let streak = 0;
  let safety = 0;
  while (hasConcluded(getDateKey(cursor)) && safety < 730) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
    safety += 1;
  }
  return streak;
}

export function computeProgressStats(calendarActivities) {
  const all = flattenActivities(calendarActivities);
  const totalConcluded = all.filter((a) => a.status === 'concluida').length;
  const totalActs = all.length;
  const overallPct = totalActs > 0 ? Math.round((totalConcluded / totalActs) * 100) : 0;
  const totalMinutes = all.reduce((sum, a) => sum + a.duration, 0);
  const streak = computeStreak(calendarActivities);

  return [
    {
      id: 1,
      title: `${overallPct}%`,
      subtitle: 'Progresso Geral',
      badge: 'Total acumulado',
      badgeType: 'badge-purple',
      icon: 'Target',
    },
    {
      id: 2,
      title: formatHours(totalMinutes),
      subtitle: 'Total de Horas',
      badge: 'Todas as atividades',
      badgeType: 'badge-blue',
      icon: 'Clock',
    },
    {
      id: 3,
      title: `${totalConcluded}`,
      subtitle: 'Atividades Concluídas',
      badge: `de ${totalActs} planejadas`,
      badgeType: 'badge-green',
      icon: 'CheckSquare',
    },
    {
      id: 4,
      title: `${streak} ${streak === 1 ? 'dia' : 'dias'}`,
      subtitle: 'Dias Consecutivos',
      badge: 'Sequência atual 🔥',
      badgeType: 'badge-orange',
      icon: 'Flame',
    },
  ];
}

export function computeWeeklyGoal(calendarActivities, storedGoal = {}) {
  const targetHours = storedGoal.targetHours || 20;
  const weekStart = startOfWeek(new Date());
  const all = flattenActivities(calendarActivities);
  const weekMinutes = all
    .filter((a) => new Date(a.dateKey) >= weekStart)
    .reduce((sum, a) => sum + a.duration, 0);

  const studiedHours = Math.round((weekMinutes / 60) * 10) / 10;
  const percentage = targetHours > 0 ? Math.min(100, Math.round((studiedHours / targetHours) * 100)) : 0;
  const remainingHours = Math.max(0, Math.round((targetHours - studiedHours) * 10) / 10);

  return {
    percentage,
    studiedHours,
    targetHours,
    remainingHours,
    period: storedGoal.period || 'Segunda — Domingo',
  };
}

export function computeWeeklyProgress(calendarActivities, weeksCount = 6) {
  const all = flattenActivities(calendarActivities);
  const currentWeekStart = startOfWeek(new Date());

  const weeks = [];
  for (let i = weeksCount - 1; i >= 0; i -= 1) {
    const start = new Date(currentWeekStart);
    start.setDate(start.getDate() - i * 7);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    weeks.push({ start, end });
  }

  const hoursPerWeek = weeks.map(({ start, end }) => {
    const minutes = all
      .filter((a) => {
        const d = new Date(a.dateKey);
        return d >= start && d <= end;
      })
      .reduce((sum, a) => sum + a.duration, 0);
    return Math.round((minutes / 60) * 10) / 10;
  });

  const maxHours = Math.max(...hoursPerWeek, 1);

  return hoursPerWeek.map((hours, idx) => ({
    week: `Sem ${idx + 1}`,
    hours,
    heightPct: Math.round((hours / maxHours) * 100),
  }));
}

export function computeNextStudies(calendarActivities, limit = 3) {
  const all = flattenActivities(calendarActivities);
  const now = new Date();
  const todayKey = getDateKey(now);

  const upcoming = all
    .filter((a) => a.status !== 'concluida' && a.dateKey >= todayKey)
    .sort((a, b) => {
      if (a.dateKey !== b.dateKey) return a.dateKey < b.dateKey ? -1 : 1;
      return (a.time || '').localeCompare(b.time || '');
    })
    .slice(0, limit);

  const statusLabel = { pendente: 'Pendente', em_andamento: 'Em andamento' };

  return upcoming.map((a) => ({
    id: a.id,
    time: a.time,
    title: a.title,
    category: a.subject,
    status: statusLabel[a.status] || 'Pendente',
  }));
}

export function computeFeaturedStudy(calendarActivities) {
  const [next] = computeNextStudies(calendarActivities, 1);
  if (!next) return null;

  return {
    tag: 'ESTUDE AGORA',
    badge: 'Próxima atividade',
    title: next.title,
    subject: next.category,
    area: '',
    details: `${next.time ? `Hoje às ${next.time}` : ''}`.trim(),
    duration: '—',
    difficulty: '—',
    questions: '—',
  };
}

export function computeOverallProgress(calendarActivities, storedOverall = {}) {
  const all = flattenActivities(calendarActivities);
  const totalConcluded = all.filter((a) => a.status === 'concluida').length;
  const totalActs = all.length;
  const percentage = totalActs > 0 ? Math.round((totalConcluded / totalActs) * 100) : 0;

  const essays = all.filter((a) => a.subject === 'Redação');
  const essaysDone = essays.filter((a) => a.status === 'concluida').length;
  const essaysTotal = essays.length;

  return {
    percentage,
    simulatedExamScore: storedOverall.simulatedExamScore ?? 0,
    essaysDone,
    essaysTotal,
  };
}

/**
 * Recalcula o progresso (%) e as horas estudadas de cada matéria
 * com base nas atividades do calendário daquela matéria.
 */
export function computeSubjectsProgress(subjects, calendarActivities) {
  const all = flattenActivities(calendarActivities);

  return subjects.map((subj) => {
    const subjActs = all.filter((a) => a.subject === subj.name);
    const total = subjActs.length;
    const concluded = subjActs.filter((a) => a.status === 'concluida');
    const progress = total > 0 ? Math.round((concluded.length / total) * 100) : 0;
    const studiedMinutes = concluded.reduce((sum, a) => sum + a.duration, 0);
    const studiedHours = Math.round((studiedMinutes / 60) * 10) / 10;

    return { ...subj, progress, studiedHours };
  });
}