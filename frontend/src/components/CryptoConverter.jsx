import React, { useState, useEffect } from "react";
import axios from "axios";

const CryptoConverter = () => {
  const [crypto, setCrypto] = useState("ethereum");
  const [inrAmount, setInrAmount] = useState("");
  const [cryptoAmount, setCryptoAmount] = useState("");
  const [cryptoRates, setCryptoRates] = useState({});

  const cryptoOptions = [
    {
      id: "ethereum",
      symbol: "ETH",
      icon: "https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=025",
    },
    {
      id: "matic-network",
      symbol: "MATIC",
      icon: "https://cryptologos.cc/logos/polygon-matic-logo.svg?v=025",
    },
    {
      id: "tether",
      symbol: "USDT",
      icon: "https://cryptologos.cc/logos/tether-usdt-logo.svg?v=025",
    },
  ];

  // Fetch live crypto rates in INR
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/simple/price?ids=${cryptoOptions
            .map((option) => option.id)
            .join(",")}&vs_currencies=inr`
        );
        setCryptoRates(response.data);
      } catch (error) {
        console.error("Error fetching crypto rates:", error);
      }
    };

    fetchRates();
    const interval = setInterval(fetchRates, 60000); // Update rates every minute
    return () => clearInterval(interval); // Clear interval on unmount
  }, []);

  // Handle INR amount change
  const handleInrAmountChange = (e) => {
    const amount = e.target.value;
    setInrAmount(amount);

    // Get current crypto rate
    const rate = cryptoRates[crypto]?.inr || 0;

    // Calculate crypto amount
    const calculatedCryptoAmount = amount ? (parseFloat(amount) / rate).toFixed(6) : "";
    setCryptoAmount(calculatedCryptoAmount);
  };

  // Handle crypto selection change
  const handleCryptoChange = (e) => {
    const selectedCrypto = e.target.value;
    setCrypto(selectedCrypto);

    // Recalculate crypto amount if INR amount exists
    if (inrAmount) {
      const rate = cryptoRates[selectedCrypto]?.inr || 0;
      const calculatedCryptoAmount = (parseFloat(inrAmount) / rate).toFixed(6);
      setCryptoAmount(calculatedCryptoAmount);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto h-[500px] p-8 bg-black/30 backdrop-blur-lg text-white rounded-xl shadow-xl border border-white/10 glassmorphism shadow-blue-500/50">

      <h1 className="text-3xl mb-4 font-bold text-white">Buy Crypto with INR</h1>
      <div className="flex justify-between items-center mb-8">
        
        <div>
          
          <div className="flex flex-row items-center">
            <input
              type="number"
              value={inrAmount}
              onChange={handleInrAmountChange}
              placeholder="Enter INR Amount"
              className="w-full bg-transparent border-none outline-none text-lg text-white [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              step="any"
            />
            <p className="text-white text-sm ml-2">INR</p>
          </div>
        </div>
        <div className="relative flex items-center gap-4 w-64">
          {cryptoOptions.find((option) => option.id === crypto)?.icon && (
            <img
              src={cryptoOptions.find((option) => option.id === crypto).icon}
              alt={crypto}
              className="w-8 h-8"
            />
          )}
          <select
            value={crypto}
            onChange={handleCryptoChange}
            className="appearance-none bg-black/30 text-white rounded-lg px-6 py-3 border border-blue-300/30 focus:border-blue-300/50 transition-colors duration-200 w-36"
          >
            {cryptoOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.symbol}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Result Section */}
      <div className="flex justify-between items-center">
        <div>
          <p className="text-base text-gray-400">You Receive</p>
          <div className="flex items-center gap-4">
            <p className="text-4xl text-white h-16 flex items-center">
              {cryptoAmount}
            </p>
            <span className="text-gray-400">
              {cryptoOptions.find(option => option.id === crypto)?.symbol}
            </span>
          </div>
        </div>
        
      </div>
      <button className="bg-pink-500 hover:bg-pink-600 pb-[-300px] text-white px-6 py-3 rounded-lg w-36">
          Buy Now
        </button>
    </div>
  );
};

export default CryptoConverter;