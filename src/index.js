import L from "leaflet";
import "./leaflet-text-label";

const map = L.map("app").setView([51, -114], 20);

L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png").addTo(map);
const a = L.leafletTextLabel().addTo(map);
