const express = require("express");
const router = express.Router();

const productsController = require("../controllers/products");

router.get("/", productsController.getIndex);

router.get("/products-list", productsController.getProductsList);

router.get("/cart", productsController.getCart);

router.get("/checkout", productsController.getCheckout);

router.get("/product-details", productsController.getProductDetails);

router.get("/products-list", productsController.getProductsList);

module.exports = router;
