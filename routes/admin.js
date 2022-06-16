const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const isAuth = require("../middleware/is-auth");

const adminController = require("../controllers/admin");

// // /admin/add-product => GET
router.get("/add-product", adminController.getAddProducts);

// // /admin/add-product => POST
router.post(
  "/add-product",
  isAuth,
  [
    body("title", "Please enter a valid title").isLength({ min: 3 }).trim(),
    body("price", "Please enter a valid price").isFloat(),
    body("description", "Please enter a valid description")
      .isLength({ min: 5, max: 400 })
      .trim(),
  ],
  adminController.postAddProducts
);

// // /admin/edit-products => GET
router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);

router.post(
  "/edit-product",
  isAuth,
  [
    body("title", "Please enter a valid title").isLength({ min: 3 }).trim(),
    body("price", "Please enter a valid price").isFloat(),
    body("description", "Please enter a valid description")
      .isLength({ min: 5, max: 400 })
      .trim(),
  ],
  adminController.postEditProduct
);

// // /admin/products => GET
router.get("/products", isAuth, adminController.getProducts);

// // /admim/delete-product
router.post("/delete-product", isAuth, adminController.postDeleteProduct);

module.exports = router;
