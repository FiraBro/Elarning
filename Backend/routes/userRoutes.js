const express = require("express");
const userRouter = express.Router();
const userController = require("../controllers/userController");
userRouter.route("/").get(userController.getAllUser);
userRouter.route("/").post(userController.createUser);

module.exports = userRouter;
