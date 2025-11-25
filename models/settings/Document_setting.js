const { DataTypes } = require('sequelize');
const sequelize = require("../../utils/sequelize");
/**
 * model pour la table document_setting
 * @author Eloge257
 * 
 */
const Document_setting = sequelize.define('document_setting', {
    id_doc_setting: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    text_introduction: {
        type: DataTypes.TEXT,
        allowNull:false
    },
    text_conclusion:{
        type:DataTypes.TEXT,
        allowNull:false
    },
    pied_page:{
        type:DataTypes.TEXT,
        allowNull:false
    },
    show_username:{
        type:DataTypes.ENUM('Oui','Non'),
        allowNull:false
    },
    montant_pourc:{
        type:DataTypes.FLOAT,
        allowNull:false
    },
    type_document:{
        type:DataTypes.ENUM("FACTURE","DEVIS"),
        allowNull:false
    },
}, {
    timestamps: false,
    tableName: 'document_setting'
});

module.exports = Document_setting;