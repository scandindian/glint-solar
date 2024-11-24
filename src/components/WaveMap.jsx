import { useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import MapInteraction from "./MapInteraction";

const WaveMap = ({ mapData }) => {
  const [marker, setMarker] = useState(null);

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
      style={{ height: "90vh", width: "100vw" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MapInteraction
        coordinates={mapData}
        marker={marker}
        setMarker={setMarker}
      />
      {marker && (
        <CircleMarker center={[marker.lat, marker.lon]} radius={5} color="red">
          <Tooltip permanent>
            <span>Hmax: {marker.value.toFixed(2)}</span>
          </Tooltip>
        </CircleMarker>
      )}
    </MapContainer>
  );
};

export default WaveMap;
