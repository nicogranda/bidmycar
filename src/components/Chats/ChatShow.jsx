import React, { useEffect, useState, useRef } from 'react';
import { getConfig } from '../../config/env';
import ChatModal from './ChatModal';
import './ChatShow.css';

const ChatShow = ({ vehicleId, userId, isOwner, onMessagesLoaded }) => {
  const { apiUrl } = getConfig();

  const [messages, setMessages] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [expandedMsg, setExpandedMsg] = useState(null);

  const lastMsgRef = useRef(null);

  // ---------------------------------------
  // Funciones de utilidad
  // ---------------------------------------
  const formatUser = (msg) => msg.user_name || 'Interesado';

  const toggleMessage = (id) => {
    setExpandedMsg((prev) => (prev === id ? null : id));
  };

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    const pad = (n) => String(n).padStart(2, '0');

    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${String(d.getFullYear()).slice(-2)} ` +
           `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  };

  // ---------------------------------------
  // Carga de mensajes
  // ---------------------------------------
  const loadMessages = async () => {
    try {
      const res = await fetch(`${apiUrl}/index.php?page=chat&action=show&vehicle_id=${vehicleId}`);
      const data = await res.json();
      const msgs = Array.isArray(data) ? data : [];
      setMessages(msgs);

      if (onMessagesLoaded) onMessagesLoaded(msgs);
    } catch (err) {
      console.error('Error cargando mensajes:', err);
      if (onMessagesLoaded) onMessagesLoaded([]);
    }
  };

  useEffect(() => { loadMessages(); }, [vehicleId]);

  // Scroll automático al último mensaje
  useEffect(() => {
    if (lastMsgRef.current) {
      lastMsgRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // ---------------------------------------
  // Modal para responder
  // ---------------------------------------
  const handleOpenModal = (msg = null) => {
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

  // ---------------------------------------
  // Organizar mensajes en threads
  // ---------------------------------------
  const organizeMessages = (messages) => {
    const map = {};
    const roots = [];

    messages.forEach((msg) => {
      msg.children = [];
      map[msg.id] = msg;
    });

    messages.forEach((msg) => {
      if (msg.reply_to && map[msg.reply_to]) {
        map[msg.reply_to].children.push(msg);
      } else {
        roots.push(msg);
      }
    });

    // Ordenar de más nuevo a más viejo
    const sortByDateDesc = (a, b) => new Date(b.created_at) - new Date(a.created_at);
    roots.sort(sortByDateDesc);
    roots.forEach((r) => r.children.sort(sortByDateDesc));

    return roots;
  };

  // ---------------------------------------
  // Render de mensajes
  // ---------------------------------------
  const renderMessage = (msg, idx) => (
    <React.Fragment key={msg.id}>
      <tr ref={idx === messages.length - 1 ? lastMsgRef : null}>
        <td>{formatUser(msg)}</td>
        <td>{formatDate(msg.created_at)}</td>
        <td>
          <div
            className={`chat-message ${expandedMsg === msg.id ? 'expanded' : ''}`}
            onClick={() => toggleMessage(msg.id)}
            title="Click para ver completo"
          >
            {msg.message}
          </div>
        </td>
        {isOwner && (
          <td>
            {formatUser(msg) === 'Interesado' && (
              <button onClick={() => handleOpenModal(msg)}>Responder</button>
            )}
          </td>
        )}
      </tr>

      {msg.children.map((child) => (
        <tr key={child.id} style={{ backgroundColor: '#f9f9f9' }}>
          <td style={{ paddingLeft: '30px' }}>{formatUser(child)}</td>
          <td>{formatDate(child.created_at)}</td>
          <td>
            <div
              className={`chat-message ${expandedMsg === child.id ? 'expanded' : ''}`}
              onClick={() => toggleMessage(child.id)}
            >
              {child.message}
            </div>
          </td>
          {isOwner && <td></td>}
        </tr>
      ))}
    </React.Fragment>
  );

  // ---------------------------------------
  // Render del componente
  // ---------------------------------------
  return (
    <>
      <div className="chat-show-container">
        {messages.length > 0 && (
          <>
           
           <div className="chat-show-container">
              <h3 className="heading heading--md chat-title">Chat</h3>
              <div className="chat-scroll-wrapper">
                <table className="chat-show-table">
                  <thead className="chat-show-header">
                    <tr>
                      <th>Usuario</th>
                      <th>Fecha</th>
                      <th>Mensaje</th>
                      {isOwner && <th>Acción</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {organizeMessages(messages).map((msg, idx) => renderMessage(msg, idx))}
                  </tbody>
                </table>
              </div>
            </div>


          </>
        )}
      </div>

      {!isOwner && (
        <button className="buttons" onClick={() => handleOpenModal(null)}>
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
