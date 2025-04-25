import React, { useEffect, useState } from "react";
import styles from "./UserController.module.css";
import { userService } from "../service/api"; // Import from your centralized API file

const UserController = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await userService.getAllUsers();
        setUsers(usersData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    try {
      await userService.deleteUser(userId);
      setUsers(users.filter((user) => user._id !== userId));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className={styles.loading}>Loading users...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;

  return (
    <div className={styles.userContainer}>
      <h2>User Management</h2>

      <div className={styles.userList}>
        {users.length > 0 ? (
          users.map((user) => (
            <div key={user._id} className={styles.userCard}>
              <div className={styles.userInfo}>
                {user.photo && (
                  <img
                    src={`http://localhost:5000/upload/userImage/${user.photo}`}
                    alt={user.name}
                    className={styles.avatar}
                  />
                )}
                <div>
                  <h3>{user.name}</h3>
                  <p>{user.email}</p>
                  <p className={styles.role}>{user.role}</p>
                </div>
              </div>
              <button
                onClick={() => handleDelete(user._id)}
                className={styles.deleteButton}
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <p>No users found</p>
        )}
      </div>
    </div>
  );
};

export default UserController;
