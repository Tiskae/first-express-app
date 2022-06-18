const fs = require("fs");
const path = require("path");
const stripe = require("stripe")();

const PDFDocument = require("pdfkit");

const { ObjectId } = require("mongodb");
const Product = require("../models/product");
const User = require("../models/user");
const order = require("../models/order");
const { populate } = require("../models/product");

const ITEMS_PER_PAGE = 2;

exports.getIndex = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems = 0;

  Product.find()
    .countDocuments()
    .then(numProducts => {
      totalItems = numProducts;

      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE)
        .then(products => {
          res.render("shop/index", {
            docTitle: "My Shop",
            path: "/",
            prods: products,
            currentPage: page,
            hasNextPage: ITEMS_PER_PAGE * page < totalItems,
            hasPrevPage: page > 1,
            nextPage: page + 1,
            prevPage: page - 1,
            lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
          });
        });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
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
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
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
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.id;

  req.user
    .deleteCartItem(prodId)
    .then(response => {
      res.redirect("/cart");
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

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
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getProducts = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems = 0;

  Product.find()
    .countDocuments()
    .then(numProducts => {
      totalItems = numProducts;

      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE)
        .then(products => {
          res.render("shop/products-list", {
            docTitle: "My Shop",
            path: "/",
            prods: products,
            currentPage: page,
            hasNextPage: ITEMS_PER_PAGE * page < totalItems,
            hasPrevPage: page > 1,
            nextPage: page + 1,
            prevPage: page - 1,
            lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
          });
        });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
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
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getCheckout = (req, res, next) => {
  let products;
  let total;

  req.user
    .populate("cart.items.productId")
    .then(user => {
      const cartProducts = user.cart.items;
      total = 0;
      cartProducts.forEach(p => {
        total += p.quantity * p.productId.price;
      });

      products = cartProducts;
      return stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: products.map(p => {
          return {
            name: p.productId.title,
            description: p.productId.description,
            amount: p.productId.price * 100,
            currency: "usd",
            quantity: p.quantity,
          };
        }),
        success_url:
          req.protocol + "://" + req.get("host") + "/checkout/success",
        cancel_url: req.protocol + "://" + req.get("host") + "/checkout/cancel",
      });
    })
    .then(session => {
      console.log(session);

      res.render("shop/checkout", {
        docTitle: "Checkout",
        path: "/checkout",
        products: products,
        totalPrice: 100,
        totalSum: total,
        sessionId: session.id,
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getCheckoutSuccess = (req, res) => {
  req.user
    .addOrder()
    .then(result => {
      res.redirect("/orders");
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;
  order
    .findById(orderId)
    .then(order => {
      if (!order) {
        return next(new Error("No orders found"));
      }
      if (order.userId.toString() !== req.user._id.toString()) {
        return next(new Error("Unauthorized"));
      }

      return order.populate("items.productId").then(order => {
        console.log(order);
        const invoiceName = "invoice-" + orderId + ".pdf";
        const invoicePath = path.join("data", "invoices", invoiceName);

        const pdfDoc = new PDFDocument();

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `inline; filename=${invoiceName}`);

        pdfDoc.fontSize(26).text("Invoice", {
          underline: true,
        });
        pdfDoc.text("----------------------------------------");
        let totalPrice = 0;
        order.items.forEach(prod => {
          totalPrice += prod.productId.price * prod.quantity;
          pdfDoc
            .fontSize(14)
            .text(
              prod.productId.title +
                " - " +
                prod.quantity +
                " x " +
                "$" +
                prod.productId.price
            );
        });
        pdfDoc.fontSize(20).text("Total price: $" + totalPrice);
        pdfDoc.pipe(fs.createWriteStream(invoicePath));
        pdfDoc.pipe(res);
        pdfDoc.end();
      });
      // fs.readFile(invoicePath, (err, data) => {
      //   if (err) {
      //     console.log(err);
      //     return next(err);
      //   }

      //   res.setHeader("Content-Type", "application/pdf");
      //   res.setHeader("Content-Disposition", `inline; filename=${invoiceName}`);
      //   res.send(data);
      // });
      // const file = fs.createReadStream(invoicePath);
      // file.pipe(res);
    })
    .catch(err => next(err));
};
