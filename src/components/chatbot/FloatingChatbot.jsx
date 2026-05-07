import { useState, useRef, useEffect } from "react";
import { getConfig } from "../../config/env";
import "./FloatingChatbot.css";

function FloatingChatbot() {
  const { apiUrl } = getConfig();

  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);

  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const sendQuestion = async () => {
    if (!question.trim()) return;

    const userMessage = { from: "user", text: question };
    setMessages((prev) => [...prev, userMessage]);

    setQuestion("");

    try {
      console.log("USER QUESTION:", question);
    
      const res = await fetch(`${apiUrl}/index.php?page=chatbot&action=send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ question })
      });
    
      const text = await res.text();
      console.log("RAW RESPONSE:", text); // <-- Aquí logueamos la respuesta cruda del backend
    
      // Parse seguro
      let data;
      try {
        data = JSON.parse(text);
      } catch(e) {
        console.error("JSON parse error:", e);
        data = { answer: "Error interno: no se pudo leer la respuesta del servidor." };
      }
    
      // Asegurarnos de que answer exista y sea string
      const answerText = typeof data.answer === "string" ? data.answer : "Respuesta vacía del servidor.";
      console.log("BOT ANSWER:", answerText); // <-- Aquí logueamos la respuesta final que se va a mostrar
    
      const botMessage = { from: "bot", text: answerText };
      setMessages((prev) => [...prev, botMessage]);
    
    } catch (err) {
      console.error("FETCH ERROR:", err);
      const botError = { from: "bot", text: "Ha ocurrido un error. Intenta nuevamente." };
      setMessages((prev) => [...prev, botError]);
    }
    
    
  };

  return (
    <>
      <div className="chatbot-button" onClick={() => setOpen(!open)}>
        ?
      </div>

      {open && (
        <div className="chatbot-window">
          <h4 className="chatbot-title">BidMyCar</h4>

          <div className="chatbot-messages" ref={chatRef}>
            {messages.map((msg, i) => (
              <div key={i} className={`chat-row ${msg.from}`}>
                
                {/* Avatar */}
                <div className="avatar">
                  {msg.from === "user" ? "Tú" : "AI"}
                </div>

                {/* Burbuja */}
                <div className={`chat-bubble ${msg.from}`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div className="chatbot-input-area">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Escribe tu pregunta..."
              onKeyDown={(e) => e.key === "Enter" && sendQuestion()}
            />
            <button onClick={sendQuestion}>Enviar</button>
          </div>
        </div>
      )}
    </>
  );
}

export default FloatingChatbot;
