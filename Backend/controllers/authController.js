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
const register = catchAsync(async (req, res, next) => {
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
const login = catchAsync(async (req, res, next) => {
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
const forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email.toLowerCase() });
  if (!user) {
    return next(new AppError("No user found with that email address", 404));
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  try {
    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/auth/reset-password/${resetToken}`;

    await sendEmail({
      to: user.email,
      subject: "Your password reset token (valid for 10 min)",
      template: "passwordReset",
      context: {
        name: user.name,
        resetURL,
      },
    });

    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        "There was an error sending the email. Try again later!",
        500
      )
    );
  }
});

/**
 * @desc    Reset password
 * @route   PATCH /api/auth/reset-password/:token
 * @access  Public
 */
const resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }

  // 3) Update password and remove reset token fields
  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.passwordChangedAt = Date.now();
  await user.save();

  // 4) Log the user in, send JWT
  const token = generateToken(user._id);

  // 5) Send confirmation email
  sendEmail({
    to: user.email,
    subject: "Your password has been changed",
    template: "passwordChanged",
    context: {
      name: user.name,
    },
  }).catch((err) => console.error("Error sending password change email:", err));

  res.status(200).json({
    status: "success",
    token,
    message: "Password updated successfully",
  });
});

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
};
