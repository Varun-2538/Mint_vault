const { ethers } = require("ethers");
const axios = require("axios");

class DebugJsonRpcProvider extends ethers.providers.JsonRpcProvider {
  async send(method, params) {
    // Extract method if it's an object
    if (typeof method === 'object' && method.method) {
      params = method.params || [];
      method = method.method;
    }

    // Ensure method is a string
    if (typeof method !== 'string') {
      console.error('Invalid method:', method);
      throw new Error('Method must be a string');
    }

    try {
      // Ensure params is an array, default to empty array if not
      params = Array.isArray(params) ? params : [];
      
      // Manually construct the JSON-RPC payload
      const payload = {
        jsonrpc: "2.0",
        id: this._nextId++,
        method,
        params
      };
      
      console.log("Sending RPC Request:", payload);
      
      // Use axios for more detailed request logging
      const response = await axios.post(this.connection.url, payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log("RPC Response:", response.data);
      
      // Handle potential errors in the response
      if (response.data.error) {
        throw new Error(`RPC Error: ${response.data.error.message}`);
      }
      
      return response.data.result;
    } catch (error) {
      console.error("Detailed RPC Request Error:", error);
      throw error;
    }
  }

  // Optional: Add network name adjustment for better clarity
  async getNetwork() {
    const network = await super.getNetwork();
    if (network.chainId === 80002) {
      network.name = "Polygon Amoy";
    }
    return network;
  }
}

module.exports = { DebugJsonRpcProvider };