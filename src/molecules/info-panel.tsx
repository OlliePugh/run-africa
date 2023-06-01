import { daysSinceStart } from "../helpers/date";
import { RunData } from "./run";
import RunPopup from "./run-popup";
import TotalStats from "./total-stats";

interface RunPopupProps {
  allRuns: RunData[];
  selectedRun?: RunData;
  onClose: () => void;
}

const InfoPanel = ({ selectedRun, onClose, allRuns }: RunPopupProps) => {
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
        <TotalStats allRuns={allRuns} />
      </div>
      <div className="overflow-hidden sm:pr-5">
        <RunPopup run={selectedRun} onClose={onClose} />
      </div>
    </div>
  );
};

export default InfoPanel;
