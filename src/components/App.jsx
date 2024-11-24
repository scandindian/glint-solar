import { useEffect, useState } from "react";
import styled from "styled-components";
import { readFile } from "../utility";
import WaveMap from "./WaveMap";
import dataFile from "../data/waves_2019-01-01.nc";
import Loader from "./Loader";
import MapInfo from "./MapInfo";

const AppContainer = styled.div`
  display: flex;
  height: 100vh;
`;

const Sidebar = styled.div`
  width: 15%;
  padding: 1rem;
  background-color: #f5f5f5;
  overflow-y: auto;
`;

const MainContent = styled.div`
  width: 85%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

function App() {
  const [mapData, setMapData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTime, setSelectedTime] = useState(0);
  const [selectedCoordinate, setSelectedCoordinate] = useState({
    lat: 0,
    lon: 0,
  });
  const [timeOptions, setTimeOptions] = useState([]);
  const [marker, setMarker] = useState(null);
  const [initialWaveData, setInitialWaveData] = useState([]);
  const [maxWaveValue, setMaxWaveValue] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const { timeValues, reshapedWaveData } = await readFile(dataFile);
      setTimeOptions(timeValues);

      setInitialWaveData(reshapedWaveData);

      if (selectedTime === 0) {
        setSelectedTime(timeValues[0]);
      }

      const selectedTimeData = reshapedWaveData.filter(
        (data) => data.time === selectedTime
      );

      setMapData(selectedTimeData);
      setLoading(false);
    };

    fetchData();
  }, [selectedTime]);

  useEffect(() => {
    if (initialWaveData.length > 0 && marker !== null) {
      const filteredData = initialWaveData.filter(
        (point) => point.lat === marker.lat && point.lon === marker.lon
      );

      const maxPoint = filteredData.reduce(
        (pointA, pointB) => (pointA.value > pointB.value ? pointA : pointB),
        filteredData[0]
      );

      setMaxWaveValue(maxPoint);
    }
  }, [marker, initialWaveData]);

  useEffect(() => {
    if (marker !== null) {
      const selectedMarker = mapData.find(
        (data) => data.lat === marker.lat && data.lon === marker.lon
      );
      setMarker(selectedMarker);
      setSelectedCoordinate({ lat: marker?.lat, lon: marker?.lon });
    }

    if (mapData.length > 0 && marker === null) {
      const selectedMarker = mapData.find(
        (data) => data.lat === 0 && data.lon === 0
      );
      setMarker(selectedMarker);
    }
  }, [mapData, marker]);

  return (
    <AppContainer>
      <Sidebar>
        <MapInfo
          timeOptions={timeOptions}
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
          selectedCoordinate={selectedCoordinate}
          setSelectedCoordinate={setSelectedCoordinate}
          maxWaveValue={maxWaveValue}
          marker={marker}
          setMarker={setMarker}
          mapData={mapData}
        />
      </Sidebar>
      <MainContent>
        {loading ? (
          <Loader />
        ) : (
          <WaveMap mapData={mapData} marker={marker} setMarker={setMarker} />
        )}
      </MainContent>
    </AppContainer>
  );
}

export default App;
