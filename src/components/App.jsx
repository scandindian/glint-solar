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
    long: 0,
  });
  const [timeOptions, setTimeOptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { timeValues, reshapedWaveData } = await readFile(dataFile);

      setTimeOptions(timeValues);
      setMapData(reshapedWaveData);
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div>
      <MapInfo
        timeOptions={timeOptions}
        selectedTime={selectedTime}
        setSelectedTime={setSelectedTime}
        selectedCoordinate={selectedCoordinate}
        setSelectedCoordinate={setSelectedCoordinate}
        maxWave={0}
      />
      {loading ? <Loader /> : <WaveMap mapData={mapData} />}
    </div>
  );
}

export default App;
