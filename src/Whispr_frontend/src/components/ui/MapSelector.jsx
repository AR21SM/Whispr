import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Check, MapPinned, AlertTriangle } from 'lucide-react';
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
  const [error, setError] = useState(null);

  // Check if running in a secure context (HTTPS or localhost)
  const isSecureContext = useRef(
    window.isSecureContext || 
    window.location.hostname === 'localhost' || 
    window.location.hostname === '127.0.0.1'
  );

  // Initialize Leaflet Map (free alternative to Google Maps)
  useEffect(() => {
    // Load Leaflet CSS
    if (!document.getElementById('leaflet-css')) {
      const linkElement = document.createElement('link');
      linkElement.id = 'leaflet-css';
      linkElement.rel = 'stylesheet';
      linkElement.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      linkElement.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
      linkElement.crossOrigin = "";
      document.head.appendChild(linkElement);
    }

    let isMounted = true;
    
    // Load Leaflet JS
    const loadLeaflet = async () => {
      try {
        // If Leaflet is already loaded
        if (window.L) {
          if (isMounted) initMap();
          return;
        }

        // Load Leaflet script
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.integrity = "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=";
        script.crossOrigin = "";
        script.async = true;
        
        // Create a promise to wait for script load
        const scriptLoadPromise = new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
        });
        
        document.head.appendChild(script);
        await scriptLoadPromise;
        
        // Check if component is still mounted before initializing map
        if (isMounted) {
          // Small delay to ensure DOM is ready
          setTimeout(() => {
            initMap();
          }, 100);
        }
      } catch (error) {
        console.error('Failed to load Leaflet:', error);
        if (isMounted) {
          setIsLoading(false);
          setError('Failed to load map. Please refresh the page.');
        }
      }
    };
    
    loadLeaflet();
    
    // Cleanup function
    return () => {
      isMounted = false;
      // Cleanup map when component unmounts
      if (leafletMap.current) {
        leafletMap.current.remove();
      }
    };
  }, []);

  // Add resize handler to fix map rendering issues
  useEffect(() => {
    const handleResize = () => {
      if (leafletMap.current) {
        leafletMap.current.invalidateSize();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const initMap = () => {
    if (!mapRef.current || typeof window.L !== 'object') {
      setIsLoading(false);
      setError('Map could not be initialized');
      return;
    }

    try {
      // Create map instance
      const map = window.L.map(mapRef.current, {
        attributionControl: false, // Hide attribution initially for cleaner look
        zoomControl: true
      }).setView(
        [selectedLocation.coordinates.lat, selectedLocation.coordinates.lng], 
        5 // Start with a zoomed out view
      );
      
      // Add dark theme tile layer with https
      window.L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
        subdomains: 'abcd'
      }).addTo(map);

      // Add attribution in bottom-right
      window.L.control.attribution({
        position: 'bottomright'
      }).addTo(map);
      
      // Create custom marker icon with inline SVG
      const markerIcon = window.L.divIcon({
        html: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" fill="#8b5cf6" stroke="white" stroke-width="2"/>
                <circle cx="12" cy="12" r="3" fill="white"/>
              </svg>`,
        className: '',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
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

      // Force a resize after initialization to fix rendering issues
      setTimeout(() => {
        map.invalidateSize();
        
        // Zoom to a better view after a short delay
        setTimeout(() => {
          map.setZoom(4);
          
          // If we have initial coordinates, fetch nearby places
          if (selectedLocation.coordinates && selectedLocation.coordinates.lat) {
            fetchNearbyPlaces(selectedLocation.coordinates);
          }
        }, 200);
      }, 100);
      
      setIsLoading(false);
      setError(null);
    } catch (error) {
      console.error('Error initializing map:', error);
      setIsLoading(false);
      setError('Failed to initialize map');
    }
  };

  const updateLocationFromCoordinates = (coordinates) => {
    // Set loading state
    setIsLoading(true);
    
    // Use Nominatim for reverse geocoding (free)
    fetch(`https://nominatim.openstreetmap.org/reverse?lat=${coordinates.lat}&lon=${coordinates.lng}&format=json&accept-language=en`, {
      headers: {
        'User-Agent': 'Whispr App (https://aoicy-vyaaa-aaaag-aua4a-cai.icp0.io)'
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
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
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleSearchSubmit = (e) => {
    // Ensure the form doesn't refresh the page
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (!searchValue.trim()) return;

    setIsLoading(true);
    setError(null);
    
    // Use Nominatim for geocoding (free)
    fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchValue)}&format=json&limit=1&accept-language=en`, {
      headers: {
        'User-Agent': 'Whispr App (https://aoicy-vyaaa-aaaag-aua4a-cai.icp0.io)'
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
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
        } else {
          setError('No locations found. Try a different search term.');
        }
      })
      .catch(error => {
        console.error("Error during geocoding search:", error);
        setError('Error searching for location. Please try again.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const fetchNearbyPlaces = (coordinates) => {
    // Use Nominatim to find nearby POIs
    fetch(`https://nominatim.openstreetmap.org/search?lat=${coordinates.lat}&lon=${coordinates.lng}&format=json&addressdetails=1&limit=5&accept-language=en`, {
      headers: {
        'User-Agent': 'Whispr App (https://aoicy-vyaaa-aaaag-aua4a-cai.icp0.io)'
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
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
    // Check if geolocation is supported
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }
    
    // Check if we're in a secure context (HTTPS or localhost)
    if (!isSecureContext.current) {
      setError('Geolocation requires a secure connection (HTTPS). Please access this site via HTTPS.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
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
        let errorMessage;
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission was denied. Please enable location access in your browser settings.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'The request to get your location timed out.';
            break;
          default:
            errorMessage = 'An unknown error occurred while getting your location.';
        }
        
        setError(errorMessage);
        setIsLoading(false);
      },
      { 
        enableHighAccuracy: true, 
        timeout: 10000, 
        maximumAge: 0 
      }
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
      setError("Could not select this location. Please try another.");
    }
  };

  return (
    <div className="space-y-3">
      <form onSubmit={handleSearchSubmit} className="flex gap-2" noValidate>
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
        <Button 
          type="button" 
          variant="secondary" 
          size="sm" 
          disabled={isLoading}
          onClick={(e) => {
            e.preventDefault();
            handleSearchSubmit();
          }}
        >
          Search
        </Button>
      </form>
      
      {error && (
        <div className="bg-red-900/40 border border-red-800 text-red-200 px-3 py-2 rounded-lg text-sm flex items-center">
          <AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      
      <div className="flex gap-2">
        <Button 
          type="button" 
          variant="secondary" 
          size="sm"
          onClick={handleUseCurrentLocation}
          disabled={isLoading}
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
          disabled={isLoading}
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