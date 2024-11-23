import { useState, useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet/dist/leaflet.css";
import { readFile } from "../utility";
import dataFile from "../data/waves_2019-01-01.nc";

const WaveMap = () => {
  const [coordinates, setCoordinates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { dimensions, variables } = await readFile(dataFile);

      const hmaxVar = variables.find((v) => v.name === "hmax");
      const latVar = variables.find((v) => v.name === "latitude");
      const lonVar = variables.find((v) => v.name === "longitude");

      if (hmaxVar && latVar && lonVar) {
        const timeSize = dimensions.find((dim) => dim.name === "time").size;
        const latSize = dimensions.find((dim) => dim.name === "latitude").size;
        const lonSize = dimensions.find((dim) => dim.name === "longitude").size;

        const reshapedData = [];
        for (let t = 0; t < timeSize; t++) {
          for (let lat = 0; lat < latSize; lat++) {
            for (let lon = 0; lon < lonSize; lon++) {
              const index = t * latSize * lonSize + lat * lonSize + lon;
              const value = hmaxVar.data[index];
              if (value > -32767) {
                // Filter invalid data
                reshapedData.push({
                  lat: latVar.data[lat],
                  lon: lonVar.data[lon],
                  value,
                });
              }
            }
          }
        }

        // Limit data points to improve performance
        const limitedData = reshapedData.slice(0, 5000);
        console.log(limitedData);
        setCoordinates(limitedData);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {loading ? (
        <p>Loading map...</p>
      ) : (
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
          style={{ height: "100vh", width: "100vw" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <MarkerClusterGroup>
            {coordinates.map((point, index) => (
              <CircleMarker
                key={index}
                center={[point.lat, point.lon]}
                radius={5}
                color="blue"
              >
                <Tooltip>
                  <span>Hmax: {point.value.toFixed(2)}</span>
                </Tooltip>
              </CircleMarker>
            ))}
          </MarkerClusterGroup>
        </MapContainer>
      )}
    </div>
  );
};

export default WaveMap;
