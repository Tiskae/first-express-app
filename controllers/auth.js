const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  // const isAuthenticated = req.get("Cookie").split("=")[1] === "true";

  console.log(req.session);

  res.render("auth/login", {
    docTitle: "Login",
    path: "/login",
    isAuthenticated: false,
  });
};

exports.postLogin = (req, res, next) => {
  User.findById("6298a11537b08a2c345403b6")
    .then(user => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save(err => {
        console.log(err);
        res.redirect("/");
      });
    })
    .catch(err => console.log(err));
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    docTitle: "Sign up",
    path: "/signup",
    isAuthenticated: false,
  });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  User.findOne({ email: email })
    .then(userDoc => {
      if (userDoc) {
        return res.redirect("/signup");
      }
      const user = new User({
        email: email,
        password: password,
        cart: { items: [] },
      });
      return user.save();
    })
    .then(result => {
      res.redirect("/login");
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect("/");
  });
};
