const express = require("express");
const router = express.Router();

const shopController = require("../controllers/shop");

router.get("/", shopController.getIndex);

router.get("/products-list", shopController.getProductsList);

router.get("/cart", shopController.getCart);

router.get("/orders", shopController.getOrders);

router.get("/checkout", shopController.getCheckout);

router.get("/product-details", shopController.getProductDetails);

router.get("/products-list", shopController.getProductsList);

module.exports = router;
