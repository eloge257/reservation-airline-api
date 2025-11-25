const RESPONSE_CODES = require("../../constants/RESPONSE_CODES");
const RESPONSE_STATUS = require("../../constants/RESPONSE_STATUS");
const yup = require("yup");
const Compte_bancaire = require("../../models/settings/Compte_bancaire");

/**
 * @function pour inserter les compte bancaire
 * @author <<Eloge257>>
 */

const createCmptBancaire = async(req,res) => {
    try {
        const { titulaire_bancaire,numero_bancaire,bank_name } = req.body
        
        //validation des champs avant l'enregistrement
        const validationSchema =  yup.object({
            titulaire_bancaire: yup.string().required("Titulaire est obligatoire"),
            numero_bancaire: yup.string().required("Numero est obligatoire"),
            bank_name: yup.string().required("Nom de la banque est obligatoire"),
        });

        await validationSchema.validate(req.body, { abortEarly: false , stripUnknown: true});

        //insertion des donnees
        const  insertData = await Compte_bancaire.create({
            titulaire_bancaire,numero_bancaire,bank_name
        })

        //reponse  d une fonction
        res.status(RESPONSE_CODES.CREATED).json({
            statusCode:RESPONSE_CODES.CREATED,
            httpStatus:RESPONSE_STATUS.CREATED,
            message:"Compte bancaire est cree avec succes",
            result:insertData
        })

    } catch (error) {
        // afficher  les erreurs de validation
        if (error instanceof yup.ValidationError) {
            return res.status(RESPONSE_CODES.UNPROCESSABLE_ENTITY).json({
                statusCode:RESPONSE_CODES.UNPROCESSABLE_ENTITY,
                httpStatus: RESPONSE_STATUS.UNPROCESSABLE_ENTITY,
                message: 'Erreur de validation des données',
                errors: error.inner.reduce((acc, curr) => {
                    if (curr.path) {
                        return { ...acc, [curr.path]: curr.errors[0] }
                    }
                }, {}),
            })
        }
        console.log(error);
           //reponse  d une fonction
        res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode:RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            httpStatus:RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
            message:error.message,
        })
    }
}

/**
 * @function pour faire la listes des comptes bancaires
 * @author <<Eloge257>>
 */

const findAllCmptBancaire = async(req,res) => {
    try {
        const devise = await Compte_bancaire.findAll({ })

        // reponse 
        res.status(RESPONSE_CODES.OK).json({
            statusCode:RESPONSE_CODES.OK,
            httpStatus:RESPONSE_STATUS.OK,
            message:"Listes des comptes bancaires",
            result:devise
        })
        
    } catch (error) {
        // capture des erreurs
        console.log(error);
        res.status(RESPONSE_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode:RESPONSE_CODES.INTERNAL_SERVER_ERROR,
            httpStatus:RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
            message:error.message
        })
    }
}

//exports function
module.exports = {
    createCmptBancaire,
    findAllCmptBancaire
}