import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMap, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import locaisData from '../../data/data.json';
import Legend from '../UI/Legend';
import './MapIcons.css';

const POSITION_FUNDAO = [-22.8528, -43.2288]; // Centered view
const BOUNDS_FUNDAO = [
  [-22.8824, -43.2706], // Expanded SW
  [-22.8232, -43.1870]  // Expanded NE
];

const CLASSIFICACAO_DESCRIPTIONS = {
  1: "Predomínio de venda de alimentos saudáveis (in natura, minimamente processados ou processados e preparações culinárias baseadas nestes alimentos).",
  2: "Misto, não há predomínio de venda de alimentos saudáveis ou não saudáveis.",
  3: "Predomínio de venda de alimentos não saudáveis (ultraprocessados e preparações culinárias baseadas nestes alimentos)."
};

const MapController = ({ selectedLocal }) => {
  const map = useMap();

  useEffect(() => {
    if (selectedLocal) {
      map.flyTo([selectedLocal.latitude, selectedLocal.longitude], 17, {
        duration: 1.5
      });
    }
  }, [selectedLocal, map]);

  return null;
};

const MapResizer = () => {
  const map = useMap();
  useEffect(() => {
    const container = map.getContainer();
    const observer = new ResizeObserver(() => {
      map.invalidateSize();
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, [map]);
  return null;
};

const createCustomIcon = (classificacao, isHighlighted) => {
  let colorClass = 'bg-red';
  if (classificacao === 1) colorClass = 'bg-green';
  if (classificacao === 2) colorClass = 'bg-yellow';

  return L.divIcon({
    className: `custom-marker ${isHighlighted ? 'selected' : ''}`,
    html: `<div class="marker-inner ${colorClass}"></div>`,
    iconSize: [isHighlighted ? 32 : 24, isHighlighted ? 32 : 24],
    iconAnchor: [isHighlighted ? 16 : 12, isHighlighted ? 16 : 12],
    popupAnchor: [0, -12]
  });
};

const MapComponent = ({ selectedLocal, onSelectMarker, isSidebarOpen }) => {
  const [hoveredLocal, setHoveredLocal] = React.useState(null);
  const markerRefs = useRef({});

  // The useEffect to open popups is no longer needed as popups are removed.
  // useEffect(() => {
  //   if (selectedLocal && markerRefs.current[selectedLocal.id]) {
  //     markerRefs.current[selectedLocal.id].openPopup();
  //   }
  // }, [selectedLocal]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>

      <MapContainer
        center={POSITION_FUNDAO}
        zoom={15}
        minZoom={13}
        maxBounds={BOUNDS_FUNDAO}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController selectedLocal={selectedLocal} />
        <MapResizer />

        {locaisData.map((local) => {
          const isSelected = selectedLocal?.id === local.id;
          const isHovered = hoveredLocal?.id === local.id;
          const isHighlighted = isSelected || isHovered;

          return (
            <Marker
              key={local.id}
              position={[local.latitude, local.longitude]}
              icon={createCustomIcon(local.classificacao, isHighlighted)}
              ref={(ref) => markerRefs.current[local.id] = ref}
              eventHandlers={{
                click: () => onSelectMarker(local),
                mouseover: () => setHoveredLocal(local),
                mouseout: () => setHoveredLocal(null)
              }}
            >
              {isHovered && !isSelected && (
                <Tooltip
                  permanent
                  direction="top"
                  offset={[0, -10]}
                  className="hover-card-tooltip"
                >
                  <div className="hover-card-content">
                    <h3>{local.nome}</h3>
                    <p>{local.tipo}</p>
                    <div className="card-score">
                      <span>{local.indiceSaudabilidade}</span>
                    </div>
                  </div>
                </Tooltip>
              )}

              {isSelected && (
                <Tooltip
                  permanent
                  direction="top"
                  offset={[0, -15]}
                  className="detailed-card-tooltip"
                >
                  <div className="detailed-card-content">
                    <button className="close-card" onClick={(e) => {
                      e.stopPropagation();
                      onSelectMarker(null);
                    }}>&times;</button>
                    <h3>{local.nome}</h3>
                    <div className="card-info">
                      <p><strong>Classificação:</strong> {local.classificacao === 1 ? 'Tipo 1' : (local.classificacao === 2 ? 'Tipo 2' : 'Tipo 3')}</p>
                      <p className="classification-desc">{CLASSIFICACAO_DESCRIPTIONS[local.classificacao]}</p>
                      <p><strong>Modalidade:</strong> {local.tipo}</p>
                    </div>
                    <div className="card-footer">
                      <div className="score-container">
                        <strong>Índice de Saudabilidade: {local.indiceSaudabilidade}</strong>
                        <div className="info-trigger">
                          ?
                          <div className="info-tooltip">
                            Quanto mais próximo de 100 o escore estiver, maior a saudabilidade do estabelecimento.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Tooltip>
              )}
            </Marker>
          );
        })}
      </MapContainer>

      <Legend />

    </div>
  );
};

export default MapComponent;
