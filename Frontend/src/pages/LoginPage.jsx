// src/pages/LoginPage/LoginPage.jsx
import { useNavigate } from 'react-router-dom';
// import AuthForm from '../../components/AuthForm/AuthForm';
import AuthForm from '../components/AuthForm/AuthForm';
import styles from './LoginPage.module.css';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = async (credentials) => {
    // Here you would typically make an API call to your backend
    console.log('Login with:', credentials);
    // Simulate successful login
    setTimeout(() => {
      navigate('/dashboard'); // Redirect after login
    }, 1000);
  };

  return (
    <div className={styles.loginPage}>
      <h1>Login</h1>
      <AuthForm onSubmit={handleLogin} isLogin={true} />
      <p className={styles.signupLink}>
        Don't have an account? <a href="/singup">Sign up</a>
      </p>
    </div>
  );
};

export default LoginPage;