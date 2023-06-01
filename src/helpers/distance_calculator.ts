// Assuming you have the sorted array of RunData objects (runDataArray)

import { RunData } from "../molecules/run";

export const calculateTotalDistance = (runs: RunData[]) => {
  let totalDistance = 0;

  // Iterate over the runDataArray and calculate the distance for each run
  runs.forEach((runData) => {
    const path = runData.path;
    let distance = 0;

    // Iterate over each set of latitude-longitude points in the path
    path.forEach((coordinates) => {
      for (let i = 1; i < coordinates.length; i++) {
        const [lat1, lon1] = coordinates[i - 1];
        const [lat2, lon2] = coordinates[i];
        distance += calculateDistance(lat1, lon1, lat2, lon2);
      }
    });

    totalDistance += distance;
  });

  return totalDistance;
};

// Function to calculate the distance between two latitude-longitude points using the Haversine formula
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
  const earthRadius = 6371; // Radius of the earth in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = earthRadius * c;
  return distance;
};

export const estimateDaysLeft = (runs: RunData[], currentDistance: number) => {
  const remainingDistance = approxTotalDistance - currentDistance;

  if (remainingDistance <= 0) {
    return 0; // Already reached the full length
  }

  const uniqueDays = new Set(runs.map((run) => run.date));

  const averageDistancePerDay = currentDistance / uniqueDays.size;
  const estimatedDaysLeft = remainingDistance / averageDistancePerDay;

  return Math.ceil(estimatedDaysLeft);
};

export const approxTotalDistance = 15190.2;
