const { DataTypes } = require('sequelize');
const sequelize = require("../utils/sequelize");
/**
 * model pour la table  airports
 * @author Eloge257
 * 
 */
const Airports = sequelize.define('airports', {
    id_airports : {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    code: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    nom: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    ville:{
          type: DataTypes.STRING(40),
        allowNull: false
    },
    pays:{
          type: DataTypes.STRING(40),
        allowNull: false
    }
}, {
    timestamps: false,
    tableName: 'airports'
});

module.exports = Airports;