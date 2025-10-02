import React, { useState, useEffect } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";

const CardForm = ({ clientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);

    const { setupIntent, error } = await stripe.confirmCardSetup(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: { name: "Milagros" },
      },
    });

    if (error) {
      console.error(error.message);
      setMessage("❌ Tarjeta inválida: " + error.message);
    } else {
      console.log("✅ Método guardado:", setupIntent.payment_method);
      setMessage("✅ Tarjeta verificada y guardada");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: "400px", margin: "20px auto" }}>
      <CardElement options={{ style: { base: { fontSize: "16px" } } }} />
      <button type="submit" style={{ marginTop: 20, padding: "10px 20px", backgroundColor: "#F15A24", color: "#fff", border: "none", borderRadius: "8px" }}>
        Confirmar tarjeta
      </button>
      <div>{message}</div>
    </form>
  );
};

export default CardForm;
