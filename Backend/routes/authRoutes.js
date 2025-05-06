const express = require("express");
const {
  register,
  login,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");
const { validateRegister, validateLogin } = require("../utils/validation");
const { authLimiter } = require("../middlewares/rateLimit");

const router = express.Router();

router.post("/register", authLimiter, validateRegister, register);
router.post("/login", authLimiter, validateLogin, login);
router.post("/forgot-password", authLimiter, forgotPassword);
router.patch("/reset-password/:token", authLimiter, resetPassword);

module.exports = router;
