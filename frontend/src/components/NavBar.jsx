import React, { useState } from "react";
import CustomButton from "./CustomButton";
import { useWallet } from "./WalletContext";

export default function Navbar() {
  const [showNavbar, setShowNavbar] = useState(false);

  const { walletAddress, connectWallet } = useWallet();

  const handleShowNavbar = () => {
    setShowNavbar(!showNavbar);
  };

  const handleLogin = () => {
    // Add logic for login here
    console.log("Login button clicked");
  };

  return (
    <nav className="w-9/12 xl:w-11/12 2xl:w-9/12 z-50 h-16 rounded-[60px] px-6 py-4 xl:py-2 bg-white backdrop-blur-xl shadow-xl border-stone-50 border-1 mx-auto mt-4 mb-16 fixed left-1/2 -translate-x-1/2">
      <div className="flex justify-between items-center h-full">
        {/* Logo Section */}
        <div className="flex items-center">
          <a className="pl-4 font-extrabold text-2xl text-blue-700 font-serif">MV</a>
        </div>

        {/* Navigation Links */}
        <ul
          className={`flex items-center gap-8 ${
            showNavbar ? "active" : ""
          }`}
        >
          <li>
            <a
              className="font-medium text-lg cursor-pointer text-blue-700 hover:text-cyan-900"
              href="#"
            >
              Liquidity Pool
            </a>
          </li>
          <li>
            <a
              className="font-medium text-lg cursor-pointer text-blue-700 hover:text-cyan-900"
              href="#"
            >
              Staking
            </a>
          </li>
          <li>
            <CustomButton
              primaryText={walletAddress ? "Connected" : "Connect Wallet"}
              onClick={connectWallet}
            />
          </li>
          <li>
            <CustomButton
              primaryText="Login"
              onClick={handleLogin}
            />
          </li>
          <li>
            <div className="bg-divider h-2/3 mx-6 hidden max-[1024px]:hidden"></div>
          </li>
        </ul>
      </div>
    </nav>
  );
}
