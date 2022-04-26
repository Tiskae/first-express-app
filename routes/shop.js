const express = require("express");

const router = express.Router();

router.use("/", (_req, res, _next) => {
  // console.log("Root path middleware");
  res.send("<h1>Hello from Express</h1>");
});

module.exports = router;
