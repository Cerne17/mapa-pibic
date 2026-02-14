import React, { useState } from 'react';
import MapComponent from './components/Map/MapComponent';
import Sidebar from './components/UI/Sidebar';
import AboutModal from './components/UI/AboutModal';
import './App.css';

function App() {
  const [selectedLocal, setSelectedLocal] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

  const handleSelectLocation = (local) => {
    setSelectedLocal(local);
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
        onOpenAbout={() => setIsAboutModalOpen(true)}
      />

      <div style={{ flex: 1, position: 'relative' }}>
        <MapComponent
          selectedLocal={selectedLocal}
          onSelectMarker={handleSelectLocation}
          isSidebarOpen={isSidebarOpen}
        />
        <AboutModal
          isOpen={isAboutModalOpen}
          onClose={() => setIsAboutModalOpen(false)}
        />
      </div>
    </div>
  );
}

export default App;
