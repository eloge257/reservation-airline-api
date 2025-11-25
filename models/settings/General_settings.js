const { DataTypes } = require('sequelize');
const sequelize = require("../../utils/sequelize");
const Pays = require('./Pays');
const Devise = require('./Devise');
const Type_article = require('./Type_article');
/**
 * model pour la table general_settings
 * @author Eloge257
 * 
 */
const General_settings = sequelize.define('general_settings', {
    id_setting: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_pays: {
        type: DataTypes.SMALLINT,
        allowNull:false
    },
    id_devise:{
        type:DataTypes.SMALLINT,
        allowNull:false
    },
    id_type_article:{
        type:DataTypes.TINYINT,
        allowNull:false
    },
    tva:{
        type:DataTypes.DOUBLE,
        allowNull:false
    },
    is_applicable:{
        type:DataTypes.TINYINT,
        allowNull:false
    },
    text_affiche:{
        type:DataTypes.TEXT,
        allowNull:false
    },
    interet_retard:{
        type:DataTypes.FLOAT,
        allowNull:false
    },
    type_document: {
        type: DataTypes.ENUM('FACTURE'),
        allowNull: false
    },
}, {
    timestamps: false,
    tableName: 'general_settings'
});

// associations avec les tables lies a cette table
General_settings.belongsTo(Pays,{ foreignKey:"id_pays", as:"pays" })
General_settings.belongsTo(Devise, { foreignKey:"id_devise", as:"devise" } )
General_settings.belongsTo(Type_article, { foreignKey:"id_type_article", as:"type_article" })

module.exports = General_settings;