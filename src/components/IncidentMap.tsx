import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { GALVESTON_CENTER, Incident } from '../lib/utils';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in React Leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

function MapController({ center }: { center: [number, number] }) {
  const map = useMap();
  map.setView(center);
  return null;
}

export default function IncidentMap({ incidents }: { incidents: Incident[] }) {
  return (
    <MapContainer 
      center={GALVESTON_CENTER} 
      zoom={12} 
      className="w-full h-full bg-[#1a1a1a]"
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      {incidents.map(incident => (
        <Marker 
          key={incident.id} 
          position={[incident.location.lat, incident.location.lng]}
        >
          <Popup className="font-sans text-sm">
            <div className="font-bold">{incident.title}</div>
            <div className="text-xs mt-1">{incident.description}</div>
            <div className="text-xs text-gray-500 mt-1">
              {new Date(incident.timestamp).toLocaleTimeString()}
            </div>
            <a 
              href={`https://www.google.com/maps/dir/?api=1&destination=${incident.location.lat},${incident.location.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 block w-full text-center bg-blue-600 hover:bg-blue-700 text-white text-xs py-1 rounded transition-colors"
            >
              NAVIGATE TO SCENE
            </a>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
