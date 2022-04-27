const express = require("express");

const router = express.Router();

router.get("/", (_, res) => {
  // console.log("Root path middleware");
  res.send("<h1>Hello from Express</h1>");
});

module.exports = router;
