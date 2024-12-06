import React, { useState } from "react";

export default function Navbar() {
  const [showNavbar, setShowNavbar] = useState(false);

  const handleShowNavbar = () => {
    setShowNavbar(!showNavbar);
  };

  return (
    <nav className="w-9/12 xl:w-11/12 2xl:w-9/12 z-50 h-16 rounded-[60px] px-6 py-4 xl:py-2 bg-slate-900 backdrop-blur-sm shadow-lg mx-auto mt-4 mb-16 fixed left-1/2 -translate-x-1/2">
      <div className="flex justify-between items-center h-full">
        {/* Logo Section */}
        <div className="flex items-center">
          <a className="pl-4 font-bold text-2xl text-white">Defy</a>
        </div>

        {/* Navigation Links */}
        <ul
          className={`flex items-center gap-8 ${
            showNavbar ? "active" : ""
          }`}
        >
          <li>
            <a
              className="font-medium text-base cursor-pointer text-gray-300 hover:text-white"
              href="#"
            >
              Quest
            </a>
          </li>
          <li>
            <a
              className="font-medium text-base cursor-pointer text-gray-300 hover:text-white"
              href="#"
            >
              Leaderboard
            </a>
          </li>
          <li>
            <a
              className="font-medium text-base cursor-pointer text-gray-300 hover:text-white"
              href="#"
            >
              FAQ
            </a>
          </li>
          <li>
            <div className="flex items-center cursor-pointer">
              <p className="font-medium text-base pr-1 text-gray-300 hover:text-white">
                Daily Rewards
              </p>
            </div>
          </li>
          <li>
            <div className="bg-divider h-2/3 mx-6 hidden max-[1024px]:hidden"></div>
          </li>
          <li>
            <div className="p-2 rounded-full bg-gray-800 bg-opacity-60 flex max-h-10 cursor-pointer">
              <p className="font-medium text-sm text-gray-300 hover:text-white">
                100 Coins
              </p>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  );
}
