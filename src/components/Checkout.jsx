import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

const Checkout = () => {
  const stripe = useStripe();
  const elements = useElements();
  const location = useLocation();
  const navigate = useNavigate();

  const { clientSecret, vehicle_id, user_id } = location.state || {}; // Accedemos a vehicle_id y user_id
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!stripe || !elements) return;

    const result = await stripe.confirmCardSetup(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (result.error) {
      setMessage(result.error.message);
    } else {
      setMessage("Tarjeta verificada con éxito ✅");
      console.log("Navigating to /auction/create with vehicle_id:", vehicle_id, "and user_id:", user_id);

      // Paso 3: Redirigir a AuctionCreate pasando vehicle_id y user_id
      navigate('/auction/create', {
        state: {
          vehicle_id,
          user_id,
          verify_card: true,  // Agregar la bandera para indicar que la tarjeta fue verificada
        }
      });
    }

    setIsLoading(false);
  };

  return (
    <main>
      <div style={{ maxWidth: 400, margin: "40px auto" }}>
        <h2>Verificar tarjeta</h2>
        <form onSubmit={handleSubmit}>
          <CardElement options={{ style: { base: { fontSize: '18px' } } }} />
          <button 
            type="submit" 
            disabled={!stripe || isLoading} style={{ marginTop: 20 }}
            class="buy-btn"
          >
            {isLoading ? "Verificando..." : "Verificar"}
          </button>
        </form>
        {message && <p style={{ marginTop: 20 }}>{message}</p>}
      </div>
    </main>
  );
};

export default Checkout;
