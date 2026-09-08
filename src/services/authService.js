import { supabase } from './supabaseClient';

function mapSupabaseUser(supabaseUser) {
  if (!supabaseUser) return null;
  const meta = supabaseUser.user_metadata || {};

  return {
    id: supabaseUser.id,
    email: supabaseUser.email,
    name: meta.name || supabaseUser.email.split('@')[0],
    initials: meta.initials || supabaseUser.email.slice(0, 2).toUpperCase(),
    grade: meta.grade || '3º ano — Nível Médio',
  };
}

export const authService = {
  async login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      throw new Error('E-mail ou senha inválidos.');
    }

    return { success: true, user: mapSupabaseUser(data.user) };
  },

  async register({ name, email, password, grade }) {
    if (!name || !email || !password) {
      throw new Error('Preencha todos os campos obrigatórios.');
    }

    const initials = name
      .trim()
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { name: name.trim(), initials, grade },
      },
    });

    if (error) {
      throw new Error(error.message || 'Erro ao cadastrar conta.');
    }

    return { success: true, user: mapSupabaseUser(data.user) };
  },

  async getCurrentUser() {
    const { data } = await supabase.auth.getSession();
    return mapSupabaseUser(data.session?.user);
  },

  async updateProfile(updatedFields) {
    const initials = updatedFields.name
      ? updatedFields.name.trim().split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
      : undefined;

    const { data, error } = await supabase.auth.updateUser({
      data: { ...updatedFields, ...(initials ? { initials } : {}) },
    });

    if (error) {
      throw new Error(error.message);
    }

    return mapSupabaseUser(data.user);
  },

  async logout() {
    await supabase.auth.signOut();
    return { success: true };
  },
};