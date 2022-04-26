const express = require("express");

const router = express.Router();

router.get("/add-product", (_req, res, _next) => {
  res.send(
    '<form action="/product" method="POST"><input type="text" name="title"/><button type="submit">Add product</button><a href="/product">To products<a/></form>'
  );
  // console.log("Add product middleware");
});

router.post("/product", (req, res, next) => {
  console.log(req.body);
  res.redirect("/");
  // res.setHeader("Location", "/");
  // res.statusCode = 302;
  // res.end();
});

module.exports = router;
