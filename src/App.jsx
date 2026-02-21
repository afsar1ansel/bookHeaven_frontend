import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import UserLogin from "./login/user/login";
import AdminLogin from "./login/admin/login";
import Register from "./register/register";

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route redirects to User Login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* User Login Route */}
        <Route path="/login" element={<UserLogin />} />

        {/* User Registration Route */}
        <Route path="/register" element={<Register />} />

        {/* Admin Login Route */}
        <Route path="/admin/login" element={<AdminLogin />} />
      </Routes>
    </Router>
  );
}

export default App;
