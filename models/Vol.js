 const { DataTypes } = require('sequelize');
const sequelize = require("../utils/sequelize");
const Type_vol = require('./Type_vol');
const Airports = require('./Airports');
/**
 * model pour la table vol
 * @author Eloge257
 * 
 */
const Vol = sequelize.define('vol', {
    id_vol: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    numero_vol: {
        type: DataTypes.STRING(40),
        allowNull: false
    },
    id_type_vol: {
        type: DataTypes.TINYINT,
        allowNull: false
    },
    destination:{
        type: DataTypes.STRING(255),
        allowNull: false
    },
    airport_depart: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    airport_arrive: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    date_depart: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue:1
    },
      date_arrive: {
        type: DataTypes.DATE,
        allowNull: false,
    },
      prix: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
      compagnie: {
        type: DataTypes.STRING(30),
        allowNull: false,
    },
       date_creation: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue:DataTypes.NOW
    },
    status_vol: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        defaultValue:1
    },
}, {
    timestamps: false,
    tableName: 'vol'
});
Vol.belongsTo(Type_vol, { foreignKey: 'id_type_vol', as: 'type_vol' });
Vol.belongsTo(Airports, { foreignKey: 'airport_depart', as: 'airport_dp',targetKey: "id_airports"});
Vol.belongsTo(Airports, { foreignKey: 'airport_arrive', as: 'airport_arr', targetKey: "id_airports"});


module.exports = Vol;