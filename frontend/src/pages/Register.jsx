import { useState } from "react";

import { registerUser } from "../services/authServices";

const Register = () => {

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const getErrorMessage = (error) => {
    const data = error.response?.data;

    if (!data) {
      return "Registration failed";
    }

    if (typeof data.error === "string") {
      return data.error;
    }

    if (typeof data.message === "string") {
      return data.message;
    }

    if (typeof data === "object") {
      return Object.values(data)
        .flat()
        .map((item) => String(item))
        .join(" ");
    }

    return String(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Form submitted");
    console.log("Form data:", formData);

    try {
      const response = await registerUser(formData);

      console.log("Response:", response);

      alert(response.data.message);
    } catch (error) {
      console.error("Error:", error);

      alert(getErrorMessage(error));
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "2rem auto", padding: "2rem", border: "1px solid #ddd", borderRadius: "8px", backgroundColor: "white" }}>
      <h1>Register</h1>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          style={{ padding: "0.5rem", border: "1px solid #ccc", borderRadius: "4px" }}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          style={{ padding: "0.5rem", border: "1px solid #ccc", borderRadius: "4px" }}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          style={{ padding: "0.5rem", border: "1px solid #ccc", borderRadius: "4px" }}
        />

        <button type="submit" style={{ padding: "0.5rem 1rem", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
          Register
        </button>

      </form>
    </div>
  );
};

export default Register;