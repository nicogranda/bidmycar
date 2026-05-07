import React, { useEffect, useState, useRef } from 'react';
import { getConfig } from '../../config/env';
import ChatModal from './ChatModal';
import './ChatShow.css';

const ChatShow = ({ vehicleId, userId, isOwner, onMessagesLoaded }) => {
// const ChatShow = ({ vehicleId, userId, isOwner }) => {

  const { apiUrl } = getConfig();
  const [messages, setMessages] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const lastMsgRef = useRef(null);

  console.log('ChatShow render - isOwner:', isOwner);

  const loadMessages = async () => {
    try {
      const res = await fetch(`${apiUrl}/index.php?page=chat&action=show&vehicle_id=${vehicleId}`);
      const data = await res.json();
      const msgs = Array.isArray(data) ? data : [];
      setMessages(msgs);

      // ⚡ Avisar al padre si hay mensajes
      if (onMessagesLoaded) onMessagesLoaded(msgs);
    } catch (err) {
      console.error('Error cargando mensajes:', err);
      if (onMessagesLoaded) onMessagesLoaded([]);
    }
  };

  useEffect(() => { loadMessages(); }, [vehicleId]);

  useEffect(() => {
    if (lastMsgRef.current) {
      lastMsgRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleOpenModal = (msg = null) => {
    console.log('Abrir modal - replyTo:', msg);
    setReplyTo(msg);
    setModalOpen(true);
  };

  const handleCloseModal = (newMessage = null) => {
    setModalOpen(false);
    setReplyTo(null);
    if (newMessage) {
      setMessages((prev) => [...prev, newMessage]);
    } else {
      loadMessages();
    }
  };

  const formatUser = (msg) => msg.user_name || 'Interesado';

  // Organizar mensajes en threads según reply_to
  const organizeMessages = (messages) => {
    const map = {};
    const roots = [];

    messages.forEach(msg => {
      msg.children = [];
      map[msg.id] = msg;
    });

    messages.forEach(msg => {
      if (msg.reply_to && map[msg.reply_to]) {
        map[msg.reply_to].children.push(msg);
      } else {
        roots.push(msg);
      }
    });

    // Ordenar por fecha
    const sortByDate = (a, b) => new Date(a.created_at) - new Date(b.created_at);
    roots.sort(sortByDate);
    roots.forEach(r => r.children.sort(sortByDate));

    return roots;
  };

  // Render de un mensaje y sus respuestas
  const renderMessage = (msg, idx) => (
    <React.Fragment key={msg.id}>
      <tr ref={idx === messages.length - 1 ? lastMsgRef : null}>
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
      {msg.children.map(child => (
        <tr key={child.id} style={{ backgroundColor: '#f9f9f9' }}>
          <td style={{ paddingLeft: '30px' }}>{formatUser(child)}</td>
          <td>{new Date(child.created_at).toLocaleString()}</td>
          <td>{child.message}</td>
          {isOwner && <td></td>}
        </tr>
      ))}
    </React.Fragment>
  );

  return (
    <>

<div className="chat-show-container">
  {messages.length > 0 && (
    <>
      <h3 className="heading heading--md">Chat</h3>
      <table className="chat-show-table">
        <thead className="chat-show-header">
          <tr>
            <th>Usuario</th>
            <th>Fecha</th>
            <th>Mensaje</th>
            {isOwner && <th>Acción</th>}
          </tr>
        </thead>
        <tbody className="chat-show-body">
          {organizeMessages(messages).map((msg, idx) => renderMessage(msg, idx))}
        </tbody>
      </table>
    </>
  )}


</div>
  {/* Botón siempre visible, aunque no haya mensajes */}
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
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default ChatShow;
