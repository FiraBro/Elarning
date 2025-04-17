const express = require("express");
const userRouter = express.Router();
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
userRouter
  .route("/")
  .get(
    authController.protect,
    authController.restrictTo("admin"),
    userController.getAllUser
  );
userRouter.route("/").post(userController.createUser);
module.exports = userRouter;
