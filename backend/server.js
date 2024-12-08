
	// Import required modules using ES Modules syntax
	import dotenv from "dotenv";
	import express from "express";
	import bodyParser from "body-parser";
	import cors from "cors";
	import crypto from "crypto";
	import { ethers } from "ethers";
	import axios from "axios";

	// Initialize environment variables
	dotenv.config();

	// Initialize Express app
	const app = express();
	const PORT = process.env.PORT || 5000;

	// Middleware
	app.use(cors());
	app.use(bodyParser.json());

	// Add middleware to parse incoming requests
	app.use(bodyParser.json()); // Parse JSON payloads
	app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded form data

// Optional: Increase the body parser size limit if the payloads are large
app.use(bodyParser.urlencoded({ extended: true, limit: "1mb" }));

let cachedRates = null; // Cache for API response
let lastFetchTime = 0; // Time of the last fetch
const CACHE_DURATION = 60000; // Cache duration (60 seconds)

// Add more robust error handling in the crypto prices endpoint
app.get("/crypto-prices", async (req, res) => {
  const { ids } = req.query;

  if (!ids) {
    return res.status(400).json({ error: "Missing 'ids' parameter" });
  }

  try {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=inr`,
      {
        headers: {
          'User-Agent': 'YourAppName/1.0', // Good practice for API requests
          'Accept': 'application/json'
        },
        timeout: 5000 // 5 second timeout
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("Detailed error fetching crypto prices:", error.response?.data || error.message);
    res.status(500).json({ 
      error: "Failed to fetch crypto prices", 
      details: error.message 
    });
  }
});

	// --------------------- Ethereum Smart Contract Configuration ---------------------

	// Load environment variables for Ethereum
	const RPC_URL = process.env.RPC_URL || "https://rpc-amoy.polygon.technology/"; // Replace with your desired RPC URL
	const PRIVATE_KEY =
	process.env.PRIVATE_KEY ||
	; // Ensure this is securely stored
	const CONTRACT_ADDRESS =
	process.env.CONTRACT_ADDRESS || "0x1b675F19c627b85D6C486109A726C68410840934"; // Replace with your deployed contract address

	// Contract ABI
	const CONTRACT_ABI = [
	{
		inputs: [
		{
			internalType: "address",
			name: "_usdtTokenAddress",
			type: "address",
		},
		{
			internalType: "address",
			name: "_trustedForwarder",
			type: "address",
		},
		],
		stateMutability: "nonpayable",
		type: "constructor",
	},
	{
		anonymous: false,
		inputs: [
		{
			indexed: true,
			internalType: "address",
			name: "sender",
			type: "address",
		},
		{
			indexed: false,
			internalType: "uint256",
			name: "amount",
			type: "uint256",
		},
		{
			indexed: false,
			internalType: "uint256",
			name: "timestamp",
			type: "uint256",
		},
		],
		name: "Deposit",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
		{
			indexed: true,
			internalType: "address",
			name: "user",
			type: "address",
		},
		{
			indexed: false,
			internalType: "uint256",
			name: "amount",
			type: "uint256",
		},
		{
			indexed: false,
			internalType: "uint256",
			name: "timestamp",
			type: "uint256",
		},
		],
		name: "Withdraw",
		type: "event",
	},
	{
		inputs: [
		{
			internalType: "uint256",
			name: "amount",
			type: "uint256",
		},
		],
		name: "depositUSDT",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
		{
			internalType: "address",
			name: "forwarder",
			type: "address",
		},
		],
		name: "isTrustedForwarder",
		outputs: [
		{
			internalType: "bool",
			name: "",
			type: "bool",
		},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "owner",
		outputs: [
		{
			internalType: "address",
			name: "",
			type: "address",
		},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "trustedForwarder",
		outputs: [
		{
			internalType: "address",
			name: "",
			type: "address",
		},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "usdtToken",
		outputs: [
		{
			internalType: "contract IERC20",
			name: "",
			type: "address",
		},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "withdrawAllUSDT",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
		{
			internalType: "address",
			name: "user",
			type: "address",
		},
		{
			internalType: "uint256",
			name: "amount",
			type: "uint256",
		},
		],
		name: "withdrawUSDT",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	];

	// Initialize Ethereum provider and wallet using Ethers.js v6 syntax
	const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
	console.log("Ethereum provider initialized:", provider);

	const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
	const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);

	// --------------------- PayU Payment Configuration ---------------------

	// PayU Credentials from environment variables for security
	const PAYU_KEY = process.env.PAYU_KEY || "your_payu_key_here";
	const PAYU_SALT = process.env.PAYU_SALT || "your_payu_salt_here";

	// PayU URL
	const PAYU_URL = process.env.PAYU_URL || "https://test.payu.in/_payment"; // Use production URL for live

	// --------------------- Ethereum Endpoints ---------------------

	/**
	 * Endpoint to execute withdrawUSDT function
	 * POST /withdraw
	 * Body: { userAddress: string, amount: number | string }
	 */

	app.post("/withdraw", async (req, res) => {
		const { userAddress, amount } = req.body;
	
		// Validate input
		if (!userAddress || !amount) {
		return res
			.status(400)
			.json({ error: "Invalid input. Provide userAddress and amount." });
		}
	
		try {
		console.log(`Processing withdrawal for user: ${userAddress}, amount: ${amount}`);
	
		// Convert USDT amount to smallest unit (6 decimals for USDT)
		const parsedAmount = ethers.utils.parseUnits(amount.toString(), 6);
		console.log(`Converted USDT amount to smallest unit: ${parsedAmount.toString()}`);
	
		// Log the wallet address and the amount to be withdrawn
		console.log(`Wallet address: ${userAddress}`);
		console.log(`Amount to withdraw (in smallest unit): ${parsedAmount.toString()}`);
	
		// Fetch recommended gas fees
		const feeData = await provider.getFeeData();
	
		// Add additional buffer to the gas fees if needed (increase priority and max fees)
		const maxPriorityFeePerGas = feeData.maxPriorityFeePerGas.add(
			ethers.utils.parseUnits("30", "gwei") // Increase the fee here
		);
		const maxFeePerGas = feeData.maxFeePerGas.add(
			ethers.utils.parseUnits("60", "gwei") // Increase the fee here as well
		);
	
		const gasLimit = await contract.estimateGas.withdrawUSDT(
			userAddress,
			parsedAmount
		);
	
		// Send the transaction
		const tx = await contract.withdrawUSDT(userAddress, parsedAmount, {
			gasLimit: gasLimit.add(ethers.BigNumber.from("40000")),
			maxPriorityFeePerGas,
			maxFeePerGas,
		});
	
		console.log("Transaction sent:", tx.hash);
	
		const receipt = await tx.wait();
		console.log("Transaction confirmed:", receipt.transactionHash);
	
		res.status(200).json({ success: true, txHash: receipt.transactionHash });
		} catch (error) {
		console.error("Error processing withdrawal:", error.message);
		res.status(500).json({ error: "Failed to process withdrawal." });
		}
	});
	
	
	// Endpoint to fetch recommended gas fees
	app.get("/gasFees", async (req, res) => {
	try {
		const feeData = await provider.getFeeData();
		const maxPriorityFeePerGas = ethers.utils.formatUnits(
		feeData.maxPriorityFeePerGas,
		"gwei"
		);
		const maxFeePerGas = ethers.utils.formatUnits(feeData.maxFeePerGas, "gwei");

		res.status(200).json({ maxPriorityFeePerGas, maxFeePerGas });
	} catch (error) {
		console.error("Error fetching gas fees:", error);
		res.status(500).json({ error: "Failed to fetch gas fees." });
	}
	});
	

	// --------------------- PayU Payment Endpoints ---------------------

	/**
	 * VPA Validation Endpoint
	 * POST /validate-upi
	 * Body: { upi: string }
	 */
	app.post("/validate-upi", async (req, res) => {
	const { upi } = req.body;

	// Validate only allowed test VPAs in sandbox mode
	const validVPAs = [
		"anything@payu",
		"9999999999@payu.in",
		"9630087918@pthdfc",
	];
	if (!validVPAs.includes(upi)) {
		return res
		.status(400)
		.json({ valid: false, message: "Invalid UPI handle." });
	}

	console.log(`UPI handle validated: ${upi}`);
	res.json({ valid: true });
	});

	/**
	 * Payment Initiation Endpoint
	 * POST /initiate-payment
	 * Body: { amount, productinfo, firstname, email, phone, vpa }
	 */
	app.post("/initiate-payment", async (req, res) => {
		const { walletAddress, usdtAmount, amount, productinfo, firstname, email, phone, vpa } = req.body;
	
		// Basic validation
		if (!amount || !productinfo || !firstname || !email || !phone || !vpa) {
		return res.status(400).json({ error: "Missing required payment fields." });
		}
	
		// Generate unique transaction ID
		const txnid = `txn_${Date.now()}`;
	
		// Store wallet address and amount temporarily
		tempPaymentData[txnid] = { walletAddress, usdtAmount };
	
		// Generate the hash for PayU and initiate the payment
		const hashString = `${PAYU_KEY}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|||||||||||${PAYU_SALT}`;
		const hash = crypto.createHash("sha512").update(hashString).digest("hex");
	
		// Payment form data
		const paymentData = {
		key: PAYU_KEY,
		txnid: txnid,
		walletAddress: walletAddress,
		usdtAmount: usdtAmount,
		amount: amount,
		productinfo: productinfo,
		firstname: firstname,
		email: email,
		phone: phone,
		pg: "UPI",
		bankcode: "UPI",
		vpa: vpa,
		surl: process.env.SURL || "http://localhost:5000/success", // Success URL
		furl: process.env.FURL || "http://localhost:5000/failure", // Failure URL
		hash: hash,
		};
	
		console.log("Payment initiation request:", paymentData);
	
		// Generate HTML form to submit to PayU
		const formHtml = `
		<form action="${PAYU_URL}" method="post">
			${Object.entries(paymentData)
				.map(
				([key, value]) =>
					`<input type="hidden" name="${key}" value="${value}" />`
				)
				.join("\n")}
			<input type="submit" value="Proceed to PayU" />
		</form>
		`;
	
		res.status(200).json({ formHtml });
	});

	/**
	 * Success Callback Endpoint
	 * POST /success
	 */
	/**
 * Success Callback Endpoint
 * POST /success
 */
app.post("/success", async (req, res) => {
	try {
	  const { txnid, amount, productinfo, firstname, email, status, hash } = req.body;
  
	  // Hash validation
	  const reverseHashString = `${PAYU_SALT}|${status}|||||||||||${email}|${firstname}|${productinfo}|${amount}|${txnid}|${PAYU_KEY}`;
	  const calculatedHash = crypto
		.createHash("sha512")
		.update(reverseHashString)
		.digest("hex");
  
	  if (hash !== calculatedHash) {
		console.error("Hash validation failed!");
		return res.status(400).send("Hash validation failed.");
	  }
  
	  console.log("Hash validation successful!");
  
	  // Retrieve the preloaded wallet address and amount
	  const paymentData = tempPaymentData[txnid];
	  
	  if (!paymentData) {
		console.error(`No payment data found for txnid: ${txnid}`);
		return res.status(400).json({ error: "No payment data found for this transaction." });
	  }
  
	  // Log payment data for debugging
	  console.log("Payment data retrieved:", paymentData);
  
	  const { walletAddress, usdtAmount } = paymentData;
  
	  // Validate wallet address and amount
	  if (!walletAddress || !usdtAmount) {
		console.error("Invalid wallet address or USDT amount");
		return res.status(400).json({ error: "Invalid wallet address or amount." });
	  }
  
	  // Convert USDT amount to smallest unit (6 decimals for USDT)
	  const parsedAmount = ethers.utils.parseUnits(usdtAmount.toString(), 6);
	  console.log(`Parsed USDT amount: ${parsedAmount.toString()}`);
  
	  // Fetch recommended gas fees
	  const feeData = await provider.getFeeData();
  
	  // Add buffer to gas fees
	  const maxPriorityFeePerGas = feeData.maxPriorityFeePerGas.add(
		ethers.utils.parseUnits("30", "gwei")
	  );
	  const maxFeePerGas = feeData.maxFeePerGas.add(
		ethers.utils.parseUnits("60", "gwei")
	  );
  
	  // Get the current nonce for the wallet
	  const nonce = await wallet.getTransactionCount();
  
	  // Estimate gas limit
	  const gasLimit = await contract.estimateGas.withdrawUSDT(
		walletAddress,
		parsedAmount
	  );
  
	  // Log gas estimation details
	  console.log(`Gas Limit: ${gasLimit.toString()}`);
	  console.log(`Max Priority Fee Per Gas: ${maxPriorityFeePerGas.toString()}`);
	  console.log(`Max Fee Per Gas: ${maxFeePerGas.toString()}`);
	  console.log(`Nonce: ${nonce}`);
  
	  // Send the transaction with explicit gas settings
	  const tx = await contract.withdrawUSDT(walletAddress, parsedAmount, {
		gasLimit: gasLimit.add(ethers.BigNumber.from("40000")),
		maxPriorityFeePerGas,
		maxFeePerGas,
		nonce: nonce
	  });
  
	  console.log("Withdrawal transaction sent:", tx.hash);
  
	  // Wait for transaction confirmation
	  const receipt = await tx.wait();
	  console.log("Withdrawal successful, txHash:", receipt.transactionHash);
  
	  // Optional: Clear the temporary payment data after successful withdrawal
	  delete tempPaymentData[txnid];
  
	  return res.send(`
		<!DOCTYPE html>
		<html>
			<head>
				<title>Payment Successful</title>
				<script>
					function redirectToWallet() {
						const txHash = "${receipt.transactionHash}";
						setTimeout(() => {
							window.location.href = "http://localhost:3000/CryptoWallet?txHash=" + encodeURIComponent(txHash);
						}, 5000);
					}
				</script>
			</head>
			<body onload="redirectToWallet()">
				<h1>Payment Successful!</h1>
				<p>You will be redirected to your crypto withdrawal in 5 seconds...</p>
				<a id="walletLink" href="http://localhost:3000/CryptoWallet?txHash=${encodeURIComponent(receipt.transactionHash)}">Click here if you are not redirected</a>
			</body>
		</html>
	`);
  
	} catch (error) {
	  console.error("Error during withdrawal process:", error);
  
	  // Detailed error logging
	  console.error("Error Name:", error.name);
	  console.error("Error Message:", error.message);
	  
	  if (error.reason) {
		console.error("Error Reason:", error.reason);
	  }
	  
	  if (error.code) {
		console.error("Error Code:", error.code);
	  }
  
	  // Send error response
	  res.status(500).send(`
	  <!DOCTYPE html>
	  <html>
		<head>
		  <title>Payment Error</title>
		</head>
		<body>
		  <h1>Payment Processing Error</h1>
		  <p>We encountered an issue processing your withdrawal. Please contact support.</p>
		  <p>Error: ${error.message}</p>
		  <script>
			// Optional: Redirect back to frontend after a few seconds
			setTimeout(() => {
			  window.location.href = '/error-page';
			}, 3000);
		  </script>
		</body>
	  </html>
	  `);
	}
  });

	

	/**
	 * Failure Callback Endpoint
	 * POST /failure
	 */
	app.post("/failure", (req, res) => {
	console.log("Payment failure response received:", req.body);
	// You can add additional logic here, such as logging the failure or notifying the user
	res.send("Payment failed. Please try again.");
	});

	// --------------------- Start the Server ---------------------

	app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
	});

