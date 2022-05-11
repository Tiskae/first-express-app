const fs = require("fs");
const path = require("path");

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
    fs.readFile(this.productsFilePath(), (error, fileContent) => {
      let products = [];
      console.log(fileContent);

      if (!error) {
        products = [];
      }
      products.push(this);

      fs.write(this.productsFilePath(), JSON.stringify(products), (err) =>
        console.error(err)
      );
    });
  }

  static fetchAll() {
    // return [];

    const filePath = path.join(
      path.dirname(require.main.filename),
      "data",
      "products.json"
    );
    fs.readFile(filePath, (err, fileContent) => {
      if (err) {
        return [];
      }
      return JSON.parse(fileContent);
    });
  }
};
