const Product = require("../models/product");
const db = require("../util/database");
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
  const newProduct = new Product(null, title, imageUrl, price, description);
  //   console.log(newProduct);

  newProduct
    .save()
    .then((dbResponse) => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getEditProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(([[product]]) => {
      if (!product) redirect("/");

      const editMode = req.query.edit;
      if (!editMode) res.redirect("/");

      res.render("admin/edit-product", {
        docTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product,
      });
    })
    .catch((err) => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const { id, title, imageUrl, price, description } = req.body;
  const updatedProduct = new Product(id, title, imageUrl, price, description);
  updatedProduct
    .save()
    .then(() => res.redirect("/admin/products"))
    .catch((err) => console.log(err));
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(([rows, fieldData]) => {
      res.render("admin/products", {
        docTitle: "Admin Products",
        path: "/admin/products",
        prods: rows,
      });
    })
    .catch((err) => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.id;
  Product.delete(prodId, () => res.redirect("/admin/products"));
};
