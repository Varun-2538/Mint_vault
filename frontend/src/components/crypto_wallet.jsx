import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

function CryptoWallet() {
  const [searchParams] = useSearchParams(); // To fetch txnid from query params
  const [txnid, setTxnid] = useState(null); // Transaction ID from URL
  const [transactionStatus, setTransactionStatus] = useState(null); // Fetched transaction details
  const [userAddress, setUserAddress] = useState(""); // User Ethereum address input
  const [amount, setAmount] = useState(""); // Amount input
  const [transactionHash, setTransactionHash] = useState(""); // Successful withdrawal transaction hash
  const [error, setError] = useState(""); // Error message
  const [loading, setLoading] = useState(false); // Loading state

  const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000"; // Backend URL

  // Fetch txnid from query params when the component loads
  useEffect(() => {
    const queryTxnid = searchParams.get("txnid");
    if (queryTxnid) {
      setTxnid(queryTxnid);
    }
  }, [searchParams]);

  // Fetch transaction details from the backend when txnid is available
  useEffect(() => {
    if (txnid) {
      const fetchTransactionStatus = async () => {
        try {
          const response = await axios.get(`${backendUrl}/api/transaction-status`, {
            params: { txnid },
          });
          setTransactionStatus(response.data); // Save transaction data
        } catch (err) {
          console.error("Error fetching transaction status:", err);
          setError(err.response?.data?.error || "Failed to fetch transaction status.");
        }
      };
      fetchTransactionStatus();
    }
  }, [txnid, backendUrl]);

  // Validate form inputs for withdrawal
  const validateInputs = () => {
    if (!userAddress || !amount) {
      setError("Please fill in both the user address and amount.");
      return false;
    }
    if (!/^0x[a-fA-F0-9]{40}$/.test(userAddress)) {
      setError("Invalid Ethereum address.");
      return false;
    }
    if (parseFloat(amount) <= 0) {
      setError("Amount must be greater than zero.");
      return false;
    }
    return true;
  };

  // Handle withdrawal form submission
  const handleWithdraw = async (e) => {
    e.preventDefault();
    setTransactionHash("");
    setError("");

    if (!validateInputs()) return;

    setLoading(true);
    try {
      const normalizedAmount = parseFloat(amount).toFixed(6); // Normalize to 6 decimals
      const response = await axios.post(`${backendUrl}/withdraw`, {
        userAddress,
        amount: normalizedAmount,
      });

      if (response.data.success) {
        setTransactionHash(response.data.txHash); // Save transaction hash
      } else {
        setError("Transaction failed. Check backend logs for details.");
      }
    } catch (err) {
      console.error("Error sending withdrawal request:", err);
      setError(err.response?.data?.error || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Crypto Wallet</h1>

      {txnid && transactionStatus ? (
        // Show transaction details if available
        <div style={{ marginBottom: "20px", border: "1px solid #ccc", padding: "15px" }}>
          <h2>Transaction Details</h2>
          <p><strong>Transaction ID:</strong> {transactionStatus.txnid}</p>
          <p><strong>Status:</strong> {transactionStatus.status}</p>
          <p><strong>Amount:</strong> {transactionStatus.amount}</p>
          <p><strong>Product Info:</strong> {transactionStatus.productinfo}</p>
          <p><strong>First Name:</strong> {transactionStatus.firstname}</p>
          <p><strong>Email:</strong> {transactionStatus.email}</p>
        </div>
      ) : txnid ? (
        // Show loading state if txnid is present but status is being fetched
        <p>Loading transaction details...</p>
      ) : null}

      <h2>USDT Withdrawal</h2>
      <form onSubmit={handleWithdraw} style={{ maxWidth: "400px", margin: "0 auto" }}>
        <div style={{ marginBottom: "15px" }}>
          <label>User Address:</label>
          <input
            type="text"
            value={userAddress}
            onChange={(e) => setUserAddress(e.target.value)}
            placeholder="0x..."
            style={{ width: "100%", padding: "10px", marginTop: "5px" }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>Amount (USDT):</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            style={{ width: "100%", padding: "10px", marginTop: "5px" }}
            step="0.000001"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: loading ? "#ccc" : "#4CAF50",
            color: "white",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Processing..." : "Withdraw"}
        </button>
      </form>

      {transactionHash && (
        <div style={{ marginTop: "20px", color: "green" }}>
          <h3>Transaction Successful</h3>
          <p>
            Transaction Hash:{" "}
            <a
              href={`https://amoy.polygonscan.com/tx/${transactionHash}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {transactionHash}
            </a>
          </p>
        </div>
      )}

      {error && (
        <div style={{ marginTop: "20px", color: "red" }}>
          <h3>Error</h3>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}

export default CryptoWallet;
