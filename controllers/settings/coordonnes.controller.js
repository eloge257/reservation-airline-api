const RESPONSE_CODES = require("../../constants/RESPONSE_CODES");
const RESPONSE_STATUS = require("../../constants/RESPONSE_STATUS");
const yup = require("yup");
const Coordonnes = require("../../models/settings/Coordonnes");
const Pays = require("../../models/settings/Pays");

/**
 * @function pour inserter les coordonnes
 * @author <<Eloge257>>
 */

const createCoordonne = async(req,res) => {
    try {
        const { adresse_email,nom_organisation,forme_juridique,numero_tva,adresse,ville,id_pays,telephone,site_internet } = req.body
        
        //validation des champs avant l'enregistrement
        const validationSchema =  yup.object({
            adresse_email: yup.string().required("Email est obligatoire"),
            nom_organisation: yup.string().required("Nom de l'organisation est obligatoire"),
            forme_juridique: yup.string().required("Forme jurdique est obligatoire"),
            numero_tva: yup.string().required("TVA est obligatoire"),
            adresse: yup.string().required("Adresse est obligatoire"),
            ville: yup.string().required("Ville est obligatoire"),
            id_pays: yup.string().required("Pays est obligatoire"),
            telephone: yup.string().required("Telephone est obligatoire"),
            site_internet: yup.string().required("Site internet est obligatoire"),

        });

        await validationSchema.validate(req.body, { abortEarly: false , stripUnknown: true});

        //insertion des donnees
        const  insertData = await Coordonnes.create({
            adresse_email,
            nom_organisation,
            forme_juridique,
            numero_tva,
            adresse,
            ville,
            id_pays,
            telephone,
            site_internet
        })

        //reponse  d une fonction
        res.status(RESPONSE_CODES.CREATED).json({
            statusCode:RESPONSE_CODES.CREATED,
            httpStatus:RESPONSE_STATUS.CREATED,
            message:"Coordonnes est cree avec succes",
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
 * @function pour faire la listes des coordonnes
 * @author <<Eloge257>>
 */

const findAllCoordonnes = async(req,res) => {
    try {
        const coordonnes = await Coordonnes.findAll({ 
            include:{
                model:Pays,
                as:"pays"
            }
        })

        // reponse 
        res.status(RESPONSE_CODES.OK).json({
            statusCode:RESPONSE_CODES.OK,
            httpStatus:RESPONSE_STATUS.OK,
            message:"Listes des coordonnes",
            result:coordonnes
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
    createCoordonne,
    findAllCoordonnes
}