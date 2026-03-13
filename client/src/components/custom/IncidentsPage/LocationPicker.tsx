import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import axios from "axios";

interface Props {
  latitude?: number | null;
  longitude?: number | null;
  onLocationSelect: (lat: number, lng: number, name?: string) => void;
}

function MapUpdater({
  latitude,
  longitude,
}: {
  latitude?: number | null;
  longitude?: number | null;
}) {
  const map = useMap();

  if (latitude && longitude) {
    map.setView([latitude, longitude], 16);
  }

  return null;
}

function MapClickHandler({ onLocationSelect }: Props) {
  useMapEvents({
    async click(e) {
      const { lat, lng } = e.latlng;

      const res = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );

      onLocationSelect(lat, lng, res.data.display_name);
    },
  });

  return null;
}

export default function LocationPicker({
  latitude,
  longitude,
  onLocationSelect,
}: Props) {
  const markerPosition =
    latitude && longitude ? ([latitude, longitude] as [number, number]) : null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragEnd = async (e: any) => {
    const marker = e.target;
    const position = marker.getLatLng();

    const lat = position.lat;
    const lng = position.lng;

    const res = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
    );

    onLocationSelect(lat, lng, res.data.display_name);
  };

  return (
    <MapContainer
      center={markerPosition ?? [5.6037, -0.187]}
      zoom={13}
      style={{ height: "270px", width: "100%" }}
    >
      <TileLayer
        attribution="OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapUpdater latitude={latitude} longitude={longitude} />

      <MapClickHandler onLocationSelect={onLocationSelect} />

      {markerPosition && (
        <Marker
          position={markerPosition}
          draggable
          eventHandlers={{
            dragend: handleDragEnd,
          }}
        />
      )}
    </MapContainer>
  );
}