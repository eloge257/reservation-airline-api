const RESPONSE_CODES = require("../../constants/RESPONSE_CODES")
const RESPONSE_STATUS = require("../../constants/RESPONSE_STATUS")
const Produit = require("../../models/stock/Produit")
const yup = require("yup");
const Unite = require("../../models/stock/Unite");
const Type_paiement = require("../../models/stock/type_paiement");


// pour lister tous les types de paiement
const findAllTypePaiment = async(req,res) => {
    try {
        const data = await Type_paiement.findAll()
        res.status(RESPONSE_CODES.OK).json({
            statusCode:RESPONSE_CODES.OK,
            httpStatus:RESPONSE_STATUS.OK,
            message:"Listes des types de paiement",
            result:data
        })
    } catch (error) {
         res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode:RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            httpStatus:RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
            message:error.message,
        })
    }
}

// pour ajouter un produit
/**
 * @function pour inserter les clients
 * @author <<Eloge257>>
 */


const createTypePaiement = async (req, res) => {
    try {
        const {
            description,
            is_active
        } = req.body;

        // -----------------------------
        // VALIDATION YUP
        // -----------------------------
        const validationSchema = yup.object({
            description: yup.string().required("Le nom du produit est obligatoire"),
            is_active: yup.boolean().required("Le champ is_calculable est obligatoire"),
        });

        await validationSchema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true
        });

        // -----------------------------
        // INSERTION DANS LA BD
        // -----------------------------
        const insertData = await Type_paiement.create({
            description,
            is_active
        });

        // -----------------------------
        // REPONSE
        // -----------------------------
        res.status(RESPONSE_CODES.CREATED).json({
            statusCode: RESPONSE_CODES.CREATED,
            httpStatus: RESPONSE_STATUS.CREATED,
            message: "Type paiement créé avec succès",
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
                    if (curr.path) {
                        acc[curr.path] = curr.errors[0];
                    }
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


module.exports ={
    findAllTypePaiment,createTypePaiement
}