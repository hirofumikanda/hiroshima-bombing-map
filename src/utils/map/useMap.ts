import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Protocol } from "pmtiles";
import { buildBlastFeatureCollection } from "./blastCircles";
import { addBlastLayers } from "./layers";
import { setupPopupHandler } from "../popup/popup";

const AIRPHOTO_SOURCE_ID = "airphoto-source";
const AIRPHOTO_LAYER_ID = "airphoto";

const ensureAirphotoExists = (map: maplibregl.Map, visible: boolean) => {
  if (!map.getSource(AIRPHOTO_SOURCE_ID)) {
    map.addSource(AIRPHOTO_SOURCE_ID, {
      type: "raster",
      tiles: ["/data/airphoto/{z}/{x}/{y}.png"],
      tileSize: 256,
    });
  }

  if (!map.getLayer(AIRPHOTO_LAYER_ID)) {
    map.addLayer({
      id: AIRPHOTO_LAYER_ID,
      type: "raster",
      source: AIRPHOTO_SOURCE_ID,
      layout: { visibility: visible ? "visible" : "none" },
    });
  } else {
    map.setLayoutProperty(
      AIRPHOTO_LAYER_ID,
      "visibility",
      visible ? "visible" : "none"
    );
  }
};

const useMap = (
  containerRef: React.RefObject<HTMLDivElement | null>,
  airphotoVisible: boolean
) => {
  const mapRef = useRef<maplibregl.Map | null>(null);
  const loadedRef = useRef(false);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    maplibregl.addProtocol("pmtiles", new Protocol().tile);

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: "styles/style.json",
      center: [132.4553, 34.3956],
      zoom: 14.8,
      minZoom: 10,
      hash: true,
    });

    mapRef.current = map;
    map.addControl(new maplibregl.NavigationControl(), "top-right");

    map.on("load", async () => {
      loadedRef.current = true;

      const blastData = buildBlastFeatureCollection();
      map.addSource("blast-circles", { type: "geojson", data: blastData });
      addBlastLayers(map);

      ensureAirphotoExists(map, airphotoVisible);

      const point_img = await map.loadImage("images/point.png");
      map.addImage("point", point_img.data);
    });

    setupPopupHandler(map);

    return () => {
      loadedRef.current = false;
      map.remove();
      mapRef.current = null;
    };
  }, [containerRef]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (loadedRef.current) {
      ensureAirphotoExists(map, airphotoVisible);
    } else {
      const onLoad = () => ensureAirphotoExists(map, airphotoVisible);
      map.once("load", onLoad);
      return () => {
        map.off("load", onLoad);
      };
    }
  }, [airphotoVisible]);

  return mapRef;
};

export default useMap;
