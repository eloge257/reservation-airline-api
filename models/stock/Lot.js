const { DataTypes } = require('sequelize');
const sequelize = require("../../utils/sequelize");
/**
 * model pour la table  Lot
 * @author Eloge257
 * 
 */
const Lot = sequelize.define('lot', {
    id_lot : {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_produit: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    quantite: {
        type: DataTypes.INTEGER,
        allowNull: false
    }, 
    date_fabrication: {
        type: DataTypes.DATE,
        allowNull: false
    },
    date_expiration: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    timestamps: false,
    tableName: 'lot'
});

module.exports = Lot;