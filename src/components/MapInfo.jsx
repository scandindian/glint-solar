import styled from "styled-components";

const Container = styled.div`
  height: 10vh;
  display: flex;
  align-items: center;
  padding: 0 20px;
  justify-content: space-between;
  border-bottom: 1px solid #ddd;
`;

const InfoGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  label {
    font-size: 0.9rem;
    margin-bottom: 0.3rem;
    color: #555;
  }

  input,
  select {
    padding: 0.5rem;
    font-size: 0.9rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 150px;
  }
`;

const MapInfo = ({
  timeOptions,
  selectedTime,
  setSelectedTime,
  selectedCoordinate,
  setSelectedCoordinate,
  maxWave,
}) => {
  const handleLatChange = (e) => {
    setSelectedCoordinate({
      lat: e.target.value,
      long: selectedCoordinate.long,
    });
  };

  const handleLongChange = (e) => {
    setSelectedCoordinate({
      lat: selectedCoordinate.lat,
      long: e.target.value,
    });
  };

  const handleTimeChange = (e) => {
    setSelectedTime(e.target.value);
  };

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);

    const timeString = date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return timeString;
  };

  return (
    <Container>
      <InfoGroup>
        <label htmlFor="date">Date</label>
        <input id="date" type="date" value="2019-01-01" readOnly />
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
          value={selectedCoordinate.long}
          onChange={handleLongChange}
        />
      </InfoGroup>
      <InfoGroup>
        <label htmlFor="max-wave">Max Wave</label>
        <input id="max-wave" type="number" value={maxWave} readOnly />
      </InfoGroup>
    </Container>
  );
};

export default MapInfo;
