import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useOkto } from "okto-sdk-react";
import { Link, ChartLine, SquarePercent } from 'lucide-react';
import { motion } from 'framer-motion';

import { WalletProvider, useWallet } from "./WalletContext";
import CryptoConverter from "./CryptoConverter";
import Navbar from "./NavBar";
import Timeline from "./Timeline";
import Footer from "./Footer";
import { Card, CardHeader, CardTitle, CardContent } from "./Card";

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
      <div className="relative min-h-screen bg-lime-50 w-full overflow-x-hidden">
        <Navbar />

        {/* Hero Section */}
        <div className="container mx-auto px-4 pt-24 pb-16 lg:pt-32 lg:pb-24">
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-12 lg:space-y-0 lg:space-x-12">
            <div className="text-center lg:text-left lg:w-1/2 space-y-6">
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold">
                Seamless UPI to Crypto
                <br />
                <span className="text-2xl lg:text-4xl text-blue-800">Powered by Okto SDK</span>
              </h1>
              <p className="text-lg lg:text-xl text-violet-800">Convert, Stake, Prosper ⚡</p>
            </div>
            <div className="w-full lg:w-1/2">
              <CryptoConverter />
            </div>
          </div>
        </div>

        {/* Key Features Section */}
        <div className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 py-16 lg:py-24">
          <motion.section 
            className="container mx-auto px-4"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <div className="text-center mb-16">
              <p className="text-3xl lg:text-5xl font-semibold text-white border-b-2 border-dashed border-white/30 pb-4 inline-block">
                Key Features
              </p>
            </div>
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
            >
              {cardDetails.map((card, index) => (
                <motion.div
                  key={index}
                  variants={cardVariants}
                  className="flex justify-center"
                >
                  <Card className="w-full max-w-sm h-full rounded-xl shadow-lg p-6 bg-white">
                    <CardHeader className="relative pb-4">
                      <div className="absolute -top-[80px] left-1/4 transform -translate-x-1/2 rounded-lg bg-blue-50 p-3">
                        {card.icon}
                      </div>
                      <CardTitle className="text-center font-bold mt-8 text-xl pt-4">
                        {card.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center text-sm mt-2">
                      {card.content}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>
        </div>

        {/* Timeline Section */}
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <Timeline stages={[{ title: "Stage 1", description: "Details about stage 1" }]} />
        </div>

        <Footer />
      </div>
    </WalletProvider>
  );
}

export default HomePage;