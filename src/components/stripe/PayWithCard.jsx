import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { getConfig } from '../../config/env';
import "./PayWithCard.css";

const PayWithCard = ({ amount = 5000, currency = "eur", email = "nicgranda@gmail.com" }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { apiUrl } = getConfig();
  const { id: vehicleId } = useParams();
  const navigate = useNavigate();

  const [clientSecret, setClientSecret] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!amount || !currency) {
      setMessage("Faltan amount o currency");
      return;
    }

    const fetchPaymentIntent = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/stripe/create_payment_intent.php`, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({ amount, currency, email }),
        });
        const data = await res.json();
        if (data.error) setMessage(data.error);
        else setClientSecret(data.clientSecret);
      } catch (err) {
        setMessage("Error al crear PaymentIntent: " + err.message);
      }
    };

    fetchPaymentIntent();
  }, [amount, currency, email, apiUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!stripe || !elements) {
      setMessage("Stripe no está listo");
      setLoading(false);
      return;
    }

    if (!clientSecret) {
      setMessage("No se pudo obtener clientSecret del backend");
      setLoading(false);
      return;
    }

    const card = elements.getElement(CardElement);
    if (!card) {
      setMessage("Tarjeta no encontrada");
      setLoading(false);
      return;
    }

    try {
      const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card },
      });

      if (error) {
        setMessage("Error: " + error.message);
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        setMessage("Pago realizado con éxito ✅");

        if (vehicleId) {
          try {
            const res = await fetch(`${apiUrl}/api/payments/banners.php`, {
              method: "POST",
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
              body: new URLSearchParams({
                vehicle_id: vehicleId,
                amount: paymentIntent.amount,
                payment_method: "card",
                transaction_id: paymentIntent.id,
                card_last4: paymentIntent.charges?.data[0]?.payment_method_details?.card?.last4 || "",
              }),
            });

            const data = await res.json();
            if (data.status === "ok") {
              setShowModal(true); // mostrar modal de éxito
            } else {
              setMessage("Pago procesado pero fallo al registrar en DB: " + (data.message || ""));
            }
          } catch (err) {
            setMessage("Pago procesado pero fallo al registrar en DB: " + err.message);
          }
        } else {
          setMessage("Pago exitoso pero no se recibió vehicle_id");
        }

      } else {
        setMessage("Pago fallido o pendiente: " + (paymentIntent?.status || "desconocido"));
      }
    } catch (err) {
      setMessage("Error al procesar el pago: " + err.message);
    }

    setLoading(false);
  };

  const goToPortfolio = () => {
    setShowModal(false);
    navigate(`/`);
  };

  const goHome = () => {
    setShowModal(false);
    navigate(`/`);
  };

  return (
    <>
      <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: "40px auto" }}>
        <CardElement options={{ style: { base: { fontSize: '18px' } } }} />
        <button
          type="submit"
          disabled={!stripe || !clientSecret || loading}
          style={{ marginTop: 20 }}
        >
          {loading ? "Procesando..." : `Pagar ${amount / 100} ${currency.toUpperCase()}`}
        </button>
        {message && <p style={{ marginTop: 10 }}>{message}</p>}
      </form>

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>🎉 ¡Pago exitoso!</h3>
            <p>Tu vehículo ha sido destacado en el banner.</p>
            <div className="modal-actions">
              <button onClick={goToPortfolio}>Ir al portfolio</button>
              <button onClick={goHome}>Volver al inicio</button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .modal-backdrop {
          position: fixed;
          top: 0; left: 0;
          width: 100%; height: 100%;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          animation: fadeIn 0.3s ease;
        }
        .modal {
          background: white;
          padding: 2rem;
          border-radius: 10px;
          max-width: 400px;
          text-align: center;
          animation: slideIn 0.3s ease;
        }
        .modal-actions {
          margin-top: 1.5rem;
          display: flex;
          justify-content: space-around;
        }
        .modal-actions button {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        .modal-actions button:first-child {
          background: #007bff;
          color: white;
        }
        .modal-actions button:last-child {
          background: #ccc;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </>
  );
};

export default PayWithCard;
