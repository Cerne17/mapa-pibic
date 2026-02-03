import React, { useState } from 'react';
import locaisData from '../../data/data.json';
import './Sidebar.css';

const Sidebar = ({ onSelectLocation }) => {
  const [busca, setBusca] = useState('');

  // Filtra os locais baseado no que o usuário digita
  const locaisFiltrados = locaisData.filter(local => 
    local.nome.toLowerCase().includes(busca.toLowerCase()) || 
    (local.centro && local.centro.toLowerCase().includes(busca.toLowerCase()))
  );

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Locais UFRJ</h2>
        <input 
          type="text" 
          placeholder="Buscar restaurante ou centro..." 
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="sidebar-list">
        {locaisFiltrados.length === 0 ? (
            <p className="no-results">Nenhum local encontrado.</p>
        ) : (
            locaisFiltrados.map(local => (
            <div 
                key={local.id} 
                className="list-item"
                onClick={() => onSelectLocation(local)}
            >
                <div className="item-header">
                    <strong>{local.nome}</strong>
                    {/* Bolinha indicativa da cor na lista também */}
                    <span 
                        className={`status-dot ${local.classificacao === 1 ? 'bg-green' : (local.classificacao === 2 ? 'bg-yellow' : 'bg-red')}`}
                    ></span>
                </div>
                <small>{local.centro || 'Campus'}</small>
            </div>
            ))
        )}
      </div>
      
      <div className="sidebar-footer">
        <p>Projeto Gastronomia UFRJ</p>
      </div>
    </div>
  );
};

export default Sidebar;
