const { DataTypes } = require('sequelize');
const sequelize = require("../../utils/sequelize");
const Pays = require('./Pays');
/**
 * model pour la table Coordonnes
 * @author Eloge257
 * 
 */
const Coordonnes = sequelize.define('coordonnes', {
    id_coordonee: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    adresse_email: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    nom_organisation: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    forme_juridique: {
        type: DataTypes.ENUM('Micro-entreprise'),
        allowNull: false
    },
    numero_tva: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    adresse: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    ville: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    id_pays: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    telephone:{
        type: DataTypes.STRING(30),
        allowNull: false
    },
    site_internet:{
        type:DataTypes.TEXT,
        allowNull:false
    }
}, {
    timestamps: false,
    tableName: 'coordonnes'
});

// jointure avec les autres table
Coordonnes.belongsTo(Pays, {foreignKey: "id_pays", as:"pays"})

module.exports = Coordonnes;