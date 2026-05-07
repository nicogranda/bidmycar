import React, { useEffect, useState } from "react";
import "./SpeedometerLoader.css";

export default function SpeedometerLoader() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let v = 0;
    const i = setInterval(() => {
      v += Math.max(1, (100 - v) / 10);
      setProgress(v);
      if (v >= 100) clearInterval(i);
    }, 40);
    return () => clearInterval(i);
  }, []);

  const angle = -90 + (progress / 100) * 180;

  return (
    <div className="speedometer-overlay">
      <svg viewBox="0 0 300 300" className="speedometer-svg">
        <path
          d="M50 200 A100 100 0 0 1 250 200"
          className="speedometer-arc"
        />

<line
  x1="150"
  y1="200"   // centro de rotación
  x2="60"    // punta de la aguja al inicio horizontal
  y2="200"   // misma y para horizontal
  className="speedometer-needle"
  style={{
    // transform: `rotate(${angle}deg)`,
    transformOrigin: "150px 200px",
  }}
/>

        <circle cx="150" cy="200" r="10" className="speedometer-center" />
      </svg>
    </div>
  );
}
