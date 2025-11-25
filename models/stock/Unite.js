const { DataTypes } = require('sequelize');
const sequelize = require("../../utils/sequelize");

/**
 * Model pour la table Produit
 * @author Eloge257
 */
const Unite = sequelize.define('units', {

    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    name: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    is_calculable:{
        type: DataTypes.BOOLEAN,
        allowNull: false
    }

}, {
    timestamps: false,
    tableName: 'units'
});


module.exports = Unite;
