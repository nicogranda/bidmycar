import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../components/auth/AuthContext";

const AuctionButton = ({ vehicle_id, seller_id }) => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  if (loading) return null;
  if (user && Number(user.id) === Number(seller_id)) return null;

  const handleClick = () => {
    if (!user) {
      navigate("/login", {
        state: {
          from: {
            pathname: `/pago/${vehicle_id}/registro`,
            state: { vehicle_id, seller_id, modo: "registro" },
          },
        },
      });
    } else {
      navigate(`/pago/${vehicle_id}/registro`, {
        state: { vehicle_id, seller_id, modo: "registro" },
      });
    }
  };

  return <button onClick={handleClick} className="buttons">Ofertar</button>;
};

export default AuctionButton;
