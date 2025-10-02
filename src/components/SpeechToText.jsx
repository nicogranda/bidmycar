import React, { useState, useEffect } from 'react';

const SpeechToText = ({ field, formData, setFormData }) => {
  const [listening, setListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) {
      console.warn("Tu navegador no soporta SpeechRecognition 😢");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recog = new SpeechRecognition();
    recog.lang = 'es-ES';
    recog.interimResults = false; // solo resultados finales
    recog.continuous = false; // se detiene en cada pausa

    recog.onresult = (event) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript.trim();
        }
      }
      if (finalTranscript) {
        setFormData(prev => ({
          ...prev,
          [field]: (prev[field] + " " + finalTranscript).trim()
        }));
      }
    };

    recog.onend = () => setListening(false);
    setRecognition(recog);
  }, [field, setFormData]);

  const toggleListening = () => {
    if (!recognition) return;
    if (!listening) {
      recognition.start();
      setListening(true);
    } else {
      recognition.stop();
      setListening(false);
    }
  };

  return (
    // <button type="button" onClick={toggleListening} style={{ marginTop: '6px' }}>
    //   {listening ? "🎤 Grabando..." : "🎙️ Dictar"}
    // </button>
    
      <button 
        type="button" 
        className={`mic-btn ${listening ? "listening" : ""}`} 
        onClick={toggleListening}
      >
        <i className="fa-solid fa-microphone"></i>
      </button>
    );
};

export default SpeechToText;
