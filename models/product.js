const { Schema, default: mongoose } = require("mongoose");

const productSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Product", productSchema);

// const { ObjectId } = require("mongodb");

// // const getDb = require("../util/database").getDb;

// class Product {
//   constructor(title, price, imageUrl, description, id, userId) {
//     this.title = title;
//     this.price = price;
//     this.imageUrl = imageUrl;
//     this.description = description;
//     this._id = id ? new ObjectId(id) : null;
//     this.userId = userId;
//   }

//   save() {
//     // ...
//     const db = getDb();

//     let dbOp;
//     if (this._id) {
//       dbOp = db.collection("products").updateOne(
//         { _id: new ObjectId(this._id) },
//         {
//           $set: this,
//         }
//       );
//     } else {
//       dbOp = db.collection("products").insertOne(this);
//     }
//     return dbOp;
//   }

//   static fetchAll() {
//     const db = getDb();
//     return db
//       .collection("products")
//       .find()
//       .toArray()
//       .then(result => result)
//       .catch(error => console.log(error));
//   }

//   static findById(id) {
//     const db = getDb();
//     return db
//       .collection("products")
//       .findOne({ _id: new ObjectId(id) })
//       .then(result => result)
//       .catch(error => console.log(error));
//   }

//   static deleteById(id) {
//     const db = getDb();
//     return db
//       .collection("products")
//       .deleteOne({ _id: ObjectId(id) })
//       .then(result => result)
//       .catch(error => console.log(error));
//   }
// }

// // const Product = sequelize.define("product", {
// //   id: {
// //     type: Sequelize.INTEGER,
// //     autoIncrement: true,
// //     primaryKey: true,
// //     allowNull: false,
// //   },
// //   title: {
// //     type: Sequelize.STRING,
// //     allowNull: false,
// //   },
// //   price: {
// //     type: Sequelize.DOUBLE,
// //     allowNull: false,
// //   },
// //   imageUrl: {
// //     type: Sequelize.STRING,
// //     allowNull: false,
// //   },
// //   description: {
// //     type: Sequelize.STRING,
// //     allowNull: false,
// //   },
// // });

// module.exports = Product;
