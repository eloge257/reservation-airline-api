const { DataTypes } = require('sequelize');
const sequelize = require("../utils/sequelize");
/**
 * model pour la table type document
 * @author Eloge257
 * 
 */
const Type_document = sequelize.define('type_document', {
    id_type_document: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nom_document: {
        type: DataTypes.TEXT,
        allowNull: false
    },
}, {
    timestamps: false,
    tableName: 'type_document'
});

module.exports = Type_document;