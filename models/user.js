const { ObjectId } = require("mongodb");
const { getDb } = require("../util/database");

class User {
  constructor(username, email, cart, id) {
    this.username = username;
    this.email = email;
    this.cart = cart; // {items: []}
    this._id = id;
  }

  save() {
    const db = getDb();
    return db.collection("users").insertOne(this);
  }

  addToCart(product) {
    const cartProductIndex = this.cart.items.findIndex(
      cp => cp.prodId.toString() === product._id.toString()
    );

    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({ prodId: product._id, quantity: newQuantity });
    }

    const updatedCart = {
      items: updatedCartItems,
    };
    const db = getDb();
    return db
      .collection("users")
      .updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      );
  }

  getCart() {
    const db = getDb();
    let prodIds = [];
    if (this.cart.items) {
      prodIds = this.cart.items.map(item => item.prodId);
    }

    return db
      .collection("products")
      .find({ _id: { $in: prodIds } })
      .toArray()
      .then(products => {
        const cartProducts = products.map(p => {
          const prod = this.cart.items.find(
            item => item.prodId.toString() === p._id.toString()
          );
          const prodQuantity = prod.quantity;
          return { title: p.title, quantity: prodQuantity, _id: p._id };
        });

        return cartProducts;
      });
  }

  deleteCartItem(id) {
    const db = getDb();
    const updatedCartItems = this.cart.items.filter(
      item => item.prodId.toString() !== id.toString()
    );

    return db
      .collection("users")
      .updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { cart: { items: updatedCartItems } } }
      );
  }

  addOrder() {
    const db = getDb();
    return this.getCart()
      .then(products => {
        const order = {
          items: products,
          user: {
            _id: new ObjectId(this._id),
            name: this.name,
          },
        };
        return db.collection("orders").insertOne(order);
      })
      .then(result => {
        this.cart = { items: [] };
        return db
          .collection("users")
          .updateOne(
            { _id: new ObjectId(this._id) },
            { $set: { cart: { items: [] } } }
          );
      });
  }

  getOrders() {
    const db = getDb();
    return db
      .collection("orders")
      .find({ "user._id": new ObjectId(this._id) })
      .toArray();
  }

  static findById(id) {
    const db = getDb();
    return db.collection("users").findOne({ _id: new ObjectId(id) });
  }
}

module.exports = User;
