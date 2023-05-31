import "./App.css";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, Marker, TileLayer, Polyline } from "react-leaflet";
import { LatLngTuple } from "leaflet";
import data from "./converted_gpx.json";

// delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

function App() {
  const position = [51.505, -0.09] as LatLngTuple;
  return (
    <MapContainer
      className="full-height-map"
      center={[10, 30]}
      zoom={3}
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
      {/* <Popup>
        A pretty CSS3 popup. <br /> Easily customizable.
      </Popup> */}
      {data.map((item) => {
        return (
          <>
            <Polyline
              positions={item.map((coords: number[]) => [coords[1], coords[0]])}
            />
            <Marker
              position={[item[item.length - 1][1], item[item.length - 1][0]]}
            />
          </>
        );
      })}
    </MapContainer>
  );
}

export default App;
