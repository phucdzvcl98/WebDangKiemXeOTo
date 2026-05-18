'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Center_Arena_Specialty extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Center_Arena_Specialty.init({
        centerId: DataTypes.INTEGER,
        arenaId: DataTypes.INTEGER,
        specialtyId: DataTypes.INTEGER

    }, {
        sequelize,
        modelName: 'Center_Arena_Specialty',
    });
    return Center_Arena_Specialty;
};