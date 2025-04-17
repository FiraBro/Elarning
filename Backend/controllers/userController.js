const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getAllUser = catchAsync(async (req, res, next) => {
  const user = await User.find();
  if (!user) {
    return next(new AppError("No user is found please rty again later!", 400));
  }
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

