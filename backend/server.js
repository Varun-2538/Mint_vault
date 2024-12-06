// Import required modules using ES Modules syntax
import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import crypto from 'crypto';
import { ethers } from 'ethers';

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
app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }));

// --------------------- Ethereum Smart Contract Configuration ---------------------

// Load environment variables for Ethereum
const RPC_URL = process.env.RPC_URL || "https://rpc-amoy.polygon.technology/"; // Replace with your desired RPC URL
const PRIVATE_KEY = process.env.PRIVATE_KEY || "your_private_key_here"; // Ensure this is securely stored
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || "0x1b675F19c627b85D6C486109A726C68410840934"; // Replace with your deployed contract address

// Contract ABI
const CONTRACT_ABI = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_usdtTokenAddress",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_trustedForwarder",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "sender",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            }
        ],
        "name": "Deposit",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            }
        ],
        "name": "Withdraw",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "depositUSDT",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "forwarder",
                "type": "address"
            }
        ],
        "name": "isTrustedForwarder",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "trustedForwarder",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "usdtToken",
        "outputs": [
            {
                "internalType": "contract IERC20",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "withdrawAllUSDT",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "withdrawUSDT",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

// Initialize Ethereum provider and wallet using Ethers.js v6 syntax
const provider = new ethers.JsonRpcProvider(RPC_URL); // Corrected for v6
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
app.post("/success", (req, res) => {
  console.log("Headers:", req.headers); // Debug headers
  console.log("Body (parsed):", req.body); // Debug parsed body

  const { txnid, amount, productinfo, firstname, email, status, hash } = req.body;

  if (!txnid || !amount || !productinfo || !firstname || !email || !status || !hash) {
      console.error("Missing required fields in callback data.");
      return res.status(400).send("Invalid callback data.");
  }

  const reverseHashString = `${PAYU_SALT}|${status}|||||||||||${email}|${firstname}|${productinfo}|${amount}|${txnid}|${PAYU_KEY}`;
  console.log("Reverse hash string:", reverseHashString);

  const calculatedHash = crypto.createHash("sha512").update(reverseHashString).digest("hex");
  console.log("Calculated hash:", calculatedHash);

  if (hash === calculatedHash) {
      console.log("Hash validation successful!");
      res.send("Payment successful and hash verified!");
  } else {
      console.error("Hash validation failed!");
      res.status(400).send("Hash validation failed.");
  }
});


/**
 * Endpoint to fetch recommended gas fees
 * GET /gasFees
 */
app.get("/gasFees", async (req, res) => {
    try {
        const feeData = await provider.getFeeData();
        const maxPriorityFeePerGas = feeData.maxPriorityFeePerGas
            ? ethers.formatUnits(feeData.maxPriorityFeePerGas, "gwei") // Updated for v6
            : "30"; // Default value if undefined
        const maxFeePerGas = feeData.maxFeePerGas
            ? ethers.formatUnits(feeData.maxFeePerGas, "gwei") // Updated for v6
            : "60"; // Default value if undefined

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
    const validVPAs = ["anything@payu", "9999999999@payu.in", "9630087918@pthdfc"];
    if (!validVPAs.includes(upi)) {
        return res.status(400).json({ valid: false, message: "Invalid UPI handle." });
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
    const { amount, productinfo, firstname, email, phone, vpa } = req.body;

    // Basic validation
    if (!amount || !productinfo || !firstname || !email || !phone || !vpa) {
        return res.status(400).json({ error: "Missing required payment fields." });
    }

    try {
        // Generate unique transaction ID
        const txnid = `txn_${Date.now()}`;

        // Hash calculation
        const hashString = `${PAYU_KEY}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|||||||||||${PAYU_SALT}`;
        const hash = crypto.createHash("sha512").update(hashString).digest("hex");

        console.log(`Hash generated: ${hash}`);

        // Payment form data
        const paymentData = {
            key: PAYU_KEY,
            txnid: txnid,
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
                    .map(([key, value]) => `<input type="hidden" name="${key}" value="${value}" />`)
                    .join("\n")}
                <input type="submit" value="Proceed to PayU" />
            </form>
        `;

        res.status(200).json({ formHtml });
    } catch (error) {
        console.error("Error initiating payment:", error);
        res.status(500).json({ error: "Failed to initiate payment." });
    }
});

/**
 * Success Callback Endpoint
 * POST /success
 */
app.post("/success", (req, res) => {
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);

  const { txnid, amount, productinfo, firstname, email, status, hash } = req.body;

  if (!txnid || !amount || !productinfo || !firstname || !email || !status || !hash) {
      console.error("Missing required fields in callback data.");
      return res.status(400).send("Invalid callback data.");
  }

  const reverseHashString = `${PAYU_SALT}|${status}|||||||||||${email}|${firstname}|${productinfo}|${amount}|${txnid}|${PAYU_KEY}`;
  console.log("Reverse hash string:", reverseHashString);

  const calculatedHash = crypto.createHash("sha512").update(reverseHashString).digest("hex");
  console.log("Calculated hash:", calculatedHash);

  if (hash === calculatedHash) {
      console.log("Hash validation successful!");
      res.send("Payment successful and hash verified!");
  } else {
      console.error("Hash validation failed!");
      res.status(400).send("Hash validation failed.");
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
