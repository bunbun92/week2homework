'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Posting extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Posting.init({
    postingId: {
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    postingTitle: DataTypes.STRING,
    postingText: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    sequelize,
    modelName: 'Posting',
  });

  
  return Posting;
};