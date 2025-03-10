const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Server is up and running !!!");
});
router.get("/health-check", (req, res) => {
  res.send("Server is healthy");
});

module.exports = router;
