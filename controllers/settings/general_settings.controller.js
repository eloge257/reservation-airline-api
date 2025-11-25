const RESPONSE_CODES = require("../../constants/RESPONSE_CODES");
const RESPONSE_STATUS = require("../../constants/RESPONSE_STATUS");
const yup = require("yup");
const General_settings = require("../../models/settings/General_settings");
const Pays = require("../../models/settings/Pays");
const Devise = require("../../models/settings/Devise");
const Type_article = require("../../models/settings/Type_article");

/**
 * @function pour inserter les general settings
 * @author <<Eloge257>>
 */

const createGeneralSettings = async(req,res) => {
    try {
        const { id_pays,id_devise,id_type_article,tva,is_applicable,text_affiche,interet_retard,type_document, } = req.body
        
        //validation des champs avant l'enregistrement
        const validationSchema =  yup.object({
            id_pays: yup.number().required("Pays  est obligatoire"),
            id_devise: yup.number().required("Devise est obligatoire"),
            id_type_article: yup.number().required("Article  est obligatoire"),
            tva: yup.number().required("Tva est obligatoire"),
            interet_retard: yup.number().required("Interet de retard  est obligatoire"),
            text_affiche: yup.string().required("Texte est obligatoire"),
            type_document: yup.string().required("Texte est obligatoire"),
        });

        await validationSchema.validate(req.body, { abortEarly: false , stripUnknown: true});

        //insertion des donnees
        const  insertData = await General_settings.create({
            id_pays,
            id_devise,
            id_type_article,
            tva,
            interet_retard,
            text_affiche,
            type_document,
            is_applicable
        })

        //reponse  d une fonction
        res.status(RESPONSE_CODES.CREATED).json({
            statusCode:RESPONSE_CODES.CREATED,
            httpStatus:RESPONSE_STATUS.CREATED,
            message:"General settings est cree avec succes",
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
 * @function pour faire la listes des parametres general
 * @author <<Eloge257>>
 */

const findAllGeneralSettings = async(req,res) => {
    try {
        const general_setting = await General_settings.findAll({
                include:[
                    {
                        model:Pays,
                        as:"pays"
                    },
                    {
                        model:Devise,
                        as:"devise"
                    },
                    {
                        model:Type_article,
                        as:"type_article"
                    }
                ]
        })

        // reponse 
        res.status(RESPONSE_CODES.OK).json({
            statusCode:RESPONSE_CODES.OK,
            httpStatus:RESPONSE_STATUS.OK,
            message:"Listes des parametres general",
            result:general_setting
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
    createGeneralSettings,
    findAllGeneralSettings
}