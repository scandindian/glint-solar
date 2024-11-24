import { useEffect, useState } from "react";
import { readFile } from "../utility";
import WaveMap from "./WaveMap";
import dataFile from "../data/waves_2019-01-01.nc";
import Loader from "./Loader";
import MapInfo from "./MapInfo";

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

  useEffect(() => {
    const fetchData = async () => {
      const { timeValues, reshapedWaveData } = await readFile(dataFile);

      setTimeOptions(timeValues);

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
    if (marker !== null) {
      setSelectedCoordinate({ lat: marker.lat, lon: marker.lon });
    }
  }, [marker]);

  return (
    <div>
      <MapInfo
        timeOptions={timeOptions}
        selectedTime={selectedTime}
        setSelectedTime={setSelectedTime}
        selectedCoordinate={selectedCoordinate}
        setSelectedCoordinate={setSelectedCoordinate}
        marker={marker}
        setMarker={setMarker}
        mapData={mapData}
      />
      {loading ? (
        <Loader />
      ) : (
        <WaveMap mapData={mapData} marker={marker} setMarker={setMarker} />
      )}
    </div>
  );
}

export default App;
