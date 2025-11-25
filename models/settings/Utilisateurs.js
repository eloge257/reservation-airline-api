const { DataTypes } = require('sequelize');
const sequelize = require("../utils/sequelize");
const Profil = require('./Profil');
const Organisation = require('./Organisation');
/**
 * model pour la table utilisateur
 * @author Eloge257
 * 
 */
const Utilisateurs = sequelize.define('utilisateurs', {
    id_utilisateur  : {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nom: {
        type: DataTypes.STRING(40),
        allowNull: false
    },
    prenom: {
        type: DataTypes.STRING(40),
        allowNull: false
    },
    telephone: {
        type: DataTypes.STRING(40),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    deviceId: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    id_profil: {
        type: DataTypes.TINYINT,
        allowNull: false
    },
    id_organisation: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
}, {
    timestamps: false, // Si vous ne voulez pas de colonnes createdAt et updatedAt
    tableName: 'utilisateurs' // Nom de la table dans la base de données
});

//joiture pour les tables associatifs de cette table
Utilisateurs.belongsTo(Profil,{ foreignKey:"id_profil", as:"profil" })
Utilisateurs.belongsTo(Organisation,{ foreignKey:"id_organisation", as:"organisation" })



// Exporter le modèle Contrat
module.exports = Utilisateurs;