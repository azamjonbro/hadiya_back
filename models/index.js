const Sequelize = require('sequelize');
const { sequelize } = require('../config/db');

const Superadmin = require('./Superadmin')(sequelize, Sequelize.DataTypes);
const Manager = require('./Manager')(sequelize, Sequelize.DataTypes);
const Category = require('./Category')(sequelize, Sequelize.DataTypes);
const Product = require('./Product')(sequelize, Sequelize.DataTypes);
const User = require('./User')(sequelize, Sequelize.DataTypes);
const LikesHistory = require('./LikesHistory')(sequelize, Sequelize.DataTypes);
const CartHistory = require('./CartHistory')(sequelize, Sequelize.DataTypes);
const OrderHistory = require('./OrderHistory')(sequelize, Sequelize.DataTypes);

Superadmin.associate(sequelize.models);
Manager.associate(sequelize.models);
Category.associate(sequelize.models);
Product.associate(sequelize.models);
User.associate(sequelize.models);
LikesHistory.associate(sequelize.models);
CartHistory.associate(sequelize.models);
OrderHistory.associate(sequelize.models);

module.exports = {
  sequelize,
  Sequelize,
  Superadmin,
  Manager,
  Category,
  Product,
  User,
  LikesHistory,
  CartHistory,
  OrderHistory
};
