import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useOkto } from "okto-sdk-react";
import CustomButton from "./CustomButton";
import { GoogleLogin } from "@react-oauth/google";
import { useWallet } from "./WalletContext";

export default function Navbar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [popoverContent, setPopoverContent] = useState(null);
  const [showPopover, setShowPopover] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [authToken, setAuthToken] = useState(null);

  const dropdownRef = useRef(null); // Ref for dropdown element
  const navigate = useNavigate();
  const { authenticate, createWallet, logOut, showWidgetModal, getUserDetails } = useOkto();
  const { updateWalletAddress, connectWallet, disconnectWallet } = useWallet();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Google Login Handler
  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const idToken = credentialResponse.credential; // Extract Google ID token
      authenticate(idToken, async (authResponse, error) => {
        if (authResponse) {
          console.log("Authentication successful:", authResponse);
          setAuthToken(authResponse.auth_token); // Set the authentication token

          // Fetch Wallet Address after login
          await fetchWalletAddress(); // Fetch wallet address for the user
          setError(null); // Clear any error state
        } else {
          console.error("Authentication failed:", error);
          setError("Failed to authenticate."); // Set error state
        }
      });
    } catch (err) {
      console.error("Error during login:", err);
      setError("Login failed."); // Handle any unexpected errors
    }
  };

  // Fetch Wallet Address
  const fetchWalletAddress = async () => {
    try {
      const walletData = await createWallet(); // Fetch the wallet
      if (walletData.wallets && walletData.wallets.length > 0) {
        const address = walletData.wallets[0].address;
        updateWalletAddress(address); // Update WalletContext
      } else {
        throw new Error("No wallet found");
      }
    } catch (error) {
      console.error("Error fetching wallet address:", error);
      setError("Failed to fetch wallet address.");
    }
  };

  // Logout Handler
  const handleLogout = async () => {
    try {
      await logOut();
      setAuthToken(null); // Clear authentication token
      updateWalletAddress(null); // Clear wallet address from context
      setError(null); // Clear error state
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
      setError("Failed to log out.");
    }
  };

  // Connect Wallet Handler
  const handleConnectWallet = async () => {
    try {
      await connectWallet(); // Trigger wallet connection
      console.log("Wallet connected");
    } catch (err) {
      console.error("Error connecting wallet:", err);
      setError("Failed to connect wallet.");
    }
  };

  // Disconnect Wallet Handler
  const handleDisconnectWallet = async () => {
    try {
      await disconnectWallet(); // Disconnect Ethereum wallet
      updateWalletAddress(null); // Clear wallet address from context
      console.log("Wallet disconnected");
    } catch (err) {
      console.error("Error disconnecting wallet:", err);
      setError("Failed to disconnect wallet.");
    }
  };

  // Automatically fetch wallet address if logged in via Google
  useEffect(() => {
    if (authToken) {
      fetchWalletAddress();
    }
  }, [authToken]);

  const fetchUserDetails = async () => {
    try {
      const details = await getUserDetails();
      return details;
    } catch (error) {
      throw new Error("Failed to fetch user details");
    }
  };

  const fetchWallets = async () => {
    try {
      const walletData = await createWallet();
      return walletData.wallets;
    } catch (error) {
      throw new Error("Failed to fetch wallets");
    }
  };

  const handleDropdownClick = async (content) => {
    setPopoverContent(null);
    setShowPopover(true);
    setLoading(true);
    setError(null);

    try {
      if (content === "User Details") {
        const userDetails = await fetchUserDetails();
        setPopoverContent({ type: "User Details", data: userDetails });
      } else if (content === "Wallet") {
        const wallets = await fetchWallets();
        setPopoverContent({ type: "Wallet", data: wallets });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <nav className="w-9/12 xl:w-11/12 2xl:w-9/12 z-50 h-16 rounded-[60px] px-6 py-4 xl:py-2 bg-white backdrop-blur-xl shadow-xl border-stone-50 border-1 mx-auto mt-4 mb-16 fixed left-1/2 -translate-x-1/2">
      <div className="flex justify-between items-center h-full">
        {/* Logo Section */}
        <div className="flex items-center">
          <a className="pl-4 font-extrabold text-2xl text-blue-700 font-serif">
            MV
          </a>
        </div>

        {/* Navigation Links */}
        <ul className="flex items-center gap-8">
          <li>
            {!authToken ? (
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => console.error("Google Login Failed")}
              />
            ) : (
              <CustomButton primaryText="Logout" onClick={handleLogout} />
            )}
          </li>
          <li>
            <CustomButton
              primaryText={!authToken ? "Connect Wallet" : "Disconnect Wallet"}
              onClick={!authToken ? handleConnectWallet : handleDisconnectWallet}
            />
          </li>
          <li>
            <a
              className="font-medium text-lg cursor-pointer text-blue-700 hover:text-cyan-900"
              href="#"
              onClick={() => navigate("/liquidity-pool")}
            >
              Liquidity Pool
            </a>
          </li>
          <li>
            <a
              className="font-medium text-lg cursor-pointer text-blue-700 hover:text-cyan-900"
              href="#"
              onClick={() => navigate("/staking")}
            >
              Staking
            </a>
          </li>

          {/* Manage Wallet Dropdown */}
          <li className="relative" ref={dropdownRef}>
            <CustomButton
              primaryText="Manage Wallet"
              onClick={(e) => {
                e.stopPropagation();
                setShowDropdown((prev) => !prev);
              }}
            />
            {showDropdown && (
              <ul className="absolute right-0 mt-2 w-48 bg-white backdrop-blur-md rounded-md shadow-lg border p-2 text-center">
                <li
                  className="p-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => handleDropdownClick("User Details")}
                >
                  User Details
                </li>
                <li
                  className="p-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => handleDropdownClick("Wallet")}
                >
                  Wallet
                </li>
              </ul>
            )}
          </li>
        </ul>
      </div>

      {/* Display Error */}
      {error && (
        <div style={{ color: "red", textAlign: "center", marginTop: "10px" }}>
          <p>{error}</p>
        </div>
      )}
    </nav>
  );
}
