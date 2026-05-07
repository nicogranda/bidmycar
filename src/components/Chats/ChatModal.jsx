// src/components/Chats/ChatModal.jsx
import { useEffect, useState } from 'react';
import { getConfig } from '../../config/env';
import './ChatModal.css';

function ChatModal({ vehicleId, ownerId, onClose, replyTo, reloadChats }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const { apiUrl } = getConfig();
  const userId = parseInt(localStorage.getItem('user_id') ?? 0);

  // 🔍 Log de debug al montar
  useEffect(() => {
    console.log('=== ChatModal mounted ===');
    console.log('vehicleId:', vehicleId, 'ownerId:', ownerId, 'userId:', userId, 'replyTo:', replyTo);
  }, [vehicleId, ownerId, replyTo, userId]);

  const loadMessages = async () => {
    if (!vehicleId) return;
    try {
      const res = await fetch(`${apiUrl}/index.php?page=chat&action=show&vehicle_id=${vehicleId}`);
      const data = await res.json();
      console.log('Mensajes cargados:', data);
      setMessages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error cargando mensajes:', err);
      setMessages([]);
    }
  };

  useEffect(() => { loadMessages(); }, [vehicleId]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;
  
    const label = userId === ownerId ? 'Propietario' : 'Interesado';
  
    setMessages(prev => [
      ...prev,
      { user_name: label, message: trimmed, reply_to: replyTo?.id ?? null }
    ]);
  
    try {
      const res = await fetch(`${apiUrl}/index.php?page=chat&action=store`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicle_id: vehicleId,
          user_id: userId,
          user_name: label,
          message: trimmed,
          reply_to: replyTo?.id ?? null,
        }),
      });
  
      const result = await res.json();
      console.log('Respuesta backend:', result);
  
      // 🔹 Recargar toda la página para ver el último mensaje
      window.location.reload();
  
      // 🔹 Opcional: cerrar modal
      onClose();
    } catch (err) {
      console.error('Error enviando mensaje:', err);
    }
  
    setInput('');
  };
  

  return (
    <div className="chat-modal">
      <div className="chat-modal__content">
        <span className="chat-modal__close" onClick={onClose}>&times;</span>
        {/* <h4>Chat sobre el coche</h4>

        <div className="chat-modal__messages">
          {messages.map((msg, idx) => (
            <p key={idx}>
              {msg.reply_to && <em>Respuesta a #{msg.reply_to}: </em>}
              <strong>{msg.user_name}:</strong> {msg.message}
            </p>
          ))}
        </div> */}

        <textarea
          className="chat-modal__input"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={replyTo ? `Responder a ${replyTo.user_name}` : 'Escribe tu mensaje...'}
          rows={3}
        />
        <button className="chat-modal__send" onClick={sendMessage}>Enviar</button>
      </div>
    </div>
  );
}

export default ChatModal;
