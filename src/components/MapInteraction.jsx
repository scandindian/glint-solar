import { useMapEvent } from "react-leaflet";

const MapInteraction = ({ coordinates, marker, setMarker }) => {
  useMapEvent("click", (e) => {
    const { lat, lng } = e.latlng;

    // Find the closest point based on lat/lon
    const closestPoint = coordinates.reduce((prev, curr) => {
      const prevDistance = Math.hypot(prev.lat - lat, prev.lon - lng);
      const currDistance = Math.hypot(curr.lat - lat, curr.lon - lng);
      return currDistance < prevDistance ? curr : prev;
    }, coordinates[0]);

    // Check if the clicked point is the same as the current marker
    if (
      marker &&
      Math.abs(marker.lat - closestPoint.lat) < 0.0001 &&
      Math.abs(marker.lon - closestPoint.lon) < 0.0001
    ) {
      setMarker(null);
    } else {
      setMarker(closestPoint);
    }
  });

  return null;
};

export default MapInteraction;
