import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import locaisData from '../../data/data.json';
import Legend from '../UI/Legend'; // Importando a legenda que criamos

const POSITION_FUNDAO = [-22.858, -43.23]; 

const createCustomIcon = (classificacao) => {
  let colorClass = 'bg-red';
  if (classificacao === 1) colorClass = 'bg-green';
  if (classificacao === 2) colorClass = 'bg-yellow';

  return L.divIcon({
    className: 'custom-marker',
    html: `<div class="marker-inner ${colorClass}"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
  });
};

const MapComponent = () => {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      
      <MapContainer 
        center={POSITION_FUNDAO} 
        zoom={15} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false} // Vamos reposicionar o zoom se precisar, ou deixar padrão
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {locaisData.map((local) => (
          <Marker 
            key={local.id} 
            position={[local.latitude, local.longitude]}
            icon={createCustomIcon(local.classificacao)}
          >
            <Popup className="custom-popup">
              <div className="popup-content">
                {/* CORREÇÃO 1: Renderização Condicional da Tag */}
                {local.centro && (
                   <span className="popup-badge">{local.centro}</span>
                )}
                
                <h3>{local.nome}</h3>
                <p className="type-text">{local.tipo}</p>
                
                <hr />
                
                <div className="saudabilidade-section">
                  <div className="saudabilidade-header">
                    <strong>Índice de Saudabilidade</strong>
                    
                    {/* CORREÇÃO 2: Nova estrutura para o Tooltip */}
                    <div className="tooltip-container">
                        <span className="tooltip-trigger">?</span>
                        <div className="tooltip-text">
                            Nota de 0 a 100. Quanto maior, mais opções in natura e menos ultraprocessados.
                        </div>
                    </div>

                  </div>
                  
                  <div className="progress-bar-container">
                    <div 
                      className="progress-bar-fill" 
                      style={{ 
                        width: `${local.indiceSaudabilidade}%`,
                        backgroundColor: local.indiceSaudabilidade > 60 ? '#2ecc71' : (local.indiceSaudabilidade > 40 ? '#f1c40f' : '#e74c3c')
                      }}
                    ></div>
                  </div>
                  <span className="score-number">{local.indiceSaudabilidade}/100</span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Adicionando a Legenda flutuante POR CIMA do mapa */}
      <Legend />
      
    </div>
  );
};

export default MapComponent;
