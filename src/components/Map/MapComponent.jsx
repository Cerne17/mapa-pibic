import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import locaisData from '../../data/data.json'; // Importando seu JSON

// Configuração do centro do mapa (Fundão)
const POSITION_FUNDAO = [-22.858, -43.23]; 

// Função para criar o ícone colorido baseado na nota
const createCustomIcon = (classificacao) => {
  let colorClass = 'bg-red'; // Padrão (ruim)
  
  if (classificacao === 1) colorClass = 'bg-green';
  if (classificacao === 2) colorClass = 'bg-yellow';

  return L.divIcon({
    className: 'custom-marker',
    html: `<div class="marker-inner ${colorClass}"></div>`,
    iconSize: [24, 24], // Tamanho da bolinha branca
    iconAnchor: [12, 12], // O ponto que fica em cima da coordenada (centro)
    popupAnchor: [0, -12] // Onde o popup abre em relação ao ícone
  });
};

const MapComponent = () => {
  return (
    <MapContainer 
      center={POSITION_FUNDAO} 
      zoom={15} 
      style={{ height: '100vh', width: '100%' }} // Ocupa tela toda
    >
      {/* Camada visual do OpenStreetMap */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Mapeando o JSON para criar Marcadores */}
      {locaisData.map((local) => (
        <Marker 
          key={local.id} 
          position={[local.latitude, local.longitude]}
          icon={createCustomIcon(local.classificacao)}
        >
          <Popup>
            <div style={{ minWidth: '200px' }}>
              <h3 style={{ margin: '0 0 5px 0' }}>{local.nome}</h3>
              <p><strong>Local:</strong> {local.centro}</p>
              <p><strong>Tipo:</strong> {local.tipo}</p>
              <hr style={{ border: '0', borderTop: '1px solid #eee' }}/>
              <p>
                <strong>Saudabilidade:</strong> 
                <span style={{ 
                    fontWeight: 'bold', 
                    marginLeft: '5px',
                    color: local.classificacao === 1 ? 'green' : (local.classificacao === 2 ? 'orange' : 'red')
                }}>
                  {local.indiceSaudabilidade}/100
                </span>
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;
