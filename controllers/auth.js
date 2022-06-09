const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const nodeMailer = require("nodemailer");
// const sendgridTransport = require("nodemailer-sendgrid-transport");

const transporter = nodeMailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,

  options: {
    auth: {
      user: "tiskae100gmail.com",
      pass: "Macbook100$",
    },
  },

  auth: {
    user: "adedokuntobiloba100@gmail.com",
    pass: "rjirkhesjffbalyv",
  },
});

const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  // const isAuthenticated = req.get("Cookie").split("=")[1] === "true";

  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render("auth/login", {
    docTitle: "Login",
    path: "/login",
    errorMessage: message,
  });
};

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        req.flash("error", "Invalid email or password");
        return res.redirect("/login");
      }
      bcrypt
        .compare(password, user.password)
        .then(doMatch => {
          if (!doMatch) {
            req.flash("error", "Invalid email or password");
            return res.redirect("/login");
          }
          req.session.isLoggedIn = true;
          req.session.user = user;
          req.session.save(err => {
            console.log(err);
            res.redirect("/");
          });
        })
        .catch(err => {
          res.redirect("/login");
        });
    })
    .catch(err => console.log(err));
};

exports.getSignup = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render("auth/signup", {
    docTitle: "Sign up",
    path: "/signup",
    errorMessage: message,
  });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  User.findOne({ email: email })
    .then(userDoc => {
      if (userDoc) {
        req.flash("error", "Email is taken already!");
        return res.redirect("/signup");
      }
      return bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
          const user = new User({
            email: email,
            password: hashedPassword,
            cart: { items: [] },
          });
          return user.save();
        })
        .then(result => {
          res.redirect("/login");

          const mailOptions = {
            from: "shop@node-app.com",
            to: email,
            subject: "Account created",
            text: "Congratulations, your account has been created successfully.",
            html: "<h1>Congratulations, your account has been created successfully.</h1>",
          };

          transporter.sendMail(mailOptions, (error, info) => {
            if (error) console.log(error);
            else console.log("Email sent, " + info.response);
          });
        });
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

exports.getReset = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render("auth/reset", {
    docTitle: "Reset password",
    path: "/reset",
    errorMessage: message,
  });
};

exports.postReset = (req, res, next) => {
  const email = req.body.email;
  if (!email) {
    req.flash("error", "Invalid email provided");
    return res.redirect("/reset");
  }

  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    }
    const token = buffer.toString("hex");
    User.findOne({ email: email })
      .then(user => {
        if (!user) {
          req.flash("error", "No account with that email found");
          return res.redirect("/reset");
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save().then(result => {
          const mailOptions = {
            from: "shop@node-app.com",
            to: email,
            subject: "Password reset",
            text: "Congratulations, your account has been created successfully.",
            html: ` <p>You requested a password reset</p>
                    <p>Click this <a href="http://localhost:3030/reset/${token}">link</a> to set a new password.</p>
                  `,
          };

          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.log(error);
              req.flash("message", info);
              res.redirect("/reset");
            } else {
              console.log("Email sent, " + info.response);
              req.flash("message", "Check your email");
              res.redirect("/");
            }
          });
        });
      })

      .catch(console.log);
  });
};
