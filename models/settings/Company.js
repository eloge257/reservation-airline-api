const { DataTypes } = require('sequelize');
const sequelize = require("../../utils/sequelize");
const Pays = require('./Pays');
const Mot_cle = require('./Mot_cle');
/**
 * model pour la table  company
 * @author Eloge257
 * 
 */
const Company = sequelize.define('company', {
    id_company : {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nom_societe: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    nif: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    adresse: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    ville: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    idpays: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    site_web: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    email_professionnel: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    id_motCle: {
        type: DataTypes.SMALLINT,
        allowNull: true
    },
    phone1: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    phone2: {
        type: DataTypes.STRING(255),
        allowNull: true
    }
}, {
    timestamps: false,
    tableName: 'company'
});

Company.belongsTo(Pays, { foreignKey: 'idpays' , as: 'pays' });
Company.belongsTo(Mot_cle, { foreignKey: 'id_motCle', as: 'mot_cle' });

module.exports = Company;