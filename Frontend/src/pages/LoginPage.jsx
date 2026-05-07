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
          "Login failed: " + (error.response?.data?.message || error.message),
        );
      } finally {
        setLoading(false);
      }
    },
    [navigate, from],
  );

  return (
    <div className={styles.pageRoot}>
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
        theme="dark"
        role="alert"
      />

      {/* Left panel — branding */}
      <aside className={styles.brandPanel} aria-hidden="true">
        <div className={styles.brandInner}>
          <div className={styles.logoMark}>
            <span className={styles.logoIcon}>⬡</span>
          </div>
          <blockquote className={styles.tagline}>
            <p>"The expert in anything was once a beginner."</p>
            <cite>— Helen Hayes</cite>
          </blockquote>
          <div className={styles.brandStats}>
            <div className={styles.stat}>
              <span className={styles.statNum}>12k+</span>
              <span className={styles.statLabel}>Students</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statNum}>340+</span>
              <span className={styles.statLabel}>Courses</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statNum}>98%</span>
              <span className={styles.statLabel}>Satisfaction</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Right panel — form */}
      <main className={styles.formPanel}>
        <div className={styles.formCard}>
          {/* Mobile logo */}
          <div className={styles.mobileLogo} aria-hidden="true">
            <span className={styles.logoIcon}>⬡</span>
          </div>

          <div className={styles.formHeader}>
            <h1 className={styles.heading} tabIndex={-1}>
              Welcome back
            </h1>
            <p className={styles.subheading}>
              Sign in to continue your learning journey
            </p>
          </div>

          <AuthForm onSubmit={handleLogin} isLogin={true} disabled={loading} />

          <div className={styles.forgotRow}>
            <Link to="/forgot-password" className={styles.forgotLink}>
              Forgot your password?
            </Link>
          </div>

          <p className={styles.signupPrompt}>
            New here?{" "}
            <Link to="/signup" className={styles.signupLink}>
              Create a free account
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
