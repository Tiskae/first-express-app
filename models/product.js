const fs = require("fs");
const path = require("path");

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
  constructor(title, imageUrl, price, description) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
  }

  save() {
    getProductsFromFile((products) => {
      products.push(this);

      fs.writeFile(productsFilePath, JSON.stringify(products), (err) =>
        console.error(err)
      );
    });
  }

  static fetchAll(cb) {
    // return [];
    getProductsFromFile(cb);
  }
};
