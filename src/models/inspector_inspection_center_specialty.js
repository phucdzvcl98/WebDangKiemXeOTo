'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Inspector_Inspection_Center_Specialty extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Inspector_Inspection_Center_Specialty.init({
        inspectorId: DataTypes.INTEGER,
        inspectionId: DataTypes.INTEGER,
        specialtyId: DataTypes.INTEGER

    }, {
        sequelize,
        modelName: 'Inspector_Inspection_Center_Specialty',
    });
    return Inspector_Inspection_Center_Specialty;
};