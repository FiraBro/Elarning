// src/components/Button/Button.jsx
import styles from "./Button.module.css";

const Button = ({ children, onClick, type = "button" }) => {
  return (
    <button type={type} className={styles.button} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
