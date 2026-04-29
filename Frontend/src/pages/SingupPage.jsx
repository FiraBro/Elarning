import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm/AuthForm";
import { userService } from "../service/api";
import styles from "./SingupPage.module.css";

const SignupPage = () => {
  const navigate = useNavigate();

  const handleSignup = async (credentials) => {
    try {
      const result = await userService.signup(credentials); // result = { token, data: { user } }
      const user = result.data.user;

      if (user.role === "student") {
        navigate("/");
      } else if (user.role === "admin") {
        navigate("/admin/dashboard");
      }
    } catch (error) {
      console.log("Signup error:", error);
      alert(error.message || "Signup failed. Please try again.");
    }
  };

  return (
    <div className={styles.signupPage}>
      <h1>Sign Up</h1>
      <AuthForm onSubmit={handleSignup} isLogin={false} />
      <p className={styles.loginLink}>
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
};

export default SignupPage;
