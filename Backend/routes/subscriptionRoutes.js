const express = require("express");
const router = express.Router();

const subscriberController = require("../controllers/subscriptionController");

router.post("/subscriber", subscriberController.subscription);

module.exports = router;
