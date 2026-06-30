module.exports = (sequelize, DataTypes) => {
  const Superadmin = sequelize.define('superadmin', {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    username: { type: DataTypes.STRING },
    name: { type: DataTypes.STRING },
    password: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    phone: { type: DataTypes.STRING },
    status: { type: DataTypes.BOOLEAN },
    history: { type: DataTypes.JSON }
  }, { timestamps: true });

  Superadmin.associate = (models) => {
    Superadmin.hasMany(models.Manager, { foreignKey: 'superadminId', constraints: false });
    Superadmin.hasMany(models.Category, { foreignKey: 'superadminId', constraints: false });
  };
  return Superadmin;
};
