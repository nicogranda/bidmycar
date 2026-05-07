import { useState } from "react";

function Chatbot() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const sendQuestion = async () => {
    const res = await fetch("/api/chatbot.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question })
    });
    const data = await res.json();
    setAnswer(data.answer);
  };

  return (
    <div>
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Escribe tu pregunta"
      />
      <button onClick={sendQuestion}>Enviar</button>
      <div>{answer}</div>
    </div>
  );
}

export default Chatbot;
