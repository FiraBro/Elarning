// import { useNavigate } from "react-router-dom";
// import AuthForm from "../components/AuthForm/AuthForm";
// import styles from "./LoginPage.module.css";
// // import { userService } from "../../services/api";
// import { userService } from "../service/api";

// const LoginPage = () => {
//   const navigate = useNavigate();

//   const handleLogin = async (credentials) => {
//     try {
//       const { data } = await userService.login(credentials);
//       if (data.user.role === "admin") {
//         navigate("/dashboard");
//       }
//       // console.log(data.user)
//       navigate("/");
//     } catch (error) {
//       alert(
//         "Login failed: " + (error.response?.data?.message || error.message)
//       );
//     }
//   };

//   return (
//     <div className={styles.loginPage}>
//       <h1>Login</h1>
//       <AuthForm onSubmit={handleLogin} isLogin={true} />
//       <p className={styles.signupLink}>
//         Don't have an account? <a href="/singup">Sign up</a>
//       </p>
//     </div>
//   );
// };

// export default LoginPage;


import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from "../components/AuthForm/AuthForm";
import styles from "./LoginPage.module.css";
import { userService } from "../service/api";

const LoginPage = () => {
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");
    
    if (token && userRole) {
      if (userRole === 'admin') {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [navigate]);

  const handleLogin = async (credentials) => {
    try {
       const {data} = await userService.login(credentials);
      if (data.user.role === 'admin') {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (error) {
      alert("Login failed: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className={styles.loginPage}>
      <h1>Login</h1>
      <AuthForm onSubmit={handleLogin} isLogin={true} />
      <p className={styles.signupLink}>
        Don't have an account? <a href="/signup">Sign up</a>
      </p>
    </div>
  );
};

export default LoginPage;

