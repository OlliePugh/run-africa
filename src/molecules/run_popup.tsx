import RunStat from "../atom/run_stat";
import { formatEpochToString } from "../helpers/date";
import { RunData } from "./run";
import CloseIcon from "./close.svg";

interface RunPopupProps {
  run?: RunData;
  onClose: () => void;
}

const RunPopup = ({ run, onClose }: RunPopupProps) => {
  return (
    <div
      className={`${
        !run ? "h-0" : "h-full"
      } transition-all mt-2 bg-white rounded-sm sm:drop-shadow-2xl p-4 ${
        run ? "translate-x-0 opacity-100" : "translate-x-64 opacity-0"
      }`}
    >
      <div className="flex justify-between align-middle">
        <p className={"text-xl"}>{run?.run_name ?? " "} </p>
        <img
          className="w-4 inline cursor-pointer"
          src={CloseIcon}
          alt="X"
          onClick={onClose}
        />
      </div>
      <hr />
      <RunStat
        title="Ran On"
        data={run?.date ? formatEpochToString(run!.date) : ""}
      />
      <hr />
      <RunStat title="Distance Ran" data={run?.distance} />
      <hr />
      <RunStat title="Time Taken" data={run?.elapsed_time} />
      <hr />
      <RunStat title="Moving Time" data={run?.moving_time} />
      <hr />
      <RunStat title="Calories Burned" data={run?.calories} />
      <div className="group m-1 rounded-sm bg-slate-200 p-1 transition-colors hover:bg-slate-500">
        <a
          href={run?.url}
          className="text-center"
          target="_blank"
          rel="noreferrer"
        >
          <p className="text-black transition-colors group-hover:text-white ">
            View on Strava
          </p>
        </a>
      </div>
    </div>
  );
};

export default RunPopup;
