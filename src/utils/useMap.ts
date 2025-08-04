import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { buildBlastFeatureCollection } from "./blastCircles";
import { addBlastLayers, setLayerVisibility } from "./layers";
import { setupPopupHandler } from "./popup";

const useMap = (
  containerRef: React.RefObject<HTMLDivElement | null>,
  airphotoVisible: boolean
) => {
  const mapRef = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: "styles/style.json",
      center: [132.4553, 34.3956],
      zoom: 13,
      minZoom: 10,
      hash: true,
    });

    mapRef.current = map;
    map.addControl(new maplibregl.NavigationControl(), "top-right");

    map.on("load", () => {
      const blastData = buildBlastFeatureCollection();
      map.addSource("blast-circles", { type: "geojson", data: blastData });
      addBlastLayers(map);
      setLayerVisibility(map, "airphoto", airphotoVisible);
    });

    setupPopupHandler(map);

    return () => map.remove();
  }, [containerRef, airphotoVisible]);

  return mapRef;
};

export default useMap;
