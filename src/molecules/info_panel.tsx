import { useMemo } from "react";
import RunStat from "../atom/run_stat";
import { daysSinceStart, getRunsPerformedYesterday } from "../helpers/date";
import {
  approxTotalDistance,
  calculateTotalDistance,
  estimateDaysLeft,
} from "../helpers/distance_calculator";
import { RunData } from "./run";
import RunPopup from "./run_popup";

interface RunPopupProps {
  allRuns: RunData[];
  selectedRun?: RunData;
  onClose: () => void;
}

const InfoPanel = ({ selectedRun, onClose, allRuns }: RunPopupProps) => {
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
    <div className="absolute w-full bottom-0 z-50 flex flex-col-reverse sm:bottom-auto sm:top-32 sm:right-0 sm:flex-col sm:w-auto">
      <div className="box-border sm:pr-5 ">
        <div className="self-center w-full relative bg-white sm:drop-shadow-2xl p-3 sm:rounded-sm sm:w-[300px]">
          <div className="text-center">
            <span className="text-lg font-bold tracking-wide">
              #ProjectAfrica
            </span>
            <span className="text-lg italic">
              {" "}
              - Day {daysSinceStart() + 1}
            </span>
            <div className="flex justify-evenly pt-1">
              <a
                href="https://www.strava.com/athletes/22704023"
                className="text-sm font-light border-b-[1px] border-gray-400"
              >
                Strava
              </a>
              <a
                href="https://twitter.com/hardestgeezer"
                className="text-sm font-light border-b-[1px] border-gray-400"
              >
                Twitter
              </a>
              <a
                href="https://www.youtube.com/@hardestgeezer"
                className="text-sm font-light border-b-[1px] border-gray-400"
              >
                YouTube
              </a>
              <a
                href="https://www.patreon.com/HardestGeezer"
                className="text-sm font-light border-b-[1px] border-gray-400"
              >
                Patreon
              </a>
              <a
                href="https://github.com/OlliePugh/run-africa"
                className="text-sm font-light border-b-[1px] border-gray-400"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
        <div>
          <div
            className={`transition-all bg-white rounded-sm sm:mt-2 sm:drop-shadow-2xl p-4`}
          >
            <RunStat
              title="Yesterdays Distance"
              data={`${distanceYesterday} km`}
            />
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
            <RunStat
              title="Total Calories Burnt"
              data={caloriesBurnt.toString()}
            />
          </div>
        </div>
      </div>
      <div className="overflow-hidden sm:pr-5">
        <RunPopup run={selectedRun} onClose={onClose} />
      </div>
    </div>
  );
};

export default InfoPanel;
