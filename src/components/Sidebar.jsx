import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  TrendingUp,
  Settings,
  GraduationCap,
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/calendario', label: 'Calendário', icon: Calendar },
  { path: '/conteudos', label: 'Conteúdos', icon: BookOpen },
  { path: '/progresso', label: 'Meu Progresso', icon: TrendingUp },
  { path: '/configuracoes', label: 'Configurações', icon: Settings }
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo-icon">
          <GraduationCap size={22} color="#FFFFFF" />
        </div>
        <div className="sidebar-brand-text">
          <span className="brand-title">ENEM</span>
          <span className="brand-subtitle">Última Hora</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <span className="sidebar-section-title">MENU</span>
        <ul className="sidebar-menu">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    `sidebar-link ${isActive ? 'active' : ''}`
                  }
                >
                  <Icon size={18} className="sidebar-icon" />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user-card">
          <div className="sidebar-user-avatar">{user?.initials || 'AL'}</div>
          <div className="sidebar-user-details">
            <span className="sidebar-user-name">{user?.name || 'Estudante'}</span>
            <span className="sidebar-user-grade">{user?.grade || 'Ensino Médio'}</span>
          </div>
          <button
            onClick={handleLogout}
            className="sidebar-logout-btn"
            title="Sair da conta"
            aria-label="Sair da conta"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
