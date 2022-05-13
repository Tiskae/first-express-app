exports.getEditProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    docTitle: "Edit Product",
    path: "/admin/edit-product",
  });
};

exports.getProducts = (req, res, next) => {
  res.render("admin/products", {
    docTitle: "Admin Products",
    path: "/admin/products",
  });
};
