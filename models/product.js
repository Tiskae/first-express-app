const products = [];

module.exports = class Product {
  constructor(title, imageUrl, price, description) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
  }

  save() {
    products.push(this);
  }

  static fetchAll() {
    return products;
  }
};
