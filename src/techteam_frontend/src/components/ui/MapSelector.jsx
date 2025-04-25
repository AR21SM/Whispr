import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Check, MapPinned } from 'lucide-react';
import Button from './Button';

const MapSelector = ({ onLocationSelect, initialAddress = '', initialCoordinates = null }) => {
  const mapRef = useRef(null);
  const [searchValue, setSearchValue] = useState(initialAddress);
  const [selectedLocation, setSelectedLocation] = useState({
    address: initialAddress,
    coordinates: initialCoordinates || { lat: 20.5937, lng: 78.9629 } // Default to India
  });
  const [isLoading, setIsLoading] = useState(true);
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const leafletMap = useRef(null);
  const leafletMarker = useRef(null);

  // Initialize Leaflet Map (free alternative to Google Maps)
  useEffect(() => {
    // Load Leaflet CSS
    if (!document.getElementById('leaflet-css')) {
      const linkElement = document.createElement('link');
      linkElement.id = 'leaflet-css';
      linkElement.rel = 'stylesheet';
      linkElement.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(linkElement);
    }

    // Load Leaflet JS
    const loadLeaflet = async () => {
      // If Leaflet is already loaded
      if (window.L) {
        initMap();
        return;
      }

      try {
        // Load Leaflet script
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.async = true;
        
        // Create a promise to wait for script load
        const scriptLoadPromise = new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
        });
        
        document.head.appendChild(script);
        await scriptLoadPromise;
        initMap();
      } catch (error) {
        console.error('Failed to load Leaflet:', error);
        setIsLoading(false);
      }
    };
    
    loadLeaflet();
    
    return () => {
      // Cleanup map when component unmounts
      if (leafletMap.current) {
        leafletMap.current.remove();
      }
    };
  }, []);

  const initMap = () => {
    if (!mapRef.current || !window.L) return;

    try {
      // Create map instance
      const map = window.L.map(mapRef.current).setView(
        [selectedLocation.coordinates.lat, selectedLocation.coordinates.lng], 
        12
      );
      
      // Add dark theme tile layer
      window.L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19
      }).addTo(map);

      // Create custom marker icon
      const markerIcon = window.L.divIcon({
        html: `<div class="flex items-center justify-center">
                <div class="h-6 w-6 bg-purple-600 rounded-full border-2 border-white flex items-center justify-center">
                  <div class="h-2 w-2 bg-white rounded-full"></div>
                </div>
              </div>`,
        className: 'custom-leaflet-marker',
        iconSize: [24, 24],
        iconAnchor: [12, 24]
      });
      
      // Create marker
      const marker = window.L.marker(
        [selectedLocation.coordinates.lat, selectedLocation.coordinates.lng],
        { icon: markerIcon, draggable: true }
      ).addTo(map);
      
      // Store references
      leafletMap.current = map;
      leafletMarker.current = marker;
      
      // Add marker drag event
      marker.on('dragend', () => {
        const position = marker.getLatLng();
        const newCoordinates = { 
          lat: position.lat, 
          lng: position.lng 
        };
        updateLocationFromCoordinates(newCoordinates);
      });
      
      // Add map click event
      map.on('click', (e) => {
        const newCoordinates = { 
          lat: e.latlng.lat, 
          lng: e.latlng.lng 
        };
        marker.setLatLng([newCoordinates.lat, newCoordinates.lng]);
        updateLocationFromCoordinates(newCoordinates);
      });
      
      setIsLoading(false);
      
      // If we have initial coordinates, fetch nearby places
      if (selectedLocation.coordinates && selectedLocation.coordinates.lat) {
        fetchNearbyPlaces(selectedLocation.coordinates);
      }
    } catch (error) {
      console.error('Error initializing map:', error);
      setIsLoading(false);
    }
  };

  const updateLocationFromCoordinates = (coordinates) => {
    // Use Nominatim for reverse geocoding (free)
    fetch(`https://nominatim.openstreetmap.org/reverse?lat=${coordinates.lat}&lon=${coordinates.lng}&format=json`)
      .then(response => response.json())
      .then(data => {
        if (data && data.display_name) {
          const address = data.display_name;
          const updatedLocation = {
            address,
            coordinates
          };
          
          setSelectedLocation(updatedLocation);
          setSearchValue(address);
          
          if (onLocationSelect) {
            onLocationSelect(updatedLocation);
          }
          
          // Fetch nearby places
          fetchNearbyPlaces(coordinates);
        }
      })
      .catch(error => {
        console.error("Error during reverse geocoding:", error);
        // Still update with raw coordinates if geocoding fails
        const updatedLocation = {
          address: `Lat: ${coordinates.lat.toFixed(6)}, Lng: ${coordinates.lng.toFixed(6)}`,
          coordinates
        };
        setSelectedLocation(updatedLocation);
        if (onLocationSelect) {
          onLocationSelect(updatedLocation);
        }
      });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchValue.trim()) return;

    setIsLoading(true);
    
    // Use Nominatim for geocoding (free)
    fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchValue)}&format=json&limit=1`)
      .then(response => response.json())
      .then(data => {
        setIsLoading(false);
        if (data && data.length > 0) {
          const place = data[0];
          const newCoordinates = { 
            lat: parseFloat(place.lat), 
            lng: parseFloat(place.lon) 
          };
          
          if (leafletMap.current && leafletMarker.current) {
            leafletMap.current.setView([newCoordinates.lat, newCoordinates.lng], 16);
            leafletMarker.current.setLatLng([newCoordinates.lat, newCoordinates.lng]);
            
            const updatedLocation = {
              address: place.display_name,
              coordinates: newCoordinates
            };
            
            setSelectedLocation(updatedLocation);
            
            if (onLocationSelect) {
              onLocationSelect(updatedLocation);
            }
            
            fetchNearbyPlaces(newCoordinates);
          }
        }
      })
      .catch(error => {
        setIsLoading(false);
        console.error("Error during geocoding search:", error);
      });
  };

  const fetchNearbyPlaces = (coordinates) => {
    // Use Nominatim to find nearby POIs
    fetch(`https://nominatim.openstreetmap.org/search?lat=${coordinates.lat}&lon=${coordinates.lng}&format=json&addressdetails=1&limit=5`)
      .then(response => response.json())
      .then(data => {
        if (data && data.length > 0) {
          // Filter to unique places by name
          const uniquePlaces = [];
          const nameSet = new Set();
          
          data.forEach(place => {
            if (place.name && !nameSet.has(place.name)) {
              nameSet.add(place.name);
              uniquePlaces.push(place);
            }
          });
          
          setNearbyPlaces(uniquePlaces.slice(0, 3));
        } else {
          setNearbyPlaces([]);
        }
      })
      .catch(error => {
        console.error("Error fetching nearby places:", error);
        setNearbyPlaces([]);
      });
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    
    setIsLoading(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coordinates = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        
        if (leafletMap.current && leafletMarker.current) {
          leafletMap.current.setView([coordinates.lat, coordinates.lng], 16);
          leafletMarker.current.setLatLng([coordinates.lat, coordinates.lng]);
          updateLocationFromCoordinates(coordinates);
        }
        
        setIsLoading(false);
      },
      (error) => {
        console.error('Error getting current location:', error);
        alert('Unable to get your current location. Please check your browser settings.');
        setIsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  };

  const handleSetLocation = () => {
    if (onLocationSelect && selectedLocation) {
      onLocationSelect(selectedLocation);
    }
  };

  const handleSelectNearbyPlace = (place) => {
    if (!leafletMap.current || !leafletMarker.current) return;
    
    try {
      const coordinates = {
        lat: parseFloat(place.lat),
        lng: parseFloat(place.lon)
      };
      
      leafletMap.current.setView([coordinates.lat, coordinates.lng], 17);
      leafletMarker.current.setLatLng([coordinates.lat, coordinates.lng]);
      
      const address = place.display_name;
      const updatedLocation = {
        address,
        coordinates
      };
      
      setSelectedLocation(updatedLocation);
      setSearchValue(address);
      
      if (onLocationSelect) {
        onLocationSelect(updatedLocation);
      }
    } catch (error) {
      console.error("Error selecting nearby place:", error);
    }
  };

  return (
    <div className="space-y-3">
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
          <input
            id="map-search-input"
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search for a location..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
          />
        </div>
        <Button type="submit" variant="secondary" size="sm">
          Search
        </Button>
      </form>
      
      <div className="flex gap-2">
        <Button 
          type="button" 
          variant="secondary" 
          size="sm"
          onClick={handleUseCurrentLocation}
          className="text-xs"
        >
          <MapPin className="h-3 w-3 mr-1" />
          Use Current Location
        </Button>
        <Button 
          type="button" 
          variant="primary" 
          size="sm"
          onClick={handleSetLocation}
          className="text-xs ml-auto"
        >
          <Check className="h-3 w-3 mr-1" />
          Set Location
        </Button>
      </div>
      
      <div 
        ref={mapRef} 
        className="w-full h-64 rounded-lg overflow-hidden border border-slate-700"
      >
        {isLoading && (
          <div className="w-full h-full bg-slate-800 flex items-center justify-center">
            <div className="text-gray-400">Loading map...</div>
          </div>
        )}
      </div>
      
      {selectedLocation.coordinates && (
        <div className="px-3 py-2 bg-slate-800 rounded-lg text-sm">
          <div className="flex flex-col gap-1">
            <div className="flex items-center text-purple-400 font-medium border-b border-slate-700 pb-1 mb-1">
              <MapPinned className="h-4 w-4 mr-2" />
              Selected Location
            </div>
            <div className="flex items-start">
              <span className="text-gray-400 mr-2">Address:</span>
              <span className="text-gray-300">{selectedLocation.address}</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-400 mr-2">Coordinates:</span>
              <span className="text-gray-300">
                {selectedLocation.coordinates.lat.toFixed(6)}, {selectedLocation.coordinates.lng.toFixed(6)}
              </span>
            </div>
          </div>
        </div>
      )}
      
      {nearbyPlaces.length > 0 && (
        <div className="px-3 py-2 bg-slate-800 rounded-lg text-sm">
          <div className="flex items-center text-purple-400 font-medium border-b border-slate-700 pb-1 mb-2">
            <MapPin className="h-4 w-4 mr-2" />
            Nearby Places
          </div>
          <div className="space-y-2">
            {nearbyPlaces.map((place, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSelectNearbyPlace(place)}
                className="block w-full text-left px-2 py-1.5 rounded hover:bg-slate-700 transition-colors"
              >
                <div className="text-gray-300">{place.name || place.display_name.split(',')[0]}</div>
                <div className="text-xs text-gray-500 truncate">{place.display_name}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MapSelector;