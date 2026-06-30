module.exports = (sequelize, DataTypes) => {
  const LikesHistory = sequelize.define('LikesHistory', {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    productid: { type: DataTypes.STRING },
    likedAt: { type: DataTypes.DATE }
  }, { timestamps: true });

  LikesHistory.associate = (models) => {
    LikesHistory.belongsTo(models.User, { foreignKey: 'userId', constraints: false });
    LikesHistory.belongsTo(models.Product, { foreignKey: 'productId', constraints: false });
  };
  return LikesHistory;
};
