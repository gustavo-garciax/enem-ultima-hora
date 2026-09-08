import initialData from '../data/db.json';

const STORAGE_KEYS = {
  USER: 'enem_user',
  SESSION: 'enem_session',
  CALENDAR: 'enem_calendar_activities',
  SUBJECTS: 'enem_subjects',
  NEXT_STUDIES: 'enem_next_studies',
  STATS: 'enem_dashboard_stats',
  WEEKLY_GOAL: 'enem_weekly_goal',
  PROGRESS_STATS: 'enem_progress_stats',
  WEEKLY_PROGRESS: 'enem_weekly_progress',
  OVERALL_PROGRESS: 'enem_overall_progress',
  FEATURED_STUDY: 'enem_featured_study',
};

export function initStorage() {
  if (typeof window === 'undefined') return;

  if (!localStorage.getItem(STORAGE_KEYS.USER)) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(initialData.user));
  }

  if (!localStorage.getItem(STORAGE_KEYS.NEXT_STUDIES)) {
    localStorage.setItem(STORAGE_KEYS.NEXT_STUDIES, JSON.stringify(initialData.nextStudies));
  }

  if (!localStorage.getItem(STORAGE_KEYS.STATS)) {
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(initialData.dashboardStats));
  }

  if (!localStorage.getItem(STORAGE_KEYS.PROGRESS_STATS)) {
    localStorage.setItem(STORAGE_KEYS.PROGRESS_STATS, JSON.stringify(initialData.progressStats));
  }

  if (!localStorage.getItem(STORAGE_KEYS.FEATURED_STUDY)) {
    localStorage.setItem(STORAGE_KEYS.FEATURED_STUDY, JSON.stringify(initialData.featuredStudy));
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