const fs = require("fs");
const path = require("path");

const Cart = require("./cart");

const productsFilePath = path.join(
  path.dirname(require.main.filename),
  "data",
  "products.json"
);

const getProductsFromFile = (cb) => {
  fs.readFile(productsFilePath, (err, fileContent) => {
    if (err) {
      return cb([]);
    }
    return cb(JSON.parse(fileContent.toString()));
  });
};

module.exports = class Product {
  constructor(id, title, imageUrl, price, description) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
  }

  save() {
    getProductsFromFile((products) => {
      if (this.id) {
        const existingProductIndex = products.findIndex((prod) => {
          return prod.id === this.id;
        });
        const updatedProducts = [...products];
        updatedProducts[existingProductIndex] = this;

        fs.writeFile(productsFilePath, JSON.stringify(updatedProducts), (err) =>
          console.error(err)
        );
      } else {
        this.id = Math.random().toString();
        products.push(this);

        fs.writeFile(productsFilePath, JSON.stringify(products), (err) =>
          console.error(err)
        );
      }
    });
  }

  static delete(id, cb) {
    getProductsFromFile((fetchedProducts) => {
      const product = fetchedProducts.find((prod) => prod.id === id);
      const updatedProducts = fetchedProducts.filter((prod) => prod.id !== id);
      fs.writeFile(productsFilePath, JSON.stringify(updatedProducts), (err) => {
        if (!err) {
          Cart.deleteProduct(id, product.price);
        }
      });

      cb();
    });
  }

  static fetchAll(cb) {
    // return [];
    getProductsFromFile(cb);
  }

  static findById(id, cb) {
    getProductsFromFile((fetchedProducts) => {
      const product = fetchedProducts.find((p) => p.id === id);
      cb(product);
    });
  }
};
