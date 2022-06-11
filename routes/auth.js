const { Router } = require("express");

const { check, body } = require("express-validator");
const User = require("../models/user");

const authContoller = require("../controllers/auth");

const authRouter = Router();

authRouter.get(
  "/login",
  [body("email", "Invalid email or password").isEmail()],
  authContoller.getLogin
);

authRouter.post("/login", authContoller.postLogin);

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
      }),
    body("password", "Password must be at least 5 characters long").isLength({
      min: 5,
    }),
    body("confirmPassword").custom((value, { req }) => {
      if (req.body.password !== value) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
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
