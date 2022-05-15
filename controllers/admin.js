const Product = require("../models/product");

// Admin middlewares
exports.getAddProducts = (req, res, next) => {
  res.render("admin/edit-product", {
    docTitle: "Add product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.postAddProducts = (req, res, next) => {
  const { title, imageUrl, price, description } = req.body;
  const newProduct = new Product(title, imageUrl, price, description);
  //   console.log(newProduct);

  newProduct.save();
  res.redirect("/");
};

exports.getEditProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId, (product) => {
    if (!product) redirect("/");

    const editMode = req.query.edit;
    if (!editMode) res.redirect("/");

    res.render("admin/edit-product", {
      docTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: editMode,
      product,
    });
  });
};

exports.postEditProduct = (req, res, next) => {};

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    // console.log(products);
    res.render("admin/products", {
      docTitle: "Admin Products",
      path: "/admin/products",
      prods: products,
    });
  });
};
