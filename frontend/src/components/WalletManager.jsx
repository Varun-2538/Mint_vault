import React, { useState } from "react";
import { useOkto } from "okto-sdk-react";
import { useNavigate } from "react-router-dom";

const WalletManager = ({ authToken, handleLogout }) => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const [wallets, setWallets] = useState(null);
  const [error, setError] = useState(null);

  const { getUserDetails, createWallet, logOut } = useOkto();

  // Fetch User Details
  const fetchUserDetails = async () => {
    try {
      const details = await getUserDetails();
      setUserDetails(details);
    } catch (error) {
      setError(`Failed to fetch user details: ${error.message}`);
    }
  };

  // Create and Fetch Wallets
  const fetchWallets = async () => {
    try {
      const walletData = await createWallet();
      setWallets(walletData.wallets); // Assume `wallets` is the key in the response
    } catch (error) {
      setError(`Failed to fetch wallets: ${error.message}`);
    }
  };

  // Logout Handler
  const logout = async () => {
    try {
      await logOut();
      handleLogout();
      navigate("/");
    } catch (error) {
      setError(`Failed to log out: ${error.message}`);
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <button onClick={fetchUserDetails}>Fetch User Details</button>
      <button onClick={fetchWallets}>Fetch Wallets</button>
      <button onClick={logout}>Logout</button>

      {userDetails && (
        <div>
          <h3>User Details:</h3>
          <pre>{JSON.stringify(userDetails, null, 2)}</pre>
        </div>
      )}

      {wallets && (
        <div>
          <h3>Wallets:</h3>
          {wallets.map((wallet, index) => (
            <p key={index}>
              {wallet.network_name}: {wallet.address}
            </p>
          ))}
        </div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default WalletManager;
