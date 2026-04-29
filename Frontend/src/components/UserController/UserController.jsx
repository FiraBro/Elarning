import React, { useEffect, useState, useMemo } from "react";
import { Trash2, User, Search, ShieldCheck, Mail, Loader2 } from "lucide-react";
import styles from "./UserController.module.css";
import { userService } from "../../service/api";

const UserController = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const usersData = await userService.getAllUsers();
      // Adjust based on your API structure (e.g., usersData.data.users)
      setUsers(Array.isArray(usersData) ? usersData : usersData.data || []);
    } catch (err) {
      setError(err.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (userId, userName) => {
    if (
      !window.confirm(
        `Are you sure you want to delete ${userName}? This action cannot be undone.`,
      )
    )
      return;

    try {
      await userService.deleteUser(userId);
      setUsers(users.filter((user) => user._id !== userId));
    } catch (err) {
      alert("Error deleting user: " + err.message);
    }
  };

  // Professional filtering logic
  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [users, searchTerm]);

  if (loading)
    return (
      <div className={styles.centerBox}>
        <Loader2 className={styles.spinner} />
        <p>Syncing User Database...</p>
      </div>
    );

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>User Management</h1>
          <p>Manage access levels and account status for all members.</p>
        </div>
        <div className={styles.stats}>
          <strong>{users.length}</strong> <span>Total Users</span>
        </div>
      </header>

      <div className={styles.actionBar}>
        <div className={styles.searchWrapper}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      {error && <div className={styles.errorAlert}>{error}</div>}

      <div className={styles.tableCard}>
        <table className={styles.userTable}>
          <thead>
            <tr>
              <th>User</th>
              <th>Status/Role</th>
              <th>Joined</th>
              <th className={styles.textRight}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td>
                    <div className={styles.userProfile}>
                      <div className={styles.avatarWrapper}>
                        {user.photo ? (
                          <img
                            src={`http://localhost:5005/uploads/userImage/${user.photo}`}
                            alt={user.name}
                            className={styles.avatar}
                          />
                        ) : (
                          <div className={styles.avatarPlaceholder}>
                            <User size={20} />
                          </div>
                        )}
                      </div>
                      <div className={styles.userMeta}>
                        <span className={styles.userName}>{user.name}</span>
                        <span className={styles.userEmail}>
                          <Mail size={12} /> {user.email}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span
                      className={`${styles.roleBadge} ${styles[user.role?.toLowerCase()]}`}
                    >
                      <ShieldCheck size={12} /> {user.role}
                    </span>
                  </td>
                  <td className={styles.dateCell}>
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className={styles.textRight}>
                    <button
                      onClick={() => handleDelete(user._id, user.name)}
                      className={styles.deleteIconButton}
                      title="Delete User"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className={styles.emptyState}>
                  No users found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserController;
