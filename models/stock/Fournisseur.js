const { DataTypes } = require('sequelize');
const sequelize = require("../../utils/sequelize");
/**
 * model pour la table  Fournisseur
 * @author Eloge257
 * 
 */
const Fournisseur = sequelize.define('fournisseur', {
    id_fournisseur : {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nom: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    adresse: {
        type: DataTypes.STRING(255),
        allowNull: false
    }, 
    telephone: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false
    }
}, {
    timestamps: false,
    tableName: 'fournisseur'
});

module.exports = Fournisseur;