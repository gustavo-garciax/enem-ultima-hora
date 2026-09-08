import React from 'react';
import { Link } from 'react-router-dom';
import { Rocket } from 'lucide-react';
import './NotFound.css';

export default function NotFound() {
  return (
    <div className="notfound-page">
      <div className="notfound-stars"></div>
      <div className="notfound-stars notfound-stars2"></div>
      <div className="notfound-stars notfound-stars3"></div>

      <div className="notfound-content">
        <div className="notfound-icon-orbit">
          <div className="notfound-icon-circle">
            <Rocket size={44} />
          </div>
        </div>

        <h1 className="notfound-code" data-text="404">404</h1>
        <h2 className="notfound-title">Essa página caiu fora do ENEM</h2>
        <p className="notfound-subtitle">
          Nem o simulado mais difícil prepara você pra essa perdida. A página que você procura não existe, foi movida, ou nunca foi estudada.
        </p>

      </div>
    </div>
  );
}