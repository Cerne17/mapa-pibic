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
      {/* Conteúdo da Legenda - No mobile, o controle de visibilidade será via CSS/Transform */}
      <div className="legend-content">
        <h4>Classificação</h4>
        <div className="legend-item">
          <span className="dot bg-green"></span>
          <div>
            <strong>Tipo 1</strong>
            <small>Predomínio de venda de alimentos saudáveis (in natura, minimamente processados ou processados e preparações culinárias baseadas nestes alimentos).</small>
          </div>
        </div>
        <div className="legend-item">
          <span className="dot bg-yellow"></span>
          <div>
            <strong>Tipo 2</strong>
            <small>Misto, não há predomínio de venda de alimentos saudáveis ou não saudáveis.</small>
          </div>
        </div>
        <div className="legend-item">
          <span className="dot bg-red"></span>
          <div>
            <strong>Tipo 3</strong>
            <small>Predomínio de venda de alimentos não saudáveis (ultraprocessados e preparações culinárias baseadas nestes alimentos).</small>
          </div>
        </div>

        <hr className="legend-divider" />

        <div className="legend-info">
          <strong>Índice de Saudabilidade</strong>
          <p>Medida síntese da disponibilidade de alimentos. Ele busca traduzir a ideia de que o estabelecimento promotor de alimentação saudável é aquele que, ao mesmo tempo, facilita o acesso aos alimentos saudáveis (in natura, minimamente processados, processados e preparações culinárias) e o dificulta aos ultraprocessados. Varia entre zero e 100. Quanto mais próximo de 100 o escore estiver, maior a saudabilidade do estabelecimento.</p>
        </div>
      </div>

      <button className="legend-toggle-btn" onClick={toggleLegend}>
        <span className="desktop-icon">{isOpen ? '▼' : 'Legenda ▲'}</span>
        <span className="mobile-icon">{isOpen ? '▶' : '◀ Legenda'}</span>
      </button>
    </div>
  );
};

export default Legend;
