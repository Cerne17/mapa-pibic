import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import locaisData from '../../data/data.json';
import Legend from '../UI/Legend';

const POSITION_FUNDAO = [-22.858, -43.23]; 

// --- NOVO COMPONENTE AUXILIAR ---
// Ele serve apenas para mover a câmera quando o usuario clica na sidebar
const MapController = ({ selectedLocal }) => {
  const map = useMap();

  useEffect(() => {
    if (selectedLocal) {
      // Voa até o local e dá um zoom mais próximo (18)
      map.flyTo([selectedLocal.latitude, selectedLocal.longitude], 17, {
        duration: 1.5 // velocidade da animação em segundos
      });
    }
  }, [selectedLocal, map]);

  return null;
};
// --------------------------------

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

// Agora o MapComponent aceita uma prop: selectedLocal
const MapComponent = ({ selectedLocal }) => {
  // Criamos uma referência para controlar os marcadores se necessário
  const markerRefs = useRef({});

  useEffect(() => {
    // Se selecionou um local, queremos abrir o popup dele automaticamente
    if (selectedLocal && markerRefs.current[selectedLocal.id]) {
      markerRefs.current[selectedLocal.id].openPopup();
    }
  }, [selectedLocal]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      
      <MapContainer 
        center={POSITION_FUNDAO} 
        zoom={15} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Aqui inserimos nosso controlador */}
        <MapController selectedLocal={selectedLocal} />

        {locaisData.map((local) => (
          <Marker 
            key={local.id} 
            position={[local.latitude, local.longitude]}
            icon={createCustomIcon(local.classificacao)}
            // Guardamos a referência deste marcador para poder abrir o popup depois
            ref={(ref) => markerRefs.current[local.id] = ref}
          >
            <Popup className="custom-popup">
               {/* ... (SEU CONTEÚDO DO POPUP ANTERIOR VEM AQUI - MANTENHA IGUAL AO ÚLTIMO PASSO) ... */}
               {/* Vou abreviar aqui para não ficar gigante, use o código do passo anterior dentro do Popup */}
               <div className="popup-content">
                    {local.centro && <span className="popup-badge">{local.centro}</span>}
                    <h3>{local.nome}</h3>
                    <p className="type-text">{local.tipo}</p>
                    <hr />
                    <div className="saudabilidade-section">
                        <div className="saudabilidade-header">
                            <strong>Índice de Saudabilidade</strong>
                            <div className="tooltip-container">
                                <span className="tooltip-trigger">?</span>
                                <div className="tooltip-text">Nota de 0 a 100...</div>
                            </div>
                        </div>
                        <div className="progress-bar-container">
                            <div className="progress-bar-fill" style={{ width: `${local.indiceSaudabilidade}%`, backgroundColor: local.indiceSaudabilidade > 60 ? '#2ecc71' : (local.indiceSaudabilidade > 40 ? '#f1c40f' : '#e74c3c') }}></div>
                        </div>
                        <span className="score-number">{local.indiceSaudabilidade}/100</span>
                    </div>
               </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <Legend />
      
    </div>
  );
};

export default MapComponent;
