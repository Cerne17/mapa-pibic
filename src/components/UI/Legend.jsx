import React from 'react';
import './Legend.css';

const Legend = () => {
  return (
    <div className="legend-container">
      <h4>Classificação dos Locais</h4>
      <div className="legend-item">
        <span className="dot bg-green"></span>
        <div>
          <strong>Saudável</strong>
          <small>Predomínio de alimentos in natura</small>
        </div>
      </div>
      <div className="legend-item">
        <span className="dot bg-yellow"></span>
        <div>
          <strong>Misto</strong>
          <small>Oferta variada / sem predomínio</small>
        </div>
      </div>
      <div className="legend-item">
        <span className="dot bg-red"></span>
        <div>
          <strong>Não Saudável</strong>
          <small>Predomínio de ultraprocessados</small>
        </div>
      </div>
    </div>
  );
};

export default Legend;
