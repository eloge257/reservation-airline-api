const { DataTypes } = require('sequelize');
const sequelize = require("../../utils/sequelize");
/**
 * model pour la table compte_bancaire
 * @author Eloge257
 * 
 */
const Compte_bancaire = sequelize.define('compte_bancaire', {
    id_compte_bancaire: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    titulaire_bancaire: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    numero_bancaire: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    bank_name: {
        type: DataTypes.STRING(255),
        allowNull: false
    }
}, {
    timestamps: false,
    tableName: 'compte_bancaire'
});

module.exports = Compte_bancaire;