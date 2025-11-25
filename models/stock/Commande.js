const { DataTypes } = require('sequelize');
const sequelize = require("../../utils/sequelize");
const Fournisseur = require('./Fournisseur');
/**
 * model pour la table  categorie
 * @author Eloge257
 */
const Commande = sequelize.define('commande', {
    id_categorie : {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_fournisseur: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    date_commande:{
        type:DataTypes.DATE,
        allowNull:false
    },
    statut:{
        type:DataTypes.ENUM('EN_ATTENTE', 'EXPEDIEE', 'ANNULEE'),
        defaultValue: 'EN_ATTENTE'
    },
    date_livraison_prevue:{
        type:DataTypes.DATE,
        allowNull:false
    }
}, {
    timestamps: false,
    tableName: 'commande'
});
Commande.belongsTo(Fournisseur, { foreignKey: 'id_fournisseur', as: "fournisseur"})

module.exports = Commande;