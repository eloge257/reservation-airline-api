const { DataTypes } = require('sequelize');
const sequelize = require("../utils/sequelize");
const Client = require('./Client');
const Vol = require('./Vol');
/**
 * model pour la table  reservations
 * @author Eloge257
 * 
 */
const Reservations = sequelize.define('reservations', {
    id_reservations: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_client: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_vol: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    is_activated: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue:0
    },
    statut_reservations: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue:1
    },
    date_reservation: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: false,
    tableName: 'reservations'
});

Reservations.belongsTo(Client, { foreignKey: 'id_client', as: 'client' });
Reservations.belongsTo(Vol, { foreignKey: 'id_vol', as: 'vol' });

module.exports = Reservations;