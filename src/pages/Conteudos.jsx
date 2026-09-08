import React from 'react';
import Header from '../components/Header';
import ProgressBar from '../components/ProgressBar';
import { useData } from '../context/DataContext';
import './Conteudos.css';

// Mapeamento fixo: nome da matéria -> caminho do PDF
const PDF_POR_MATERIA = {
  'Matemática': '/pdf/kit-matematica-fichas.pdf',
  'Português': '/pdf/linguagens-enem.pdf',
  'Redação': '/pdf/guia-de-redacao.pdf',
  'História': '/pdf/historia-enem.pdf',
  'Geografia': '/pdf/geografia-enem.pdf',
  'Sociologia': '/pdf/sociologia-enem.pdf',
  'Física': '/pdf/fisica-enem.pdf',
  'Química': '/pdf/quimica-enem.pdf',
  'Filosofia': '/pdf/filosofia-enem.pdf',
  'Estrategia prova': '/pdf/estrategia-prova.pdf',
  'Mapa Mentais': '/pdf/mapa-mentais.pdf',
};

export default function Conteudos() {
  const { subjects } = useData();

  return (
    <div>
      <Header pageTitle="Conteúdos" />
      <div className="page-content">
        <h1 className="page-title">Conteúdos</h1>
        <p className="page-subtitle">Acesse aulas, exercícios e materiais por matéria</p>
        <div className="subjects-cards-grid">
          {subjects.map((subj) => {
            const pdfUrl = PDF_POR_MATERIA[subj.name];

            return (
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

                {pdfUrl && (

                  <a href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-pdf-card"
                  >Ver pdf do conteudo</a>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}