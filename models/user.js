const { ObjectId } = require("mongodb");
const { Schema, default: mongoose } = require("mongoose");
const Order = require("./order");
const Product = require("./product");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
  },
});

userSchema.methods.addToCart = function (product) {
  const cartProductIndex = this.cart.items.findIndex(
    cp => cp.productId.toString() === product._id.toString()
  );

  let newQuantity = 1;
  const updatedCartItems = [...this.cart.items];

  if (cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({ productId: product._id, quantity: newQuantity });
  }

  const updatedCart = {
    items: updatedCartItems,
  };

  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.deleteCartItem = function (id) {
  const updatedCartItems = this.cart.items.filter(
    item => item.productId.toString() !== id.toString()
  );

  this.cart.items = updatedCartItems;
  return this.save();
};

userSchema.methods.addOrder = function () {
  const newOrder = new Order({
    items: this.cart.items,
    userId: this._id,
  });

  this.cart = { items: [] };
  return this.save()
    .then(() => newOrder.save())
    .catch(error => console.log(error));
};

userSchema.methods.getOrders = function () {
  return Order.find({ userId: new ObjectId(this._id) }).populate(
    "items.productId"
  );
};

module.exports = mongoose.model("User", userSchema);

// const { ObjectId } = require("mongodb");
// const { getDb } = require("../util/database");

// class User {
//   constructor(username, email, cart, id) {
//     this.username = username;
//     this.email = email;
//     this.cart = cart; // {items: []}
//     this._id = id;
//   }

//   save() {
//     const db = getDb();
//     return db.collection("users").insertOne(this);
//   }

//   addToCart(product) {
//     const cartProductIndex = this.cart.items.findIndex(
//       cp => cp.productId.toString() === product._id.toString()
//     );

//     let newQuantity = 1;
//     const updatedCartItems = [...this.cart.items];

//     if (cartProductIndex >= 0) {
//       newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//       updatedCartItems[cartProductIndex].quantity = newQuantity;
//     } else {
//       updatedCartItems.push({ productId: product._id, quantity: newQuantity });
//     }

//     const updatedCart = {
//       items: updatedCartItems,
//     };
//     const db = getDb();
//     return db
//       .collection("users")
//       .updateOne(
//         { _id: new ObjectId(this._id) },
//         { $set: { cart: updatedCart } }
//       );
//   }

//   getCart() {
//     const db = getDb();
//     let productIds = [];
//     if (this.cart.items) {
//       productIds = this.cart.items.map(item => item.productId);
//     }

//     return db
//       .collection("products")
//       .find({ _id: { $in: productIds } })
//       .toArray()
//       .then(products => {
//         const cartProducts = products.map(p => {
//           const prod = this.cart.items.find(
//             item => item.productId.toString() === p._id.toString()
//           );
//           const prodQuantity = prod.quantity;
//           return { title: p.title, quantity: prodQuantity, _id: p._id };
//         });

//         return cartProducts;
//       });
//   }

//   deleteCartItem(id) {
//     const db = getDb();
//     const updatedCartItems = this.cart.items.filter(
//       item => item.productId.toString() !== id.toString()
//     );

//     return db
//       .collection("users")
//       .updateOne(
//         { _id: new ObjectId(this._id) },
//         { $set: { cart: { items: updatedCartItems } } }
//       );
//   }

//   addOrder() {
//     const db = getDb();
//     return this.getCart()
//       .then(products => {
//         const order = {
//           items: products,
//           user: {
//             _id: new ObjectId(this._id),
//             name: this.name,
//           },
//         };
//         return db.collection("orders").insertOne(order);
//       })
//       .then(result => {
//         this.cart = { items: [] };
//         return db
//           .collection("users")
//           .updateOne(
//             { _id: new ObjectId(this._id) },
//             { $set: { cart: { items: [] } } }
//           );
//       });
//   }

//   getOrders() {
//     const db = getDb();
//     return db
//       .collection("orders")
//       .find({ "user._id": new ObjectId(this._id) })
//       .toArray();
//   }

//   static findById(id) {
//     const db = getDb();
//     return db.collection("users").findOne({ _id: new ObjectId(id) });
//   }
// }

// module.exports = User;
