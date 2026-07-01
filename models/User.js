module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    firstName: { type: DataTypes.STRING },
    lastName: { type: DataTypes.STRING },
    phone: { type: DataTypes.STRING },
    likesHistory: { type: DataTypes.STRING },
    OrderHistory: { type: DataTypes.STRING },
    cartHistory: { type: DataTypes.STRING }
  }, { timestamps: true });

  User.associate = (models) => {
    User.hasMany(models.LikesHistory, { foreignKey: 'userId', constraints: false });
    User.hasMany(models.HistoryModel, { foreignKey: 'userId', constraints: false });
    User.hasMany(models.CartHistory, { foreignKey: 'userId', constraints: false });
  };
  return User;
};
