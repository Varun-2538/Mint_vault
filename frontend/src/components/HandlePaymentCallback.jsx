import { useEffect } from "react";
import axios from "axios";

function HandlePaymentCallback() {
    useEffect(() => {
        const handleCallback = async () => {
            try {
                const response = await axios.post("http://localhost:5000/success", {
                    // Pass any required payment callback data
                });

                if (response.data.success && response.data.redirectUrl) {
                    // Redirect the user to the provided URL
                    window.location.href = response.data.redirectUrl;
                } else {
                    console.error("Payment validation failed.");
                }
            } catch (error) {
                console.error("Error handling payment callback:", error);
            }
        };

        handleCallback();
    }, []);

    return <p>Processing payment...</p>;
}

export default HandlePaymentCallback;
