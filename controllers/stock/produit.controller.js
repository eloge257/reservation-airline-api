const RESPONSE_CODES = require("../../constants/RESPONSE_CODES")
const RESPONSE_STATUS = require("../../constants/RESPONSE_STATUS")
const Produit = require("../../models/stock/Produit")
const yup = require("yup");


// pour lister tous les produits
const findAllProduit = async (req, res) => {
    try {
        const data = await Produit.findAll()
        res.status(RESPONSE_CODES.OK).json({
            statusCode: RESPONSE_CODES.OK,
            httpStatus: RESPONSE_STATUS.OK,
            message: "Listes des produits",
            result: data
        })
    } catch (error) {
        res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
            message: error.message,
        })
    }
}

// pour ajouter un produit
/**
 * @function pour inserter les clients
 * @author <<Eloge257>>
 */

const createProduct = async (req, res) => {
    try {
        const {
            code_sku,
            nom,
            description,
            categorie,
            quantite_stock,
            stock_min,
            stock_max,
            prix_achat,
            prix_vente,
            id_fournisseur,
            date_achat,
            date_peremption,
            lieu_stockage,
            largeur_cm,
            profondeur_cm,
            hauteur_cm,
            poids_kg,
            etat,
            numero_lot,
            type_gestion
        } = req.body;

        // -----------------------------
        // VALIDATION YUP
        // -----------------------------
        const validationSchema = yup.object({
            code_sku: yup.string().nullable(),
            nom: yup.string().required("Le nom du produit est obligatoire"),
            description: yup.string().nullable(),

            categorie: yup.number().nullable(),

            quantite_stock: yup.number().required("Quantite est obligatoire"),
            stock_min: yup.number().nullable(),
            stock_max: yup.number().nullable(),

            prix_achat: yup.number().required("Le prix d'achat est obligatoire"),
            prix_vente: yup.number().required("Le prix de vente est obligatoire"),

            id_fournisseur: yup.number().nullable(),

            date_achat: yup.date().nullable(),
            date_peremption: yup.date().nullable(),

            lieu_stockage: yup.string().nullable(),

            largeur_cm: yup.number().nullable(),
            profondeur_cm: yup.number().nullable(),
            hauteur_cm: yup.number().nullable(),
            poids_kg: yup.number().nullable(),

            etat: yup.string().nullable(),
            numero_lot: yup.string().nullable(),
            type_gestion: yup.string().nullable(),
        });

        await validationSchema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true
        });

        // -----------------------------
        // INSERTION DANS LA BD
        // -----------------------------
        const insertData = await Produit.create({
            code_sku,
            nom,
            description,
            categorie,
            quantite_stock,
            stock_min,
            stock_max,
            prix_achat,
            prix_vente,
            id_fournisseur,
            date_achat,
            date_peremption,
            lieu_stockage,
            largeur_cm,
            profondeur_cm,
            hauteur_cm,
            poids_kg,
            etat,
            numero_lot,
            type_gestion
        });

        // -----------------------------
        // REPONSE
        // -----------------------------
        res.status(RESPONSE_CODES.CREATED).json({
            statusCode: RESPONSE_CODES.CREATED,
            httpStatus: RESPONSE_STATUS.CREATED,
            message: "Produit créé avec succès",
            result: insertData
        });

    } catch (error) {

        // -----------------------------
        // ERREURS YUP
        // -----------------------------
        if (error instanceof yup.ValidationError) {
            return res.status(RESPONSE_CODES.UNPROCESSABLE_ENTITY).json({
                statusCode: RESPONSE_CODES.UNPROCESSABLE_ENTITY,
                httpStatus: RESPONSE_STATUS.UNPROCESSABLE_ENTITY,
                message: 'Erreur de validation',
                errors: error.inner.reduce((acc, curr) => {
                    if (curr.path) acc[curr.path] = curr.errors[0];
                    return acc;
                }, {})
            });
        }

        console.log(error);

        // -----------------------------
        // ERREURS SERVEUR
        // -----------------------------
        res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode: RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            httpStatus: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
            message: error.message
        });
    }
};

module.exports = {
    findAllProduit, createProduct
}