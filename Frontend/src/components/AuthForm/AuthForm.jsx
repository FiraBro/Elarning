// import { useState } from "react";
// import style from "./AuthForm.module.css";
// import Button from '../Button/Button'
// const AuthForm = ({ onSubmit, isLogin }) => {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [role, setRole] = useState("");

//   const [errors, setErrors] = useState({});

//   const validate = () => {
//     const newErrors = {};
//     if (!isLogin && !name) newErrors.name = "Name is required";
//     if (!email) newErrors.email = "Email is required";
//     else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";
//     if (!password) newErrors.password = "Password is required";
//     else if (password.length < 8)
//       newErrors.password = "Password must be at least 8 characters";
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (validate()) {
//       if (isLogin) {
//         onSubmit({ email, password });
//       } else {
//         onSubmit({ name, email, password });
//       }
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className={style.form}>
//       {!isLogin && (
//         <div className={style.formGroup}>
//           <label htmlFor="name">Name</label>
//           <input
//             type="text"
//             id="name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             className={errors.name ? style.errorInput : ""}
//           />
//           {errors.name && <span className={style.error}>{errors.name}</span>}
//         </div>
//       )}

//       <div className={style.formGroup}>
//         <label htmlFor="email">Email</label>
//         <input
//           type="email"
//           id="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className={errors.email ? style.errorInput : ""}
//         />
//         {errors.email && <span className={style.error}>{errors.email}</span>}
//       </div>

//       <div className={style.formGroup}>
//         <label htmlFor="password">Password</label>
//         <input
//           type="password"
//           id="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className={errors.password ? style.errorInput : ""}
//         />
//         {errors.password && (
//           <span className={style.error}>{errors.password}</span>
//         )}
//       </div>
//       <div className={style.formGroup}>
//         <label htmlFor="password">Password</label>
//         <input
//           type="text"
//           id="text"
//           value={role}
//           onChange={(e) => setPassword(e.target.value)}
//           className={errors.role ? style.errorInput : ""}
//         />
//         {errors.role && (
//           <span className={style.error}>{errors.role}</span>
//         )}
//       </div>

//       <Button type="submit">{isLogin ? "Login" : "Sign Up"}</Button>

//     </form>
//   );
// };
// export default AuthForm;

import { useState } from "react";
import style from "./AuthForm.module.css";
import Button from "../Button/Button";

const AuthForm = ({ onSubmit, isLogin }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!isLogin && !name) newErrors.name = "Name is required";
    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (!isLogin && !role) newErrors.role = "Role is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      if (isLogin) {
        onSubmit({ email, password });
      } else {
        onSubmit({ name, email, password, role });
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
          <label htmlFor="role">Role</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className={errors.role ? style.errorInput : ""}
          >
            <option value="">Select a role</option>
            <option value="student">Student</option>
            <option value="admin">Admin</option>
            <option value="instructor">Instructor</option>
          </select>
          {errors.role && <span className={style.error}>{errors.role}</span>}
        </div>
      )}

      <Button type="submit">{isLogin ? "Login" : "Sign Up"}</Button>
    </form>
  );
};

export default AuthForm;
