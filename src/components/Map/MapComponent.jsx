import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, useMap, Tooltip, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import locaisData from '../../data/data.json';
import Legend from '../UI/Legend';
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

const MapController = ({ selectedLocal }) => {
  const map = useMap();

  useEffect(() => {
    if (selectedLocal) {
      map.flyTo([selectedLocal.latitude, selectedLocal.longitude], 18, {
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

const MapClickListener = ({ onDeselect }) => {
  useMapEvents({
    click: () => {
      onDeselect();
    }
  });
  return null;
};

const colorMap = { 1: 'marker-green', 2: 'marker-yellow', 3: 'marker-red' };

const createCustomIcon = (classificacao, isHighlighted) => {
  const colorClass = colorMap[classificacao] || 'marker-blue';
  return L.divIcon({
    className: `custom-marker-symbol ${isHighlighted ? 'selected' : ''} ${colorClass}`,
    html: `<span class="material-symbols-outlined">location_on</span>`,
    iconSize: [isHighlighted ? 44 : 32, isHighlighted ? 44 : 32],
    iconAnchor: [isHighlighted ? 22 : 16, isHighlighted ? 44 : 32],
    popupAnchor: [0, -32]
  });
};

const ICON_CACHE = Object.fromEntries(
  [1, 2, 3, 'fallback'].flatMap(cls =>
    [false, true].map(highlighted => [`${cls}-${highlighted}`, createCustomIcon(cls, highlighted)])
  )
);

// Muitos estabelecimentos ficam a poucos metros uns dos outros (e alguns
// compartilham a mesma coordenada). No zoom máximo (z19, ~0,275 m/px) os ícones
// de 32px ainda se sobrepõem e o usuário acaba clicando no pino errado.
// Afastamos apenas os pares que se sobrepõem, com o menor deslocamento possível
// — data.json continua com as coordenadas levantadas em campo.
const SEPARACAO_MINIMA_M = 9.5; // ~34px no z19: nenhum ícone de 32px se sobrepõe
const PASSES_RELAXAMENTO = 20; // converge em ~5; o limite é apenas uma trava
const RAIO_TERRA_M = 6371000;

const paraRad = (graus) => (graus * Math.PI) / 180;
const paraGraus = (rad) => (rad * 180) / Math.PI;

const distanciaMetros = (a, b) => {
  const x = paraRad(b.longitude - a.longitude) * RAIO_TERRA_M * Math.cos(paraRad(a.latitude));
  const y = paraRad(b.latitude - a.latitude) * RAIO_TERRA_M;
  return Math.sqrt(x * x + y * y);
};

const fanOutCollisions = (locais) => {
  const pontos = locais.map(local => ({ ...local }));

  for (let passe = 0; passe < PASSES_RELAXAMENTO; passe++) {
    let houveSobreposicao = false;

    for (let i = 0; i < pontos.length; i++) {
      for (let j = i + 1; j < pontos.length; j++) {
        const distancia = distanciaMetros(pontos[i], pontos[j]);
        if (distancia >= SEPARACAO_MINIMA_M) continue;
        houveSobreposicao = true;

        // Coordenadas idênticas não têm direção de afastamento: derivamos um
        // ângulo do índice para o resultado continuar determinístico.
        const angulo = distancia < 1e-9
          ? (2 * Math.PI * i) / pontos.length
          : Math.atan2(
            paraRad(pontos[j].latitude - pontos[i].latitude) * RAIO_TERRA_M,
            paraRad(pontos[j].longitude - pontos[i].longitude) * RAIO_TERRA_M * Math.cos(paraRad(pontos[i].latitude))
          );

        // Cada ponto recebe metade do afastamento, em sentidos opostos.
        const empurrao = (SEPARACAO_MINIMA_M - distancia) / 2 + 0.01;
        const deltaLat = paraGraus((empurrao * Math.sin(angulo)) / RAIO_TERRA_M);
        const deltaLng = paraGraus(
          (empurrao * Math.cos(angulo)) / (RAIO_TERRA_M * Math.cos(paraRad(pontos[i].latitude)))
        );

        pontos[i].latitude -= deltaLat;
        pontos[i].longitude -= deltaLng;
        pontos[j].latitude += deltaLat;
        pontos[j].longitude += deltaLng;
      }
    }

    if (!houveSobreposicao) break;
  }

  return pontos;
};

const MapComponent = ({ selectedLocal, onSelectMarker }) => {
  const [hoveredLocal, setHoveredLocal] = useState(null);

  const uniqueLocais = useMemo(() => {
    const seen = new Set();
    const deduplicados = locaisData.filter(local => {
      if (seen.has(local.id)) return false;
      seen.add(local.id);
      return true;
    });
    return fanOutCollisions(deduplicados);
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100dvh' }}>

      <MapContainer
        center={POSITION_FUNDAO}
        zoom={15}
        minZoom={13}
        maxZoom={19}
        maxBounds={BOUNDS_FUNDAO}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxNativeZoom={18}
          maxZoom={19}
        />

        <MapController selectedLocal={selectedLocal} />
        <MapResizer />
        <MapClickListener onDeselect={() => onSelectMarker(null)} />

        {uniqueLocais.map((local) => {
            const isSelected = selectedLocal?.id === local.id;
            const isHovered = hoveredLocal?.id === local.id;
            const isHighlighted = isSelected || isHovered;

            return (
              <Marker
                key={local.id}
                position={[local.latitude, local.longitude]}
                icon={ICON_CACHE[`${local.classificacao}-${isHighlighted}`] ?? ICON_CACHE[`fallback-${isHighlighted}`]}
                zIndexOffset={isSelected ? 1000 : (isHovered ? 500 : 0)}
                eventHandlers={{
                  click: (e) => {
                    e.originalEvent?.stopPropagation();
                    if (isSelected) {
                      onSelectMarker(null);
                    } else {
                      onSelectMarker(local);
                    }
                  },
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
                    <div className="detailed-card-content" onClick={(e) => e.stopPropagation()}>
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
      </MapContainer>

      <Legend selectedLocal={selectedLocal} />

    </div>
  );
};

export default MapComponent;
