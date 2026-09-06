import React, { createContext, useContext, useState, useEffect } from 'react';
import { studyService } from '../services/studyService';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [calendarActivities, setCalendarActivities] = useState({});
  const [subjects, setSubjects] = useState([]);
  const [nextStudies, setNextStudies] = useState([]);
  const [weeklyGoal, setWeeklyGoal] = useState({});
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAllData = async () => {
    try {
      const [cal, subs, nexts, goal, dashStats] = await Promise.all([
        studyService.getCalendarActivities(),
        studyService.getSubjects(),
        studyService.getNextStudies(),
        studyService.getWeeklyGoal(),
        studyService.getDashboardStats(),
      ]);
      setCalendarActivities(cal);
      setSubjects(subs);
      setNextStudies(nexts);
      setWeeklyGoal(goal);
      setStats(dashStats);
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
    return result;
  };

  const updateActivityStatus = async (dateKey, activityId, newStatus) => {
    const updated = await studyService.updateActivityStatus(dateKey, activityId, newStatus);
    setCalendarActivities({ ...updated });
    return updated;
  };

  const deleteCalendarActivity = async (dateKey, activityId) => {
    const updated = await studyService.deleteActivity(dateKey, activityId);
    setCalendarActivities({ ...updated });
    return updated;
  };

  const updateSubjectProgress = async (subjectId, progress) => {
    const updated = await studyService.updateSubjectProgress(subjectId, progress);
    setSubjects([...updated]);
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
        loading,
        addCalendarActivity,
        updateActivityStatus,
        deleteCalendarActivity,
        updateSubjectProgress,
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

