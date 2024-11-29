# Wave Inspector

## Overview
Wave Inspector is an interactive tool designed to inspect wave height data for a selected location and time. It allows users to view the max wave height at a given location, along with the highest wave recorded historically for comparison. For more details, visit [Glint Solar](https://glint-solar.netlify.app/).

## Key Features
- **Interactive Map**: Click on the map to view the max wave height for that location.
- **Manual Location Input**: Enter latitude and longitude to fetch wave data.
- **Time Selection**: Compare wave height changes over different time periods.
- **Max Wave Data**: View the highest wave recorded for the selected location.

## Code Analysis
- The app consists of two main components: `WaveMap` and `MapInfo`.
- Data processing is handled by utilities found in the `utility` folder.
- The data is stored in the `data` folder and currently displays data for `2019-01-01`.
- A flexible file path system allows future extension to load selected datasets.

## Technologies
- **ReactJS** with **Vite** for the frontend.
- **ndarray** for efficient data processing.
- **Leaflet** for map visualization.
- **netCDF4** to read `.nc` files containing the wave data.
- **styled-components** for styling.

## Challenges
- **Handling Large `.nc` Files**: Large datasets can impact UI performance, requiring careful optimization.
- **Max Wave Calculation**: Adjusting the max wave height based on scaling and offset factors required extensive research.
- **User Interface Design**: Displaying data in an intuitive and user-friendly manner.
- **Performance Optimization**: Ensuring minimal re-renders to maintain app performance.

## Run locally 
- `npm install` to install dependencies
- `npm run dev` to run the app

