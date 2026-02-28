import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../utils/baseurl";
import "./Profile.css";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.clear();
      navigate("/login");
    }
  };
  const [formData, setFormData] = useState({
    Name: "",
    Address: "",
    Phone: "",
    Password: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/api/user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch profile data");
      }

      const data = await response.json();
      setProfile(data);
      setFormData({
        Name: data.Name || "",
        Address: data.Address || "",
        Phone: data.Phone || "",
        Password: "", // Keep password empty for security
      });
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Unable to load profile. Please make sure you are logged in.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/api/user/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      alert("Profile updated successfully");
      setIsEditing(false);
      fetchProfile(); // Refresh profile data
    } catch (err) {
      alert(err.message);
    }
  };

  if (isLoading)
    return <div className="loading-spinner">Loading your profile...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!profile) return null;

  const initials = profile.Name ? profile.Name.charAt(0).toUpperCase() : "U";

  return (
    <div className="profile-container">
      <header className="profile-header">
        <h1>My Account</h1>
        <p>Manage your personal information and account settings.</p>
      </header>

      <div className="profile-card">
        {!isEditing ? (
          <>
            <div className="profile-avatar-section">
              <div className="profile-avatar">{initials}</div>
              <h2 style={{ color: "var(--color-secondary)" }}>
                {profile.Name}
              </h2>
              <span style={{ color: "#666", fontSize: "0.9rem" }}>
                Customer ID: #{profile.UserID}
              </span>
            </div>

            <div className="profile-details">
              <div className="detail-item">
                <span className="detail-label">Full Name</span>
                <span className="detail-value">{profile.Name}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Email Address</span>
                <span className="detail-value">{profile.Email}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Shipping Address</span>
                <span className="detail-value">
                  {profile.Address || "Not provided"}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Phone Number</span>
                <span className="detail-value">
                  {profile.Phone || "Not provided"}
                </span>
              </div>
            </div>

            <div className="profile-actions">
              <button
                className="btn-edit-profile"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile Information
              </button>
              <button className="btn-logout" onClick={handleLogout}>
                Logout Account
              </button>
            </div>
          </>
        ) : (
          <form className="profile-form" onSubmit={handleUpdate}>
            <h2
              style={{ color: "var(--color-secondary)", marginBottom: "1rem" }}
            >
              Edit Profile
            </h2>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="Name"
                value={formData.Name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Shipping Address</label>
              <input
                type="text"
                name="Address"
                value={formData.Address}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="text"
                name="Phone"
                value={formData.Phone}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>New Password (leave blank to keep current)</label>
              <input
                type="password"
                name="Password"
                value={formData.Password}
                onChange={handleInputChange}
                placeholder="Enter new password"
              />
            </div>
            <div className="profile-actions">
              <button
                type="button"
                className="btn-cancel-edit"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn-save-profile">
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
