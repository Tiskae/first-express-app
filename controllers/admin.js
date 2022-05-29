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
  const product = new Product(title, price, imageUrl, description);
  product
    .save()
    .then(result => {
      console.log(result, "[Product added to DB successfully]");
      res.redirect("/admin/products");
    })
    .catch(error => console.log(error));
};

// exports.getEditProduct = (req, res, next) => {
//   const prodId = req.params.productId;
//   req.user
//     .getProducts({ where: { id: prodId } })
//     // Product.findById(prodId)
//     .then(products => {
//       const product = products[0];
//       if (!product) redirect("/");

//       const editMode = req.query.edit;
//       if (!editMode) res.redirect("/");

//       res.render("admin/edit-product", {
//         docTitle: "Edit Product",
//         path: "/admin/edit-product",
//         editing: editMode,
//         product,
//       });
//     })
//     .catch(err => console.log(err));
// };

// exports.postEditProduct = (req, res, next) => {
//   const { id, title, imageUrl, price, description } = req.body;
//   Product.findById(id)
//     .then(product => {
//       product.title = title;
//       product.imageUrl = imageUrl;
//       product.price = price;
//       product.description = description;
//       return product.save();
//     })
//     .then(result => {
//       console.log("[Updated product!]");
//       res.redirect("/admin/products");
//     })
//     .catch(err => console.log(err));
// };

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(products => {
      res.render("admin/products", {
        docTitle: "Admin Products",
        path: "/admin/products",
        prods: products,
      });
    })
    .catch(err => console.log(err));
};

// exports.postDeleteProduct = (req, res, next) => {
//   const prodId = req.body.id;
//   Product.findById(prodId)
//     .then(product => product.destroy())
//     .then(result => {
//       console.log("[Product deleted successfully!]");
//       res.redirect("/admin/products");
//     })
//     .catch();
// };
