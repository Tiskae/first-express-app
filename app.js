const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const adminRouter = require("./routes/admin");
const shopRouter = require("./routes/shop");
const authRouter = require("./routes/auth");
const _404Controller = require("./controllers/404");

const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
// const mongoConnect = require("./util/database").mongoConnect;

const MONGODB_URI =
  "mongodb+srv://Tiskae:o8M4nQR36nhclwpd@cluster0.irqruor.mongodb.net/shop?retryWrites=true&w=majority";

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

const User = require("./models/user");

app.set("view engine", "ejs");
app.set("views", "views");

const port = process.env.PORT || 3030;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

// Get user middleware
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use("/admin", adminRouter);
app.use(shopRouter);
app.use(authRouter);

// 404 error page
app.use(_404Controller.get404);

mongoose
  .connect(MONGODB_URI)
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
