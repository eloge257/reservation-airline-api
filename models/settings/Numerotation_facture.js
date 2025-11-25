const { DataTypes } = require('sequelize');
const sequelize = require("../utils/sequelize");
/**
 * model pour la table numerotation_facture
 * @author Eloge257
 * 
 */
const Numerotation_facture = sequelize.define('numerotation_facture', {
    id_numerotation: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    format: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    taille_compteur: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    reset_compteur: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
}, {
    timestamps: false,
    tableName: 'numerotation_facture'
});

module.exports = Numerotation_facture;