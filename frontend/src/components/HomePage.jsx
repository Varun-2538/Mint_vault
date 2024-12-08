import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Routes, Route } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import CryptoConverter from "./CryptoConverter";
import { WalletProvider } from "./WalletContext";
import { useOkto } from "okto-sdk-react";
import CustomButton from "./CustomButton";
import Navbar from "./NavBar";
import Timeline from "./Timeline";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "./Card";
import { Link, ChartLine, SquarePercent } from 'lucide-react';
import { useWallet } from "./WalletContext";
import { motion } from 'framer-motion';
import Footer from "./Footer";

function HomePage() {
  const { connectWallet, disconnectWallet, updateWalletAddress } = useWallet();
  const navigate = useNavigate();
  const { getUserDetails, authenticate, createWallet, logOut, showWidgetModal } = useOkto();
  const [authToken, setAuthToken] = useState(null);
  const [error, setError] = useState(null);
  const cardDetails = [
    {
      title: 'Instant Wallet Creation',
      description: '',
      content:
        'Sign in with Google and get your wallet instantly with our seamless Okto SDK integration. No setup hassles, just start your crypto journey',
      icon: <Link className="h-8 w-8" />,
    },
    {
      title: 'Easy INR to Crypto Swaps',
      description: '',
      content:
        'Deposit INR and instantly receive crypto from our secure liquidity pool. Fast, reliable, and user-focused for effortless trading.',
      icon: <SquarePercent className="h-8 w-8" />,
    },
    {
      title: 'Stake and Earn with MV Token',
      description: '',
      content:
        'Grow your assets by staking MV tokens with annual growth rates. Swap them later with any token on our platform for maximum flexibility.',
      icon: <ChartLine className="h-8 w-8" />,
    },
  ];

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.4,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 1 } },
  };

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

  const handleScroll = () => {
    const target = document.getElementById("target-section");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const handleModalClose = () => {
    setIsModalOpen(false);
    setModalContent(null); // Reset modal content
  };

  const openModal = (content) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  return (
    <WalletProvider>
      <div className="relative min-h-screen bg-lime-50 w-full overflow-hidden">
        {/* Main Content */}
        <div className="flex min-h-screen w-full pb-4">
          <Navbar />
          <div className="flex flex-col w-full mt-36 ml-24 mr-24">
            {/* Main Row Container */}
            <div className="flex w-full items-center justify-between">
              {/* Left-Aligned Header */}
              <div className="flex flex-col">
                <h1 className="text-6xl text-black font-bold mb-4">
                  <span className="mb-1 block">Seamless UPI to Crypto</span>
                  <span className="text-4xl mb-1 font-bold text-black">One Click, One Wallet – Powered by <span className="text-blue-800">Okto SDK .</span></span>
                  <br />
                  <span className="text-3xl font-bold text-violet-800 animate-slide">
                    Convert, Stake, Prosper⚡
                  </span>
                  
                </h1>
                
                
              </div>
              

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

        {/* Section with Key Features */}
        <div
          className="relative h-[80vh] w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 overflow-hidden mt-12 px-24"
        >
          <motion.section
            className="flex flex-col items-center justify-center gap-y-16 px-10 h-full"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <p className="text-5xl font-semibold border-b-2 border-dashed border-app-slate p-2 text-app-purple">
              Key Features
            </p>
            <motion.div
              className="flex items-center justify-center gap-x-10 flex-wrap"
              variants={containerVariants}
            >
              {cardDetails.map((card, index) => (
                <motion.div
                  key={index}
                  className="relative"
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }} // Animate when 20% of the card is in view
                >
                  <Card className="relative w-96 h-80 rounded-xl border-app-violet shadow-md border-r-4 border-b-4">
                    <CardHeader>
                      <span className="-mt-4 ml-4 absolute rounded-lg bg-white">{card.icon}</span>
                      <CardTitle className="text-xl text-center flex flex-col justify-center pt-8 font-bold text-blue-800">
                        {card.title}
                      </CardTitle>
                      <CardDescription className="mt-10 text-lg text-black text-app-violet">
                        {card.description}
                      </CardDescription>
                    </CardHeader>
                    <div className="mx-6 bg-app-charteuse h-48 rounded-xl">
                      <CardContent className="p-3 text-center flex flex-col text-lg text-black justify-center py-6">
                        <p>{card.content}</p>
                      </CardContent>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>
        </div>

        {/* Timeline Section */}
        <div className="relative min-h-screen justify-center items-center w-full bg-lime-50 overflow-hidden mt-36 ml-24 mr-24">
          <Timeline stages={content} />
        </div>

        <Routes>{/* Add routes if needed */}</Routes>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-96 max-w-full shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  {modalContent === "wallets" ? "Wallets" : "User Details"}
                </h2>
                <button
                  onClick={handleModalClose}
                  className="text-gray-500 hover:text-gray-700"
                >
                  &times;
                </button>
              </div>

              {/* Modal Content */}
              {modalContent === "wallets" && (
                <div>
                  <h3>Wallets:</h3>
                  {/* Add wallet details here */}
                </div>
              )}

              {modalContent === "userDetails" && (
                <div>
                  <h3>User Details:</h3>
                  {/* Add user details here */}
                </div>
              )}
            </div>
          </div>
        )}
        <Footer />
      </div>
    </WalletProvider>
  );
}

export default HomePage;
