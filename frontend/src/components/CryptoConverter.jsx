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
    const calculatedCryptoAmount = amount
      ? (parseFloat(amount) / rate).toFixed(6)
      : "";
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
    <div className="w-full max-w-md mx-auto p-4 sm:p-6 md:p-8 bg-black/30 backdrop-blur-lg text-white rounded-xl shadow-xl border border-white/10 glassmorphism shadow-blue-500/50 font-serif">
      <h1 className="text-2xl sm:text-3xl mb-4 font-bold text-white text-center">Buy Crypto with INR</h1>
      
      {/* INR Input Section */}
      <div className="mb-6 sm:mb-8 mt-6 sm:mt-12">
        <div className="flex items-center justify-between w-full pb-2">
          <input
            type="number"
            value={inrAmount}
            onChange={handleInrAmountChange}
            placeholder="Enter INR Amount"
            className="w-full bg-transparent border-none outline-none text-base sm:text-lg text-white [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none font-serif"
            step="any"
          />
          <p className="text-white text-xs sm:text-sm ml-4 sm:ml-24 font-serif">INR</p>
        </div>
      </div>

      {/* Result Section */}
      <p className="text-xl sm:text-2xl text-white mt-6 sm:mt-14 mb-4 text-center font-serif">You Receive</p>
      
      <div className="flex flex-col items-center mt-4 sm:mt-10">
        <div className="flex flex-col sm:flex-row items-center justify-between w-full space-y-4 sm:space-y-0 sm:space-x-4">
          {/* Crypto Amount */}
          <div className="flex items-center justify-center w-full sm:w-auto">
            <p
              className={`text-base sm:text-lg font-serif text-center ${
                cryptoAmount ? "text-white" : "text-gray-400"
              }`}
              style={{ minWidth: "150px" }}
            >
              {cryptoAmount || "Equivalent Exchange"}
            </p>
          </div>

          {/* Crypto Selection */}
          <div className="flex items-center justify-center w-full sm:w-auto">
            <div className="flex items-center">
              {cryptoOptions.find((option) => option.id === crypto)?.icon && (
                <img
                  src={cryptoOptions.find((option) => option.id === crypto).icon}
                  alt={crypto}
                  className="w-6 h-6 sm:w-8 sm:h-8 p-1 mr-2 sm:mr-4 rounded-full bg-white/40"
                />
              )}
              <select
                value={crypto}
                onChange={handleCryptoChange}
                className="appearance-none bg-black/30 text-white rounded-lg px-4 sm:px-6 py-2 sm:py-3 border border-blue-300/30 focus:border-blue-300/50 transition-colors duration-200 w-28 sm:w-36 text-sm sm:text-base font-serif"
              >
                {cryptoOptions.map((option) => (
                  <option key={option.id} value={option.id} className="font-serif">
                    {option.symbol}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Buy Now Button */}
      <div className="flex justify-center">
        <button className="mt-6 sm:mt-8 bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg font-serif text-sm sm:text-base transition-colors duration-200">
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default CryptoConverter;