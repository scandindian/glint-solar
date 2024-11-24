import { useMapEvent } from "react-leaflet";
import { getClosestPoint } from "../utility";

const MapInteraction = ({ coordinates, setMarker }) => {
  useMapEvent("click", (e) => {
    const { lat, lng } = e.latlng;
    const closestPoint = getClosestPoint(coordinates, lat, lng);
    setMarker(closestPoint);
  });

  return null;
};

export default MapInteraction;
