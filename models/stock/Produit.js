const { DataTypes } = require("sequelize");
const sequelize = require("../../utils/sequelize");

/**
 * Modèle Sequelize pour la table `produit`
 * Base : facture_bi
 * Auteur : Paolo / Eloge257
 */

const Produit = sequelize.define("produit", {
  id_produit: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  code_sku: {
    type: DataTypes.STRING(100),
    allowNull: true
  },

  nom: {
    type: DataTypes.STRING(255),
    allowNull: false
  },

  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },

  categorie: {
    type: DataTypes.SMALLINT,
    allowNull: true
  },

  quantite_stock: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },

  stock_min: {
    type: DataTypes.FLOAT,
    allowNull: true,
    defaultValue: 0
  },

  stock_max: {
    type: DataTypes.FLOAT,
    allowNull: true,
    defaultValue: 0
  },

  prix_achat: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },

  prix_vente: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },

  id_fournisseur: {
    type: DataTypes.INTEGER,
    allowNull: true
  },

  date_achat: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },

  date_peremption: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },

  lieu_stockage: {
    type: DataTypes.STRING(255),
    allowNull: true
  },

  largeur_cm: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },

  profondeur_cm: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },

  hauteur_cm: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },

  poids_kg: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },

  etat: {
    type: DataTypes.STRING(50),
    allowNull: true
  },

  numero_lot: {
    type: DataTypes.STRING(100),
    allowNull: true
  },

  type_gestion: {
    type: DataTypes.STRING(50),
    allowNull: true
  },

  date_creation: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },

  date_modification: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }

}, {
  tableName: "produit",
  timestamps: false, // désactivation des createdAt/updatedAt automatiques
});

module.exports = Produit;
