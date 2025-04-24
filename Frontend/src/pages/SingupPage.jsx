import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm/AuthForm";
import { userService } from "../service/api";
import styles from "./SingupPage.module.css";

const SignupPage = () => {
  const navigate = useNavigate();

  const handleSignup = async (credentials) => {
    try {
      const { data } = await userService.signup(credentials);
      console.log(data.user);
      if (data.user.role === "student") {
        navigate("/");
      } else if (data.user.role === "admin") {
        navigate("/dashboard");
      }
    } catch (error) {
      alert(error.response?.data?.error || "Signup failed. Please try again.");
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
