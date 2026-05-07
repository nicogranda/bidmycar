import React, { useEffect, useState, useRef } from 'react';
import { getConfig } from '../../config/env';
import ChatModal from './ChatModal';
import './ChatShow.css';

const ChatShow = ({ vehicleId, userId, isOwner }) => {
  const { apiUrl } = getConfig();
  const [messages, setMessages] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const lastMsgRef = useRef(null); // 🔹 para scroll automático

  // Cargar mensajes desde backend
  const loadMessages = async () => {
    try {
      console.log("Cargando chat para vehicleId:", vehicleId);
      const res = await fetch(`${apiUrl}/index.php?page=chat&action=show&vehicle_id=${vehicleId}`);
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error cargando mensajes:', err);
    }
  };

  useEffect(() => { loadMessages(); }, [vehicleId]);

  // 🔹 scroll automático al último mensaje cuando cambian los mensajes
  useEffect(() => {
    if (lastMsgRef.current) {
      lastMsgRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleOpenModal = (msg = null) => {
    setReplyTo(msg);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setReplyTo(null);
    loadMessages(); // recarga mensajes
  };

  const formatUser = (msg) => msg.user_name || 'Interesado';

  return (
    <>
      <h3 class="subtitle">Chat</h3>
      <div className="chat-show-container" style={{ maxHeight: '400px', overflowY: 'auto' }}>
        <table className="chat-show-table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Fecha</th>
              <th>Mensaje</th>
              {isOwner && <th>Acción</th>}
            </tr>
          </thead>
          <tbody>
            {messages.map((msg, idx) => (
              <tr key={msg.id || msg.created_at} ref={idx === messages.length - 1 ? lastMsgRef : null}>
                <td>{formatUser(msg)}</td>
                <td>{new Date(msg.created_at).toLocaleString()}</td>
                <td>{msg.message}</td>
                {isOwner && (
                  <td>
                    {formatUser(msg) === 'Interesado' && (
                      <button onClick={() => handleOpenModal(msg)}>Responder</button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!isOwner && (
        <button className="chat-btn" onClick={() => handleOpenModal(null)}>
          Preguntar
        </button>
      )}

      {modalOpen && (
        <ChatModal
          vehicleId={vehicleId}               
          ownerId={isOwner ? userId : null}  
          replyTo={replyTo}
          onClose={handleCloseModal}  // 🔹 al cerrar recarga y hace scroll
        />
      )}
    </>
  );
};

export default ChatShow;
