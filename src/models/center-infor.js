'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Center_Infor extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Center_Infor.belongsTo(models.User, { foreignKey: 'centerId' })

            Center_Infor.belongsTo(models.Allcode, { foreignKey: 'priceId', targetKey: 'keyMap', as: 'priceTypeData' })
            Center_Infor.belongsTo(models.Allcode, { foreignKey: 'regionId', targetKey: 'keyMap', as: 'regionTypeData' })
            Center_Infor.belongsTo(models.Allcode, { foreignKey: 'paymentId', targetKey: 'keyMap', as: 'paymentTypeData' })
        }
    }
    Center_Infor.init({
        centerId: DataTypes.INTEGER,
        priceId: DataTypes.STRING,
        regionId: DataTypes.STRING,
        paymentId: DataTypes.STRING,
        addressArena: DataTypes.STRING,
        nameArena: DataTypes.STRING,
        note: DataTypes.STRING,
        count: DataTypes.INTEGER,
        arenaId: DataTypes.INTEGER,

    }, {
        sequelize,
        modelName: 'Center_Infor',
        freezeTableName: true
    });
    return Center_Infor;
};