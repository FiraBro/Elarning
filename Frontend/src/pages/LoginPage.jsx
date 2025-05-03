import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthForm from "../components/AuthForm/AuthForm";
import styles from "./LoginPage.module.css";
import { userService } from "../service/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginPage = () => {
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");

    if (token && userRole) {
      if (userRole === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [navigate]);

  const handleLogin = async (credentials) => {
    try {
      const { data } = await userService.login(credentials);
      if (data.user.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (error) {
      toast.error(
        "Login failed: " + (error.response?.data?.message || error.message)
      );
    }
  };

  return (
    <div className={styles.loginPage}>
      <ToastContainer position="top-center" autoClose={3000} />
      <h1>Login</h1>
      <AuthForm onSubmit={handleLogin} isLogin={true} />

      <div style={{ marginTop: "15px" }}>
        <Link
          to="/forgot-password"
          style={{ color: "#4CAF50", textDecoration: "none" }}
        >
          Forgot Password?
        </Link>
      </div>

      <p className={styles.signupLink}>
        Don't have an account? <Link to="/signup">Sign up</Link>
      </p>
    </div>
  );
};

export default LoginPage;
