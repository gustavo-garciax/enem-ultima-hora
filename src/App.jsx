import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Calendario from './pages/Calendario';
import Conteudos from './pages/Conteudos';
import MeuProgresso from './pages/MeuProgresso';
import Configuracoes from './pages/Configuracoes';
import Login from './pages/Login';
import NotFound from './pages/NotFound';

// Layout autenticado padrão (com Sidebar e container principal)
function AppLayout() {
  return (
    <ProtectedRoute>
      <div className="app-container">
        <Sidebar />
        <main className="main-wrapper">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/calendario" element={<Calendario />} />
            <Route path="/conteudos" element={<Conteudos />} />
            <Route path="/progresso" element={<MeuProgresso />} />
            <Route path="/configuracoes" element={<Configuracoes />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/*" element={<AppLayout />} />
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  );
}
