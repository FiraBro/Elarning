const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../config/jwt");
const { sendEmail } = require("../services/emailService");
const crypto = require("crypto");

const register = async (req, res) => {
  const { name, email, password,role } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    user = new User({ name, email, password,role });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    const token = generateToken(user);
    res.status(201).json({ status: "success", token });
  } catch (error) {
    res.status(500).json({ status: "fail", message: "Server error" });
  }
};

const login = async (req, res) => {
  const { email, password ,role} = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ status: "fail", message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ status: "fail", message: "Invalid credentials" });

    const token = generateToken(user);
    res.status(200).json({ status: "success", token });
  } catch (error) {
    res.status(500).json({ status: "fail", message: "Server error" });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ status: "fail", message: "User not found" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    await sendEmail({
      to: user.email,
      subject: "Password Reset Request",
      text: `You requested a password reset. Click this link to reset your password: ${resetUrl}\n\nThis link expires in 1 hour.`,
    });

    res
      .status(200)
      .json({ status: "success", message: "Password reset email sent" });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ status: "fail", message: "Server error" });
  }
};

const resetPassword = async (req, res) => {
  const { token, password } = req.body;
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user)
      return res
        .status(400)
        .json({ status: "fail", message: "Invalid or expired token" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res
      .status(200)
      .json({ status: "success", message: "Password reset successful" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ status: "fail", message: "Server error" });
  }
};

module.exports = { register, login, forgotPassword, resetPassword };
