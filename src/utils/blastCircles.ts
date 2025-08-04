import * as turf from "@turf/turf";
import type { Feature, Polygon, Position } from "geojson";
import type { BlastCircleProps } from "./types";

const createCircle = (
  center: Position, // または Point の geometry を受けるなら center: Point
  radiusKm: number,
  props: BlastCircleProps
): Feature<Polygon, BlastCircleProps> => {
  const circle = turf.circle(center, radiusKm, { units: "kilometers", steps: 64 }) as Feature<Polygon, BlastCircleProps>;
  circle.properties = props;
  return circle;
};

export const buildBlastFeatureCollection = () => {
  const center: Position = [132.4553, 34.3956];

  return {
    type: "FeatureCollection" as const,
    features: [
      createCircle(center, 2, { radius: "2km", type: "爆風", discription: "建物の全焼倒壊" }),
      createCircle(center, 3, { radius: "3km", type: "熱線", discription: "火傷や家屋の自然発火" }),
    ],
  };
};
