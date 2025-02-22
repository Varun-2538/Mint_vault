import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import CryptoWallet from "./components/crypto_wallet";
import ReadData from "./components/ReadData";
import { OktoProvider, BuildType } from "okto-sdk-react";
import WalletManager from "./components/WalletManager";
import { WalletProvider } from "./components/WalletContext"; // Import WalletProvider
import StakingComponent from "./components/StakingComponent";
import "./index.css";

const OKTO_CLIENT_API_KEY = process.env.REACT_APP_OKTO_CLIENT_API_KEY;

function App() {
  const [authToken, setAuthToken] = useState(null);

  // Logout handler
  const handleLogout = () => {
    console.log("User logged out.");
    setAuthToken(null); // Clear authentication state
  };

  return (
    <OktoProvider apiKey={OKTO_CLIENT_API_KEY} buildType={BuildType.SANDBOX}>
      <BrowserRouter>
        <div className="min-h-screen w-full">
          {/* Wrap Routes with WalletProvider to make it accessible throughout the app */}
          <WalletProvider>
            <Routes>
              <Route
                path="/"
                element={
                  <HomePage
                    authToken={authToken}
                    setAuthToken={setAuthToken}
                    handleLogout={handleLogout}
                  />
                }
              />
              <Route
                path="/CryptoWallet"
                element={
                  <CryptoWallet
                    authToken={authToken}
                    handleLogout={handleLogout}
                  />
                }
              />
              <Route
                path="/read-data"
                element={
                  <ReadData authToken={authToken} handleLogout={handleLogout} />
                }
              />
              <Route
                path="/wallet-manager"
                element={
                  <WalletManager
                    authToken={authToken}
                    handleLogout={handleLogout}
                  />
                }
              />
              <Route path="/staking" element={<StakingComponent />} />
            </Routes>
          </WalletProvider>
        </div>
      </BrowserRouter>
    </OktoProvider>
  );
}

export default App;
