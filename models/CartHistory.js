module.exports = (sequelize, DataTypes) => {
  const CartHistory = sequelize.define('CartHistory', {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    ProductId: { type: DataTypes.STRING },
    history: { type: DataTypes.STRING },
    quantity: { type: DataTypes.BIGINT }
  }, { timestamps: true });

  CartHistory.associate = (models) => {
    CartHistory.belongsTo(models.User, { foreignKey: 'userId', constraints: false });
    CartHistory.belongsTo(models.Product, { foreignKey: 'productId', constraints: false });
  };
  return CartHistory;
};
