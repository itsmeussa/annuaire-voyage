'use client';

import { useEffect, useRef, useState } from 'react';
import { MapPin, Maximize2, Minimize2, Layers } from 'lucide-react';
import type { Agency } from '@/types';

interface AgencyMapProps {
  agencies: Agency[];
  center?: [number, number];
  zoom?: number;
  height?: string;
  showFullscreenControl?: boolean;
  onAgencyClick?: (agency: Agency) => void;
}

export default function AgencyMap({
  agencies,
  center,
  zoom = 6,
  height = '500px',
  showFullscreenControl = true,
  onAgencyClick,
}: AgencyMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mapStyle, setMapStyle] = useState<'streets' | 'satellite'>('streets');

  // Filter agencies with valid coordinates
  const validAgencies = agencies.filter(
    (agency) =>
      agency.location?.lat &&
      agency.location?.lng &&
      !isNaN(agency.location.lat) &&
      !isNaN(agency.location.lng)
  );

  // Calculate center from agencies if not provided
  const defaultCenter: [number, number] = center || (() => {
    if (validAgencies.length === 0) return [31.7917, -7.0926]; // Morocco center
    const avgLat = validAgencies.reduce((sum, a) => sum + (a.location?.lat || 0), 0) / validAgencies.length;
    const avgLng = validAgencies.reduce((sum, a) => sum + (a.location?.lng || 0), 0) / validAgencies.length;
    return [avgLat, avgLng];
  })();

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current) return;

    const initMap = async () => {
      const L = (await import('leaflet')).default;

      // Fix default marker icons
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });

      // Create custom icon
      const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            width: 36px;
            height: 36px;
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            border: 3px solid white;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <div style="
              transform: rotate(45deg);
              color: white;
              font-size: 14px;
              font-weight: bold;
            ">✈</div>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -36],
      });

      // Create map
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }

      const map = L.map(mapRef.current!, {
        center: defaultCenter,
        zoom: zoom,
        scrollWheelZoom: true,
        zoomControl: false,
      });

      // Add zoom control to top-right
      L.control.zoom({ position: 'topright' }).addTo(map);

      // Street tile layer
      const streetLayer = L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 19,
        }
      );

      // Satellite tile layer
      const satelliteLayer = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          attribution: '&copy; Esri',
          maxZoom: 19,
        }
      );

      // Add default layer
      streetLayer.addTo(map);

      // Store layers for switching
      (map as any).streetLayer = streetLayer;
      (map as any).satelliteLayer = satelliteLayer;

      // Create marker cluster group if many agencies
      const markers: any[] = [];

      validAgencies.forEach((agency) => {
        const marker = L.marker([agency.location!.lat, agency.location!.lng], {
          icon: customIcon,
        });

        const popupContent = `
          <div style="min-width: 200px; font-family: system-ui, sans-serif;">
            <h3 style="font-size: 14px; font-weight: 600; margin: 0 0 8px 0; color: #1e40af;">
              ${agency.title}
            </h3>
            ${agency.totalScore ? `
              <div style="display: flex; align-items: center; gap: 4px; margin-bottom: 6px;">
                <span style="color: #f59e0b;">★</span>
                <span style="font-weight: 500;">${agency.totalScore.toFixed(1)}</span>
                <span style="color: #6b7280; font-size: 12px;">(${agency.reviewsCount || 0} avis)</span>
              </div>
            ` : ''}
            ${agency.city ? `
              <p style="font-size: 12px; color: #6b7280; margin: 0 0 8px 0;">
                📍 ${agency.city}${agency.countryCode ? `, ${agency.countryCode}` : ''}
              </p>
            ` : ''}
            <a 
              href="/agencies/${agency.slug || ''}" 
              style="
                display: inline-block;
                padding: 6px 12px;
                background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
                color: white;
                text-decoration: none;
                border-radius: 6px;
                font-size: 12px;
                font-weight: 500;
              "
            >
              Voir le profil →
            </a>
          </div>
        `;

        marker.bindPopup(popupContent);
        
        if (onAgencyClick) {
          marker.on('click', () => onAgencyClick(agency));
        }

        marker.addTo(map);
        markers.push(marker);
      });

      // Fit bounds if multiple agencies
      if (validAgencies.length > 1 && !center) {
        const group = L.featureGroup(markers);
        map.fitBounds(group.getBounds().pad(0.1));
      }

      mapInstanceRef.current = map;
      setIsLoaded(true);
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [validAgencies.length, center, zoom]);

  // Handle map style change
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    
    const map = mapInstanceRef.current;
    if (mapStyle === 'satellite') {
      map.removeLayer(map.streetLayer);
      map.addLayer(map.satelliteLayer);
    } else {
      map.removeLayer(map.satelliteLayer);
      map.addLayer(map.streetLayer);
    }
  }, [mapStyle]);

  // Handle fullscreen
  const toggleFullscreen = () => {
    if (!mapRef.current) return;

    if (!isFullscreen) {
      if (mapRef.current.requestFullscreen) {
        mapRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      // Resize map after fullscreen change
      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 100);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  if (validAgencies.length === 0) {
    return (
      <div 
        className="flex flex-col items-center justify-center bg-muted rounded-xl"
        style={{ height }}
      >
        <MapPin className="h-12 w-12 text-muted-foreground mb-3" />
        <p className="text-muted-foreground">Aucune localisation disponible</p>
      </div>
    );
  }

  return (
    <div className="relative rounded-xl overflow-hidden shadow-lg animate-fade-in" style={{ height }}>
      {/* Loading overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-muted flex items-center justify-center z-10">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-muted-foreground">Chargement de la carte...</p>
          </div>
        </div>
      )}

      {/* Map container */}
      <div ref={mapRef} className="w-full h-full" />

      {/* Controls */}
      <div className="absolute top-3 left-3 z-[1000] flex flex-col gap-2">
        {/* Agency count badge */}
        <div className="bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">{validAgencies.length} agences</span>
        </div>
      </div>

      {/* Right controls */}
      <div className="absolute bottom-3 right-3 z-[1000] flex gap-2">
        {/* Map style toggle */}
        <button
          onClick={() => setMapStyle(mapStyle === 'streets' ? 'satellite' : 'streets')}
          className="bg-white/95 backdrop-blur-sm p-2.5 rounded-lg shadow-md hover:bg-white transition-colors"
          title={mapStyle === 'streets' ? 'Vue satellite' : 'Vue carte'}
        >
          <Layers className="h-5 w-5 text-gray-700" />
        </button>

        {/* Fullscreen toggle */}
        {showFullscreenControl && (
          <button
            onClick={toggleFullscreen}
            className="bg-white/95 backdrop-blur-sm p-2.5 rounded-lg shadow-md hover:bg-white transition-colors"
            title={isFullscreen ? 'Quitter le plein écran' : 'Plein écran'}
          >
            {isFullscreen ? (
              <Minimize2 className="h-5 w-5 text-gray-700" />
            ) : (
              <Maximize2 className="h-5 w-5 text-gray-700" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
