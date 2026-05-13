import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Admin = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/dashboard");
      return;
    }

    fetchUsers();
  }, [user, navigate]);

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/api/v1/admin/users", {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        console.error("Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) {
    return <div style={{ textAlign: "center", padding: "2rem" }}>Loading...</div>;
  }

  return (
    <div style={{ maxWidth: "1000px", margin: "2rem auto", padding: "2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1>Admin Panel</h1>
          <p>Manage users and system settings</p>
        </div>
        <div>
          <button
            onClick={() => navigate("/dashboard")}
            style={{ padding: "0.5rem 1rem", backgroundColor: "#6c757d", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", marginRight: "1rem" }}
          >
            Back to Dashboard
          </button>
          <button onClick={handleLogout} style={{ padding: "0.5rem 1rem", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
            Logout
          </button>
        </div>
      </div>

      <div style={{ marginBottom: "2rem" }}>
        <h2>All Users ({users.length})</h2>
        {users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <div style={{ display: "grid", gap: "1rem" }}>
            {users.map((userData) => (
              <div
                key={userData.id}
                style={{
                  border: "1px solid #ddd",
                  padding: "1rem",
                  borderRadius: "8px",
                  backgroundColor: "white",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <h3>{userData.username}</h3>
                  <p>Email: {userData.email}</p>
                  <p>Role: <span style={{
                    padding: "0.25rem 0.5rem",
                    borderRadius: "4px",
                    fontSize: "0.8rem",
                    backgroundColor: userData.role === "admin" ? "#d1ecf1" : "#f8f9fa",
                    color: userData.role === "admin" ? "#0c5460" : "#495057"
                  }}>{userData.role}</span></p>
                </div>
                <div>
                  <span style={{
                    padding: "0.25rem 0.5rem",
                    backgroundColor: "#e9ecef",
                    borderRadius: "4px",
                    fontSize: "0.8rem"
                  }}>
                    ID: {userData.id}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;