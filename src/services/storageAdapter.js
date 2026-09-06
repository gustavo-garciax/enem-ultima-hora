import initialData from '../data/db.json';

const STORAGE_KEYS = {
  USER: 'enem_user',
  SESSION: 'enem_session',
  CALENDAR: 'enem_calendar_activities',
  SUBJECTS: 'enem_subjects',
  NEXT_STUDIES: 'enem_next_studies',
  STATS: 'enem_dashboard_stats',
  WEEKLY_GOAL: 'enem_weekly_goal',
};

/**
 * Inicializa os dados no LocalStorage caso ainda não existam.
 * Permite que a aplicação use dados dinâmicos e persistentes,
 * mantendo compatibilidade com um futuro backend/API.
 */
export function initStorage() {
  if (typeof window === 'undefined') return;

  if (!localStorage.getItem(STORAGE_KEYS.USER)) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(initialData.user));
  }

  // Se não houver sessão ativa, podemos iniciar com a sessão do usuário padrão do db.json
  if (!localStorage.getItem(STORAGE_KEYS.SESSION)) {
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(initialData.user));
  }

  if (!localStorage.getItem(STORAGE_KEYS.CALENDAR)) {
    localStorage.setItem(STORAGE_KEYS.CALENDAR, JSON.stringify(initialData.calendarActivities));
  }

  if (!localStorage.getItem(STORAGE_KEYS.SUBJECTS)) {
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(initialData.subjects));
  }

  if (!localStorage.getItem(STORAGE_KEYS.NEXT_STUDIES)) {
    localStorage.setItem(STORAGE_KEYS.NEXT_STUDIES, JSON.stringify(initialData.nextStudies));
  }

  if (!localStorage.getItem(STORAGE_KEYS.STATS)) {
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(initialData.dashboardStats));
  }

  if (!localStorage.getItem(STORAGE_KEYS.WEEKLY_GOAL)) {
    localStorage.setItem(STORAGE_KEYS.WEEKLY_GOAL, JSON.stringify(initialData.weeklyGoal));
  }
}

export const storageAdapter = {
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Erro ao gravar no localStorage:', e);
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error('Erro ao remover do localStorage:', e);
    }
  },

  KEYS: STORAGE_KEYS,
};

