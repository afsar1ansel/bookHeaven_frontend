import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const location = useLocation();

  // Hide navbar on login and register pages
  const authPages = ["/login", "/register", "/admin/login"];
  if (authPages.includes(location.pathname)) {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src="/logo.png" alt="BookHeaven Logo" />
          <span>BookHeaven</span>
        </Link>

        <ul className="nav-menu">
          <li className="nav-item">
            <Link
              to="/"
              className={`nav-links ${location.pathname === "/" ? "active" : ""}`}
            >
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/books"
              className={`nav-links ${location.pathname === "/books" ? "active" : ""}`}
            >
              Books
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/my-orders"
              className={`nav-links ${location.pathname === "/my-orders" ? "active" : ""}`}
            >
              My Orders
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/profile"
              className={`nav-links ${location.pathname === "/profile" ? "active" : ""}`}
            >
              Profile
            </Link>
          </li>

          {/* Admin section - highlighted or separated */}
          <li className="nav-item admin-link">
            <Link
              to="/book-management"
              className={`nav-links ${location.pathname === "/book-management" ? "active" : ""}`}
            >
              Management
            </Link>
          </li>
          <li className="nav-item admin-link">
            <Link
              to="/orders"
              className={`nav-links ${location.pathname === "/orders" ? "active" : ""}`}
            >
              Orders
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
