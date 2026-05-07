// src/components/Chats/ChatButton.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import ChatModal from "./ChatModal";

const ChatButton = ({ vehicleId, ownerId, userName, isOpen, onOpen, onClose }) => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  // ✅ Rehidratación post-login
  useEffect(() => {
    if (loading || !user) return;

    const action = sessionStorage.getItem("postLoginAction");
    if (!action) return;

    try {
      const parsed = JSON.parse(action);

      if (
        parsed.action === "openChat" &&
        String(parsed.vehicleId) === String(vehicleId)
      ) {
        onOpen();
      }
    } catch (e) {
      console.error("postLoginAction corrupta:", e);
    } finally {
      sessionStorage.removeItem("postLoginAction");
    }
  }, [loading, user, vehicleId, onOpen]);

  if (loading) return null;

  const handleClick = () => {
    if (!user) {
      sessionStorage.setItem(
        "postLoginAction",
        JSON.stringify({
          action: "openChat",
          vehicleId,
        })
      );

      navigate("/login", {
        state: {
          from: {
            pathname: `/vehiculo/${vehicleId}`,
          },
        },
      });
    } else {
      onOpen();
    }
  };

  return (
    <>
      <button className="buttons" onClick={handleClick}>
        Chat
      </button>

      {isOpen && (
        <ChatModal
          vehicleId={vehicleId}
          ownerId={ownerId}
          userName={userName}
          onClose={onClose}
        />
      )}
    </>
  );
};

export default ChatButton;
