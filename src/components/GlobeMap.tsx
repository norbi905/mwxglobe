import { useEffect, useRef } from "react"
import maplibregl, { Map, Marker } from "maplibre-gl"
import { createRoot } from "react-dom/client"; 
import FloatingCard from "./FloatingCard"

interface Project {
  id: string;
  lat: number;
  lng: number;
  title: string;
  description: string;
}

type GlobeMapProps = {
  focusCoords: [number, number] | null;
  activeProjectCoords?: [number, number] | null;
  items: Project[];
  onProjectClick: (project: Project) => void;
  isDrawerOpen: boolean;
  showAll: boolean;
}

export default function GlobeMap({ focusCoords, activeProjectCoords, items, onProjectClick, isDrawerOpen, showAll }: GlobeMapProps) {
  const mapRef = useRef<Map | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const markersRef = useRef<Marker[]>([])
  const rootsRef = useRef<any[]>([]);

  // Initialize Map
  useEffect(() => {
    if (!containerRef.current) return
    mapRef.current = new maplibregl.Map({
      container: containerRef.current,
      style: "https://tiles.basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
      center: [0, 20],
      zoom: 2.2,
      //antialias: true,
      attributionControl: false,
      maxTileCacheSize: 500,
      fadeDuration: 300,
      minZoom: 2.4
    })

    mapRef.current.on("style.load", () => {
      mapRef.current?.setProjection({ type: "globe" });
      mapRef.current?.setRenderWorldCopies(true);
    })

    return () => mapRef.current?.remove()
  }, [])

  // Handle Pan/Zoom Logic
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Stop any current movement/inertia immediately
    map.stop();

    // Define clear padding goals
    const sidePadding = isDrawerOpen ? 450 : 100;
    const verticalPadding = 100;

    // PRIORITY 0: Project is selected (Zoom in)
    if (activeProjectCoords) {
      map.flyTo({
        center: activeProjectCoords,
        zoom: 12,
        padding: { top: verticalPadding, bottom: verticalPadding, left: 100, right: sidePadding },
        duration: 1500,
        essential: true
      });
      return;
    }

    // PRIORITY 1: Show All Mode (Global view)
    if (showAll && !isDrawerOpen) {
      map.flyTo({
        center: [0, 20],
        zoom: 2.2,
        padding: { top: 0, bottom: 0, left: 0, right: 0 },
        duration: 1500,
        essential: true
      });
      return;
    }

    // PRIORITY 2: Search Results (Consistent Bounding Box)
    if (items && items.length > 0) {
      if (items.length === 1) {
        // For a single project, we use a fixed, consistent zoom distance
        map.flyTo({
          center: [items[0].lng, items[0].lat],
          zoom: 12, 
          padding: { top: 100, bottom: 100, left: 100, right: isDrawerOpen ? 450 : 100 },
          duration: 1500,
          essential: true
        });
      } else {
        // For multiple projects, we calculate the bounds of the projects ONLY
        const lats = items.map(p => p.lat);
        const lngs = items.map(p => p.lng);
        
        const bounds: [[number, number], [number, number]] = [
          [Math.min(...lngs), Math.min(...lats)],
          [Math.max(...lngs), Math.max(...lats)]
        ];

        // We use cameraForBounds to calculate the EXACT zoom needed 
        // to fit these projects into the screen with a healthy 150px margin.
        const target = map.cameraForBounds(bounds, {
          // This padding acts as your "zoom control". 
          // Increase these numbers to zoom OUT more (more space around projects).
          // Decrease them to zoom IN more (projects closer to screen edges).
          padding: { 
            top: 150, 
            bottom: 150, 
            left: 150, 
            right: isDrawerOpen ? 500 : 150 
          }
        });

        if (target) {
          map.flyTo({
            center: target.center,
            zoom: target.zoom, // No offsets, no +1.2, just the pure calculated zoom
            duration: 1500,
            essential: true
          });
        }
      }
      return;
    }

    // PRIORITY 3: Reset
    map.flyTo({
      center: [0, 20],
      zoom: 2.2,
      padding: { top: 0, bottom: 0, left: 0, right: 0 },
      duration: 1500
    });

  }, [focusCoords, items, isDrawerOpen, activeProjectCoords, showAll]);

  // Handle Markers
  useEffect(() => {
    if (!mapRef.current) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];
    const rootsToUnmount = [...rootsRef.current];
    rootsRef.current = [];
    setTimeout(() => {
      rootsToUnmount.forEach((root) => { try { root.unmount(); } catch (e) {} });
    }, 0);

    if (items.length === 0) return;

    items.forEach((item) => {
      const coords: [number, number] = [item.lng, item.lat];
      if (item.lng === undefined || item.lat === undefined) return;

      const markerNode = document.createElement("div");
      const root = createRoot(markerNode);
      root.render(<FloatingCard item={item} onClick={() => onProjectClick(item)} />);
      rootsRef.current.push(root);

      const marker = new maplibregl.Marker({
        element: markerNode,
        anchor: "bottom",
        pitchAlignment: "map",
        rotationAlignment: "viewport", 
      })
      .setLngLat(coords)
      .addTo(mapRef.current!);

      const pulseEl = document.createElement("div");
      pulseEl.className = "pulse-wrapper";
      pulseEl.innerHTML = `<div class="pulse-dot"></div><div class="pulse-ring"></div>`;

      const pulseMarker = new maplibregl.Marker({
        element: pulseEl,
        pitchAlignment: "map",
        rotationAlignment: "map",
        anchor: "center",
      })
      .setLngLat(coords)
      .addTo(mapRef.current!);

      markersRef.current.push(marker, pulseMarker);
    });
  }, [items]);

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
}