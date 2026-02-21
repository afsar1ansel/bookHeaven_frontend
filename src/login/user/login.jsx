import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./login.css";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulated login
    setTimeout(() => {
      console.log("User login attempt:", { email });
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="login-container">
      <img src="/logo.png" alt="BookHeaven Logo" className="logo-img" />
      <div className="login-card">
        <div className="login-header">
          <h1>Welcome Back</h1>
          <p>Login to your account to continue</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-wrapper">
              <input
                type="email"
                id="email"
                placeholder="you@example.com"
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

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? "Hang tight..." : "Continue"}
          </button>
        </form>

        <div className="footer-links">
          <span>Don't have an account?</span>
          <Link to="/register">Join now</Link>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
