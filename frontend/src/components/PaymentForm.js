import React, { useState, useEffect } from "react";
import axios from "axios";

const CryptoConverter = () => {
  const [crypto, setCrypto] = useState("ethereum");
  const [inrAmount, setInrAmount] = useState("");
  const [cryptoAmount, setCryptoAmount] = useState("");
  const [cryptoRates, setCryptoRates] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [upiId, setUpiId] = useState("");
  const [upiValidationStatus, setUpiValidationStatus] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const handleBuyNow = () => {
    setShowModal(true);
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
      <div className="flex justify-between items-center">
        <div>
          <p className="text-base text-gray-400">You Receive</p>
          <div className="flex items-center gap-4">
            <p className="text-4xl text-white h-16 flex items-center">
              {cryptoAmount}
            </p>
            <span className="text-gray-400">
              {cryptoOptions.find((option) => option.id === crypto)?.symbol}
            </span>
          </div>
        </div>
      </div>
      <button
        onClick={handleBuyNow}
        className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg w-36"
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
              className={`bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md ${
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
                className="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
              >
                Proceed
              </button>
            )}
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
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
