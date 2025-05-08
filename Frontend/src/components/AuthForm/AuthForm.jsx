import { useState } from "react";
import style from "./AuthForm.module.css";
import Button from "../Button/Button";

const AuthForm = ({ onSubmit, isLogin }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!isLogin && !name) newErrors.name = "Name is required";
    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (!isLogin) {
      if (!confirmPassword)
        newErrors.confirmPassword = "Please confirm your password";
      else if (password !== confirmPassword)
        newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      if (isLogin) {
        onSubmit({ email, password });
      } else {
        onSubmit({ name, email, password, passwordConfirm: confirmPassword });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className={style.form}>
      {!isLogin && (
        <div className={style.formGroup}>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={errors.name ? style.errorInput : ""}
          />
          {errors.name && <span className={style.error}>{errors.name}</span>}
        </div>
      )}

      <div className={style.formGroup}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={errors.email ? style.errorInput : ""}
        />
        {errors.email && <span className={style.error}>{errors.email}</span>}
      </div>

      <div className={style.formGroup}>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={errors.password ? style.errorInput : ""}
        />
        {errors.password && (
          <span className={style.error}>{errors.password}</span>
        )}
      </div>

      {!isLogin && (
        <div className={style.formGroup}>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={errors.confirmPassword ? style.errorInput : ""}
          />
          {errors.confirmPassword && (
            <span className={style.error}>{errors.confirmPassword}</span>
          )}
        </div>
      )}

      <Button type="submit">{isLogin ? "Login" : "Sign Up"}</Button>
    </form>
  );
};

export default AuthForm;
