const RESPONSE_CODES = require("../../constants/RESPONSE_CODES")
const RESPONSE_STATUS = require("../../constants/RESPONSE_STATUS")
const Produit = require("../../models/stock/Produit")
const yup = require("yup");
const Unite = require("../../models/stock/Unite");


// pour lister tous les unites
const findAllUnite = async(req,res) => {
    try {
        const data = await Unite.findAll()
        res.status(RESPONSE_CODES.OK).json({
            statusCode:RESPONSE_CODES.OK,
            httpStatus:RESPONSE_STATUS.OK,
            message:"Listes des unites",
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


const createUnite = async (req, res) => {
    try {
        const {
            name,
            is_calculable
        } = req.body;

        // -----------------------------
        // VALIDATION YUP
        // -----------------------------
        const validationSchema = yup.object({
            name: yup.string().required("Le nom du produit est obligatoire"),
is_calculable: yup.boolean().required("Le champ is_calculable est obligatoire"),
        });

        await validationSchema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true
        });

        // -----------------------------
        // INSERTION DANS LA BD
        // -----------------------------
        const insertData = await Unite.create({
            name,
            is_calculable
        });

        // -----------------------------
        // REPONSE
        // -----------------------------
        res.status(RESPONSE_CODES.CREATED).json({
            statusCode: RESPONSE_CODES.CREATED,
            httpStatus: RESPONSE_STATUS.CREATED,
            message: "Unite créé avec succès",
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
    findAllUnite,createUnite
}