const { ObjectId } = require("mongodb");
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
  const { title, price, imageUrl, description } = req.body;
  const product = new Product({
    title,
    price,
    imageUrl,
    description,
    userId: req.user,
  });

  product
    .save()
    .then(result => {
      console.log(result, "[Product added to DB successfully]");
      res.redirect("/admin/products");
    })
    .catch(error => console.log(error));
};

exports.getEditProduct = (req, res, next) => {
  const prodId = req.params.productId;

  const editMode = req.query.edit;
  if (!editMode) res.redirect("/");

  Product.findById(prodId)
    .then(product => {
      if (!product) res.redirect("/");

      res.render("admin/edit-product", {
        docTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product,
      });
    })
    .catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const { id, title, imageUrl, price, description } = req.body;
  const update = { title, imageUrl, price, description };

  Product.updateOne({ _id: new ObjectId(id) }, update)
    .then(result => {
      console.log("[Updated product!]");
      res.redirect("/admin/products");
    })
    .catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
  Product.find()
    // .select("title price")
    // .populate("userId")
    .then(products => {
      console.log(products);

      res.render("admin/products", {
        docTitle: "Admin Products",
        path: "/admin/products",
        prods: products,
      });
    })
    .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.id;

  Product.findByIdAndRemove(prodId)
    .then(result => {
      console.log(result, "[Product deleted successfully!]");
      res.redirect("/admin/products");
    })
    .catch(error => console.log(error));
};
