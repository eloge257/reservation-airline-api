const { DataTypes } = require('sequelize');
const sequelize = require("../utils/sequelize");
/**
 * model pour la table profil
 * @author Eloge257
 * 
 */
const Profil = sequelize.define('profil', {
    id_profil : {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nom_profil: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
}, {
    timestamps: false,
    tableName: 'profil'
});

module.exports = Profil;