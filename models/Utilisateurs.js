const { DataTypes } = require('sequelize');
const sequelize = require("../utils/sequelize");
/**
 * model pour la table utilisateurs
 * @author Eloge257
 * 
 */
const Utilisateurs = sequelize.define('utilisateurs', {
    id_utilisateurs: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_client: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    mot_de_passe: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    type_utilisateur: {
        type: DataTypes.TINYINT,
        allowNull: false
    },
    is_activated: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue:1
    },
}, {
    timestamps: false,
    tableName: 'utilisateurs'
});

module.exports = Utilisateurs;