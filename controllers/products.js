const products = [];

exports.getAddProducts = (req, res, next) => {
  // res.sendFile(path.join(rootDir, "views", "add-product.html"));
  res.render("add-product", {
    docTitle: "Add product",
    path: "/admin/add-product",
    activeShop: false,
    activeAddProduct: true,
  });
};

exports.postAddProducts = (req, res, next) => {
  products.push({ title: req.body.title });
  res.redirect("/");
};

exports.getProducts = (req, res, next) => {
  res.render("shop", {
    prods: products,
    docTitle: "My Shop",
    path: "/",
    listIsEmpty: products.length === 0,
    activeShop: true,
    activeAddProduct: false,
  });
};
