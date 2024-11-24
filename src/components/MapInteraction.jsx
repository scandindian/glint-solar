import { useMapEvent } from "react-leaflet";
import { getClosestPoint } from "../utility";

const MapInteraction = ({ coordinates, marker, setMarker }) => {
  useMapEvent("click", (e) => {
    const { lat, lng } = e.latlng;

    // Find the closest point based on lat/lon
    const closestPoint = getClosestPoint(coordinates, lat, lng);

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
