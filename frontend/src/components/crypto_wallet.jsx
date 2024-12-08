import React, { useEffect, useState } from 'react';

const CryptoWallet = () => {
  const [txHash, setTxHash] = useState(null);

  useEffect(() => {
    // Extract the txHash from the URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const txHashFromUrl = urlParams.get('txHash');
    
    if (txHashFromUrl) {
      setTxHash(txHashFromUrl);
    }
  }, []);

  if (!txHash) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <h1 className="text-2xl font-bold text-blue-500">Loading...</h1>
        <p className="text-lg text-gray-600">Transaction hash not found.</p>
      </div>
    );
  }

  // Customize the block explorer link based on the network (e.g., Polygon)
  const explorerUrl = `https://polygonscan.com/tx/${txHash}`; // For Polygon Network (you can change this to Etherscan for Ethereum)

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-3xl p-6">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-semibold text-green-600">Transaction Successful!</h1>
          <p className="text-lg text-gray-700">Your transaction has been successfully processed.</p>
        </div>

        <div className="mb-6">
          <table className="min-w-full table-auto text-gray-600">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th colSpan="2" className="py-2 px-4 text-lg font-semibold">Transaction Details</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-gray-200">
                <td className="py-2 px-4 font-semibold">Transaction Hash:</td>
                <td className="py-2 px-4">{txHash}</td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="py-2 px-4 font-semibold">Status:</td>
                <td className="py-2 px-4">Success</td> {/* Dynamic status could be added */}
              </tr>
              <tr className="border-t border-gray-200">
                <td className="py-2 px-4 font-semibold">Amount:</td>
                <td className="py-2 px-4">100 USDT</td> {/* Dynamic amount could be added */}
              </tr>
              <tr className="border-t border-gray-200">
                <td className="py-2 px-4 font-semibold">Product Info:</td>
                <td className="py-2 px-4">Crypto Withdrawal</td> {/* Dynamic product info */}
              </tr>
              <tr className="border-t border-gray-200">
                <td className="py-2 px-4 font-semibold">Email:</td>
                <td className="py-2 px-4">user@example.com</td> {/* Dynamic email */}
              </tr>
            </tbody>
          </table>
        </div>

        <div className="text-center mt-6">
          <h3 className="text-lg font-semibold text-gray-800">View Transaction on Explorer:</h3>
          <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none"
          >
            View Transaction on Explorer
          </a>
        </div>
      </div>
    </div>
  );
};

export default CryptoWallet;
