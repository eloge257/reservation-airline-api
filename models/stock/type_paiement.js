const { DataTypes } = require('sequelize');
const sequelize = require("../../utils/sequelize");

/**
 * Model pour la table Produit
 * @author Eloge257
 */
const Type_paiement = sequelize.define('type_paiement', {

    idPaiement: {
        type: DataTypes.SMALLINT,
        primaryKey: true,
        autoIncrement: true
    },
    description: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    is_active:{
        type: DataTypes.BOOLEAN,
        allowNull: false
    }

}, {
    timestamps: false,
    tableName: 'type_paiement'
});


module.exports = Type_paiement;
