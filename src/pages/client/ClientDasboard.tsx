import { useAuth } from "../../app/providers/AuthProvider";
import { logout } from "../../features/auth/api";
import { useNavigate } from "react-router-dom";

const ClientDashboard = () => {
  const navigate = useNavigate();
  const { logout: contextLogout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout(); // Firebase signOut
      contextLogout(); // Update context
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default ClientDashboard;
