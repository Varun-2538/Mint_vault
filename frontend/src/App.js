import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import CryptoWallet from "./components/crypto_wallet";
import "./index.css";
import HandlePaymentCallback from "./components/HandlePaymentCallback"; // Adjust path as necessary

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen w-full">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/callback" element={<HandlePaymentCallback />} />
          <Route path="/CryptoWallet" element={<CryptoWallet />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
