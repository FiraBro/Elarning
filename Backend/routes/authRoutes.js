const express = require("express");
const {
  register,
  login,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");
const { validateRegister, validateLogin } = require("../utils/validation");

const router = express.Router();

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

module.exports = router;
