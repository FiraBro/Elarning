const express = require("express");
const userRouter = express.Router();
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
userRouter.use(authController.protect);
userRouter.get(
  "/",
  authController.restrictTo("admin"),
  userController.getAllUser
);
userRouter.delete("/deleteMe", userController.deleteMe);
userRouter.post("/", userController.createUser);
userRouter.get("/me", userController.getMe, userController.getUser);
userRouter.get("/:id", userController.getUser);
userRouter.patch(
  "/updateMe",
  userController.uploadPhoto,
  userController.userPhotoResize,
  userController.updateMe
);
module.exports = userRouter;
