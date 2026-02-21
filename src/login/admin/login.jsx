import React, { useState } from "react";
import "./login.css";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulated login logic
    setTimeout(() => {
      console.log("Login attempt:", { email, password });
      setIsLoading(false);
      // alert('Login submitted (Simulated)');
    }, 1500);
  };

  return (
    <div className="login-container">
      <img src="/logo.png" alt="BookHeaven Logo" className="logo-img" />
      <div className="login-card">
        <div className="login-header">
          <h1>Admin Portal</h1>
          <p>Enter your credentials to access the dashboard</p>
        </div>

        <form onSubmit={handleSubmit}>
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

          <button type="submit" className="login-button" disabled={isLoading}>
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
