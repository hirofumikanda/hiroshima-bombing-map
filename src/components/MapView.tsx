import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Protocol } from "pmtiles";
import * as turf from "@turf/turf";
import { setupPopupHandler } from "../utils/popup";

const center = turf.point([132.4553, 34.3956]);
const circle2km = turf.circle(center, 2, { units: "kilometers", steps: 64 });
const circle3km = turf.circle(center, 3, { units: "kilometers", steps: 64 });
circle2km.properties = {
  radius: "2km",
  type: "爆風",
  discription: "建物の全焼倒壊",
};
circle3km.properties = {
  radius: "3km",
  type: "熱線",
  discription: "火傷や家屋の自然発火",
};

const MapView = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [airphotoVisible, setAirphotoVisible] = useState(true); // ON/OFF 状態

  useEffect(() => {
    const protocol = new Protocol();
    maplibregl.addProtocol("pmtiles", protocol.tile);

    const map = new maplibregl.Map({
      container: mapContainerRef.current!,
      style: "styles/style.json",
      center: [132.4553, 34.3956],
      zoom: 13,
      minZoom: 10,
      hash: true,
    });

    mapRef.current = map;

    map.addControl(new maplibregl.NavigationControl(), "top-right");

    map.on("load", () => {
      map.addSource("blast-circles", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [circle2km, circle3km],
        },
      });

      map.addLayer({
        id: "circle-2km",
        type: "line",
        source: "blast-circles",
        paint: {
          "line-color": "#0000ff",
          "line-width": 5,
        },
        filter: ["==", ["get", "radius"], "2km"],
      });

      map.addLayer({
        id: "circle-2km-label",
        type: "symbol",
        source: "blast-circles",
        filter: ["==", ["get", "radius"], "2km"],
        layout: {
          "text-field": [
            "concat",
            ["get", "discription"],
            " (",
            ["get", "radius"],
            ")",
          ],
          "text-font": ["Noto Sans Regular"],
          "text-size": 16,
          "text-anchor": "center",
          "symbol-placement": "line",
        },
        paint: {
          "text-color": "#000000",
          "text-halo-color": "#ffffff",
          "text-halo-width": 2,
        },
      });

      map.addLayer({
        id: "circle-3km",
        type: "line",
        source: "blast-circles",
        paint: {
          "line-color": "#ff0000",
          "line-width": 5,
        },
        filter: ["==", ["get", "radius"], "3km"],
      });

      map.addLayer({
        id: "circle-3km-label",
        type: "symbol",
        source: "blast-circles",
        filter: ["==", ["get", "radius"], "3km"],
        layout: {
          "text-field": ["concat", ["get", "discription"], " (", ["get", "radius"], ")"],
          "text-font": ["Noto Sans Regular"],
          "text-size": 16,
          "text-anchor": "center",
          "symbol-placement": "line",
        },
        paint: {
          "text-color": "#000000",
          "text-halo-color": "#ffffff",
          "text-halo-width": 2,
        },
      });
    });

    setupPopupHandler(map);

    return () => {
      map.remove();
    };
  }, []);

  const handleToggleAirphoto = () => {
    const nextState = !airphotoVisible;
    setAirphotoVisible(nextState);

    const map = mapRef.current;
    if (!map) return;

    const airphotoLayerId = "airphoto";

    if (map.getLayer(airphotoLayerId)) {
      map.setLayoutProperty(
        airphotoLayerId,
        "visibility",
        nextState ? "visible" : "none"
      );
    }
  };

  return (
    <>
      {/* 地図 */}
      <div ref={mapContainerRef} style={{ width: "100%", height: "100vh" }} />

      {/* チェックボックスUIにゃ！ */}
      <div
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          background: "white",
          padding: "5px 10px",
          borderRadius: "8px",
          boxShadow: "0 0 5px gray",
          fontSize: "14px",
          zIndex: 1000,
        }}
      >
        <label>
          <input
            type="checkbox"
            checked={airphotoVisible}
            onChange={handleToggleAirphoto}
          />
          被爆前の空中写真を表示
        </label>
      </div>
    </>
  );
};

export default MapView;
