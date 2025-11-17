import React from "react";
import "./Loading.scss";

type Props = {
  size?: number; // px
  color?: string;
  thickness?: number; // px
  className?: string;
};

export default function Loading({
  size = 40,
  color = "#2563eb",
  thickness = 4,
  className = "",
}: Props) {
  return (
    <div className="loading-container">
      <div
        className={`circle-loader ${className}`}
        style={
          {
            "--size": `${size}px`,
            "--color": color,
            "--thickness": `${thickness}px`,
          } as React.CSSProperties
        }
        role="status"
        aria-label="Loading"
      />
    </div>
  );
}
