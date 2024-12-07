import React, { useState, useEffect } from "react";
import axios from "axios";
import { useWallet } from "./WalletContext";

const CryptoConverter = () => {
  const { walletAddress } = useWallet();
  const [crypto, setCrypto] = useState("ethereum");
  const [inrAmount, setInrAmount] = useState("");
  const [cryptoAmount, setCryptoAmount] = useState("");
  const [cryptoRates, setCryptoRates] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [upiId, setUpiId] = useState("");
  const [upiValidationStatus, setUpiValidationStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const cryptoOptions = [
    // {
    //   id: "ethereum",
    //   symbol: "ETH",
    //   icon: "https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=025",
    // },
    // {
    //   id: "matic-network",
    //   symbol: "MATIC",
    //   icon: "https://cryptologos.cc/logos/polygon-matic-logo.svg?v=025",
    // },
    {
      id: "tether",
      symbol: "USDT",
      icon: "https://cryptologos.cc/logos/tether-usdt-logo.svg?v=025",
    },
  ];

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
    const interval = setInterval(fetchRates, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleInrAmountChange = (e) => {
    const amount = e.target.value;
    setInrAmount(amount);

    const rate = cryptoRates[crypto]?.inr || 0;

    // Calculate crypto amount
    const calculatedCryptoAmount = amount
      ? (parseFloat(amount) / rate).toFixed(6)
      : "";
    setCryptoAmount(calculatedCryptoAmount);
  };

  const handleCryptoChange = (e) => {
    const selectedCrypto = e.target.value;
    setCrypto(selectedCrypto);

    if (inrAmount) {
      const rate = cryptoRates[selectedCrypto]?.inr || 0;
      const calculatedCryptoAmount = (parseFloat(inrAmount) / rate).toFixed(6);
      setCryptoAmount(calculatedCryptoAmount);
    }
  };

  const validateUpi = async () => {
    if (!upiId) {
      alert("Please enter your UPI ID.");
      return;
    }

    setLoading(true);
    setUpiValidationStatus(null);

    try {
      const response = await axios.post("http://localhost:5000/validate-upi", {
        upi: upiId,
      });

      if (response.data.valid) {
        setUpiValidationStatus("Valid UPI ID");
      } else {
        setUpiValidationStatus("Invalid UPI ID");
      }
    } catch (error) {
      console.error("Error validating UPI ID:", error);
      setUpiValidationStatus("Error validating UPI ID");
    } finally {
      setLoading(false);
    }
  };

  const proceedToPayment = async () => {
    try {
      setLoading(true);
      const response = await axios.post("http://localhost:5000/initiate-payment", {
        amount: inrAmount,
        productinfo: "Crypto Purchase",
        firstname: "John Doe",
        email: "john.doe@example.com",
        phone: "9999999999",
        vpa: upiId,
      });

      const { formHtml } = response.data;

      const div = document.createElement("div");
      div.innerHTML = formHtml;
      document.body.appendChild(div);
      div.querySelector("form").submit();
    } catch (error) {
      console.error("Error initiating payment:", error);
      alert("Failed to initiate payment. Please try again.");
    } finally {
      setLoading(false);
      setShowModal(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 sm:p-6 md:p-8 bg-white backdrop-blur-lg text-black rounded-xl shadow-xl  border-violet-600 border-2 glassmorphism shadow-blue-500/50 font-serif">
      <h1 className="text-2xl sm:text-3xl mb-4 font-bold text-black text-center">
        Buy Crypto with INR
      </h1>

      {walletAddress && (
        <div className="mb-4">
          <label className="block text-sm text-black mb-2">Connected Wallet:</label>
          <input
            type="text"
            value={walletAddress}
            readOnly
            className="w-full bg-amber-50 border-fuchsia-300 border-2 text-black p-2 rounded-md"
          />
        </div>
      )}

      {/* INR Input Section */}
      <div className="mb-6 sm:mb-8 mt-6 sm:mt-12">
        <div className="flex items-center justify-between w-full pb-2">
          <input
            color="black"
            type="number"
            value={inrAmount}
            onChange={handleInrAmountChange}
            placeholder="Enter INR Amount"
            className="w-full bg-transparent border-none outline-none text-base sm:text-lg placeholder-black text-black [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none font-serif"
            step="any"
          />
          <p className="text-black text-base sm:text-lg ml-4 sm:ml-24 font-serif">INR</p>
        </div>
      </div>

      {/* Result Section */}
      <p className="text-xl sm:text-2xl text-black mt-6 sm:mt-14 mb-4 text-center font-serif">
        You Receive
      </p>

      <div className="flex flex-col items-center mt-4 sm:mt-10">
        <div className="flex flex-col sm:flex-row items-center justify-between w-full space-y-4 sm:space-y-0 sm:space-x-4">
          {/* Crypto Amount */}
          <div className="flex items-center justify-center w-full sm:w-auto">
            <p
              className={`text-base sm:text-lg font-serif text-center ${
                cryptoAmount ? "text-black" : "text-black"
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
                className="appearance-none bg-amber-50 text-black rounded-lg px-4 sm:px-6 py-2 sm:py-3 border border-fuchsia-500  transition-colors duration-200 w-28 sm:w-36 text-sm sm:text-base font-serif"
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

      <button
        onClick={() => setShowModal(true)}
        disabled={!walletAddress || !inrAmount}
        className={`bg-purple-300 text-black rounded-lg border-2 border-purple-400 hover:border-purple-900 transition ease-in-out px-6 py-3 w-36 mt-6 ${
          !walletAddress || !inrAmount ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        Buy Now
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Enter UPI ID</h2>
            <input
              type="text"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="Enter your UPI ID"
              className="w-full border border-gray-300 rounded-md p-2 mb-4 text-black"
            />
            <p className="mb-4">
              <strong>You will receive:</strong> {cryptoAmount}{" "}
              {cryptoOptions.find((option) => option.id === crypto)?.symbol}
            </p>
            <button
              onClick={validateUpi}
              disabled={loading}
              className={`bg-blue-500 hover:bg-blue-600 text-black px-4 py-2 rounded-md ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Validating..." : "Validate"}
            </button>
            {upiValidationStatus && (
              <p
                className={`mt-4 ${
                  upiValidationStatus === "Valid UPI ID"
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {upiValidationStatus}
              </p>
            )}
            {upiValidationStatus === "Valid UPI ID" && (
              <button
                onClick={proceedToPayment}
                className="mt-4 bg-green-500 hover:bg-green-600 text-black px-4 py-2 rounded-md"
              >
                Proceed
              </button>
            )}
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 bg-gray-500 hover:bg-gray-600 text-black px-4 py-2 rounded-md"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CryptoConverter;