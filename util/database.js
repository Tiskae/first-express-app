const Sequelize = require("sequelize");

const sequelize = new Sequelize("node_app", "root", "75865335", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
