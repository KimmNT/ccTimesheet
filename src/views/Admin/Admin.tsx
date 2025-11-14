import { useNavigate } from "@tanstack/react-router";
import { clearSession } from "@/utils/auth/sessionManager";

export default function Admin() {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearSession();
    navigate({ to: "/login" });
  };

  return (
    <div>
      <h1>Admin page is here</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
