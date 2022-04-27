const express = require("express");

const router = express.Router();

// /admin/add-product => GET
router.get("/add-product", (_, res) => {
  res.send(
    '<form action="/admin/add-product" method="POST"><input type="text" name="title"/><button type="submit">Add product</button><a href="/product">To products<a/></form>'
  );
});

// /admin/add-product => POST
router.post("/add-product", (req, res, next) => {
  res.redirect("/");
});

module.exports = router;
