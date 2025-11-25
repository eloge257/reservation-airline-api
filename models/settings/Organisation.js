const { DataTypes } = require('sequelize');
const sequelize = require("../../utils/sequelize");
/**
 * model pour la table profil
 * @author Eloge257
 * 
 */
const Organisation = sequelize.define('organisation', {
    id_organisation: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nom_organisation: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
}, {
    timestamps: false,
    tableName: 'organisation'
});

module.exports = Organisation;