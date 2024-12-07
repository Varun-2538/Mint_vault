import React, { createContext, useState, useContext } from "react";

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState(null);

  // Connect Ethereum Wallet
  const connectWallet = async () => {
    console.log("Connect Wallet button clicked");
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        console.log("Wallet connected:", accounts[0]);
        setWalletAddress(accounts[0]);
      } catch (error) {
        console.error("Error connecting wallet:", error);
        alert("Failed to connect wallet. Please try again.");
      }
    } else {
      alert("MetaMask is not installed. Please install it to continue.");
    }
  };

  // Disconnect Wallet
  const disconnectWallet = async () => {
    console.log("Disconnect Wallet button clicked");
    setWalletAddress(null); // Reset wallet address to null
    alert("Wallet disconnected successfully.");
  };

  // Update Wallet Address (used by external components like Navbar)
  const updateWalletAddress = (address) => {
    setWalletAddress(address);
    console.log("Wallet address updated:", address);
  };

  return (
    <WalletContext.Provider
      value={{ walletAddress, connectWallet, disconnectWallet, updateWalletAddress }}
    >
      {children}
    </WalletContext.Provider>
  );
};

// Hook to use Wallet Context
export const useWallet = () => useContext(WalletContext);
