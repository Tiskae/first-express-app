const { Router } = require("express");
const authContoller = require("../controllers/auth");

const authRouter = Router();

authRouter.get("/login", authContoller.getLogin);

authRouter.post("/login", authContoller.postLogin);

module.exports = authRouter;
