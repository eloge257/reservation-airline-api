const { DataTypes, NOW } = require('sequelize');
const sequelize = require("../../utils/sequelize");
const Lot = require('./Lot');
/**
 * model pour la table  MouvementStock
 * @author Eloge257
 * 
 */
const MouvementStock = sequelize.define('mouvementStock', {
    id_mouvement : {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    type_mouvement: {
        type: DataTypes.ENUM('ENTREE', 'SORTIE'),
        allowNull: false
    },
    id_lot: {
        type: DataTypes.INTEGER,
        allowNull: false
    }, 
    quantite: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    date_mouvement: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: NOW()
    },
    commentaire: {
        type: DataTypes.TEXT,
        allowNull: false,
    }
}, {
    timestamps: false,
    tableName: 'mouvementStock'
});

MouvementStock.belongsTo(Lot,{foreignKey: "id_lot", as:"lot"})

module.exports = MouvementStock;