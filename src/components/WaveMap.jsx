import { MapContainer, TileLayer, CircleMarker } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import MapInteraction from "./MapInteraction";

const WaveMap = ({ mapData, marker, setMarker }) => {
  return (
    <MapContainer
      bounds={[
        [-90, -180],
        [90, 180],
      ]}
      center={[0, 0]}
      zoom={3}
      minZoom={3}
      maxBounds={[
        [-90, -180],
        [90, 180],
      ]}
      maxBoundsViscosity={1.0}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MapInteraction coordinates={mapData} setMarker={setMarker} />
      {marker && (
        <CircleMarker
          center={[marker.lat, marker.lon]}
          radius={5}
          color="red"
        />
      )}
    </MapContainer>
  );
};

export default WaveMap;
