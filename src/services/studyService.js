import { storageAdapter, initStorage } from './storageAdapter';

initStorage();

export const studyService = {
  /**
   * Obtém o mapa de atividades do calendário
   */
  async getCalendarActivities() {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return storageAdapter.get(storageAdapter.KEYS.CALENDAR, {});
  },

  /**
   * Adiciona uma nova atividade de estudo para uma data específica (ex: '2026-09-05')
   */
  async addCalendarActivity(dateKey, activity) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const allActivities = storageAdapter.get(storageAdapter.KEYS.CALENDAR, {});
    const dayActivities = allActivities[dateKey] ? [...allActivities[dateKey]] : [];

    const newActivity = {
      id: Date.now(),
      subject: activity.subject || 'Geral',
      title: activity.title,
      time: activity.time || '10:00',
      status: activity.status || 'pendente',
      color: activity.color || '#5842ED',
    };

    dayActivities.push(newActivity);
    allActivities[dateKey] = dayActivities;
    storageAdapter.set(storageAdapter.KEYS.CALENDAR, allActivities);

    return { dateKey, activity: newActivity, allActivities };
  },

  /**
   * Altera o status de uma atividade existente (ex: 'pendente' -> 'em_andamento' -> 'concluida')
   */
  async updateActivityStatus(dateKey, activityId, newStatus) {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const allActivities = storageAdapter.get(storageAdapter.KEYS.CALENDAR, {});
    const dayActivities = allActivities[dateKey];

    if (!dayActivities) return allActivities;

    const updatedDay = dayActivities.map((act) => {
      if (act.id === activityId) {
        return { ...act, status: newStatus };
      }
      return act;
    });

    allActivities[dateKey] = updatedDay;
    storageAdapter.set(storageAdapter.KEYS.CALENDAR, allActivities);
    return allActivities;
  },

  /**
   * Remove uma atividade do calendário
   */
  async deleteActivity(dateKey, activityId) {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const allActivities = storageAdapter.get(storageAdapter.KEYS.CALENDAR, {});
    if (allActivities[dateKey]) {
      allActivities[dateKey] = allActivities[dateKey].filter((act) => act.id !== activityId);
      storageAdapter.set(storageAdapter.KEYS.CALENDAR, allActivities);
    }
    return allActivities;
  },

  /**
   * Obtém a lista de matérias com progresso
   */
  async getSubjects() {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return storageAdapter.get(storageAdapter.KEYS.SUBJECTS, []);
  },

  /**
   * Atualiza o progresso de uma matéria
   */
  async updateSubjectProgress(subjectId, progress) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const subjects = storageAdapter.get(storageAdapter.KEYS.SUBJECTS, []);
    const updated = subjects.map((subj) =>
      subj.id === subjectId ? { ...subj, progress: Math.min(100, Math.max(0, progress)) } : subj
    );
    storageAdapter.set(storageAdapter.KEYS.SUBJECTS, updated);
    return updated;
  },

  /**
   * Obtém os próximos estudos
   */
  async getNextStudies() {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return storageAdapter.get(storageAdapter.KEYS.NEXT_STUDIES, []);
  },

  /**
   * Obtém dados da meta semanal
   */
  async getWeeklyGoal() {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return storageAdapter.get(storageAdapter.KEYS.WEEKLY_GOAL, {});
  },

  /**
   * Obtém os dados de métricas do dashboard
   */
  async getDashboardStats() {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return storageAdapter.get(storageAdapter.KEYS.STATS, []);
  },
};

