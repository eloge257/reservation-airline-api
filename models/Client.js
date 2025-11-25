const { DataTypes } = require('sequelize');
const sequelize = require("../utils/sequelize");
/**
 * model pour la table  client
 * @author Eloge257
 * 
 */
const Client = sequelize.define('client', {
    id_client : {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nom: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    prenom: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    email:{
        type: DataTypes.STRING(40),
        allowNull: false
    },
    telephone:{
          type: DataTypes.STRING(20),
        allowNull: false
    },
    is_activated:{
          type: DataTypes.TINYINT,
        allowNull: false
    },
    date_creation:{
          type: DataTypes.DATE,
        allowNull: false,
        defaultValue:DataTypes.NOW
    }
}, {
    timestamps: false,
    tableName: 'client'
});

module.exports = Client;