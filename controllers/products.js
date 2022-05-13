const Product = require("../models/product");

exports.getAddProducts = (req, res, next) => {
  res.render("add-product", {
    docTitle: "Add product",
    path: "/admin/add-product",
    activeShop: false,
    activeAddProduct: true,
  });
};

exports.postAddProducts = (req, res, next) => {
  const newProduct = new Product(req.body.title);
  newProduct.save();
  res.redirect("/");
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    console.log(products);
    res.render("shop", {
      prods: products,
      docTitle: "My Shop",
      path: "/",
      listIsEmpty: products.length === 0,
      activeShop: true,
      activeAddProduct: false,
    });
  });
};
