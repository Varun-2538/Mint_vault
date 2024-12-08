import React, { useState } from "react";
import Navbar from "./NavBar";

const StakingComponent = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [stakingTokens, setStakingTokens] = useState(0);
  const [rewardTokens, setRewardTokens] = useState(0);
  const [balanceStaked, setBalanceStaked] = useState(0);
  const [rewardBalance, setRewardBalance] = useState(0);

  const handleStake = () => {
    // Logic for staking
    alert("Stake clicked!");
  };

  const handleWithdraw = () => {
    // Logic for withdrawal
    alert("Withdraw clicked!");
  };

  return (
    <>
      <Navbar />
      <div className="w-full min-h-screen flex justify-center items-center bg-lime-50 ">
        
        <div className="p-6  bg-white backdrop-blur-lg text-black rounded-xl shadow-xl  border-violet-600 border-2 glassmorphism shadow-blue-500/50  w-4/5">
          <h2 className="text-2xl font-semibold mb-4">Wallet Address</h2>
          <input
            type="text"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            placeholder="Enter your wallet address"
            className="w-full p-2 mb-6 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-lg font-semibold mb-1">Staking Tokens:</p>
              <p className="text-black">{stakingTokens}</p>
              <p className=" text-lg font-semibold mb-1 mt-4">Reward Tokens:</p>
              <p className="text-black">{rewardTokens}</p>
            </div>
            <div>
              <p className="text-lg font-semibold mb-1">Balance Staked:</p>
              <p className="text-black">{balanceStaked}</p>
              <p className="text-lg font-semibold mb-1 mt-4">Reward Balance:</p>
              <p className="text-black">{rewardBalance}</p>
            </div>
          </div>
          <div className="flex justify-end mt-6 space-x-4">
            <button
              onClick={handleStake}
              className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              Stake
            </button>
            <button
              onClick={handleWithdraw}
              className="px-4 py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
            >
              Withdraw
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default StakingComponent;
