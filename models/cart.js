const fs = require("fs");
const path = require("path");

const cartFilePath = path.join(
  path.dirname(require.main.filename),
  "data",
  "cart.json"
);

module.exports = class {
  static addProduct(id, productPrice) {
    // Fetch the previous cart
    fs.readFile(cartFilePath, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(fileContent);
      }

      // Analyse the cart => find existing product
      const existingProductIndex = cart.products.findIndex(
        (prod) => prod.id === id
      );
      const existingProduct = cart.products[existingProductIndex];
      let updatedProduct;
      if (existingProduct) {
        updatedProduct = { ...existingProduct };
        updatedProduct.quantity = updatedProduct.quantity + 1;

        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        // Add new product
        updatedProduct = { id, quantity: 1 };
        cart.products = [...cart.products, updatedProduct];
      }

      cart.totalPrice = cart.totalPrice + +productPrice;
      fs.writeFile(cartFilePath, JSON.stringify(cart), (err) => {
        console.log(err);
      });
    });
  }

  static removeProduct(id) {}
};
