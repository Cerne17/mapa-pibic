import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMap, Tooltip } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import locaisData from '../../data/data.json';
import Legend from '../UI/Legend';
import 'react-leaflet-cluster/dist/assets/MarkerCluster.css';
import 'react-leaflet-cluster/dist/assets/MarkerCluster.Default.css';
import './MapIcons.css';

const POSITION_FUNDAO = [-22.8528, -43.2288];
const BOUNDS_FUNDAO = [
  [-22.8824, -43.2706],
  [-22.8232, -43.1870]
];

const CLASSIFICACAO_DESCRIPTIONS = {
  1: "Predomínio de venda de alimentos saudáveis (in natura, minimamente processados ou processados e preparações culinárias baseadas nestes alimentos).",
  2: "Misto, não há predomínio de venda de alimentos saudáveis ou não saudáveis.",
  3: "Predomínio de venda de alimentos não saudáveis (ultraprocessados e preparações culinárias baseadas nestes alimentos)."
};

const ClusterController = ({ selectedLocal, clusterGroupRef, markerRefsRef }) => {
  const map = useMap();

  useEffect(() => {
    if (!selectedLocal) return;

    const latlng = [selectedLocal.latitude, selectedLocal.longitude];
    const clusterGroup = clusterGroupRef.current;
    const markerInstance = markerRefsRef.current[selectedLocal.id];

    if (clusterGroup && markerInstance) {
      clusterGroup.zoomToShowLayer(markerInstance, () => {
        map.flyTo(latlng, 17, { duration: 1.5 });
      });
    } else {
      map.flyTo(latlng, 17, { duration: 1.5 });
    }
  }, [selectedLocal, map, clusterGroupRef, markerRefsRef]);

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

const colorMap = { 1: 'marker-green', 2: 'marker-yellow', 3: 'marker-red' };

const createCustomIcon = (classificacao, isHighlighted) => {
  const colorClass = colorMap[classificacao] || 'marker-blue';
  return L.divIcon({
    className: `custom-marker-symbol ${isHighlighted ? 'selected' : ''} ${colorClass}`,
    html: `<span class="material-symbols-outlined">location_on</span>`,
    iconSize: [isHighlighted ? 40 : 32, isHighlighted ? 40 : 32],
    iconAnchor: [isHighlighted ? 20 : 16, isHighlighted ? 40 : 32],
    popupAnchor: [0, -32]
  });
};

const ICON_CACHE = Object.fromEntries(
  [1, 2, 3].flatMap(cls =>
    [false, true].map(highlighted => [`${cls}-${highlighted}`, createCustomIcon(cls, highlighted)])
  )
);

const MapComponent = ({ selectedLocal, onSelectMarker }) => {
  const [hoveredLocal, setHoveredLocal] = useState(null);
  const clusterGroupRef = useRef(null);
  const markerRefsRef = useRef({});

  const uniqueLocais = useMemo(() => {
    const seen = new Set();
    return locaisData.filter(local => {
      if (seen.has(local.id)) return false;
      seen.add(local.id);
      return true;
    });
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100dvh' }}>

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

        <ClusterController
          selectedLocal={selectedLocal}
          clusterGroupRef={clusterGroupRef}
          markerRefsRef={markerRefsRef}
        />
        <MapResizer />

        <MarkerClusterGroup ref={clusterGroupRef} chunkedLoading>
        {uniqueLocais.map((local) => {
            const isSelected = selectedLocal?.id === local.id;
            const isHovered = hoveredLocal?.id === local.id;
            const isHighlighted = isSelected || isHovered;

            return (
              <Marker
                key={local.id}
                position={[local.latitude, local.longitude]}
                icon={ICON_CACHE[`${local.classificacao}-${isHighlighted}`]}
                ref={(instance) => { if (instance) markerRefsRef.current[local.id] = instance; }}
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
                        e.nativeEvent.stopImmediatePropagation();
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
        </MarkerClusterGroup>
      </MapContainer>

      <Legend />

    </div>
  );
};

export default MapComponent;
