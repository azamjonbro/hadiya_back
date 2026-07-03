module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING },
    status: { type: DataTypes.STRING }, // 'Active', 'Draft', 'Out of Stock'
    sku: { type: DataTypes.STRING },
    barcode: { type: DataTypes.STRING },
    brand: { type: DataTypes.STRING },
    shortDescription: { type: DataTypes.TEXT },
    fullDescription: { type: DataTypes.TEXT },
    characteristics: { type: DataTypes.JSON },
    history: { type: DataTypes.JSON },
    images: { type: DataTypes.JSON },
    likes: { type: DataTypes.STRING },
    quantity: { type: DataTypes.STRING },
    price: { type: DataTypes.STRING },
    saleprice: { type: DataTypes.STRING },
    salePercent: { type: DataTypes.BIGINT },
    category: { type: DataTypes.STRING }
  }, { timestamps: true });

  Product.associate = (models) => {
    Product.belongsTo(models.Category, { foreignKey: 'categoryId', constraints: false });
    Product.hasMany(models.LikesHistory, { foreignKey: 'productId', constraints: false });
    Product.hasMany(models.CartHistory, { foreignKey: 'productId', constraints: false });
    Product.hasMany(models.HistoryModel, { foreignKey: 'productId', constraints: false });
  };
  return Product;
};
