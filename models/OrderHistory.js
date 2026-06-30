module.exports = (sequelize, DataTypes) => {
  const OrderHistory = sequelize.define('HistoryModel', {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    ProductId: { type: DataTypes.STRING },
    history: { type: DataTypes.STRING },
    quantity: { type: DataTypes.BIGINT }
  }, { timestamps: true });

  OrderHistory.associate = (models) => {
    OrderHistory.belongsTo(models.User, { foreignKey: 'userId', constraints: false });
    OrderHistory.belongsTo(models.Product, { foreignKey: 'productId', constraints: false });
  };
  return OrderHistory;
};
