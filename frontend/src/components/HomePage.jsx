import React from "react";
import { Routes, Route } from "react-router-dom";
import CryptoConverter from "./CryptoConverter";
import { WalletProvider } from "./WalletContext";
import Navbar from "./NavBar";
import Timeline from "./Timeline";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "./Card";
import { Link, ChartLine, SquarePercent } from 'lucide-react';
import { motion } from 'framer-motion';


function HomePage() {
     const cardDetails = [
    {
      title: 'Cross-Chain Flexibility',
      description: '',
      content:
        'Lend assets on Chain X and borrow on Chains Y, Z, and A with up to 80% liquidity.',
      icon: <Link className="h-8 w-8" />,
    },
    {
      title: 'Dynamic APY Optimization',
      description: '',
      content:
        'Experience interest rates that adjust based on pool liquidity for maximum returns.',
      icon: <SquarePercent className="h-8 w-8" />,
    },
    {
      title: 'Interactive APY Estimator',
      description: '',
      content:
        'Visualize and play with APY trends using our "Estimate APY" graphs for smarter decisions.',
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
                    <button
                        onClick={handleScroll}
                        className="absolute bottom-10 flex items-center justify-center group"
                        >
                        <span className="text-black text-lg mb-2">Scroll Down</span>
                        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-lg group-hover:bg-gray-200 transition">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-6 h-6 text-gray-800 group-hover:text-black transition"
                        >
                            <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 9l-7 7-7-7"
                            />
                        </svg>
                        </div>
                    </button>
                
                </div>
            
            </div>
          
        </div>
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
                        <CardDescription className="mt-10 text-lg text-black  text-app-violet">
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

        <div className="relative min-h-screen w-full bg-lime-50 overflow-hidden mt-36 ml-24 mr-24">
            <Timeline stages={content} />
        </div>

        <Routes>{/* Add routes if needed */}</Routes>
      </div>
    </WalletProvider>
  );
}

export default HomePage;