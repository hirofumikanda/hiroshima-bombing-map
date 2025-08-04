import maplibregl from "maplibre-gl";

export const addBlastLayers = (map: maplibregl.Map) => {
  map.addLayer({
    id: "circle-2km",
    type: "line",
    source: "blast-circles",
    paint: { "line-color": "#0000ff", "line-width": 5 },
    filter: ["==", ["get", "radius"], "2km"],
  });

  map.addLayer({
    id: "circle-2km-label",
    type: "symbol",
    source: "blast-circles",
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
    filter: ["==", ["get", "radius"], "2km"],
  });

  map.addLayer({
    id: "circle-3km",
    type: "line",
    source: "blast-circles",
    paint: { "line-color": "#ff0000", "line-width": 5 },
    filter: ["==", ["get", "radius"], "3km"],
  });

  map.addLayer({
    id: "circle-3km-label",
    type: "symbol",
    source: "blast-circles",
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
    filter: ["==", ["get", "radius"], "3km"],
  });
};

export const setLayerVisibility = (
  map: maplibregl.Map,
  layerId: string,
  visible: boolean
) => {
  if (!map.getLayer(layerId)) return;
  map.setLayoutProperty(layerId, "visibility", visible ? "visible" : "none");
};
