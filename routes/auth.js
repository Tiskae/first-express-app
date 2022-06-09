const { Router } = require("express");
const authContoller = require("../controllers/auth");

const authRouter = Router();

authRouter.get("/login", authContoller.getLogin);

authRouter.post("/login", authContoller.postLogin);

authRouter.post("/logout", authContoller.postLogout);

authRouter.get("/signup", authContoller.getSignup);

authRouter.post("/signup", authContoller.postSignup);

authRouter.get("/reset", authContoller.getReset);

authRouter.post("/reset", authContoller.postReset);

module.exports = authRouter;
