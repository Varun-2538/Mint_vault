import Okto from "@okto/sdk";

const okto = new Okto({
  apiKey: process.env.REACT_APP_OKTO_CLIENT_API_KEY,
  environment: "production", // Use 'sandbox' for testing in a non-production environment
});

export default okto;
