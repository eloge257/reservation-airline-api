const { DataTypes } = require('sequelize');
const sequelize = require("../utils/sequelize");
/**
 * model pour la table  paiement
 * @author Eloge257
 * 
 */
const Paiement = sequelize.define('paiement', {
    id_paiement: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_reservations: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    montant: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    mode_paiement: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    transaction_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    statut: {
        type: DataTypes.TINYINT,
        allowNull: false,
    },
    date_paiement: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: false,
    tableName: 'paiement'
});

module.exports = Paiement;