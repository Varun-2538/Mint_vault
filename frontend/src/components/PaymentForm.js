import React, { useState } from "react";
import axios from "axios";

const PaymentForm = () => {
  const [formData, setFormData] = useState({
    amount: "",
    productinfo: "Buy USDT",
    firstname: "User",
    email: "user@example.com",
    phone: "9999999999",
    vpa: "",
  });
  const [error, setError] = useState(null);
  const [paymentForm, setPaymentForm] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setPaymentForm(null);

    try {
      // Validate UPI handle
      console.log("Validating UPI handle...");
      const validateResponse = await axios.post("http://localhost:5000/validate-upi", {
        upi: formData.vpa,
      });

      if (!validateResponse.data.valid) {
        setError("Invalid UPI handle.");
        return;
      }

      console.log("UPI handle validated. Initiating payment...");

      // Initiate payment
      const response = await axios.post("http://localhost:5000/initiate-payment", formData);
      setPaymentForm(response.data.formHtml);
    } catch (err) {
      console.error("Error during payment process:", err);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div>
      <h1>Pay with UPI</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Amount:</label>
          <input type="number" name="amount" value={formData.amount} onChange={handleChange} required />
        </div>
        <div>
          <label>UPI ID:</label>
          <input type="text" name="vpa" value={formData.vpa} onChange={handleChange} required />
        </div>
        <button type="submit">Pay</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {paymentForm && (
        <div
          dangerouslySetInnerHTML={{ __html: paymentForm }}
        ></div> /* Dynamically injects and submits the form */
      )}
    </div>
  );
};

export default PaymentForm;
