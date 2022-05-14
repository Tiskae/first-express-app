const express = require("express");
const router = express.Router();

const productsController = require("../controllers/shop");
const adminController = require("../controllers/admin");

// /admin/add-product => GET
router.get("/add-product", productsController.getAddProducts);

// /admin/add-product => POST
router.post("/add-product", productsController.postAddProducts);

// /admin/edit-products => GET
router.get("/edit-product", adminController.getEditProduct);

// /admin/products => GET
router.get("/products", adminController.getProducts);

module.exports = router;
