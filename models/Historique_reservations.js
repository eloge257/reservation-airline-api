const { DataTypes } = require('sequelize');
const sequelize = require("../utils/sequelize");
/**
 * model pour la table  historique_reservations
 * @author Eloge257
 * 
 */
const Historique_reservations = sequelize.define('historique_reservations', {
    id_historique : {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_reservations: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    statut:{
          type: DataTypes.TINYINT,
        allowNull: false
    },
    update_date:{
          type: DataTypes.DATE,
        allowNull: false,
        defaultValue:DataTypes.NOW
    }
}, {
    timestamps: false,
    tableName: 'historique_reservations'
});

module.exports = Historique_reservations;