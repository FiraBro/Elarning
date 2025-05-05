import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import AuthForm from "../components/AuthForm/AuthForm";
import styles from "./LoginPage.module.css";
import { userService } from "../service/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);

  const from = (location.state && location.state.from) || "/";

  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    const userRole =
      localStorage.getItem("userRole") || sessionStorage.getItem("userRole");

    if (token && userRole) {
      if (userRole === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    }
  }, [navigate, from]);

  const handleLogin = useCallback(
    async (credentials, rememberMe) => {
      setLoading(true);
      try {
        const { data } = await userService.login(credentials);

        if (rememberMe) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("userRole", data.user.role);
        } else {
          sessionStorage.setItem("token", data.token);
          sessionStorage.setItem("userRole", data.user.role);
        }

        if (data.user.role === "admin") {
          navigate("/admin/dashboard", { replace: true });
        } else {
          navigate(from, { replace: true });
        }
      } catch (error) {
        toast.error(
          "Login failed: " + (error.response?.data?.message || error.message)
        );
      } finally {
        setLoading(false);
      }
    },
    [navigate, from]
  );

  return (
    <div className={styles.loginPage}>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        role="alert"
      />
      <h1 tabIndex={-1}>Login</h1>
      <AuthForm onSubmit={handleLogin} isLogin={true} disabled={loading} />
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
