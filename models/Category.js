module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING },
    status: { type: DataTypes.BOOLEAN },
    history: { type: DataTypes.JSON }
  }, { timestamps: true });

  Category.associate = (models) => {
    Category.belongsTo(models.superadmin, { foreignKey: 'superadminId', constraints: false });
    Category.hasMany(models.Product, { foreignKey: 'categoryId', constraints: false });
  };
  return Category;
};
