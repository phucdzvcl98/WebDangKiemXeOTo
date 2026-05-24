'use strict';

module.exports = (sequelize, DataTypes) => {
    const Center_Specialty = sequelize.define('Center_Specialty', {
        centerId: DataTypes.INTEGER,
        specialtyId: DataTypes.INTEGER,
    }, {
        freezeTableName: true
    });

    Center_Specialty.associate = function (models) {
        Center_Specialty.belongsTo(models.User, {
            foreignKey: 'centerId',
            targetKey: 'id',
            as: 'centerData'
        });

        Center_Specialty.belongsTo(models.Specialty, {
            foreignKey: 'specialtyId',
            targetKey: 'id',
            as: 'specialtyData'
        });
    };

    return Center_Specialty;
};