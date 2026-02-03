import React, { useState } from 'react';
import MapComponent from './components/Map/MapComponent';
import Sidebar from './components/UI/Sidebar';
import Modal from './components/UI/Modal';
import './App.css';

function App() {
  const [selectedLocal, setSelectedLocal] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleSelectLocation = (local) => {
    setSelectedLocal(local);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleToggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  }

  return (
    <div className="app-container" style={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <Sidebar
        onSelectLocation={handleSelectLocation}
        isOpen={isSidebarOpen}
        onToggle={handleToggleSidebar}
      />

      <div style={{ flex: 1, position: 'relative' }}>
        <MapComponent
          selectedLocal={selectedLocal}
          onSelectMarker={handleSelectLocation}
          isSidebarOpen={isSidebarOpen}
        />
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          local={selectedLocal}
        />
      </div>
    </div>
  );
}

export default App;
