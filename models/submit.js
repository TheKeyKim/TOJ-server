'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class submit extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  submit.init({
    submit_id: DataTypes.INTEGER,
    problem_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    status: DataTypes.INTEGER,
    language : DataTypes.INTEGER,
    code : DataTypes.STRING
  }, {
    sequelize,
    modelName: 'submit',
  });
  return submit;
};