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
      content: 'Sign in with Google and get your wallet instantly with our seamless Okto SDK integration. No setup hassles, just start your crypto journey',
      icon: <Link className="h-8 w-8" />,
    },
    {
      title: 'Easy INR to Crypto Swaps',
      description: '',
      content: 'Deposit INR and instantly receive crypto from our secure liquidity pool. Fast, reliable, and user-focused for effortless trading.',
      icon: <SquarePercent className="h-8 w-8" />,
    },
    {
      title: 'Stake and Earn with MV Token',
      description: '',
      content: 'Grow your assets by staking MV tokens with annual growth rates. Swap them later with any token on our platform for maximum flexibility.',
      icon: <ChartLine className="h-8 w-8" />,
    },
  ];

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

  return (
    <WalletProvider>
      <div className="relative min-h-screen bg-lime-50 w-full overflow-hidden">
        <Navbar />

        {/* Add gap between Navbar and Main Content */}
        <div className="h-16 mt-48"></div>

        <div className="flex flex-col lg:flex-row items-center w-full px-6 lg:px-24">
          <div className="text-center lg:text-left lg:w-1/2">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Seamless UPI to Crypto
              <br />
              <span className="text-2xl lg:text-4xl text-blue-800">Powered by Okto SDK.</span>
            </h1>
            <p className="text-lg lg:text-xl text-violet-800">Convert, Stake, Prosper ⚡</p>
          </div>
          <div id="target-section" className="w-full lg:w-1/2 mt-10 lg:mt-0">
            <CryptoConverter />
          </div>
        </div>

        {/* Key Features Section */}
        <div
          className="relative w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mt-16 py-20 lg:py-32 px-8 lg:px-32"
        >
          <motion.section
            className="flex flex-col items-center justify-center gap-y-16"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <p className="text-3xl lg:text-5xl font-semibold text-app-purple border-b-2 border-dashed border-app-slate">
              Key Features
            </p>
            <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10" variants={containerVariants}>
              {cardDetails.map((card, index) => (
                <motion.div
                  key={index}
                  className="relative w-full h-auto"
                  variants={cardVariants}
                >
                  <Card className="relative rounded-xl shadow-md h-96 p-6">
                    <CardHeader>
                      <span className="absolute top-4 left-4 rounded-lg bg-white p-2">{card.icon}</span>
                      <CardTitle className="text-center font-bold mt-16 text-xl">{card.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center text-sm mt-6">{card.content}</CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>
        </div>

        <div className="px-6 lg:px-24 mt-24">
          <Timeline stages={[{ title: "Stage 1", description: "Details about stage 1" }]} />
        </div>

        <Footer />
      </div>
    </WalletProvider>
  );
}

export default HomePage;
