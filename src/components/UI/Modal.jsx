import React, { useEffect } from 'react';
import './Modal.css';

const Modal = ({ isOpen, onClose, local }) => {
  // Fechar ao pressionar Esc
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen || !local) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        
        <div className="modal-header">
          {local.centro && <span className="modal-badge">{local.centro}</span>}
          <h2>{local.nome}</h2>
          <p className="modal-type">{local.tipo}</p>
        </div>

        <div className="modal-body">
          <div className="saudabilidade-card">
            <div className="saudabilidade-info">
              <div className="saudabilidade-title">
                <strong>Índice de Saudabilidade</strong>
                <div className="info-tooltip">
                  <span className="info-icon">?</span>
                  <div className="tooltip-box">
                    Nota de 0 a 100. Quanto maior, mais opções in natura e menos ultraprocessados.
                  </div>
                </div>
              </div>
              <div className="score-display">
                <span className="score-value">{local.indiceSaudabilidade}</span>
                <span className="score-total">/100</span>
              </div>
            </div>

            <div className="modal-progress-container">
              <div 
                className="modal-progress-fill" 
                style={{ 
                  width: `${local.indiceSaudabilidade}%`,
                  backgroundColor: local.indiceSaudabilidade > 60 ? '#2ecc71' : (local.indiceSaudabilidade > 40 ? '#f1c40f' : '#e74c3c')
                }}
              ></div>
            </div>
          </div>

          <div className="classificacao-explicacao">
            <h4>Sobre este local</h4>
            {local.classificacao === 1 && (
              <p>🟢 <strong>Saudável:</strong> Predomínio de alimentos in natura ou minimamente processados. Ótima opção para refeições completas.</p>
            )}
            {local.classificacao === 2 && (
              <p>🟡 <strong>Misto:</strong> Oferece tanto alimentos saudáveis quanto ultraprocessados em quantidades equilibradas.</p>
            )}
            {local.classificacao === 3 && (
              <p>🔴 <strong>Não Saudável:</strong> Alta disponibilidade de ultraprocessados (salgadinhos, refrigerantes, doces). Recomenda-se cautela.</p>
            )}
          </div>
        </div>

        <div className="modal-footer">
            <button className="btn-secondary" onClick={onClose}>Fechar</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
