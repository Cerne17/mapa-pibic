import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import locaisData from '../../data/data.json';
import Legend from '../UI/Legend'; // <--- VERIFIQUE SE ESTÁ IMPORTADO

const POSITION_FUNDAO = [-22.858, -43.23];

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

const MapComponent = ({ selectedLocal, onSelectMarker, isSidebarOpen }) => {
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
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController selectedLocal={selectedLocal} />
        <MapResizer />

        {locaisData.map((local) => (
          <Marker
            key={local.id}
            position={[local.latitude, local.longitude]}
            icon={createCustomIcon(local.classificacao)}
            ref={(ref) => markerRefs.current[local.id] = ref}
            eventHandlers={{
              click: () => onSelectMarker(local)
            }}
          />
        ))}
      </MapContainer>

      {/* --- AQUI ESTÁ A LEGENDA --- */}
      {/* Ela precisa estar DENTRO da div relativa, mas FORA do MapContainer */}
      <Legend />

    </div>
  );
};

export default MapComponent;
