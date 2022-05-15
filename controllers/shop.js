const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getIndex = (req, res, next) => {
  Product.fetchAll((products) => {
    // console.log(products);
    res.render("shop/index", {
      docTitle: "My Shop",
      path: "/",
      prods: products,
    });
  });
};

exports.getCart = (req, res, next) => {
  res.render("shop/cart", {
    docTitle: "Cart",
    path: "/cart",
  });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, (product) => {
    Cart.addProduct(prodId, product.price);
  });

  res.redirect("/cart");
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    docTitle: "Your orders",
    path: "/orders",
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    docTitle: "Checkout",
    path: "/checkout",
  });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId, (product) =>
    res.render("shop/product-details", {
      docTitle: product.title,
      path: "/products",
      product, // product: product
    })
  );
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    // console.log(products);
    res.render("shop/products-list", {
      prods: products,
      docTitle: "All Products",
      path: "/products",
    });
  });
};
