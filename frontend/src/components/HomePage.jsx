import React from "react";
import { Routes, Route } from "react-router-dom";
import StickyScroll from "./StickyScroll";
import CryptoConverter from "./CryptoConverter";
import { WalletProvider } from "./WalletContext";
import Navbar from "./NavBar";
import Timeline from "./Timeline";

function HomePage() {
    const content = [
    {
      title: "First Title",
      description: "First description",
      content: <div>First content</div>
    },
    {
      title: "Second Title",
      description: "Second description",
      content: <div>Second content</div>
    },
    {
      title: "First Title",
      description: "First description",
      content: <div>First content</div>
    },
    {
      title: "Second Title",
      description: "Second description",
      content: <div>Second content</div>
    },
];
  return (
    <WalletProvider>  {/* Wrap the entire component with WalletProvider */}
      <div className="relative min-h-screen bg-lime-50 w-full overflow-hidden">     
        {/* Main Content */}
        <div className="flex min-h-screen w-full pb-4">
          <Navbar />
          <div className="flex flex-col w-full mt-36 ml-24 mr-24 ">
            {/* Main Row Container */}
            <div className="flex w-full items-center justify-between">
              {/* Left-Aligned Header */}
              <h1 className="text-6xl text-black font-bold">
                <span className="mb-1 block">Seamless UPI to Crypto</span>
                <span className="text-4xl font-bold text-violet-800 animate-slide">
                  Convert, Stake, Prosper⚡
                </span>
              </h1>

              {/* Right-Aligned CryptoConverter */}
              <section
                id="target-section"
                className="text-white text-center flex flex-col items-end"
              >
                <CryptoConverter />
              </section>
            </div>
          </div>
        </div>
        <div className="relative min-h-screen w-full bg-lime-50 overflow-hidden mt-36 ml-24 mr-24">
            <Timeline stages={content} />
        </div>

        <Routes>{/* Add routes if needed */}</Routes>
      </div>
    </WalletProvider>
  );
}

export default HomePage;