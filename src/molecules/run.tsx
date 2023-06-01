import { LatLngTuple } from "leaflet";
import { Marker, Polyline, Popup } from "react-leaflet";

interface Run {
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

const Run = ({ run }: { run: Run }) => {
  return (
    <>
      <Polyline positions={run.path[0] as LatLngTuple[]} />
      <Marker
        position={[
          run.path[0][run.path[0].length - 1][0],
          run.path[0][run.path[0].length - 1][1],
        ]}
        eventHandlers={{
          click: (e: any) => {
            console.log("marker clicked", e);
          },
        }}
      ></Marker>
    </>
  );
};

export default Run;
