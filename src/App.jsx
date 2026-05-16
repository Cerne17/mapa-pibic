import React, { useState, useCallback } from 'react';
import MapComponent from './components/Map/MapComponent';
import Sidebar from './components/UI/Sidebar';
import AboutModal from './components/UI/AboutModal';
import './App.css';

function App() {
  const [selectedLocal, setSelectedLocal] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

  const handleSelectLocation = useCallback((local) => {
    setSelectedLocal(local);
  }, []);

  const handleToggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  const handleOpenAbout = useCallback(() => setIsAboutModalOpen(true), []);
  const handleCloseAbout = useCallback(() => setIsAboutModalOpen(false), []);

  return (
    <div className="app-container">
      <Sidebar
        onSelectLocation={handleSelectLocation}
        isOpen={isSidebarOpen}
        onToggle={handleToggleSidebar}
        onOpenAbout={handleOpenAbout}
      />

      <div className="map-wrapper">
        <MapComponent
          selectedLocal={selectedLocal}
          onSelectMarker={handleSelectLocation}
        />
        <AboutModal
          isOpen={isAboutModalOpen}
          onClose={handleCloseAbout}
        />
      </div>
    </div>
  );
}

export default App;
