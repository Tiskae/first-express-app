const { Router } = require("express");

const { check, body } = require("express-validator");
const User = require("../models/user");

const authContoller = require("../controllers/auth");

const authRouter = Router();

authRouter.get("/login", authContoller.getLogin);

authRouter.post(
  "/login",
  [
    body("email", "Please enter a valid email address")
      .isEmail()
      .normalizeEmail(),
    body("password", "Password must be at least 5 characters")
      .isLength({
        min: 5,
      })
      .trim(),
  ],
  authContoller.postLogin
);

authRouter.post("/logout", authContoller.postLogout);

authRouter.get("/signup", authContoller.getSignup);

authRouter.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .custom(value => {
        return User.findOne({ email: value }).then(userDoc => {
          if (userDoc) {
            return Promise.reject("Email is taken already!");
          }
        });
      })
      .normalizeEmail(),
    body("password", "Password must be at least 5 characters long")
      .isLength({
        min: 5,
      })
      .trim(),
    body("confirmPassword")
      .custom((value, { req }) => {
        if (req.body.password !== value) {
          throw new Error("Passwords do not match");
        }
        return true;
      })
      .trim(),
  ],
  authContoller.postSignup
);

authRouter.get("/reset", authContoller.getReset);

authRouter.post(
  "/reset",
  body("email", "Please enter a valid email").isEmail(),
  authContoller.postReset
);

authRouter.get("/reset/:token", authContoller.getNewPassword);

authRouter.post(
  "/new-password",
  body("password", "Password must be at least 5 characters long").isLength({
    min: 5,
  }),
  authContoller.postNewPassword
);

module.exports = authRouter;
