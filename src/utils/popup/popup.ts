import maplibregl, { Map, MapMouseEvent } from "maplibre-gl";
import type { MapGeoJSONFeature } from "maplibre-gl";

export const setupPopupHandler = (map: Map) => {
  map.on("click", (e: MapMouseEvent) => {
    const features = map.queryRenderedFeatures(e.point);

    if (features.length === 0) return;

    const popupContent = buildPopupContent(features[0]);
    new maplibregl.Popup({ closeOnClick: true })
      .setLngLat(e.lngLat)
      .setHTML(popupContent)
      .addTo(map);
  });
};

const buildPopupContent = (feature: MapGeoJSONFeature): string => {
  const props = feature.properties ?? {};
  let html = `<table style="border-collapse:collapse;">`;

  for (const key in props) {
    if (Object.prototype.hasOwnProperty.call(props, key)) {
      const value = String(props[key]);

      const valueHTML =
        key.toLowerCase() === "link"
          ? `<a href="${escapeHTML(value)}" target="_blank" rel="noopener noreferrer">詳細</a>`
          : escapeHTML(value);

      html += `
        <tr>
          <td style="padding:4px; border:1px solid #ccc;"><strong>${escapeHTML(key)}</strong></td>
          <td style="padding:4px; border:1px solid #ccc;">${valueHTML}</td>
        </tr>`;
    }
  }

  html += `</table>`;
  return html;
};


const escapeHTML = (str: string): string =>
  str.replace(/[&<>"']/g, (char) => {
    const map: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return map[char];
  });
