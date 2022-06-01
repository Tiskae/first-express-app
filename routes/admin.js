const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admin");

// // /admin/add-product => GET
router.get("/add-product", adminController.getAddProducts);

// // /admin/add-product => POST
router.post("/add-product", adminController.postAddProducts);

// // /admin/edit-products => GET
router.get("/edit-product/:productId", adminController.getEditProduct);

router.post("/edit-product", adminController.postEditProduct);

// // /admin/products => GET
router.get("/products", adminController.getProducts);

// // /admim/delete-product
router.post("/delete-product", adminController.postDeleteProduct);

module.exports = router;
