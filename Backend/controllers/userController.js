const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getAllUser = catchAsync(async (req, res, next) => {
  const users = await User.find();
  if (!users) {
    return next(new AppError("No user is found please try again later!", 400));
  }
  res.status(200).json({
    status: "success",
    length:users.length,
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
exports.getMe = catchAsync(async(req,res,next)=>{

})
exports.createUser = (req, res) => {
    res.status(500).json({
      status: 'fail',
      message: 'This route is not defined! Please use /register instead'
    });
  };