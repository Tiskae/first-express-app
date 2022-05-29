const getDb = require("../util/database").getDb;

class Product {
  constructor(title, price, imageUrl, description) {
    this.title = title;
    this.price = price;
    this.imageUrl = imageUrl;
    this.description = description;
  }

  save() {
    // ...
    const db = getDb();
    return db
      .collection("products")
      .insertOne(this)
      .then(result => console.log(result))
      .catch(err => console.log(err));
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection("products")
      .find()
      .toArray()
      .then(result => {
        console.log(result);
        return result;
      })
      .catch(error => console.log(error));
  }

  static findById(id) {
    const db = getDb();
    return db
      .collection("products")
      .findOne({ _id: id })
      .then(result => {
        console.log(result);
        return result;
      })
      .catch(error => console.log(error));
  }
}

// const Product = sequelize.define("product", {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     primaryKey: true,
//     allowNull: false,
//   },
//   title: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
//   price: {
//     type: Sequelize.DOUBLE,
//     allowNull: false,
//   },
//   imageUrl: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
//   description: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
// });

module.exports = Product;
