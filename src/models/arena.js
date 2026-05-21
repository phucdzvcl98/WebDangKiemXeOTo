'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Arena extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Arena.init({
        name: DataTypes.STRING,
        address: DataTypes.STRING,
        descriptionHTML: DataTypes.TEXT,
        descriptionMarkdown: DataTypes.TEXT,
        image: DataTypes.TEXT,


    }, {
        sequelize,
        modelName: 'Arena',
    });
    return Arena;
};