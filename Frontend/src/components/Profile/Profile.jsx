import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { userService } from "../../service/api";
import Navbar from "../Navbar/Navbar";
import styles from "./Profile.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    photo: null,
  });

  const [showUpdatePassword, setShowUpdatePassword] = useState(false);

  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data } = await userService.getMe();
        setUser(data.user);
        setFormData({
          name: data.user.name || "",
          email: data.user.email || "",
          photo: null,
        });
        setLoading(false);
      } catch (err) {
        const message = err.response?.data?.message || err.message;
        setError(message);
        setLoading(false);

        if (err.response?.status === 401) {
          navigate("/login");
        }
      }
    };

    fetchUserData();
  }, [navigate]);

  // Logout handler
  const handleLogout = () => {
    userService.logout();
    navigate("/login");
  };

  // Form input change handler
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo") {
      setFormData((prev) => ({ ...prev, photo: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Profile update handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError("");

    try {
      const data = await userService.updateUser(formData);
      setUser(data.user);
      toast.success("Profile updated successfully!");
      setFormData((prev) => ({
        ...prev,
        photo: null,
      }));
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      setError(message);
      toast.error(message);
    } finally {
      setUpdating(false);
    }
  };

  // Delete account handler
  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (!confirmed) return;

    try {
      await userService.deleteMe();
      toast.success("Your account has been deleted.");
      userService.logout();
      navigate("/login");
    } catch (err) {
      toast.error(err.message || "Failed to delete account.");
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorText}>{error}</p>
        <Link to="/login" className={styles.authLink}>
          Back to Login
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className={styles.holeProfile}>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <div className={styles.profileContainer}>
          <div className={styles.profileHeader}>
            <h2>User Profile</h2>
            <button
              onClick={handleLogout}
              className={styles.logoutButton}
              aria-label="Logout"
            >
              Logout
            </button>
          </div>
          <div className={styles.profileContent}>
            {/* User info and avatar */}
            <div className={styles.profileSection}>
              <div className={styles.avatar} aria-label="User avatar">
                {user?.photo ? (
                  <img
                    src={userService.getUserImageUrl(user.photo)}
                    alt={`Profile photo of ${user.name}`}
                    className={styles.avatarImage}
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = "/default-avatar.jpg";
                    }}
                  />
                ) : (
                  <span className={styles.avatarFallback}>
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </span>
                )}
              </div>
              <div className={styles.userInfo}>
                <h3>{user?.name || "User"}</h3>
                <p className={styles.userEmail}>{user?.email}</p>
                <p className={styles.userRole}>Role: {user?.role}</p>
              </div>
            </div>

            {/* Account info and preferences */}
            <div className={styles.profileDetails}>
              <div className={styles.detailCard}>
                <h4>Account Information</h4>
                <div className={styles.detailItem}>
                  <span>Joined:</span>
                  <span>
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span>Last Updated:</span>
                  <span>
                    {user?.updatedAt
                      ? new Date(user.updatedAt).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
              </div>

              <div className={styles.detailCard}>
                <h4>Preferences</h4>
                <div className={styles.preferenceItem}>
                  <span>Notification Settings</span>
                  <button
                    className={styles.editButton}
                    aria-label="Edit notification settings"
                  >
                    Edit
                  </button>
                </div>
                <div className={styles.preferenceItem}>
                  <span>Language</span>
                  <button
                    className={styles.editButton}
                    aria-label="Edit language"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>

            {/* Update profile form */}
            <div className={styles.updateProfile}>
              <h3>Update Profile</h3>
              <form onSubmit={handleSubmit} className={styles.updateForm}>
                <label>
                  Name:
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={updating}
                  />
                </label>

                <label>
                  Email:
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={updating}
                  />
                </label>

                <label>
                  Photo:
                  <input
                    type="file"
                    name="photo"
                    accept="image/*"
                    onChange={handleChange}
                    disabled={updating}
                    ref={fileInputRef}
                  />
                </label>

                <button
                  type="submit"
                  disabled={updating}
                  className={styles.saveButton}
                  aria-label="Save changes"
                >
                  {updating ? "Updating..." : "Save Changes"}
                </button>
              </form>
              {error && <p className={styles.errorText}>{error}</p>}
            </div>

            {/* Action buttons */}
            <div className={styles.actionButtons}>
              <button
                onClick={() => setShowUpdatePassword(true)}
                className={styles.actionButton}
                aria-label="Change password"
              >
                Change Password
              </button>
              <button
                onClick={handleDeleteAccount}
                className={styles.actionButtonDanger}
                aria-label="Delete account"
              >
                Delete Account
              </button>
            </div>

            {/* UpdatePassword modal */}
            {showUpdatePassword && (
              <div
                className={styles.modalOverlay}
                tabIndex={-1}
                aria-modal="true"
                role="dialog"
              >
                <div className={styles.modal}>
                  <UpdatePassword
                    onClose={() => setShowUpdatePassword(false)}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
