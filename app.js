const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const adminRouter = require("./routes/admin");
const shopRouter = require("./routes/shop");
const _404Controller = require("./controllers/404");

const app = express();
const mongoose = require("mongoose");
// const mongoConnect = require("./util/database").mongoConnect;

const User = require("./models/user");

app.set("view engine", "ejs");
app.set("views", "views");

const port = process.env.PORT || 3030;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// Get user middleware
app.use((req, res, next) => {
  User.findById("6298a11537b08a2c345403b6")
    .then(user => {
      // console.log(user);

      req.user = user;
      // console.log(req.user);

      next();
    })
    .catch(err => {
      console.log(err);
      next();
    });
});

app.use("/admin", adminRouter);
app.use(shopRouter);

// 404 error page
app.use(_404Controller.get404);

mongoose
  .connect(
    "mongodb+srv://Tiskae:o8M4nQR36nhclwpd@cluster0.irqruor.mongodb.net/shop?retryWrites=true&w=majority"
  )
  .then(result => {
    User.findOne().then(user => {
      if (!user) {
        const admin = new User({
          name: "tiskae",
          email: "tiskae100@gmail.com",
          cart: { items: [] },
        });
        return admin.save();
      }

      return null;
    });
  })
  .then(() => {
    app.listen(port, () => {
      console.log(`listening on ${port}`);
    });
  })
  .catch(error => console.log(error));
