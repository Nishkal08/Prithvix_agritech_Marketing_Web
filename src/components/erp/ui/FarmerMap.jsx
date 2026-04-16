import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';
import 'leaflet.heat';
import { farmers } from '../../../data/erp/farmers';

// Fix for default marker icons in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function FarmerMap({ view = 'cluster' }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const clusterGroup = useRef(null);
  const heatLayer = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map if it doesn't exist
    if (!mapInstance.current) {
      mapInstance.current = L.map(mapRef.current).setView([22.5, 78.5], 5);
      
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap'
      }).addTo(mapInstance.current);
    }

    const map = mapInstance.current;

    // Clear previous layers
    if (clusterGroup.current) {
      map.removeLayer(clusterGroup.current);
    }
    if (heatLayer.current) {
      map.removeLayer(heatLayer.current);
    }

    if (view === 'cluster') {
      clusterGroup.current = L.markerClusterGroup({
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true,
        maxClusterRadius: 50,
        iconCreateFunction: function(cluster) {
          const count = cluster.getChildCount();
          return L.divIcon({
            html: `<div class="bg-forest text-gold w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 border-gold shadow-lg">${count}</div>`,
            className: 'custom-cluster-icon',
            iconSize: L.point(32, 32)
          });
        }
      });

      farmers.forEach(f => {
        if (f.lat && f.lng) {
          const marker = L.marker([f.lat, f.lng])
            .bindPopup(`
              <div class="p-1">
                <p class="font-bold text-dark m-0">${f.name}</p>
                <p class="text-xs text-muted m-0">${f.village}</p>
                <p class="text-[10px] text-forest font-bold mt-1">Tier: ${f.loyaltyTier}</p>
              </div>
            `);
          clusterGroup.current.addLayer(marker);
        }
      });

      map.addLayer(clusterGroup.current);
      if (farmers.length > 0) {
        map.fitBounds(clusterGroup.current.getBounds(), { padding: [20, 20] });
      }
    } else if (view === 'heat') {
      const heatPoints = farmers
        .filter(f => f.lat && f.lng)
        .map(f => [f.lat, f.lng, (f.outstandingAmount || 0) / 10000]); // Use udhaar density as weight

      heatLayer.current = L.heatLayer(heatPoints, {
        radius: 25,
        blur: 15,
        maxZoom: 10,
        gradient: {
          0.4: 'green',
          0.6: 'yellow',
          0.8: 'orange',
          1.0: 'red'
        }
      }).addTo(map);

      if (heatPoints.length > 0) {
        map.setView([22.5, 78.5], 5);
      }
    }

    return () => {
      // Cleanup happens on component unmount
    };
  }, [view]);

  // Handle resizing
  useEffect(() => {
    const handleResize = () => {
      if (mapInstance.current) {
        mapInstance.current.invalidateSize();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden border border-[#E8E3DA]">
      <div ref={mapRef} className="w-full h-full z-0" />
      
      {/* Legend / Overlay */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg border border-[#E8E3DA] shadow-md z-[1000]">
        <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-2">Map Legend</p>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-forest border border-gold" />
            <span className="text-xs text-dark">Farmer Cluster</span>
          </div>
          {view === 'heat' && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500 blur-[1px]" />
              <span className="text-xs text-dark">High Udhaar Density</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
