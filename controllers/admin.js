const { ObjectId } = require("mongodb");
const Product = require("../models/product");

const { validationResult } = require("express-validator");

// Admin middlewares
exports.getAddProducts = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.redirect("/login");
  }
  res.render("admin/edit-product", {
    docTitle: "Add product",
    path: "/admin/add-product",
    editing: false,
    errorMessage: null,
    oldInput: {
      title: "",
      price: "",
      imageUrl: "",
      description: "",
    },
    validationErrors: [],
  });
};

exports.postAddProducts = (req, res, next) => {
  const { title, price, imageUrl, description } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      docTitle: "Sign up",
      path: "/signup",
      errorMessage: errors.array()[0].msg,
      editing: false,
      oldInput: {
        title,
        price,
        imageUrl,
        description,
      },
      validationErrors: errors.array(),
    });
  }

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
        errorMessage: null,
        validationErrors: [],
      });
    })
    .catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const { id, title, imageUrl, price, description } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      docTitle: "Sign up",
      path: "/signup",
      errorMessage: errors.array()[0].msg,
      editing: true,
      product: {
        title,
        price,
        imageUrl,
        description,
        _id: id,
      },
      validationErrors: errors.array(),
    });
  }

  Product.findById(id)
    .then(product => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect("/");
      }

      product.title = title;
      product.imageUrl = imageUrl;
      product.price = price;
      product.description = description;

      return product.save().then(result => {
        console.log("[Updated product!]");
        res.redirect("/admin/products");
      });
    })
    .catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
  Product.find({ userId: req.user._id })
    // .select("title price")
    // .populate("userId")
    .then(products => {
      // console.log(products);

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

  Product.deleteOne({ _id: prodId, userId: req.user._id })
    .then(result => {
      console.log("[Product deleted successfully!]");
      res.redirect("/admin/products");
    })
    .catch(error => console.log(error));
};
