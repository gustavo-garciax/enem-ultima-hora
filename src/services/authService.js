import { storageAdapter, initStorage } from './storageAdapter';

initStorage();

/**
 * Camada de serviço de autenticação.
 * Métodos assíncronos (Promises) para simular o comportamento de chamadas de API reais.
 * Quando um backend real for configurado, basta alterar estas funções para chamar fetch/axios.
 */
export const authService = {
  /**
   * Realiza login do usuário
   * @param {string} email 
   * @param {string} password 
   */
  async login(email, password) {
    // Simula delay de rede de 300ms
    await new Promise((resolve) => setTimeout(resolve, 300));

    const registeredUser = storageAdapter.get(storageAdapter.KEYS.USER);

    // Validação flexível: aceita as credenciais do usuário cadastrado ou simula login para qualquer usuário
    if (registeredUser && registeredUser.email.toLowerCase() === email.trim().toLowerCase()) {
      storageAdapter.set(storageAdapter.KEYS.SESSION, registeredUser);
      return { success: true, user: registeredUser };
    }

    // Se o usuário digitou outro e-mail válido, cria a sessão para permitir teste imediato
    if (email && password) {
      const nameFromEmail = email.split('@')[0];
      const initials = nameFromEmail.slice(0, 2).toUpperCase();
      const newUser = {
        name: nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1),
        initials,
        email: email.trim(),
        birthdate: '01/01/2007',
        school: 'Escola de Ensino Médio',
        grade: '3º ano — Nível Médio',
        level: 'medio',
        preferences: {
          studyReminders: true,
          goalAlerts: true,
          emailNotifications: false,
          darkMode: false,
        },
      };
      storageAdapter.set(storageAdapter.KEYS.USER, newUser);
      storageAdapter.set(storageAdapter.KEYS.SESSION, newUser);
      return { success: true, user: newUser };
    }

    throw new Error('E-mail ou senha inválidos.');
  },

  /**
   * Cadastra um novo estudante
   * @param {Object} userData 
   */
  async register({ name, email, password, grade }) {
    await new Promise((resolve) => setTimeout(resolve, 350));

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

    const newUser = {
      name: name.trim(),
      initials: initials || 'AL',
      email: email.trim(),
      birthdate: '15/05/2007',
      school: 'Ensino Médio / Pré-Vestibular',
      grade: grade || '3º ano — Nível Médio',
      level: 'medio',
      preferences: {
        studyReminders: true,
        goalAlerts: true,
        emailNotifications: false,
        darkMode: false,
      },
    };

    storageAdapter.set(storageAdapter.KEYS.USER, newUser);
    storageAdapter.set(storageAdapter.KEYS.SESSION, newUser);
    return { success: true, user: newUser };
  },

  /**
   * Retorna os dados do usuário atualmente autenticado
   */
  async getCurrentUser() {
    const session = storageAdapter.get(storageAdapter.KEYS.SESSION);
    return session || null;
  },

  /**
   * Atualiza os dados cadastrais do perfil do estudante
   * @param {Object} updatedFields 
   */
  async updateProfile(updatedFields) {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const currentUser = storageAdapter.get(storageAdapter.KEYS.USER) || {};
    const updated = {
      ...currentUser,
      ...updatedFields,
    };

    // Recalcula iniciais se o nome tiver mudado
    if (updatedFields.name) {
      updated.initials = updatedFields.name
        .trim()
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
    }

    storageAdapter.set(storageAdapter.KEYS.USER, updated);
    storageAdapter.set(storageAdapter.KEYS.SESSION, updated);
    return updated;
  },

  /**
   * Encerra a sessão atual
   */
  async logout() {
    await new Promise((resolve) => setTimeout(resolve, 150));
    storageAdapter.remove(storageAdapter.KEYS.SESSION);
    return { success: true };
  },
};

