import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) {
    return null;
  }

  return (
    <nav style={{
      backgroundColor: "#343a40",
      color: "white",
      padding: "1rem",
      marginBottom: "2rem"
    }}>
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
          Task Manager
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span>Welcome, {user.username}</span>

          <button
            onClick={() => navigate("/dashboard")}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "transparent",
              color: "white",
              border: "1px solid white",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Dashboard
          </button>

          {user.role === "admin" && (
            <button
              onClick={() => navigate("/admin")}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#17a2b8",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              Admin
            </button>
          )}

          <button
            onClick={handleLogout}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;