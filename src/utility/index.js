import { NetCDFReader } from "netcdfjs";

export const readFile = async (dataFile) => {
  try {
    const response = await fetch(dataFile);
    if (!response.ok) {
      throw new Error("File not found or cannot be accessed");
    }
    const arrayBuffer = await response.arrayBuffer();
    const nc = new NetCDFReader(arrayBuffer);

    const dimensions = nc.dimensions;

    const variables = nc.variables.map((variable) => ({
      name: variable.name,
      dimensions: variable.dimensions,
      data: nc.getDataVariable(variable.name),
    }));

    return { dimensions, variables };
  } catch (error) {
    throw new Error(error);
  }
};
