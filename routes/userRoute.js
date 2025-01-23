const express = require("express");
const router = express.Router();

// Example route: GET all users (dummy response for now)
router.get("/", (req, res) => {
  res.json([{ name: "Ziada Libse", email: "z@petra.com" }]);
});

module.exports = router;
