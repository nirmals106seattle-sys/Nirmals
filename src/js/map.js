//
// map.js
//

import L from 'leaflet';

document.addEventListener('DOMContentLoaded', () => {
  const mapSection = document.querySelector('[data-map]');
    
  // Check if mapSection exists and the data-map attribute is present
  if (mapSection && mapSection.hasAttribute('data-map')) {
      const mapConfig = JSON.parse(mapSection.getAttribute('data-map'));
      console.log(mapConfig);

      // Initialize the map with options
      const map = L.map(mapSection, {
        center: mapConfig.center,  // Use correct order [latitude, longitude]
        zoom: mapConfig.zoom,
        zoomControl: false,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
        tap: false,
        keyboard: false,
        touchZoom: false,
      });

      // Add tile layer from OpenStreetMap
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      // Add a marker at the initial location
      const marker = L.marker(mapConfig.center).addTo(map)
        .bindPopup("Nirmal's - 106 Occidental Ave, Seattle")
        .openPopup();

      // Add a click event to open Google Maps
      marker.on('click', () => {
        const googleMapsUrl = `https://www.google.com/maps?q=${mapConfig.center[0]},${mapConfig.center[1]}`;
        window.open(googleMapsUrl, '_blank');
      });

  } else {
      console.log("data-map attribute not found or mapSection not found. Skipping map logic.");
  }

  
});





