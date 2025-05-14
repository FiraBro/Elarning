const Subscriber = require("../models/subscription");
exports.subscription = async (req, res) => {
  const { email } = req.body;

  // Basic validation
  if (!email || !email.includes("@")) {
    return res.status(400).json({ error: "Invalid email" });
  }

  try {
    // Check if email already exists
    const existing = await Subscriber.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Already subscribed" });
    }

    // Save new subscriber
    const subscriber = new Subscriber({ email });
    await subscriber.save();

    res.status(201).json({ message: "Subscribed successfully" });

    // Optional: trigger a confirmation email here
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
};
