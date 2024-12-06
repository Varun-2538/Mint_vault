import React from "react";

function Bubble({ icon, top, left, delay }) {
  return (
    <div
      className="absolute flex items-center justify-center rounded-full border-2 border-opacity-50"
      style={{
        top: top,
        left: left,
        width: "100px", // Bubble size
        height: "100px",
        animation: `float ${6 + Math.random() * 2}s ease-in-out infinite ${delay}`, // Floating animation
        borderColor: "rgba(0, 255, 255, 0.8)", // Neon border
        backgroundColor: "rgba(255, 255, 255, 0.05)", // Transparent background
        boxShadow: "0 0 10px rgba(0, 255, 255, 0.6), 0 0 20px rgba(0, 255, 255, 0.4)", // Neon glow
      }}
    >
      {/* Render the SVG icon */}
      {icon}
    </div>
  );
}

export default Bubble;
