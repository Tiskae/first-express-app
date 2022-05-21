const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const adminRouter = require("./routes/admin");
const shopRouter = require("./routes/shop");
const _404Controller = require("./controllers/404");

const app = express();
const sequelize = require("./util/database");

app.set("view engine", "ejs");
app.set("views", "views");

const port = process.env.PORT || 3030;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRouter);
app.use(shopRouter);

// 404 error page
app.use(_404Controller.get404);

sequelize
  .sync()
  .then((response) => {
    console.log("%c[Connected to Db succesfully!]", "color: #00ff00");
    app.listen(port);
  })
  .catch((error) => console.log("error"));
