import "./App.css";
import "leaflet/dist/leaflet.css";
import L, { LatLngTuple } from "leaflet";
import { MapContainer, TileLayer } from "react-leaflet";
import data from "./all_runs.json";
import Run, { RunData } from "./molecules/run";
import { useState } from "react";
import InfoPanel from "./molecules/info_panel";

// @ts-ignore
const sortedData = data.sort((a, b) => b.date - a.date);

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

function App() {
  const [openMarker, setOpenMarker] = useState<RunData | undefined>();

  return (
    <>
      <InfoPanel run={openMarker} onClose={() => setOpenMarker(undefined)} />
      <MapContainer
        className="full-height-map z-10"
        center={sortedData[0].path[0][0] as LatLngTuple}
        zoom={8}
        minZoom={3}
        maxZoom={18}
        maxBounds={[
          [-85.06, -180],
          [85.06, 180],
        ]}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* I have no idea what TypeScripts issue is here (guessing just JSON import funkiness) */}
        {/* @ts-ignore */}
        {data.map((item) => (
          <Run key={item.url} run={item} onClick={setOpenMarker} />
        ))}
      </MapContainer>
    </>
  );
}

export default App;
