const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const filterObj = (obj, allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
exports.getAllUser = catchAsync(async (req, res, next) => {
  const users = await User.find();
  if (!users) {
    return next(new AppError("No user is found please try again later!", 400));
  }
  res.status(200).json({
    status: "success",
    length: users.length,
    data: {
      users,
    },
  });
});
exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError("No User is Found with this ID.", 400));
  }
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});
exports.getMe = catchAsync(async (req, res, next) => {
  req.params.id = req.user.id;
  next();
});
exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password) {
    return next(
      new AppError(
        "This not the right place for updating password,please use reset-password instead!",
        400
      )
    );
  }
  const filteredFields = filterObj(req.body, "name", "email");
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    filteredFields,
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({
    status: "success",
    user: updatedUser,
  });
});
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndDelete(req.user.id, { active: false });
  res.status(200).json({
    status: "success",
    data: null,
  });
});
exports.deleteUser = catchAsync(async (req, res, next) => {
  const doc = await User.findByIdAndDelete(req.params.id);
  if (!doc) {
    return next(new AppError("No document is found with this ID!", 400));
  }
  res.status(200).json({
    status: "success",
    message: "User with this ID is successfully deleted",
  });
});
exports.createUser = (req, res) => {
  res.status(500).json({
    status: "fail",
    message: "This route is not defined! Please use /register instead",
  });
};
