import React from "react";

export default function ScrollArrow() {
  const handleScroll = () => {
    const targetSection = document.getElementById("target-section");
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      onClick={handleScroll}
      className="flex items-center justify-center w-14 h-14 border-2 border-blue-500 rounded-full cursor-pointer hover:scale-110 transition-transform duration-300 ease-in-out"
    >
      {/* Downward Arrow */}
      <span className="block w-4 h-4 border-b-2 border-r-2 border-blue-500 transform rotate-45 translate-y-1"></span>
    </div>
  );
}
