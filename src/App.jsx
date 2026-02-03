import React, { useState } from 'react';
import MapComponent from './components/Map/MapComponent';
import Sidebar from './components/UI/Sidebar';
import './App.css'; // Certifique-se de que o CSS do App não limite o tamanho da div

function App() {
  // O estado que diz qual local está selecionado
  const [selectedLocal, setSelectedLocal] = useState(null);

  const handleSelectLocation = (local) => {
    setSelectedLocal(local);
  };

  return (
    <div className="app-container" style={{ display: 'flex', width: '100vw', height: '100vh' }}>
      {/* 1. Sidebar na esquerda */}
      <Sidebar onSelectLocation={handleSelectLocation} />
      
      {/* 2. Área do Mapa (ocupa o resto) */}
      <div style={{ flex: 1, position: 'relative' }}>
        <MapComponent selectedLocal={selectedLocal} />
      </div>
    </div>
  );
}

export default App;
