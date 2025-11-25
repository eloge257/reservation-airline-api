const { DataTypes } = require('sequelize');
const sequelize = require("../../utils/sequelize");
const Mot_cle = require('./Mot_cle');
const Company = require('./Company');
/**
 * model pour la table  company
 * @author Eloge257
 * 
 */
const Client = sequelize.define('client', {
    idClient  : {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nom_client: {
        type: DataTypes.STRING(35),
        allowNull: false
    },
    prenom_client: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    fonction: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(45),
        allowNull: true
    },
    telephone1: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    telephone2: {
        type: DataTypes.STRING(45),
        allowNull: true
    },
    id_motCle: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    id_company: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    typeClient: {
        type: DataTypes.ENUM('Particulier', 'Professionnel'),
        allowNull: false
    },
}, {
    timestamps: false,
    tableName: 'Client'
});
// Association avec Company et Mot_cle
Client.belongsTo(Company, { foreignKey: 'id_company', as: 'company' });
Client.belongsTo(Mot_cle, { foreignKey: 'id_motCle', as: 'mot_cle' });

module.exports = Client;