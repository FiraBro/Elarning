// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { userService } from "../service/api";
// import styles from "./Profile.module.css";

// const Profile = () => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [updating, setUpdating] = useState(false);
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     photo: null,
//   });

//   const navigate = useNavigate();
//   const fileInputRef = useRef(null);

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const { data } = await userService.getMe();
//         setUser(data.user);
//         setFormData({
//           name: data.user.name || "",
//           email: data.user.email || "",
//           photo: null,
//         });
//         setLoading(false);
//       } catch (err) {
//         const message = err.response?.data?.message || err.message;
//         setError(message);
//         setLoading(false);

//         if (err.response?.status === 401) {
//           navigate("/login");
//         }
//       }
//     };

//     fetchUserData();
//   }, [navigate]);

//   const handleLogout = () => {
//     userService.logout();
//     navigate("/login");
//   };

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     if (name === "photo") {
//       setFormData((prev) => ({ ...prev, photo: files[0] }));
//     } else {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setUpdating(true);
//     setError("");

//     try {
//       const data = await userService.updateUser(formData);
//       setUser(data.user);
//       alert("Profile updated successfully!");
//       // Keep name and email, only clear photo
//       setFormData((prev) => ({
//         ...prev,
//         photo: null,
//       }));
//       // Clear the file input field visually
//       if (fileInputRef.current) {
//         fileInputRef.current.value = "";
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || err.message);
//     } finally {
//       setUpdating(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className={styles.loadingContainer}>
//         <div className={styles.spinner}></div>
//         <p>Loading profile...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className={styles.errorContainer}>
//         <p className={styles.errorText}>{error}</p>
//         <Link to="/login" className={styles.authLink}>
//           Back to Login
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div className={styles.profileContainer}>
//       <div className={styles.profileHeader}>
//         <h2>User Profile</h2>
//         <button onClick={handleLogout} className={styles.logoutButton}>
//           Logout
//         </button>
//       </div>

//       <div className={styles.profileContent}>
//         <div className={styles.profileSection}>
//           <div className={styles.avatar}>
//             {user?.photo ? (
//               <img
//                 src={`http://localhost:5000/img/users/${
//                   user.photo
//                 }?${new Date().getTime()}`}
//                 alt={user.name}
//                 className={styles.avatarImage}
//               />
//             ) : (
//               user?.name?.charAt(0).toUpperCase() || "U"
//             )}
//           </div>
//           <div className={styles.userInfo}>
//             <h3>{user?.name || "User"}</h3>
//             <p className={styles.userEmail}>{user?.email}</p>
//             <p className={styles.userRole}>Role: {user?.role}</p>
//           </div>
//         </div>

//         <div className={styles.profileDetails}>
//           <div className={styles.detailCard}>
//             <h4>Account Information</h4>
//             <div className={styles.detailItem}>
//               <span>Joined:</span>
//               <span>{new Date(user?.createdAt).toLocaleDateString()}</span>
//             </div>
//             <div className={styles.detailItem}>
//               <span>Last Updated:</span>
//               <span>{new Date(user?.updatedAt).toLocaleDateString()}</span>
//             </div>
//           </div>

//           <div className={styles.detailCard}>
//             <h4>Preferences</h4>
//             <div className={styles.preferenceItem}>
//               <span>Notification Settings</span>
//               <button className={styles.editButton}>Edit</button>
//             </div>
//             <div className={styles.preferenceItem}>
//               <span>Language</span>
//               <button className={styles.editButton}>Edit</button>
//             </div>
//           </div>
//         </div>

//         <div className={styles.updateProfile}>
//           <h3>Update Profile</h3>
//           <form onSubmit={handleSubmit} className={styles.updateForm}>
//             <label>
//               Name:
//               <input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 required
//                 disabled={updating}
//               />
//             </label>

//             <label>
//               Email:
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 required
//                 disabled={updating}
//               />
//             </label>

//             <label>
//               Photo:
//               <input
//                 type="file"
//                 name="photo"
//                 accept="image/*"
//                 onChange={handleChange}
//                 disabled={updating}
//                 ref={fileInputRef}
//               />
//             </label>

//             <button
//               type="submit"
//               disabled={updating}
//               className={styles.saveButton}
//             >
//               {updating ? "Updating..." : "Save Changes"}
//             </button>
//           </form>
//           {error && <p className={styles.errorText}>{error}</p>}
//         </div>

//         <div className={styles.actionButtons}>
//           <Link to="/update-password" className={styles.actionButton}>
//             Change Password
//           </Link>
//           <Link to="/delete-account" className={styles.actionButtonDanger}>
//             Delete Account
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Profile;

import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { userService } from "../service/api";
import styles from "./Profile.module.css";

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

  const handleLogout = () => {
    userService.logout();
    navigate("/login");
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo") {
      setFormData((prev) => ({ ...prev, photo: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError("");

    try {
      const data = await userService.updateUser(formData);
      setUser(data.user);
      alert("Profile updated successfully!");
      setFormData((prev) => ({
        ...prev,
        photo: null,
      }));
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (!confirmed) return;

    try {
      await userService.deleteMe();
      alert("Your account has been deleted.");
      userService.logout();
      navigate("/login");
    } catch (err) {
      alert(err.message || "Failed to delete account.");
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading profile...</p>
      </div>
    );
  }

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
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
        <h2>User Profile</h2>
        <button className={styles.homeBtn} onClick={() => navigate("/")}>
          Home
        </button>
        <button onClick={handleLogout} className={styles.logoutButton}>
          Logout
        </button>
      </div>

      <div className={styles.profileContent}>
        {/* User info and avatar */}
        <div className={styles.profileSection}>
          <div className={styles.avatar}>
            {user?.photo ? (
              <img
                src={`http://localhost:5000/img/users/${
                  user.photo
                }?${new Date().getTime()}`}
                alt={user.name}
                className={styles.avatarImage}
              />
            ) : (
              user?.name?.charAt(0).toUpperCase() || "U"
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
              <span>{new Date(user?.createdAt).toLocaleDateString()}</span>
            </div>
            <div className={styles.detailItem}>
              <span>Last Updated:</span>
              <span>{new Date(user?.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>

          <div className={styles.detailCard}>
            <h4>Preferences</h4>
            <div className={styles.preferenceItem}>
              <span>Notification Settings</span>
              <button className={styles.editButton}>Edit</button>
            </div>
            <div className={styles.preferenceItem}>
              <span>Language</span>
              <button className={styles.editButton}>Edit</button>
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
          >
            Change Password
          </button>
          <button
            onClick={handleDeleteAccount}
            className={styles.actionButtonDanger}
          >
            Delete Account
          </button>
        </div>

        {/* Optional: UpdatePassword modal */}
        {showUpdatePassword && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <UpdatePassword onClose={() => setShowUpdatePassword(false)} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
