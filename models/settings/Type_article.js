const { DataTypes } = require('sequelize');
const sequelize = require("../../utils/sequelize");
/**
 * model pour la table type article
 * @author Eloge257
 * 
 */
const Type_article = sequelize.define('type_article', {
    id_type_article: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nom_article: {
        type: DataTypes.TEXT,
        allowNull: false
    },
}, {
    timestamps: false,
    tableName: 'type_article'
});

module.exports = Type_article;