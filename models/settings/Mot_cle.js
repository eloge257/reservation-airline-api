const { DataTypes } = require('sequelize');
const sequelize = require("../../utils/sequelize");
/**
 * model pour la table devise
 * @author Eloge257
 * 
 */
const Mot_cle = sequelize.define('mot_cle', {
    id_mot_cle : {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    motCle_name: {
        type: DataTypes.STRING(8),
        allowNull: false
    },
}, {
    timestamps: false,
    tableName: 'mot_cle'
});

module.exports = Mot_cle;