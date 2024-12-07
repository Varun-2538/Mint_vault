import React, { useState } from "react";
import { useOkto } from "okto-sdk-react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

const ReadData = ({ handleLogout }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [portfolioData, setPortfolioData] = useState(null);
  const [wallets, setWallets] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { authenticate, getUserDetails, getPortfolio, createWallet, logOut } = useOkto();
  const navigate = useNavigate();

  // Handle Google Login and Authentication
  const handleGoogleLogin = async (credentialResponse) => {
    setLoading(true);
    try {
      const idToken = credentialResponse.credential;
      console.log("Google ID Token received:", idToken);

      authenticate(idToken, async (authResponse, error) => {
        if (authResponse) {
          console.log("Okto Authentication successful:", authResponse);
          setAuthToken(authResponse.auth_token);

          // Automatically create a wallet after successful authentication
          try {
            const walletCreationResponse = await createWallet();
            console.log("Wallet created successfully:", walletCreationResponse);
            setWallets([walletCreationResponse]); // Store created wallet
          } catch (walletError) {
            console.error("Error creating wallet:", walletError);
            setError("Failed to create wallet. Please try again.");
          }
        } else if (error) {
          console.error("Okto Authentication error:", error);
          setError("Authentication failed. Please try again.");
        }
        setLoading(false);
      });
    } catch (loginError) {
      console.error("Google Login error:", loginError);
      setError("Google Login failed. Please try again.");
      setLoading(false);
    }
  };

  // Fetch user details
  const fetchUserDetails = async () => {
    try {
      console.log("Fetching user details...");
      const details = await getUserDetails();
      console.log("User details fetched:", details);
      setUserDetails(details);
    } catch (error) {
      console.error("Error fetching user details:", error);
      setError(`Failed to fetch user details: ${error.message}`);
    }
  };

  // Fetch portfolio data
  const fetchPortfolio = async () => {
    try {
      console.log("Fetching portfolio data...");
      const portfolio = await getPortfolio();
      console.log("Portfolio data fetched:", portfolio);
      setPortfolioData(portfolio);
    } catch (error) {
      console.error("Error fetching portfolio data:", error);
      setError(`Failed to fetch portfolio: ${error.message}`);
    }
  };

  // Logout functionality
  const logout = async () => {
    try {
      console.log("Logging out...");
      await logOut();
      handleLogout();
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
      setError(`Failed to log out: ${error.message}`);
    }
  };

  return (
    <div className="container mx-auto p-6">
      {!authToken ? (
        <div>
          <h2 className="mb-4">Login to Authenticate</h2>
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={(error) => {
              console.error("Google Login failed:", error);
              setError("Google Login failed. Please try again.");
            }}
          />
        </div>
      ) : (
        <div>
          <div className="flex space-x-4 mb-4">
            <button className="btn" onClick={fetchUserDetails}>
              View User Details
            </button>
            <button className="btn" onClick={fetchPortfolio}>
              View Portfolio
            </button>
            <button className="btn" onClick={logout}>
              Log Out
            </button>
          </div>
          {userDetails && (
            <div>
              <h2>User Details:</h2>
              <pre>{JSON.stringify(userDetails, null, 2)}</pre>
            </div>
          )}
          {portfolioData && (
            <div>
              <h2>Portfolio Data:</h2>
              <pre>{JSON.stringify(portfolioData, null, 2)}</pre>
            </div>
          )}
          {wallets && (
            <div>
              <h2>Wallets:</h2>
              <pre>{JSON.stringify(wallets, null, 2)}</pre>
            </div>
          )}
          {error && (
            <div className="text-red-500">
              <h2>Error:</h2>
              <p>{error}</p>
            </div>
          )}
        </div>
      )}
      {loading && <p>Loading...</p>}
    </div>
  );
};

export default ReadData;
