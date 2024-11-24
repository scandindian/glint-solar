import styled from "styled-components";
import { getClosestPoint } from "../utility";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 20px;
  height: 100%;
  overflow-y: auto;
  background-color: #f5f5f5;
`;

const InfoGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;

  label {
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
    color: #555;
  }

  input,
  select {
    padding: 0.5rem;
    font-size: 0.9rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 100%;
  }

  span {
    font-size: 1rem;
    font-weight: bold;
    color: #333;
  }
`;

const MapInfo = ({
  timeOptions,
  selectedTime,
  setSelectedTime,
  selectedCoordinate,
  setSelectedCoordinate,
  maxWaveValue,
  marker,
  setMarker,
  mapData,
}) => {
  const updateMarkerPosition = (lat = null, lon = null) => {
    const markerLat = lat !== null ? lat : marker?.lat;
    const markerLon = lon !== null ? lon : marker?.lon;
    const closestPoint = getClosestPoint(mapData, markerLat, markerLon);

    if (
      marker &&
      Math.abs(marker.lat - closestPoint.lat) < 0.0001 &&
      Math.abs(marker.lon - closestPoint.lon) < 0.0001
    ) {
      setMarker(null);
    } else {
      setMarker(closestPoint);
    }
  };

  const handleLatChange = (e) => {
    setSelectedCoordinate({
      lat: e.target.value,
      lon: selectedCoordinate.lon,
    });
    updateMarkerPosition(e.target.value, null);
  };

  const handleLongChange = (e) => {
    setSelectedCoordinate({
      lat: selectedCoordinate.lat,
      lon: e.target.value,
    });
    updateMarkerPosition(null, e.target.value);
  };

  const handleTimeChange = (e) => {
    setSelectedTime(e.target.value);
  };

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Container>
      <InfoGroup>
        <label htmlFor="date">Date</label>
        <input id="date" type="date" value="2019-01-01" readOnly />
      </InfoGroup>
      <InfoGroup>
        <label htmlFor="max-wave">Max Wave</label>
        <span id="max-wave">{marker?.value?.toFixed(2) ?? "N/A"}</span>
      </InfoGroup>
      <InfoGroup>
        <label htmlFor="highest-max-wave">Highest Max Wave</label>
        <span id="highest-max-wave">
          {maxWaveValue
            ? `${maxWaveValue.value?.toFixed(2)} at ${formatTime(
                maxWaveValue?.time
              )}`
            : "N/A"}
        </span>
      </InfoGroup>
      <InfoGroup>
        <label htmlFor="lat">Latitude</label>
        <input
          id="lat"
          type="number"
          value={selectedCoordinate.lat}
          onChange={handleLatChange}
        />
      </InfoGroup>
      <InfoGroup>
        <label htmlFor="lon">Longitude</label>
        <input
          id="lon"
          type="number"
          value={selectedCoordinate.lon}
          onChange={handleLongChange}
        />
      </InfoGroup>
      <InfoGroup>
        <label htmlFor="time">Time</label>
        <select id="time" value={selectedTime} onChange={handleTimeChange}>
          {timeOptions.map((time) => (
            <option key={time} value={time}>
              {formatTime(time)}
            </option>
          ))}
        </select>
      </InfoGroup>
    </Container>
  );
};

export default MapInfo;
