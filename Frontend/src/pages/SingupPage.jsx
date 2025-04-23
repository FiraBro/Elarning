// src/pages/SignupPage/SignupPage.jsx
import { useNavigate } from 'react-router-dom';
// import AuthForm from '../../components/AuthForm/AuthForm';
import AuthForm from '../components/AuthForm/AuthForm';
import styles from './SingupPage.module.css';

const SingnupPage = () => {
  const navigate = useNavigate();

  const handleSignup = async (credentials) => {
    // Here you would typically make an API call to your backend
    console.log('Signup with:', credentials);
    // Simulate successful signup
    setTimeout(() => {
      navigate('/dashboard'); // Redirect after signup
    }, 1000);
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

export default SingnupPage;