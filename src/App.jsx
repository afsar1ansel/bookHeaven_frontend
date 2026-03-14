import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import UserLogin from "./login/user/login";
import AdminLogin from "./login/admin/login";
import Register from "./register/register";

// Dashboard / Feature Pages
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home/Home";
import Profile from "./pages/Profile/Profile";
import Books from "./pages/Books/Books";
import BookManagement from "./pages/BookManagement/BookManagement";
import Orders from "./pages/Orders/Orders";
import MyOrders from "./pages/MyOrders/MyOrders";
import Cart from "./pages/Cart/Cart";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Main Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/books" element={<Books />} />

        {/* Protected Admin Routes */}
        <Route
          path="/book-management"
          element={
            <ProtectedRoute adminOnly>
              <BookManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute adminOnly>
              <Orders />
            </ProtectedRoute>
          }
        />

        {/* User Routes */}
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/cart" element={<Cart />} />

        {/* Authentication Routes */}
        <Route path="/login" element={<UserLogin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/login" element={<AdminLogin />} />
      </Routes>
    </Router>
  );
}

export default App;
