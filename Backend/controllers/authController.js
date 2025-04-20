const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../config/jwt");
const Email = require("../services/emailService");
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

  // 2) Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(
      new AppError("Email already in use. Please use another email", 409)
    );
  }

  // 3) Create user
  const newUser = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    role: role || "student",
  });

  // 4) Generate token
  const token = generateToken(newUser._id);

  // 5) Remove password from output
  newUser.password = undefined;
  // 6) Send welcome email (in background)
  new Email(newUser, process.env.FRONTEND_URL) // <-- Fix here
    .sendWelcome()
    .catch((err) => console.error("Error sending welcome email:", err));

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

  // 2) Find user and validate password
  const user = await User.findOne({ email: email.toLowerCase() }).select(
    "+password +active"
  );
  if (
    !user ||
    !user.password ||
    !(await user.correctPassword(password, user.password))
  ) {
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
exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  if (!email || !validator.isEmail(email)) {
    return next(new AppError("Please provide a valid email address", 400));
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ status: "fail", message: "User not found" });
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.passwordResetToken = hashedToken;
  user.passwordResetExpires = Date.now() + 3600000; // 1 hour
  await user.save();

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  await new Email(user, resetUrl)
    .sendPasswordReset()
    .catch((err) => console.log(err));

  res.status(200).json({
    status: "success",
    message: "Password reset email sent",
  });
});

/**
 * @desc    Reset password
 * @route   POST /api/auth/reset-password/:token
 * @access  Public
 */
exports.resetPassword = catchAsync(async (req, res, next) => {
  const { password } = req.body;

  // Validate password
  if (!password || password.length < 8) {
    return next(
      new AppError("Password must be at least 8 characters long", 400)
    );
  }

  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.passwordChangedAt = Date.now();
  await user.save();

  await sendEmail({
    to: user.email,
    subject: "Your password has been changed",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color: #333;">Password Updated</h2>
        <p>Hello ${user.name || "User"},</p>
        <p>Your password was successfully changed on ${new Date().toLocaleString()}.</p>
        <p>If you didn't make this change, please contact us immediately.</p>
      </div>
    `,
  });

  const token = generateToken(user._id);

  res.status(200).json({
    status: "success",
    token,
    message: "Password updated successfully",
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  // 1. Check if token exists in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }

  // 2. Verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // 3. Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError("The user belonging to this token no longer exists.", 401)
    );
  }

  // 4. Grant access to protected route
  req.user = currentUser;
  next();
});
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }

    next();
  };
};
