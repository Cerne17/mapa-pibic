import React, { useState } from 'react';
import './Legend.css';

const Legend = () => {
  // Estado para controlar se está aberto ou fechado
  // No Desktop começa aberto (true), mas vamos deixar o CSS controlar o visual inicial
  const [isOpen, setIsOpen] = useState(true);

  const toggleLegend = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`legend-wrapper ${isOpen ? 'open' : 'closed'}`}>
      
      {/* Botão de Toggle (Aparece sempre) */}
      <button className="legend-toggle-btn" onClick={toggleLegend}>
        {isOpen ? '▼' : 'Legenda ▲'}
      </button>

      {/* Conteúdo da Legenda (Só aparece se isOpen for true) */}
      {isOpen && (
        <div className="legend-content">
          <h4>Classificação</h4>
          <div className="legend-item">
            <span className="dot bg-green"></span>
            <div>
              <strong>Saudável</strong>
              <small>In natura / minimamente proc.</small>
            </div>
          </div>
          <div className="legend-item">
            <span className="dot bg-yellow"></span>
            <div>
              <strong>Misto</strong>
              <small>Oferta variada</small>
            </div>
          </div>
          <div className="legend-item">
            <span className="dot bg-red"></span>
            <div>
              <strong>Não Saudável</strong>
              <small>Predomínio ultraprocessados</small>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Legend;
