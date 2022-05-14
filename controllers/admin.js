const Product = require("../models/product");

exports.getEditProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    docTitle: "Edit Product",
    path: "/admin/edit-product",
  });
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    console.log(products);
    res.render("admin/products", {
      docTitle: "Admin Products",
      path: "/admin/products",
      prods: products,
    });
  });
};
