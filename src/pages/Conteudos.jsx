import React from 'react';
import Header from '../components/Header';
import ProgressBar from '../components/ProgressBar';
import { useData } from '../context/DataContext';
import './Conteudos.css';

export default function Conteudos() {
  const { subjects } = useData();

  return (
    <div>
      <Header pageTitle="Conteúdos" />
      <div className="page-content">
        <h1 className="page-title">Conteúdos</h1>
        <p className="page-subtitle">Acesse aulas, exercícios e materiais por matéria</p>
        <div className="subjects-cards-grid">
          {subjects.map((subj) => (
            <div key={subj.id} className="card subject-box-card">
              <div className="subj-icon-circle" style={{ backgroundColor: `${subj.color}15` }}>
                <span className="subj-emoji-icon">{subj.icon}</span>
              </div>
              <h3 className="subj-card-title">{subj.name}</h3>
              <div className="subj-card-prog-wrap">
                <ProgressBar
                  value={subj.progress}
                  color={subj.color}
                  showValue={false}
                  height={6}
                />
              </div>

              {subj.pdfUrl && (
                
              <a  href={subj.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-pdf-card">Ver pdf do conteudo</a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}