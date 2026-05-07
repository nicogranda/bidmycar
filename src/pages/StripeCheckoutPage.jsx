import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { getConfig } from "../config/env";
import { useAuth } from "../components/auth/AuthContext";

const StripeCheckoutPage = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const location = useLocation();
  const { apiUrl } = getConfig();
  const { user, loading } = useAuth();

  const { vehicle_id, seller_id } = location.state || {};

  const [clientSecret, setClientSecret] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [redirectToAuction, setRedirectToAuction] = useState(false);

  // Guardamos verify_card de forma persistente por si recarga
  useEffect(() => {
    if (vehicle_id && redirectToAuction) {
      localStorage.setItem(`verify_card_${vehicle_id}`, "true");
    }
  }, [redirectToAuction, vehicle_id]);

  console.log("🔹 StripeCheckoutPage mounted", { vehicle_id, seller_id, user, loading });

  useEffect(() => {
    if (!user) return;

    const fetchSetupIntent = async () => {
      try {
        console.log("🔹 Llamando setup_payment_intent.php con:", { user_id: user.id, email: user.email });

        const res = await fetch(`${apiUrl}/api/stripe/setup_payment_intent.php`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: user.id, email: user.email }),
        });

        const data = await res.json();
        console.log("🔹 Respuesta setup_payment_intent.php:", data, "Status OK?", res.ok);

        if (!res.ok || !data.clientSecret)
          throw new Error(data.error || "No se pudo obtener clientSecret");

        setClientSecret(data.clientSecret);
        setCustomerId(data.customerId);
      } catch (err) {
        console.error("❌ Error fetchSetupIntent:", err);
        setMessage(err.message);
      }
    };

    fetchSetupIntent();
  }, [user, apiUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🟢 handleSubmit ejecutado");

    if (!stripe || !elements) {
      console.log("🔴 Stripe o Elements NO listos", { stripe, elements });
      return;
    }

    if (!clientSecret) {
      console.log("🔴 clientSecret inválido:", clientSecret);
      setMessage("ClientSecret inválido");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error("CardElement no inicializado");

      console.log("🔹 Enviando confirmCardSetup con clientSecret:", clientSecret);

      const { setupIntent, error } = await stripe.confirmCardSetup(clientSecret, {
        payment_method: { card: cardElement },
      });

      console.log("🔹 Resultado confirmCardSetup:", { setupIntent, error });

      if (error) throw error;

      console.log("🔹 Guardando método de pago en backend:", {
        user_id: user.id,
        customer_id: customerId,
        payment_method_id: setupIntent.payment_method,
      });

      const saveRes = await fetch(`${apiUrl}/api/stripe/save_payment_method.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          customer_id: customerId,
          payment_method_id: setupIntent.payment_method,
        }),
      });

      const saveData = await saveRes.json();
      console.log("🔹 Respuesta save_payment_method.php:", saveData);

      setMessage("✅ Tarjeta verificada y guardada con éxito");

      setRedirectToAuction(true); // trigger seguro para navegar
    } catch (err) {
      console.error("❌ Checkout error:", err);
      setMessage(err.message || "Error inesperado al verificar la tarjeta");
    }

    setIsLoading(false);
  };

  // Navegación segura con useEffect
  useEffect(() => {
    if (redirectToAuction && user) {
      navigate(`/vehiculo/${vehicle_id}/subasta`, {
        state: { vehicle_id, user_id: user.id, verify_card: true },
      });
    }
  }, [redirectToAuction, user, navigate, vehicle_id]);

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

export default StripeCheckoutPage;
