import React, { createContext, useContext, useState, useEffect } from 'react';
import { studyService } from '../services/studyService';
import {
  computeDashboardStats,
  computeProgressStats,
  computeWeeklyGoal,
  computeWeeklyProgress,
  computeNextStudies,
  computeFeaturedStudy,
  computeOverallProgress,
  computeSubjectsProgress,
} from '../utils/statsCalculator';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [rawSubjects, setRawSubjects] = useState([]); // dados fixos por matéria: nome, ícone, cor, aulas, exercícios
  const [calendarActivities, setCalendarActivities] = useState({});
  const [subjects, setSubjects] = useState([]); // rawSubjects + progresso/horas calculados
  const [nextStudies, setNextStudies] = useState([]);
  const [weeklyGoal, setWeeklyGoal] = useState({});
  const [stats, setStats] = useState([]);
  const [progressStats, setProgressStats] = useState([]);
  const [weeklyProgress, setWeeklyProgress] = useState([]);
  const [overallProgress, setOverallProgress] = useState({});
  const [featuredStudy, setFeaturedStudy] = useState(null);
  const [loading, setLoading] = useState(true);

  const [goalConfig, setGoalConfig] = useState({});
  const [overallConfig, setOverallConfig] = useState({});

  // Recalcula todas as estatísticas derivadas a partir das atividades atuais
  const recomputeDerived = (activities, subjs, goalCfg, overallCfg) => {
    setSubjects(computeSubjectsProgress(subjs, activities));
    setStats(computeDashboardStats(activities));
    setProgressStats(computeProgressStats(activities));
    setWeeklyGoal(computeWeeklyGoal(activities, goalCfg));
    setWeeklyProgress(computeWeeklyProgress(activities));
    setNextStudies(computeNextStudies(activities));
    setFeaturedStudy(computeFeaturedStudy(activities));
    setOverallProgress(computeOverallProgress(activities, overallCfg));
  };

  const loadAllData = async () => {
    try {
      const [cal, subs, storedGoal, storedOverall] = await Promise.all([
        studyService.getCalendarActivities(),
        studyService.getSubjects(),
        studyService.getWeeklyGoal(),
        studyService.getOverallProgress(),
      ]);
      setCalendarActivities(cal);
      setRawSubjects(subs);
      setGoalConfig(storedGoal);
      setOverallConfig(storedOverall);
      recomputeDerived(cal, subs, storedGoal, storedOverall);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const addCalendarActivity = async (dateKey, activity) => {
    const result = await studyService.addCalendarActivity(dateKey, activity);
    setCalendarActivities({ ...result.allActivities });
    recomputeDerived(result.allActivities, rawSubjects, goalConfig, overallConfig);
    return result;
  };

  const updateActivityStatus = async (dateKey, activityId, newStatus) => {
    const updated = await studyService.updateActivityStatus(dateKey, activityId, newStatus);
    setCalendarActivities({ ...updated });
    recomputeDerived(updated, rawSubjects, goalConfig, overallConfig);
    return updated;
  };

  const deleteCalendarActivity = async (dateKey, activityId) => {
    const updated = await studyService.deleteActivity(dateKey, activityId);
    setCalendarActivities({ ...updated });
    recomputeDerived(updated, rawSubjects, goalConfig, overallConfig);
    return updated;
  };

  return (
    <DataContext.Provider
      value={{
        calendarActivities,
        subjects,
        nextStudies,
        weeklyGoal,
        stats,
        progressStats,
        weeklyProgress,
        overallProgress,
        featuredStudy,
        loading,
        addCalendarActivity,
        updateActivityStatus,
        deleteCalendarActivity,
        reload: loadAllData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData deve ser usado dentro de um DataProvider');
  }
  return context;
}