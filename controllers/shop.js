const Product = require("../models/product");

// Admin middlewares
exports.getAddProducts = (req, res, next) => {
  res.render("admin/add-product", {
    docTitle: "Add product",
    path: "/admin/add-product",
  });
};

exports.postAddProducts = (req, res, next) => {
  const { title, imageUrl, price, description } = req.body;
  const newProduct = new Product(title, imageUrl, price, description);
  //   console.log(newProduct);

  newProduct.save();
  res.redirect("/");
};

// Product middlewares

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

exports.getProductDetails = (req, res, next) => {
  res.render("shop/product-details", {
    docTitle: "Product Details",
    path: "/product-details",
  });
};

exports.getProductsList = (req, res, next) => {
  Product.fetchAll((products) => {
    // console.log(products);
    res.render("shop/products-list", {
      prods: products,
      docTitle: "All Products",
      path: "/products-list",
    });
  });
};
