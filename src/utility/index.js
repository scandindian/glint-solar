import { NetCDFReader } from "netcdfjs";
import ndarray from "ndarray";

// Function to fetch and read the NetCDF file
const fetchNetCDFFile = async (dataFile) => {
  const response = await fetch(dataFile);
  if (!response.ok) {
    throw new Error("File not found or cannot be accessed");
  }
  const arrayBuffer = await response.arrayBuffer();
  return new NetCDFReader(arrayBuffer);
};

// Function to extract variables from the NetCDF file
const extractVariables = (nc) => {
  return nc.variables.map((variable) => ({
    name: variable.name,
    dimensions: variable.dimensions,
    data: nc.getDataVariable(variable.name),
    attributes: variable.attributes.reduce((acc, attr) => {
      acc[attr.name] = attr.value;
      return acc;
    }, {}),
  }));
};

// Function to find a specific variable by name
const findVariableByName = (variables, name) => {
  return variables.find((v) => v.name === name);
};

// Function to handle time conversion
const convertTime = (timeVar) => {
  const timeUnits = timeVar.attributes.units;
  const [unit, reference] = timeUnits.split(" since ");
  const referenceDate = new Date(reference);

  return timeVar.data.map((t) => {
    const adjustedDate = new Date(referenceDate);
    if (unit === "seconds") {
      adjustedDate.setSeconds(referenceDate.getSeconds() + t);
    } else if (unit === "hours") {
      adjustedDate.setHours(referenceDate.getHours() + t);
    } else if (unit === "days") {
      adjustedDate.setDate(referenceDate.getDate() + t);
    }
    return adjustedDate.toISOString();
  });
};

// Function to reshape wave data
const reshapeWaveData = (
  hmaxArray,
  timeValues,
  latVar,
  lonVar,
  dimensions,
  scaleFactor,
  addOffset,
  fillValue
) => {
  const timeSize = dimensions.find((dim) => dim.name === "time").size;
  const latSize = dimensions.find((dim) => dim.name === "latitude").size;
  const lonSize = dimensions.find((dim) => dim.name === "longitude").size;

  const reshapedWaveData = [];
  for (let t = 0; t < timeSize; t++) {
    for (let lat = 0; lat < latSize; lat++) {
      for (let lon = 0; lon < lonSize; lon++) {
        let value = hmaxArray.get(t, lat, lon);

        // Apply corrections for scale, offset, and fill value
        if (value !== fillValue) {
          value = value * scaleFactor + addOffset;
        } else {
          value = null;
        }

        reshapedWaveData.push({
          time: timeValues[t],
          lat: latVar.data[lat],
          lon: lonVar.data[lon],
          value,
        });
      }
    }
  }
  return reshapedWaveData;
};

// Main function to process the file and return reshaped data
export const readFile = async (dataFile) => {
  try {
    const nc = await fetchNetCDFFile(dataFile);
    const dimensions = nc.dimensions;

    const variables = extractVariables(nc);

    const hmaxVar = findVariableByName(variables, "hmax");
    const latVar = findVariableByName(variables, "latitude");
    const lonVar = findVariableByName(variables, "longitude");
    const timeVar = findVariableByName(variables, "time");

    if (hmaxVar && latVar && lonVar && timeVar) {
      const timeValues = convertTime(timeVar);

      const timeSize = dimensions.find((dim) => dim.name === "time").size;
      const latSize = dimensions.find((dim) => dim.name === "latitude").size;
      const lonSize = dimensions.find((dim) => dim.name === "longitude").size;

      const hmaxArray = ndarray(hmaxVar.data, [timeSize, latSize, lonSize]);

      const scaleFactor = hmaxVar.attributes.scale_factor || 1;
      const addOffset = hmaxVar.attributes.add_offset || 0;
      const fillValue = hmaxVar.attributes._FillValue || null;

      const reshapedWaveData = reshapeWaveData(
        hmaxArray,
        timeValues,
        latVar,
        lonVar,
        dimensions,
        scaleFactor,
        addOffset,
        fillValue
      );

      return { timeValues, reshapedWaveData };
    } else {
      throw new Error(
        "Required variables (hmax, latitude, longitude, time) not found"
      );
    }
  } catch (error) {
    throw new Error(error.message);
  }
};
