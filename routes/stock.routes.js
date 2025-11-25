const express = require("express");
const  paysController  = require("../controllers/settings/pays.controller");
const categorieController = require("../controllers/stock/categorie.controller")
const produitController = require("../controllers/stock/produit.controller")
const uniteController = require("../controllers/stock/unite.controller")



const stock_routes =  express.Router();



// ==========================================================
// les routes pour les categories
// ==========================================================

/**
 * @method POST
 * /stock/categorie/
 */
stock_routes.post('/categorie/',categorieController.createCategorie)


/**
 * @method POST
 * /stock/categorie/
 */
stock_routes.get('/categorie/',categorieController.findAllCategorie)



/**
 * @method PUT
 * /stock/categorie/
 */
stock_routes.put('/categorie/:id',categorieController.updateCategorie)

/**
 * @method DELETE
 * /stock/categorie/
 */
stock_routes.delete('/categorie/:id',categorieController.deleteCategorie)

// ==============================================
// les routes pour les produits
// ==============================================
stock_routes.get('/product',produitController.findAllProduit)
stock_routes.post('/product',produitController.createProduct)

// ==============================================
// les routes pour les clients
// ==============================================
stock_routes.get('/unite',uniteController.findAllUnite)
stock_routes.post('/unite',uniteController.createUnite)


module.exports = stock_routes