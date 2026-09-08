import { storageAdapter, initStorage } from './storageAdapter';
import { supabase } from './supabaseClient';

initStorage();

export const studyService = {
  /**
   * Obtém o mapa de atividades do calendário do usuário logado
   */
  async getCalendarActivities() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return {};

    const { data, error } = await supabase
      .from('calendar_activities')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      console.error('Erro ao buscar atividades:', error);
      return {};
    }

    const grouped = {};
    data.forEach((act) => {
      if (!grouped[act.date_key]) grouped[act.date_key] = [];
      grouped[act.date_key].push({
        id: act.id,
        subject: act.subject,
        title: act.title,
        time: act.time,
        duration: act.duration,
        status: act.status,
        color: act.color,
      });
    });
    return grouped;
  },

  /**
   * Adiciona uma nova atividade de estudo para uma data específica (ex: '2026-09-05')
   */
  async addCalendarActivity(dateKey, activity) {
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.from('calendar_activities').insert({
      user_id: user.id,
      date_key: dateKey,
      subject: activity.subject || 'Geral',
      title: activity.title,
      time: activity.time || '10:00',
      duration: activity.duration ? Number(activity.duration) : 60,
      status: activity.status || 'pendente',
      color: activity.color || '#5842ED',
    });

    if (error) throw error;

    const allActivities = await this.getCalendarActivities();
    return { dateKey, allActivities };
  },

  /**
   * Altera o status de uma atividade existente (ex: 'pendente' -> 'em_andamento' -> 'concluida')
   */
  async updateActivityStatus(dateKey, activityId, newStatus) {
    const { error } = await supabase
      .from('calendar_activities')
      .update({ status: newStatus })
      .eq('id', activityId);

    if (error) throw error;
    return await this.getCalendarActivities();
  },

  /**
   * Remove uma atividade do calendário
   */
  async deleteActivity(dateKey, activityId) {
    const { error } = await supabase
      .from('calendar_activities')
      .delete()
      .eq('id', activityId);

    if (error) throw error;
    return await this.getCalendarActivities();
  },

  /**
   * Obtém a lista de matérias com progresso
   */
  async getSubjects() {
    const { data, error } = await supabase.from('subjects').select('*');

    if (error) {
      console.error('Erro ao buscar matérias:', error);
      return [];
    }

    return data.map((s) => ({
      id: s.id,
      name: s.name,
      icon: s.icon,
      color: s.color,
      aulas: s.aulas,
      exercicios: s.exercicios,
      pdfUrl: s.pdf_url,
    }));
  },

  /**
   * Obtém a meta semanal do usuário logado (cria com valores padrão se ainda não existir)
   */
  async getWeeklyGoal() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return {};

    let { data, error } = await supabase
      .from('user_settings')
      .select('target_hours, period')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Erro ao buscar meta semanal:', error);
      return {};
    }

    if (!data) {
      const defaults = { user_id: user.id, target_hours: 20, period: 'Segunda — Domingo' };
      await supabase.from('user_settings').insert(defaults);
      data = defaults;
    }

    return {
      targetHours: data.target_hours,
      period: data.period,
    };
  },

  /**
   * Obtém a nota de simulado do usuário logado
   */
  async getOverallProgress() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return {};

    const { data, error } = await supabase
      .from('user_settings')
      .select('simulated_exam_score')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Erro ao buscar progresso geral:', error);
      return {};
    }

    return {
      simulatedExamScore: data?.simulated_exam_score || 0,
    };
  },

  /**
   * Atualiza a meta de horas semanais do usuário
   */
  async updateWeeklyGoalHours(targetHours) {
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase
      .from('user_settings')
      .upsert({ user_id: user.id, target_hours: targetHours });

    if (error) throw error;
  },

  /**
   * Atualiza a nota de simulado do usuário
   */
  async updateSimulatedExamScore(score) {
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase
      .from('user_settings')
      .upsert({ user_id: user.id, simulated_exam_score: score });

    if (error) throw error;
  },
};