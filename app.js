const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const adminRouter = require("./routes/admin");
// const shopRouter = require("./routes/shop");
const _404Controller = require("./controllers/404");

const app = express();
const mongoConnect = require("./util/database").mongoConnect;

app.set("view engine", "ejs");
app.set("views", "views");

const port = process.env.PORT || 3030;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// Get user middleware
app.use((req, res, next) => {
  // User.findById(1)
  //   .then((user) => {
  //     req.user = user;
  //     next();
  //   })
  //   .catch((err) => console.log(err));
});

app.use("/admin", adminRouter);
// app.use(shopRouter);

// 404 error page
app.use(_404Controller.get404);

mongoConnect(client => {
  console.log(client);
  app.listen(port);
});
