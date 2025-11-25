const { DataTypes } = require('sequelize');
const sequelize = require("../../utils/sequelize");
/**
 * model pour la table devise
 * @author Eloge257
 * 
 */
const Devise = sequelize.define('devise', {
    id_devise: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
}, {
    timestamps: false,
    tableName: 'devise'
});

module.exports = Devise;