const RESPONSE_CODES = require("../../constants/RESPONSE_CODES");
const RESPONSE_STATUS = require("../../constants/RESPONSE_STATUS");
const yup = require("yup");
const Document_setting = require("../../models/settings/Document_setting");

/**
 * @function pour inserter les parametres des documents
 * @author <<Eloge257>>
 */

const createDocSetting = async(req,res) => {
    try {
        const { text_introduction,text_conclusion,pied_page,show_username,montant_pourc,type_document } = req.body
        
        //validation des champs avant l'enregistrement
        const validationSchema =  yup.object({
            text_introduction: yup.string().required("Email est obligatoire"),
            text_conclusion: yup.string().required("Nom de l'organisation est obligatoire"),
            pied_page: yup.string().required("Forme jurdique est obligatoire"),
            show_username: yup.string().required("TVA est obligatoire"),
            montant_pourc: yup.string().required("Adresse est obligatoire"),
            type_document: yup.string().required("Ville est obligatoire")
        });

        await validationSchema.validate(req.body, { abortEarly: false , stripUnknown: true});

        //insertion des donnees
        const  insertData = await Document_setting.create({
            text_introduction,text_conclusion,pied_page,show_username,montant_pourc,type_document
        })

        //reponse  d une fonction
        res.status(RESPONSE_CODES.CREATED).json({
            statusCode:RESPONSE_CODES.CREATED,
            httpStatus:RESPONSE_STATUS.CREATED,
            message:"Parametres du document est cree avec succes",
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
 * @function pour faire la listes des parametres des documents
 * @author <<Eloge257>>
 */

const findAllDocSettings = async(req,res) => {
    try {
        const docSettings = await Document_setting.findAll({ })

        // reponse 
        res.status(RESPONSE_CODES.OK).json({
            statusCode:RESPONSE_CODES.OK,
            httpStatus:RESPONSE_STATUS.OK,
            message:"Listes des parametres des documents",
            result:docSettings
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
    createDocSetting,
    findAllDocSettings
}