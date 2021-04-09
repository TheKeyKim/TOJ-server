'use strict';
const {
  Model, QueryInterface
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class solved extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.solved.belongsTo(models.user, {foreignKey:"user_id"});
    }
  };

  up : async(queryInterface, Sequelize) => {
    await QueryInterface.addConstraints('user_id', {
      fields:['user_id'],
      tpye : "foreign key",
      name: "solved_user_id_fk",
      references:{
        table:"users",
        field:"id"
      },
      onDelete: "cascade"
    });
  }
  solved.init({
    user_id: DataTypes.STRING,
    solved: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'solved',
  });
  return solved;
};