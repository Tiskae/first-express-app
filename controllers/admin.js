const { ObjectId } = require("mongodb");
const Product = require("../models/product");

const fileHelper = require("../util/file");

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
  const { title, price, description } = req.body;
  const image = req.file;

  const errors = validationResult(req);

  if (!image) {
    return res.status(422).render("admin/edit-product", {
      docTitle: "Add product",
      path: "/add-product",
      errorMessage: "Attached file is not an image",
      editing: false,
      oldInput: {
        title,
        price,
        description,
      },
      validationErrors: [],
    });
  }

  const imageUrl = image.path;

  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      docTitle: "Add product",
      path: "/add-product",
      errorMessage: errors.array()[0].msg,
      editing: false,
      oldInput: {
        title,
        price,
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
      console.log("[Product added to DB successfully]");
      res.redirect("/admin/products");
    })
    .catch(err => {
      // res.status(500).render("admin/edit-product", {
      //   docTitle: "Sign up",
      //   path: "/signup",
      //   errorMessage: "Database operation failed, please try again!",
      //   editing: false,
      //   oldInput: {
      //     title,
      //     price,
      //     imageUrl,
      //     description,
      //   },
      //   validationErrors: [],
      // });
      // res.redirect("/500");
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
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
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postEditProduct = (req, res, next) => {
  const { id, title, price, description } = req.body;
  const image = req.file;

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
      if (image) {
        fileHelper.deleteFile(product.imageUrl);
        product.imageUrl = image.path;
      }
      product.price = price;
      product.description = description;

      return product.save().then(result => {
        console.log("[Updated product!]");
        res.redirect("/admin/products");
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
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
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.deleteProduct = (req, res, next) => {
  const prodId = req.params.productId;
  console.log(prodId);

  Product.findById(prodId)
    .then(product => {
      if (!product) {
        throw new Error("Product not found");
      }
      fileHelper.deleteFile(product.imageUrl);

      Product.deleteOne({ _id: prodId, userId: req.user._id }).then(result => {
        console.log("[Product deleted successfully!]");
        res.status(200).json({
          message: "Success!",
        });
      });
    })
    .catch(err => {
      res.status(500).json({ message: "Deleting product failed!" });
    });
};
