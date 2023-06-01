import { LatLngTuple } from "leaflet";
import { Marker, Polyline } from "react-leaflet";

export interface RunData {
  date: number;
  distance: string;
  moving_time: string;
  pace: string;
  elevation: string;
  calories: string;
  elapsed_time: string;
  url: string;
  run_name: string;
  path: number[][][];
}

interface RunProps {
  run: RunData;
  onClick: (runData: RunData) => void;
}

const Run = ({ run, onClick }: RunProps) => {
  return (
    <>
      <Polyline positions={run.path[0] as LatLngTuple[]} />
      <Marker
        position={[
          run.path[0][run.path[0].length - 1][0],
          run.path[0][run.path[0].length - 1][1],
        ]}
        eventHandlers={{
          click: (_) => {
            onClick(run);
          },
        }}
      ></Marker>
    </>
  );
};

export default Run;
