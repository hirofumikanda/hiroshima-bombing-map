import { useRef, useState } from "react";
import useMap from "../utils/map/useMap";

const MapView = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [airphotoVisible, setAirphotoVisible] = useState(true);

  useMap(mapContainerRef, airphotoVisible);

  const handleToggleAirphoto = () => {
    setAirphotoVisible((prev) => !prev);
  };

  return (
    <>
      <div ref={mapContainerRef} style={{ width: "100%", height: "100vh" }} />
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
