import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const CheckoutPage = ({ clientSecret }) => {
  const navigate = useNavigate();
  const cardElementRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!window.Stripe) {
      console.error("Stripe no está cargado correctamente.");
      return;
    }

    const stripe = window.Stripe("pk_test_..."); // Tu clave pública de Stripe
    const elements = stripe.elements();
    const cardElement = elements.create("card");
    cardElement.mount(cardElementRef.current);

    return () => {
      cardElement.unmount();
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const stripe = window.Stripe("pk_test_..."); // Tu clave pública de Stripe

    if (!clientSecret) {
      console.error("No se ha proporcionado un clientSecret.");
      setIsLoading(false);
      return;
    }

    const elements = stripe.elements();
    const cardElement = elements.getElement("card");

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: { name: "Milagros" },
      },
    });

    if (error) {
      console.error("Error al confirmar el pago:", error.message);
      setIsLoading(false);
    } else {
      if (paymentIntent.status === "succeeded") {
        console.log("Pago completado exitosamente", paymentIntent);
        // Redirigir al usuario o mostrar un mensaje
        navigate("/thank-you"); // Redirigir a una página de agradecimiento
      } else {
        console.error("El pago no fue exitoso", paymentIntent.status);
      }
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Pago con Stripe</h2>
      <form onSubmit={handleSubmit}>
        <div ref={cardElementRef}></div> {/* Aquí se montará el card element */}
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Cargando..." : "Pagar"}
        </button>
      </form>
    </div>
  );
};

export default CheckoutPage;
