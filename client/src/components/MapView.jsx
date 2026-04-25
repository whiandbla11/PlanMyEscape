import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const TYPE_COLORS = {
  monument: '#6366f1',
  nature: '#22c55e',
  food: '#f59e0b',
  museum: '#8b5cf6',
  beach: '#06b6d4',
  market: '#f97316',
  religious: '#ec4899',
  default: '#64748b',
};

function createColoredIcon(type) {
  const color = TYPE_COLORS[type] || TYPE_COLORS.default;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 28 36">
      <path d="M14 0C6.268 0 0 6.268 0 14c0 9.333 14 22 14 22S28 23.333 28 14C28 6.268 21.732 0 14 0z" fill="${color}"/>
      <circle cx="14" cy="14" r="6" fill="white"/>
    </svg>`;
  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [28, 36],
    iconAnchor: [14, 36],
    popupAnchor: [0, -36],
  });
}

function FitBounds({ places }) {
  const map = useMap();
  useEffect(() => {
    const valid = places.filter((p) => p.coordinates?.lat && p.coordinates?.lng);
    if (valid.length > 0) {
      const bounds = L.latLngBounds(valid.map((p) => [p.coordinates.lat, p.coordinates.lng]));
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [places, map]);
  return null;
}

export default function MapView({ days, activeDay }) {
  const places = activeDay !== null && activeDay !== undefined
    ? days[activeDay]?.places || []
    : days.flatMap((d) => d.places || []);

  const validPlaces = places.filter((p) => p.coordinates?.lat && p.coordinates?.lng);

  if (validPlaces.length === 0) return null;

  const center = [validPlaces[0].coordinates.lat, validPlaces[0].coordinates.lng];

  return (
    <div className="h-80 rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700">
      <MapContainer center={center} zoom={13} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds places={validPlaces} />
        {validPlaces.map((place, i) => (
          <Marker
            key={i}
            position={[place.coordinates.lat, place.coordinates.lng]}
            icon={createColoredIcon(place.type)}
          >
            <Popup>
              <div className="min-w-[140px]">
                <p className="font-semibold text-slate-800 text-sm">{place.name}</p>
                <p className="text-xs text-slate-500 mt-1">{place.duration}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
