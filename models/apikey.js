const {
    Model
  } = require('sequelize');
  module.exports = (sequelize, DataTypes) => {
    class apikey extends Model {
    };
    apikey.init({
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      api_key: {type: DataTypes.STRING, unique: true, allowNull: false},
      is_stale: {type: DataTypes.BOOLEAN, allowNull: false}
    }, {
      sequelize,
      modelName: 'apikey',
    });
    return apikey;
  };