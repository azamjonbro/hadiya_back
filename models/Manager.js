module.exports = (sequelize, DataTypes) => {
  const Manager = sequelize.define('Manager', {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    username: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    password: { type: DataTypes.STRING },
    phone: { type: DataTypes.STRING },
    status: { type: DataTypes.BOOLEAN },
    history: { type: DataTypes.JSON }
  }, { timestamps: true });

  Manager.associate = (models) => {
    Manager.belongsTo(models.superadmin, { foreignKey: 'superadminId', constraints: false });
  };
  return Manager;
};
