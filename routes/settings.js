const express = require("express");
const  paysController  = require("../controllers/settings/pays.controller");
const general_settings = require("../controllers/settings/general_settings.controller");
const deviseController = require("../controllers/settings/devise.controller");
const cmptController = require("../controllers/settings/compte_bancaire.controller");
const coordonneController = require("../controllers/settings/coordonnes.controller");
const organisationController = require("../controllers/settings/organisation.controller");
const docSettingsController = require("../controllers/settings/document_setting.controller");
const motCleController = require("../controllers/settings/mot_cle.controller")
const companyController = require("../controllers/settings/company.controller")
const clientsControler = require("../controllers/settings/client.controller")
const typePaiementController = require("../controllers/stock/type_paiement.controller");



const settings_routes =  express.Router();



// ==========================================================
// les routes pays
// ==========================================================

/**
 * @method get
 * /settings/pays/all
 */
settings_routes.get('/pays/all',paysController.findAllPays)

/**
 * @method post
 * /settings/pays/create
 */
settings_routes.post('/pays/create',paysController.createPays)

/**
 * @method get
 * /settings/pays/findOne/${id}
 */
settings_routes.get('/pays/findOne/:id',paysController.findPays)

/**
 * @method put
 * /settings/pays/update
 */
settings_routes.put('/pays/update/:id',paysController.updatePays)

// ===============================================================
// Les routes pour general settings
// ===============================================================

/**
 * @method post
 * /settings/general/create
 */
settings_routes.post('/general/',general_settings.createGeneralSettings)

/**
 * @method get
 * /settings/general/findAll
 */
settings_routes.get('/general/findAll',general_settings.findAllGeneralSettings)

// ===============================================================
// Les routes pour devise
// ===============================================================

/**
 * @method post
 * /settings/devise/create
 */
settings_routes.post('/devise/create',deviseController.createDevise)

/**
 * @method get
 * /settings/devise/findAll
 */
settings_routes.get('/devise/findAll',deviseController.findAllDevise)


// ===============================================================
// Les routes pour  compte bancaire
// ===============================================================

/**
 * @method post
 * /settings/cmpt/create
 */
settings_routes.post('/cmpt/create',cmptController.createCmptBancaire)

/**
 * @method get
 * /settings/cmpt/findAll
 */
settings_routes.get('/cmpt/findAll',cmptController.findAllCmptBancaire)

// ===============================================================
// Les routes pour  coordonnes
// ===============================================================

/**
 * @method post
 * /settings/coordonnes/create
 */
settings_routes.post('/coordonnes/create',coordonneController.createCoordonne)

/**
 * @method get
 * /settings/coordonnes/findAll
 */
settings_routes.get('/coordonnes/findAll',coordonneController.findAllCoordonnes)


// ===============================================================
// Les routes pour  organisations
// ===============================================================

/**
 * @method post
 * /settings/organisation/create
 */
settings_routes.post('/organisation/create',organisationController.createOrganisation)

/**
 * @method get
 * /settings/organisation/findAll
 */
settings_routes.get('/organisation/findAll',organisationController.findAllOrganisations)


// ===============================================================
// Les routes pour  parametres des documents
// ===============================================================

/**
 * @method post
 * /settings/docSettings/create
 */
settings_routes.post('/docSettings/create',docSettingsController.createDocSetting)

/**
 * @method get
 * /settings/docSettings/findAll
 */
settings_routes.get('/docSettings/findAll',docSettingsController.findAllDocSettings)


// ===============================================================
// Les routes pour  les mot cles
// ===============================================================

/**
 * @method post
 * /settings/motCle/create
 */
settings_routes.post('/motCle/create',motCleController.createMotCle)

/**
 * @method get
 * /settings/motCle/findAll
 */
settings_routes.get('/motCle/findAll',motCleController.findAllMotCle)


// ===============================================================
// Les routes pour  les clients
// ===============================================================

/**
 * @method post
 * /settings/company/create
 */
settings_routes.post('/company/create',companyController.createCompany)


/**
 * @method get
 * /settings/company/all
 */
settings_routes.get('/company/all',companyController.findAllCompany)



/**
 * @method get
 * /settings/company/findOne/:id
 */
settings_routes.get('/company/findOne/:id',companyController.findCompanyById)


/**
 * @method put
 * /settings/company/update/:id
 */
settings_routes.put('/company/update/:id',companyController.updatePays)




// ===============================================================
// Les routes pour  les clients
// ===============================================================

/**
 * @method post
 * /settings/clients/create
 */
settings_routes.post('/clients/create',clientsControler.createClient)


/**
 * @method get
 * /settings/clients/all
 */
settings_routes.get('/clients/all',clientsControler.findAllClient)



/**
 * @method get
 * /settings/clients/findOne/:id
 */
settings_routes.get('/clients/findOne/:id',clientsControler.findClientById)


/**
 * @method put
 * /settings/clientsControler/update/:id
 */
settings_routes.put('/clients/update/:id',clientsControler.updateClient)


// ===============================================================
// Les routes pour  les types de paiement
// ===============================================================
/**
 * @method post
 * /settings/type_paiement
 */
settings_routes.post('/type_paiement',typePaiementController.createTypePaiement)


/**
 * @method get
 * /settings/type_paiement
 */
settings_routes.get('/type_paiement',typePaiementController.findAllTypePaiment)




module.exports = settings_routes