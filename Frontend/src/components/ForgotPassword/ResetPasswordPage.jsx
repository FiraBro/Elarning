import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { userService } from "../../service/api";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle password reset submission
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await userService.resetPassword(token, newPassword, confirmPassword);
      setSuccess("Password reset successful. You can now log in.");
      setTimeout(() => {
        navigate("/login"); // Redirect to login after success
      }, 3000);
    } catch (err) {
      setError(
        "Error resetting password: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "50px auto", textAlign: "center" }}>
      <h1>Reset Password</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <form onSubmit={handleResetPassword}>
        <input
          type="password"
          required
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          style={{ padding: "10px", width: "100%", marginBottom: "10px" }}
        />
        <input
          type="password"
          required
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={{ padding: "10px", width: "100%", marginBottom: "10px" }}
        />
        <button
          type="submit"
          style={{ padding: "10px 20px" }}
          disabled={loading || newPassword !== confirmPassword}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
