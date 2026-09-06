import React from 'react';
import { Search, Bell } from 'lucide-react';
import './Header.css';

export default function Header({ pageTitle = '' }) {
  return (
    <header className="header">
      <div className="header-left">
        <span className="header-page-title">{pageTitle}</span>
      </div>
      <div className="header-right">
        <div className="search-box">
          <input type="text" placeholder="Buscar..." className="search-input" />
          <Search size={16} className="search-icon" />
        </div>
        <button className="bell-button" aria-label="Notificações">
          <Bell size={18} />
          <span className="bell-dot" />
        </button>
      </div>
    </header>
  );
}