const User = require("../models/User");
// const bcrypt = require("bcryptjs");
const { generateToken } = require("../config/jwt");
const { sendEmail } = require("../services/emailService");
const crypto = require("crypto");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const validator = require("validator");

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.register = catchAsync(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  // 1) Validate input
  if (!name || !email || !password) {
    return next(new AppError("Name, email and password are required", 400));
  }

  if (!validator.isEmail(email)) {
    return next(new AppError("Please provide a valid email", 400));
  }

  if (password.length < 8) {
    return next(
      new AppError("Password must be at least 8 characters long", 400)
    );
  }

  // 2) Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(
      new AppError("Email already in use. Please use another email", 409)
    );
  }

  // 3) Create new user
  const newUser = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    role: role || "student",
  });

  // 4) Generate JWT token
  const token = generateToken(newUser._id);

  // 5) Remove password from output
  newUser.password = undefined;

  // 6) Send welcome email (in background, don't await)
  sendEmail({
    to: newUser.email,
    subject: "Welcome to Our Platform!",
    template: "welcome",
    context: {
      name: newUser.name,
    },
  }).catch((err) => console.error("Error sending welcome email:", err));

  // 7) Send response
  res.status(201).json({
    status: "success",
    token,
    data: {
      user: newUser,
    },
  });
});

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  // 2) Check if user exists and password is correct
  const user = await User.findOne({ email: email.toLowerCase() }).select(
    "+password +active"
  );

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  // 3) Check if account is active
  if (!user.active) {
    return next(
      new AppError(
        "Your account has been deactivated. Please contact support",
        403
      )
    );
  }

  // 4) Update last login
  user.lastLogin = Date.now();
  await user.save();

  // 5) Generate token
  const token = generateToken(user._id);

  // 6) Remove sensitive data
  user.password = undefined;
  user.active = undefined;

  // 7) Send response
  res.status(200).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
});

/**
 * @desc    Forgot password
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
exports.forgotPassword = async (req, res) => {
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

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1. Get user based on token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2. If token invalid or expired
  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }

  // 3. Update password
  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.passwordChangedAt = Date.now();
  await user.save();

  // 4. Send confirmation email
  await sendEmail({
    email: user.email,
    subject: "Your password has been changed",
    message: "Your password was successfully updated.",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color: #333;">Password Updated</h2>
        <p>Hello ${user.name || "User"},</p>
        <p>Your password was successfully changed on ${new Date().toLocaleString()}.</p>
        <p>If you didn't make this change, please contact us immediately.</p>
      </div>
    `,
  });

  // 5. Create and send JWT
  const token = generateToken(user._id);

  res.status(200).json({
    status: "success",
    token,
    message: "Password updated successfully",
  });
});
