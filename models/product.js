const fs = require("fs");
const path = require("path");

const productsFilePath = path.join(
  path.dirname(require.main.filename),
  "data",
  "products.json"
);

module.exports = class Product {
  constructor(title, imageUrl, price, description) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
  }

  productsFilePath() {
    return path.join(
      path.dirname(require.main.filename),
      "data",
      "products.json"
    );
  }

  save() {
    fs.readFile(productsFilePath, (error, fileContent) => {
      let products = [];

      if (!error) {
        products = JSON.parse(fileContent);
      }
      products.push(this);

      fs.writeFile(productsFilePath, JSON.stringify(products), (err) =>
        console.error(err)
      );
    });
  }

  static fetchAll() {
    // return [];
    fs.readFile(productsFilePath, (err, fileContent) => {
      if (err) {
        console.error("Fetct all");
        return [];
      }
      return JSON.parse(fileContent.toString());
    });
  }
};
