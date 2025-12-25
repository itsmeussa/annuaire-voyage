'use client';

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { MapPin, Navigation, Loader2, Layers, Maximize2, Minimize2, Search, X } from 'lucide-react';
import type { Agency } from '@/types';

interface FastAgencyMapProps {
  agencies: Agency[];
  height?: string;
  maxMarkers?: number;
  maxSearchResults?: number;
  onAgencyClick?: (agency: Agency) => void;
  minimal?: boolean; // Hide search bar and extra controls for single agency view
}

// Calculate distance between two points in km (Haversine formula)
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function FastAgencyMap({
  agencies,
  height = '600px',
  maxMarkers = 100,
  maxSearchResults = 100,
  onAgencyClick,
  minimal = false,
}: FastAgencyMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);
  const userMarkerRef = useRef<any>(null);

  const [isLoaded, setIsLoaded] = useState(false);
  // Auto-locate only if we are browsing (more than 1 agency or empty)
  const [isLocating, setIsLocating] = useState(agencies.length !== 1);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [mapStyle, setMapStyle] = useState<'streets' | 'satellite'>('streets');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(0);

  // Filter agencies with valid coordinates
  const validAgencies = useMemo(() =>
    agencies.filter(
      (agency) =>
        agency.location?.lat &&
        agency.location?.lng &&
        !isNaN(agency.location.lat) &&
        !isNaN(agency.location.lng)
    ), [agencies]
  );

  // Get nearby agencies sorted by distance
  const getNearbyAgencies = useCallback((lat: number, lng: number, limit: number = maxMarkers) => {
    return validAgencies
      .map(agency => ({
        ...agency,
        distance: calculateDistance(lat, lng, agency.location!.lat, agency.location!.lng)
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, limit);
  }, [validAgencies, maxMarkers]);

  // Search agencies
  const searchAgencies = useCallback((query: string) => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return validAgencies.filter(a =>
      a.title.toLowerCase().includes(q) ||
      a.city?.toLowerCase().includes(q) ||
      a.country?.toLowerCase().includes(q) ||
      a.category?.toLowerCase().includes(q)
    ).slice(0, maxSearchResults);
  }, [validAgencies, maxSearchResults]);

  // Update markers on map
  const updateMarkers = useCallback(async (agenciesToShow: Agency[], centerLat?: number, centerLng?: number) => {
    if (!mapInstanceRef.current) return;

    const L = (await import('leaflet')).default;

    // Clear existing markers
    if (markersLayerRef.current) {
      markersLayerRef.current.clearLayers();
    } else {
      markersLayerRef.current = L.layerGroup().addTo(mapInstanceRef.current);
    }

    // Custom icon
    const customIcon = L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 2px solid white;
          box-shadow: 0 3px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="transform: rotate(45deg); color: white; font-size: 12px;">✈</div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });

    // Add markers
    agenciesToShow.forEach((agency) => {
      const marker = L.marker([agency.location!.lat, agency.location!.lng], { icon: customIcon });

      const distanceText = (agency as any).distance
        ? `<p style="font-size: 11px; color: #059669; margin: 4px 0;">📍 ${((agency as any).distance).toFixed(1)} km</p>`
        : '';

      const popupContent = `
        <div style="min-width: 180px; font-family: system-ui, sans-serif;">
          <h3 style="font-size: 13px; font-weight: 600; margin: 0 0 6px 0; color: #1e40af; line-height: 1.3;">
            ${agency.title}
          </h3>
          ${agency.totalScore ? `
            <div style="display: flex; align-items: center; gap: 4px; margin-bottom: 4px;">
              <span style="color: #f59e0b;">★</span>
              <span style="font-weight: 500; font-size: 12px;">${agency.totalScore.toFixed(1)}</span>
              <span style="color: #6b7280; font-size: 11px;">(${agency.reviewsCount || 0})</span>
            </div>
          ` : ''}
          ${distanceText}
          ${agency.city ? `
            <p style="font-size: 11px; color: #6b7280; margin: 0 0 6px 0;">
              ${agency.city}${agency.country ? `, ${agency.country}` : ''}
            </p>
          ` : ''}
          <a 
            href="/agencies/${agency.slug || ''}" 
            style="
              display: inline-block;
              padding: 5px 10px;
              background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
              color: white;
              text-decoration: none;
              border-radius: 5px;
              font-size: 11px;
              font-weight: 500;
            "
          >
            View →
          </a>
        </div>
      `;

      marker.bindPopup(popupContent, { maxWidth: 250 });

      if (onAgencyClick) {
        marker.on('click', () => onAgencyClick(agency));
      }

      markersLayerRef.current.addLayer(marker);
    });

    setVisibleCount(agenciesToShow.length);

    // Fit bounds if we have agencies
    if (agenciesToShow.length > 0 && !centerLat) {
      const group = L.featureGroup(markersLayerRef.current.getLayers());
      mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1), { maxZoom: 12 });
    }
  }, [onAgencyClick]);

  // Auto-detect location on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Try to get cached location first
    const cachedLoc = sessionStorage.getItem('userLocation');
    if (cachedLoc) {
      try {
        const loc = JSON.parse(cachedLoc);
        setUserLocation(loc);
        setIsLocating(false);
        return;
      } catch (e) { }
    }

    // Auto-detect location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = { lat: position.coords.latitude, lng: position.coords.longitude };
          setUserLocation(loc);
          sessionStorage.setItem('userLocation', JSON.stringify(loc));
          setIsLocating(false);
        },
        () => {
          // Fallback to IP geolocation or default
          setIsLocating(false);
          setLocationError('Location access denied. Showing all agencies.');
        },
        { enableHighAccuracy: false, timeout: 5000, maximumAge: 600000 }
      );
    } else {
      setIsLocating(false);
    }
  }, []);

  // Initialize map
  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current || isLocating) return;

    const initMap = async () => {
      const L = (await import('leaflet')).default;

      // Fix icons
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }

      const defaultCenter: [number, number] = userLocation
        ? [userLocation.lat, userLocation.lng]
        : [31.7917, -7.0926]; // Morocco

      const map = L.map(mapRef.current!, {
        center: defaultCenter,
        zoom: userLocation ? 10 : 5,
        scrollWheelZoom: true,
        zoomControl: false,
      });

      L.control.zoom({ position: 'topright' }).addTo(map);

      // Tile layers
      const streetLayer = L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        { attribution: '© OpenStreetMap', maxZoom: 19 }
      );

      const satelliteLayer = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        { attribution: '© Esri', maxZoom: 19 }
      );

      streetLayer.addTo(map);
      (map as any).streetLayer = streetLayer;
      (map as any).satelliteLayer = satelliteLayer;

      mapInstanceRef.current = map;

      // Add user marker if we have location
      if (userLocation) {
        const userIcon = L.divIcon({
          className: 'user-marker',
          html: `
            <div style="
              width: 20px;
              height: 20px;
              background: #3b82f6;
              border-radius: 50%;
              border: 3px solid white;
              box-shadow: 0 0 0 2px #3b82f6, 0 2px 8px rgba(59, 130, 246, 0.5);
            "></div>
          `,
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        });

        userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
          .addTo(map)
          .bindPopup('<b>Your location</b>');

        // Show nearby agencies
        const nearby = getNearbyAgencies(userLocation.lat, userLocation.lng);
        updateMarkers(nearby, userLocation.lat, userLocation.lng);
      } else {
        // Show first N agencies globally
        updateMarkers(validAgencies.slice(0, maxMarkers));
      }

      setIsLoaded(true);

      // Update markers when map moves (debounced)
      let moveTimeout: NodeJS.Timeout;
      map.on('moveend', () => {
        clearTimeout(moveTimeout);
        moveTimeout = setTimeout(() => {
          if (!searchQuery && !userLocation) {
            const center = map.getCenter();
            const nearby = getNearbyAgencies(center.lat, center.lng);
            updateMarkers(nearby);
          }
        }, 300);
      });
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isLocating, userLocation, validAgencies, maxMarkers, getNearbyAgencies, updateMarkers, searchQuery]);

  // Handle search
  useEffect(() => {
    if (!isLoaded || !mapInstanceRef.current) return;

    if (searchQuery.trim()) {
      const results = searchAgencies(searchQuery);
      updateMarkers(results);
    } else if (userLocation) {
      const nearby = getNearbyAgencies(userLocation.lat, userLocation.lng);
      updateMarkers(nearby);
    }
  }, [searchQuery, isLoaded, searchAgencies, userLocation, getNearbyAgencies, updateMarkers]);

  // Handle style change
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

  // Fullscreen
  const toggleFullscreen = () => {
    if (!mapRef.current) return;
    if (!isFullscreen) {
      mapRef.current.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullscreen(!isFullscreen);
  };

  useEffect(() => {
    const handler = () => {
      setIsFullscreen(!!document.fullscreenElement);
      setTimeout(() => mapInstanceRef.current?.invalidateSize(), 100);
    };
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  // Relocate user
  const relocateUser = async () => {
    if (!navigator.geolocation || !mapInstanceRef.current) return;

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const loc = { lat: position.coords.latitude, lng: position.coords.longitude };
        setUserLocation(loc);
        sessionStorage.setItem('userLocation', JSON.stringify(loc));
        setIsLocating(false);

        const L = (await import('leaflet')).default;

        if (userMarkerRef.current) {
          mapInstanceRef.current.removeLayer(userMarkerRef.current);
        }

        const userIcon = L.divIcon({
          className: 'user-marker',
          html: `<div style="width: 20px; height: 20px; background: #3b82f6; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 0 2px #3b82f6;"></div>`,
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        });

        userMarkerRef.current = L.marker([loc.lat, loc.lng], { icon: userIcon })
          .addTo(mapInstanceRef.current)
          .bindPopup('<b>Your location</b>');

        mapInstanceRef.current.flyTo([loc.lat, loc.lng], 10, { duration: 1 });

        const nearby = getNearbyAgencies(loc.lat, loc.lng);
        updateMarkers(nearby, loc.lat, loc.lng);
        setSearchQuery('');
      },
      () => {
        setIsLocating(false);
        setLocationError('Could not get your location');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Loading state
  if (isLocating) {
    return (
      <div className="flex flex-col items-center justify-center bg-muted rounded-xl" style={{ height }}>
        <Loader2 className="h-10 w-10 text-primary animate-spin mb-3" />
        <p className="text-muted-foreground">Detecting your location...</p>
      </div>
    );
  }

  return (
    <div className="relative rounded-xl overflow-hidden shadow-lg" style={{ height }}>
      {/* Loading overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-muted flex items-center justify-center z-10">
          <div className="flex flex-col items-center">
            <Loader2 className="h-10 w-10 text-primary animate-spin mb-3" />
            <p className="text-muted-foreground">Loading map...</p>
          </div>
        </div>
      )}

      {/* Map */}
      <div ref={mapRef} className="w-full h-full" />

      {/* Search bar - hidden in minimal mode */}
      {!minimal && (
        <div className="absolute top-3 left-3 right-16 z-[1000]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search agencies, cities..."
              className="w-full pl-9 pr-8 py-2.5 bg-white/95 backdrop-blur-sm rounded-lg shadow-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
              >
                <X className="h-4 w-4 text-gray-400" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Stats badge - simplified in minimal mode */}
      {!minimal && (
        <div className="absolute bottom-3 left-3 z-[1000]">
          <div className="bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">
              {visibleCount} agencies
              {userLocation && !searchQuery && ' nearby'}
            </span>
          </div>
        </div>
      )}

      {/* Controls - simplified in minimal mode */}
      <div className={`absolute bottom-3 ${minimal ? 'left-3' : 'right-3'} z-[1000] flex gap-2`}>
        {!minimal && (
          <button
            onClick={relocateUser}
            disabled={isLocating}
            className={`bg-white/95 backdrop-blur-sm p-2.5 rounded-lg shadow-md hover:bg-white transition-colors ${userLocation ? 'ring-2 ring-blue-500' : ''
              }`}
            title="Find my location"
          >
            {isLocating ? (
              <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
            ) : (
              <Navigation className={`h-5 w-5 ${userLocation ? 'text-blue-500' : 'text-gray-700'}`} />
            )}
          </button>
        )}

        <button
          onClick={() => setMapStyle(s => s === 'streets' ? 'satellite' : 'streets')}
          className="bg-white/95 backdrop-blur-sm p-2.5 rounded-lg shadow-md hover:bg-white transition-colors"
          title={mapStyle === 'streets' ? 'Satellite view' : 'Street view'}
        >
          <Layers className="h-5 w-5 text-gray-700" />
        </button>

        <button
          onClick={toggleFullscreen}
          className="bg-white/95 backdrop-blur-sm p-2.5 rounded-lg shadow-md hover:bg-white transition-colors"
          title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
        >
          {isFullscreen ? (
            <Minimize2 className="h-5 w-5 text-gray-700" />
          ) : (
            <Maximize2 className="h-5 w-5 text-gray-700" />
          )}
        </button>
      </div>

      {/* Error message */}
      {locationError && (
        <div className="absolute top-16 left-3 right-16 z-[1000]">
          <div className="bg-amber-500/90 text-white text-sm px-3 py-2 rounded-lg shadow-md">
            {locationError}
          </div>
        </div>
      )}
    </div>
  );
}
