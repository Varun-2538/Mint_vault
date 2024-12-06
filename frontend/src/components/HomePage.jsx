import React from "react";
import { Routes, Route } from "react-router-dom";
import { LampDemo } from "./Lamp";
import Bubble from "./Bubble";
import PaymentForm from "./PaymentForm";
import CryptoConverter from "./CryptoConverter";

function HomePage() {
  return (
    <div className="relative min-h-screen bg-gray-950 w-full overflow-hidden">
      {/* Floating Bubbles with Different SVGs */}
      

      {/* Main Content */}
      <div className="relative z-50">
        <LampDemo />
        <section id="target-section" className="min-h-screen text-white text-center flex items-center justify-center">
          {/* <h1 className="text-3xl">Hey there</h1> */}
          <CryptoConverter  />
        </section>
      </div>

      <Routes>{/* Add routes if needed */}</Routes>
    </div>
  );
}

export default HomePage;
