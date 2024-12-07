import React from 'react';

const CustomButton = ({ primaryText, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 bg-purple-300 text-black rounded-lg border-2 border-purple-400 hover:border-purple-900 transition ease-in-out"
    >
      <span className="text-black font-semibold">{primaryText}</span>
    </button>
  );
};

export default CustomButton;
