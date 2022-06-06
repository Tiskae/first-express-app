const { ObjectId } = require("mongodb");
const Product = require("../models/product");
const User = require("../models/user");

exports.getIndex = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render("shop/index", {
        docTitle: "My Shop",
        path: "/",
        prods: products,
      });
    })
    .catch(err => console.log(err));
};

exports.getCart = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then(user => {
      const cartProducts = user.cart.items;

      res.render("shop/cart", {
        docTitle: "Cart",
        path: "/cart",
        products: cartProducts,
        totalPrice: 100,
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch(error => console.log(error));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;

  Product.findById(prodId)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(result => {
      // console.log(result, "[Added to cart!]");
      res.redirect("/");
    })
    .catch(error => console.log(error));
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.id;

  req.user
    .deleteCartItem(prodId)
    .then(response => {
      res.redirect("/cart");
    })
    .catch(error => console.log(error));
};

exports.postOrder = (req, res) => {
  req.user
    .addOrder()
    .then(result => {
      res.redirect("/orders");
    })
    .catch(error => console.log(error));
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders()
    .then(orders => {
      res.render("shop/orders", {
        docTitle: "Your orders",
        path: "/orders",
        orders,
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch(error => console.log(error));
};

// exports.getCheckout = (req, res, next) => {
//   res.render("shop/checkout", {
//     docTitle: "Checkout",
//     path: "/checkout",
//   });
// };

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;

  // Product.findAll({ where: { id: prodId } }).then((products) =>
  //   res
  //     .render("shop/product-details", {
  //       docTitle: products[0].title,
  //       path: "/products",
  //       product: products[0], //
  //     })
  //     .catch((err) => console.log(err))
  // );

  Product.findOne({ _id: new ObjectId(prodId) })
    .then(product => {
      // console.log(product);
      res.render("shop/product-details", {
        docTitle: product.title,
        path: "/products",
        product, // product: product
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render("shop/products-list", {
        docTitle: "All Products",
        path: "/products",
        prods: products,
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch(err => console.log(err));
};
