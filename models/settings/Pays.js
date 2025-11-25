const { DataTypes } = require('sequelize');
const sequelize = require("../../utils/sequelize");
/**
 * model pour la table pays
 * @author Eloge257
 * 
 */
const Pays = sequelize.define('pays', {
    id_pays: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    CommonName: {
        type: DataTypes.STRING(38),
        allowNull: false
    },
    Capital: {
        type: DataTypes.STRING(78),
        allowNull: false
    },
}, {
    timestamps: false,
    tableName: 'pays'
});

module.exports = Pays;