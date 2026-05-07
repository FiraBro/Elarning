import { useNavigate, Link } from "react-router-dom";
import AuthForm from "../components/AuthForm/AuthForm";
import { userService } from "../service/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./SingupPage.module.css";
const SignupPage = () => {
  const navigate = useNavigate();

  const handleSignup = async (credentials) => {
    try {
      const result = await userService.signup(credentials);
      const user = result.data.user;

      if (user.role === "student") {
        navigate("/");
      } else if (user.role === "admin") {
        navigate("/admin/dashboard");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Signup failed. Please try again.",
      );
    }
  };

  return (
    <div className={styles.pageRoot}>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        theme="dark"
        role="alert"
      />

      {/* Left branding panel */}
      <aside className={styles.brandPanel} aria-hidden="true">
        <div className={styles.brandInner}>
          <div className={styles.logoMark}>
            <span className={styles.logoIcon}>⬡</span>
          </div>

          <h2 className={styles.brandHeading}>
            Start your journey
            <br />
            <em>today.</em>
          </h2>

          <ul className={styles.perks}>
            <li>
              <span className={styles.perkIcon}>✦</span>
              Access 340+ expert-led courses
            </li>
            <li>
              <span className={styles.perkIcon}>✦</span>
              Learn at your own pace, on any device
            </li>
            <li>
              <span className={styles.perkIcon}>✦</span>
              Earn certificates recognized by employers
            </li>
            <li>
              <span className={styles.perkIcon}>✦</span>
              Join a community of 12,000+ learners
            </li>
          </ul>

          <div className={styles.avatarRow}>
            <div className={styles.avatarStack}>
              {["AK", "RS", "MJ", "TL"].map((initials) => (
                <div key={initials} className={styles.avatar}>
                  {initials}
                </div>
              ))}
            </div>
            <p className={styles.avatarCaption}>
              Join thousands already learning
            </p>
          </div>
        </div>
      </aside>

      {/* Right form panel */}
      <main className={styles.formPanel}>
        <div className={styles.formCard}>
          {/* Mobile logo */}
          <div className={styles.mobileLogo} aria-hidden="true">
            <span className={styles.logoIcon}>⬡</span>
          </div>

          <div className={styles.formHeader}>
            <h1 className={styles.heading}>Create your account</h1>
            <p className={styles.subheading}>
              Free forever. No credit card required.
            </p>
          </div>

          <AuthForm onSubmit={handleSignup} isLogin={false} />

          <p className={styles.loginPrompt}>
            Already have an account?{" "}
            <Link to="/login" className={styles.loginLink}>
              Sign in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default SignupPage;
