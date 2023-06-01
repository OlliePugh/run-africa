import { useMemo } from "react";
import RunStat from "../atom/run-stat";
import {
  approxTotalDistance,
  calculateTotalDistance,
  estimateDaysLeft,
} from "../helpers/distance_calculator";
import { getRunsPerformedYesterday } from "../helpers/date";
import { RunData } from "./run";

const TotalStats = ({ allRuns }: { allRuns: RunData[] }) => {
  const totalDistance = useMemo(
    () => Math.round(calculateTotalDistance(allRuns)),
    [allRuns]
  );

  const distanceYesterday = useMemo(() => {
    const runsYesterday = getRunsPerformedYesterday(allRuns);
    return Math.round(calculateTotalDistance(runsYesterday));
  }, [allRuns]);

  const daysLeft = useMemo(() => {
    return estimateDaysLeft(allRuns, totalDistance);
  }, [allRuns, totalDistance]);

  const caloriesBurnt = useMemo(() => {
    return allRuns.reduce(
      (accumulator, currentValue) =>
        accumulator + parseInt(currentValue.calories.replaceAll(",", "")),
      0
    );
  }, [allRuns]);

  return (
    <div>
      <div
        className={`transition-all bg-white rounded-sm sm:mt-2 sm:drop-shadow-2xl p-4`}
      >
        <RunStat title="Yesterdays Distance" data={`${distanceYesterday} km`} />
        <hr />
        <RunStat title="Total Distance" data={`${totalDistance} km`} />
        <hr />
        <RunStat
          title="Est. Distance Remaining"
          data={`${approxTotalDistance - totalDistance}km`}
        />
        <hr />
        <RunStat title="Est. Days Remaining" data={daysLeft.toString()} />
        <hr />
        <RunStat title="Total Calories Burnt" data={caloriesBurnt.toString()} />
      </div>
    </div>
  );
};

export default TotalStats;
