import GlobeMap from "./components/GlobeMap"
import SearchBar from "./components/SearchBar"
import { useState } from 'react';
import { searchPlace } from "./utils/search"
import countryData from "../projects.json" 
import SideDrawer from "./components/SideDrawer";

import logoFull from './assets/mwxlogo500x62.png'
import logoSquare from './assets/mwxlogosquare.png'

export default function App() {
  const [focusCoords, setFocusCoords] = useState<[number, number] | null>(null)
  const [activeItems, setActiveItems] = useState<any[]>([])
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [showAll, setShowAll] = useState(false);

  // Flatten projects for the "Show All" feature
  const allProjects = Object.values(countryData).flatMap((country: any) => country.projects);
  
  // Decide what the map should actually render
  const displayedItems = showAll ? allProjects : activeItems;

  const toggleShowAll = () => {
    const nextState = !showAll;
    setShowAll(nextState);
    if (nextState) {
      setFocusCoords(null);
      setActiveItems([]); 
      setSelectedProject(null);
    }
  };

  async function handleSearch(query: string) {
    setShowAll(false);
    if (!query || query.trim() === "") {
      setFocusCoords(null);
      setActiveItems([]);
      setSelectedProject(null);
      return;
    }

    const coords = await searchPlace(query);
    if (coords) {
      setFocusCoords(coords);
      const countryKey = Object.keys(countryData).find(
        key => key.toLowerCase() === query.toLowerCase().trim()
      );
      
      const data = countryKey ? (countryData as any)[countryKey] : null;
      setActiveItems(data?.projects || []);
      setSelectedProject(null); 
    }
  }

  return (
    <div className="app-container">
      <div className="bg-texture-overlay" />
      
      <div className="logo-overlay">
        <div 
          className={`logo-glass-container ${selectedProject ? 'collapsed' : ''}`} 
          onClick={() => {
             setShowAll(false);
             handleSearch("");
          }}
        >
          <img 
            src={selectedProject ? logoSquare : logoFull} 
            alt="Logo" 
            className={`app-logo ${selectedProject ? 'logo-icon' : 'logo-full'}`} 
          />
        </div>
      </div>

      <div className="map-wrapper">
        <GlobeMap 
          focusCoords={focusCoords} 
          items={displayedItems}
          onProjectClick={(p) => setSelectedProject(p)}
          isDrawerOpen={!!selectedProject} 
          activeProjectCoords={selectedProject ? [selectedProject.lng, selectedProject.lat] : null}
          showAll={showAll}
        />
      </div>

      <div className="controls-overlay">
        <button 
          className={`glass-button toggle-all ${showAll ? 'active' : ''}`}
          onClick={toggleShowAll}
        >
          <span className="icon">{showAll ? "🌍" : "🗺️"}</span>
          {showAll ? "Hide All Projects" : "View All Projects"}
        </button>
      </div>

      <SideDrawer 
        project={selectedProject} 
        onClose={() => setSelectedProject(null)} 
      />

      <div className="search-overlay">
        <div className="search-bar-container">
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>
    </div>
  )
}