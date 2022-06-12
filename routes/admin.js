const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const adminController = require("../controllers/admin");

// // /admin/add-product => GET
router.get("/add-product", adminController.getAddProducts);

// // /admin/add-product => POST
router.post(
  "/add-product",
  [
    body("title", "Please enter a valid title").isLength({ min: 3 }).trim(),
    body("price", "Please enter a valid price").isFloat(),
    body("imageUrl", "Please enter a vlaid image URL").isURL().trim(),
    body("description", "Please enter a valid description")
      .isLength({ min: 5, max: 400 })
      .trim(),
  ],
  adminController.postAddProducts
);

// // /admin/edit-products => GET
router.get("/edit-product/:productId", adminController.getEditProduct);

router.post(
  "/edit-product",
  [
    body("title", "Please enter a valid title").isLength({ min: 3 }).trim(),
    body("price", "Please enter a valid price").isFloat(),
    body("imageUrl", "Please enter a vlaid image URL").isURL().trim(),
    body("description", "Please enter a valid description")
      .isLength({ min: 5, max: 400 })
      .trim(),
  ],
  adminController.postEditProduct
);

// // /admin/products => GET
router.get("/products", adminController.getProducts);

// // /admim/delete-product
router.post("/delete-product", adminController.postDeleteProduct);

module.exports = router;
