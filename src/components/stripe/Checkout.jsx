import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { getConfig } from "../../config/env";
import { useAuth } from "../../components/auth/AuthContext";

const Checkout = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const location = useLocation();
  const { apiUrl } = getConfig();
  const { user, loading } = useAuth(); // <--- reemplazamos useCurrentUser

  // ⬇️ Recuperar el vehicle_id del estado de navegación
  const { vehicle_id, seller_id } = location.state || {};

  const [clientSecret, setClientSecret] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user) return;
    const fetchSetupIntent = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/stripe/setup_payment_intent.php`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: user.id, email: user.email }), 
        });
        const data = await res.json();
        if (!res.ok || !data.clientSecret)
          throw new Error(data.error || "No se pudo obtener clientSecret");
        setClientSecret(data.clientSecret);
        setCustomerId(data.customerId);
      } catch (err) {
        console.error(err);
        setMessage(err.message);
      }
    };
    fetchSetupIntent();
  }, [user, apiUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    if (!clientSecret) return setMessage("ClientSecret inválido");

    setIsLoading(true);
    setMessage("");

    try {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error("CardElement no inicializado");

      const { setupIntent, error } = await stripe.confirmCardSetup(clientSecret, {
        payment_method: { card: cardElement },
      });

      if (error) throw error;

      await fetch(`${apiUrl}/api/stripe/save_payment_method.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          customer_id: customerId,
          payment_method_id: setupIntent.payment_method,
        }),
      });

      setMessage("✅ Tarjeta verificada y guardada con éxito");

      setTimeout(() => {
        navigate(`/vehiculo/${vehicle_id}/subasta`, {
          state: { vehicle_id, user_id: user.id, verify_card: true },
        });
      }, 1200);
    } catch (err) {
      console.error("❌ Checkout error:", err);
      setMessage(err.message || "Error inesperado al verificar la tarjeta");
    }

    setIsLoading(false);
  };

  if (loading) return <p>Cargando usuario...</p>;
  if (!user) return <p>Debes iniciar sesión para continuar.</p>;
  if (!vehicle_id) return <p>Error: ID de vehículo no recibido.</p>;

  return (
    <main style={{ maxWidth: 400, margin: "40px auto" }}>
      <h2>Verificar tarjeta</h2>
      <p>Conecta tu tarjeta antes de ofertar.</p>
      <form onSubmit={handleSubmit}>
        <CardElement options={{ style: { base: { fontSize: "18px" } } }} />
        <button type="submit" disabled={!stripe || isLoading} style={{ marginTop: 20, width: "100%" }}>
          {isLoading ? "Verificando..." : "Verificar tarjeta"}
        </button>
      </form>
      {message && <p style={{ marginTop: 20 }}>{message}</p>}
    </main>
  );
};

export default Checkout;
