import React, { useState, useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useOkto } from "okto-sdk-react";
import { useWallet } from "./WalletContext";
import CustomButton from "./CustomButton";


export default function Navbar() {
  const [userDetails, setUserDetails] = useState(null);
  const [showNavbar, setShowNavbar] = useState(false);
  const [wallets, setWallets] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [modalContent, setModalContent] = useState(null); // Content to display in the modal


  const navigate = useNavigate();
  const { getUserDetails, authenticate, createWallet, logOut, showWidgetModal } = useOkto();
  const { updateWalletAddress, connectWallet, disconnectWallet } = useWallet();

  // Toggle Navbar visibility for mobile
  const handleShowNavbar = () => {
    setShowNavbar(!showNavbar);
  };

  // Google Login Handler
  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const idToken = credentialResponse.credential;
      authenticate(idToken, async (authResponse, error) => {
        if (authResponse) {
          console.log("Authentication successful:", authResponse);
          setAuthToken(authResponse.auth_token);

          // Fetch Wallet Address after login
          await fetchWalletAddress();
          setError(null);
        } else {
          console.error("Authentication failed:", error);
          setError("Failed to authenticate.");
        }
      });
    } catch (err) {
      console.error("Error during login:", err);
      setError("Login failed.");
    }
  };

  const fetchWallets = async () => {
    try {
      const walletData = await createWallet();
      setWallets(walletData.wallets); // Assume `wallets` is the key in the response
    } catch (error) {
      setError(`Failed to fetch wallets: ${error.message}`);
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
      setAuthToken(null);
      updateWalletAddress(null); // Clear wallet address from context
      setError(null);
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
      setError("Failed to log out.");
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

  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setModalContent(null); // Clear modal content when closed
  };

  const fetchUserDetails = async () => {
    try {
      console.log("Fetching user details...");
      const details = await getUserDetails();
      console.log("User details fetched:", details);
      setUserDetails(details);
      setModalContent("userDetails"); // Set content type for modal
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching user details:", error);
      setError(`Failed to fetch user details: ${error.message}`);
    }
  };

  // Automatically fetch wallet address if logged in via Google
  useEffect(() => {
    if (authToken) {
      fetchWalletAddress();
    }
  }, [authToken]);

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
              Home
            </a>
          </li>
          <li>
            <a
              className="font-medium text-lg cursor-pointer text-blue-700 hover:text-cyan-900"
              href="/liquidity-pool"
            >
              Liquidity Pool
            </a>
          </li>
          <li>
            <a
              className="font-medium text-lg cursor-pointer text-blue-700 hover:text-cyan-900"
              href="/staking"
            >
              Staking
            </a>
          </li>
          {/* Display Google Login or Logout Button */}
          
          {/* Connect Wallet Button */}
          <li>
            <CustomButton
              primaryText={!authToken ? "Connect Wallet" : "Disconnect Wallet"}
              onClick={!authToken ? connectWallet : handleDisconnectWallet}
            />
          </li>
          {/* Show Widget Button */}
          <li>
            <CustomButton
              primaryText="Widget"
              onClick={() => showWidgetModal()}
            />
          </li>
          {/* Link to Wallet Manager */}
          <li>
            <CustomButton
              primaryText="Manage Wallet"
              onClick={handleToggle}
            />
            {isOpen && (
              <div className="absolute mt-2 w-48 h-24 place-content-evenly bg-white/70 shadow-lg rounded-md ring-1 ring-gray-300 z-10">
                <ul className="text-black font-semibold text-2xl w-full text-center">
                  <li>
                    <button
                      onClick={fetchWallets}
                      className="block px-4 py-2 text-base font-bold hover:bg-gray-100 w-full"
                    >
                      Wallet Manager
                    </button>
                    
                  </li>
                  <li>
                    <button
                      onClick={fetchUserDetails}
                      className="block px-4 py-2 text-base font-bold hover:bg-gray-100 w-full"
                    >
                      User Details 
                    </button>
                    
                  </li>
                </ul>
              </div>
            )}
          </li>
          
        </ul>
      </div>
      {/* {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 max-w-full shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{modalContent === "wallets" ? "Wallets" : "User Details"}</h2>
              <button onClick={handleModalClose} className="text-gray-500 hover:text-gray-700">&times;</button>
            </div>

            
            {modalContent === "wallets" && wallets && (
              <div>
                <h3>Wallets:</h3>
                {wallets.map((wallet, index) => (
                  <p key={index}>
                    {wallet.network_name}: {wallet.address}
                  </p>
                ))}
              </div>
            )}

            {modalContent === "userDetails" && userDetails && (
              <div>
                <h3>User Details:</h3>
                <pre>{JSON.stringify(userDetails, null, 2)}</pre>
              </div>
            )}
          </div>
        </div>
      )} */}


      {/* Display Error */}
      {error && (
        <div style={{ color: "red", textAlign: "center", marginTop: "10px" }}>
          <p>{error}</p>
        </div>
      )}
    </nav>
  );
}
