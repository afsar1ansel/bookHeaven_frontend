import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../utils/baseurl";
import "./login.css";

const AdminLogin = () => {
  console.log("AdminLogin component rendered");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${BASE_URL}/api/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Email: email,
          Password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store user data in localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.Username);
        localStorage.setItem("email", data.Email);
        localStorage.setItem("role", data.role);

        // Redirect to dashboard or home
        navigate("/");
      } else {
        setError(data.message || "Invalid credentials. Please try again.");
      }
    } catch (err) {
      setError("An error occurred during login. Please check your connection.");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <img src="/logo.png" alt="BookHeaven Logo" className="logo-img" />
      <div className="login-card">
        <div className="login-header">
          <h1>Admin Portal</h1>
          <p>Enter your credentials to access the dashboard</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-wrapper">
              <input
                type="email"
                id="email"
                placeholder="admin@bookheaven.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <input
                type="password"
                id="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {error && <p className="error-message">{error}</p>}

          <button
            type="submit"
            className="login-button"
            disabled={isLoading}
            onClick={() => console.log("Sign In button clicked")}
          >
            {isLoading ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        <div className="footer-links">
          <span>Forgot password?</span>
          <a href="#">Contact Support</a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
